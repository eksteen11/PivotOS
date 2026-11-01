import { createHmac, timingSafeEqual } from 'node:crypto'

export const WHATSAPP_WEBHOOK_MAX_BODY_BYTES = 512_000
export const WHATSAPP_WEBHOOK_MAX_MESSAGES = 50
export const WHATSAPP_WEBHOOK_MAX_STATUSES = 50
export const WHATSAPP_WEBHOOK_MAX_ECHOES = 50

export function verifyWhatsappSignature(rawBody: string, signatureHeader: string | null, appSecret: string) {
  if (!appSecret || !signatureHeader?.startsWith('sha256=')) return false
  if (rawBody.length > WHATSAPP_WEBHOOK_MAX_BODY_BYTES) return false
  const expected = Buffer.from(`sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`)
  const actual = Buffer.from(signatureHeader)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function verifyWhatsappChallenge(input: {
  mode: string | null
  token: string | null
  challenge: string | null
  expectedToken: string
}) {
  if (!input.expectedToken || input.mode !== 'subscribe' || input.token !== input.expectedToken) {
    return { ok: false as const, status: 403 as const }
  }
  return { ok: true as const, challenge: input.challenge ?? '' }
}

export type ParsedWhatsappMessage = {
  providerMessageId: string
  from: string
  timestamp: string
  text: string
  mediaKind: 'none' | 'image' | 'audio' | 'document' | 'video' | 'sticker' | 'unknown'
  groupId: string | null
  field: 'messages' | 'smb_message_echoes' | 'history' | 'unknown'
}

export type ParsedWhatsappWebhook = {
  object: string
  wabaId: string
  phoneNumberId: string
  displayPhoneNumber: string
  fields: string[]
  messages: ParsedWhatsappMessage[]
  echoes: ParsedWhatsappMessage[]
  groupMessagesUnsupported: ParsedWhatsappMessage[]
  statuses: Array<{ providerMessageId: string; recipient: string; status: string }>
}

/** Parse Meta Cloud API / coexistence webhook shapes without contacting Meta. */
export function parseWhatsappWebhook(payload: unknown): ParsedWhatsappWebhook {
  const messages: ParsedWhatsappMessage[] = []
  const echoes: ParsedWhatsappMessage[] = []
  const groupMessagesUnsupported: ParsedWhatsappMessage[] = []
  const statuses: ParsedWhatsappWebhook['statuses'] = []
  const fields: string[] = []
  let phoneNumberId = ''
  let displayPhoneNumber = ''
  let wabaId = ''
  let object = ''
  if (!payload || typeof payload !== 'object') {
    return { object, wabaId, phoneNumberId, displayPhoneNumber, fields, messages, echoes, groupMessagesUnsupported, statuses }
  }
  object = String((payload as { object?: unknown }).object ?? '')
  const entries = Array.isArray((payload as { entry?: unknown }).entry) ? (payload as { entry: unknown[] }).entry : []
  for (const entry of entries.slice(0, 8)) {
    if (entry && typeof entry === 'object') {
      const entryId = String((entry as { id?: unknown }).id ?? '')
      if (entryId && !wabaId) wabaId = entryId
    }
    const changes = entry && typeof entry === 'object' && Array.isArray((entry as { changes?: unknown }).changes)
      ? (entry as { changes: unknown[] }).changes
      : []
    for (const change of changes.slice(0, 8)) {
      if (!change || typeof change !== 'object') continue
      const field = String((change as { field?: unknown }).field ?? 'messages').slice(0, 64)
      if (field && !fields.includes(field)) fields.push(field)
      const value = (change as { value?: Record<string, unknown> }).value
      if (!value) continue
      const metadata = value.metadata && typeof value.metadata === 'object' ? value.metadata as Record<string, unknown> : {}
      phoneNumberId = String(metadata.phone_number_id ?? phoneNumberId).slice(0, 64)
      displayPhoneNumber = String(metadata.display_phone_number ?? displayPhoneNumber).slice(0, 32)

      const messageBags: Array<{ bag: unknown[]; asField: ParsedWhatsappMessage['field'] }> = []
      if (Array.isArray(value.messages)) messageBags.push({ bag: value.messages, asField: field === 'history' ? 'history' : 'messages' })
      if (Array.isArray(value.message_echoes)) messageBags.push({ bag: value.message_echoes, asField: 'smb_message_echoes' })
      if (field === 'smb_message_echoes' && Array.isArray(value.messages) === false && Array.isArray((value as { message_echoes?: unknown }).message_echoes) === false) {
        // some payloads nest echoes under messages key with field smb_message_echoes
      }

      for (const { bag, asField } of messageBags) {
        for (const message of bag) {
          const target = asField === 'smb_message_echoes' ? echoes : messages
          if (target.length >= (asField === 'smb_message_echoes' ? WHATSAPP_WEBHOOK_MAX_ECHOES : WHATSAPP_WEBHOOK_MAX_MESSAGES)) break
          const parsed = parseMessageRow(message, asField)
          if (!parsed) continue
          if (parsed.groupId) {
            if (groupMessagesUnsupported.length < WHATSAPP_WEBHOOK_MAX_MESSAGES) groupMessagesUnsupported.push(parsed)
            continue
          }
          target.push(parsed)
        }
      }

      for (const status of Array.isArray(value.statuses) ? value.statuses : []) {
        if (statuses.length >= WHATSAPP_WEBHOOK_MAX_STATUSES) break
        if (!status || typeof status !== 'object') continue
        const row = status as Record<string, unknown>
        const providerMessageId = String(row.id ?? '').slice(0, 256)
        if (!providerMessageId) continue
        statuses.push({
          providerMessageId,
          recipient: String(row.recipient_id ?? '').replace(/\D/g, '').slice(0, 15),
          status: String(row.status ?? '').slice(0, 32),
        })
      }
    }
  }
  return { object, wabaId, phoneNumberId, displayPhoneNumber, fields, messages, echoes, groupMessagesUnsupported, statuses }
}

function parseMessageRow(message: unknown, field: ParsedWhatsappMessage['field']): ParsedWhatsappMessage | null {
  if (!message || typeof message !== 'object') return null
  const row = message as Record<string, unknown>
  const providerMessageId = String(row.id ?? '').slice(0, 256)
  if (!providerMessageId) return null
  const text = row.type === 'text' && row.text && typeof row.text === 'object'
    ? String((row.text as { body?: unknown }).body ?? '').slice(0, 12_000)
    : ''
  const groupId = String(row.group_id ?? '').slice(0, 128) || null
  return {
    providerMessageId,
    from: String(row.from ?? '').replace(/\D/g, '').slice(0, 15),
    timestamp: isoFromUnix(String(row.timestamp ?? '')),
    text,
    mediaKind: mediaKindFor(String(row.type ?? 'unknown')),
    groupId,
    field,
  }
}

/** Reject payloads that are not bound to the configured Cloud API phone (and WABA when set). */
export function assertWhatsappWebhookBinding(parsed: ParsedWhatsappWebhook, expected: {
  phoneNumberId: string
  wabaId?: string
  displayE164?: string
}) {
  if (parsed.object && parsed.object !== 'whatsapp_business_account') {
    return { ok: false as const, reason: 'object-mismatch' as const }
  }
  if (!expected.phoneNumberId || !parsed.phoneNumberId || parsed.phoneNumberId !== expected.phoneNumberId) {
    return { ok: false as const, reason: 'phone-number-id-mismatch' as const }
  }
  if (expected.wabaId && parsed.wabaId && parsed.wabaId !== expected.wabaId) {
    return { ok: false as const, reason: 'waba-mismatch' as const }
  }
  if (expected.displayE164 && parsed.displayPhoneNumber) {
    const expectedDigits = expected.displayE164.replace(/\D/g, '')
    const actualDigits = parsed.displayPhoneNumber.replace(/\D/g, '')
    if (expectedDigits && actualDigits && expectedDigits !== actualDigits) {
      return { ok: false as const, reason: 'display-phone-mismatch' as const }
    }
  }
  return { ok: true as const }
}

function mediaKindFor(type: string): ParsedWhatsappMessage['mediaKind'] {
  if (type === 'text') return 'none'
  if (type === 'image' || type === 'audio' || type === 'document' || type === 'video' || type === 'sticker') return type
  return 'unknown'
}

function isoFromUnix(value: string) {
  if (!/^\d+$/.test(value)) return ''
  return new Date(Number(value) * 1000).toISOString()
}
