import { companyForWhatsappContext, isFounderPrivateContext, type WhatsappContext } from './contexts'
import { captureInboundMessage, type WhatsappInboundMessage } from './inbound'
import { dedupeProviderMessageIds } from './sync'
import type { ParsedWhatsappMessage, ParsedWhatsappWebhook } from './webhook'

export type WhatsappMessageRow = {
  id: string
  owner_id: string
  provider_message_id: string
  direction: 'inbound' | 'outbound' | 'echo'
  from_e164: string
  to_phone_number_id: string
  body: string
  media_kind: string
  media_present: boolean
  extraction: string
  uncertain: boolean
  context: WhatsappContext | null
  company: string | null
  privacy: 'founder-private' | 'company-visible'
  status: string
  company_inferred: false
  group_id: string | null
  group_support: 'supported' | 'not-supported' | 'n/a'
  webhook_field: string
  payload: Record<string, unknown>
  received_at: string
}

export function privacyForContext(context: WhatsappContext | null): 'founder-private' | 'company-visible' {
  if (!context || isFounderPrivateContext(context)) return 'founder-private'
  return 'company-visible'
}

export function rowFromInbound(
  ownerId: string,
  message: WhatsappInboundMessage,
  payload: Record<string, unknown> = {},
  extras: Partial<Pick<WhatsappMessageRow, 'direction' | 'group_id' | 'group_support' | 'webhook_field'>> = {},
): WhatsappMessageRow {
  const company = message.context ? companyForWhatsappContext(message.context) : null
  return {
    id: message.id,
    owner_id: ownerId,
    provider_message_id: message.providerMessageId,
    direction: extras.direction ?? 'inbound',
    from_e164: message.from.startsWith('+') ? message.from : `+${message.from}`,
    to_phone_number_id: message.toPhoneNumberId,
    body: message.text,
    media_kind: message.mediaKind,
    media_present: message.mediaPresent,
    extraction: message.extraction,
    uncertain: message.uncertain,
    context: message.context,
    company,
    privacy: privacyForContext(message.context),
    status: message.status,
    company_inferred: false,
    group_id: extras.group_id ?? null,
    group_support: extras.group_support ?? 'n/a',
    webhook_field: extras.webhook_field ?? 'messages',
    payload,
    received_at: message.receivedAt,
  }
}

function rowFromParsed(
  ownerId: string,
  phoneNumberId: string,
  message: ParsedWhatsappMessage,
  direction: 'inbound' | 'echo',
  groupSupport: WhatsappMessageRow['group_support'],
): WhatsappMessageRow | null {
  const captured = captureInboundMessage({
    id: crypto.randomUUID(),
    providerMessageId: message.providerMessageId,
    from: message.from || '00000000',
    toPhoneNumberId: phoneNumberId || '0',
    receivedAt: message.timestamp || new Date().toISOString(),
    text: message.text || (message.mediaKind !== 'none' ? `[${message.mediaKind}]` : ''),
    mediaKind: message.mediaKind,
  })
  if (!captured.ok) return null
  return rowFromInbound(ownerId, captured.message, {
    source: 'meta-webhook',
    field: message.field,
    group_id: message.groupId,
    coexistence_group_sync: groupSupport,
  }, {
    direction,
    group_id: message.groupId,
    group_support: groupSupport,
    webhook_field: message.field,
  })
}

export function inboundRowsFromWebhook(ownerId: string, parsed: ParsedWhatsappWebhook): WhatsappMessageRow[] {
  const rows: WhatsappMessageRow[] = []
  const known: string[] = []
  for (const message of parsed.messages) {
    const row = rowFromParsed(ownerId, parsed.phoneNumberId, message, 'inbound', message.groupId ? 'not-supported' : 'n/a')
    if (!row) continue
    rows.push(row)
    known.push(row.provider_message_id)
  }
  for (const echo of parsed.echoes) {
    const { unique } = dedupeProviderMessageIds([echo.providerMessageId], known)
    if (!unique.length) continue
    const row = rowFromParsed(ownerId, parsed.phoneNumberId, echo, 'echo', echo.groupId ? 'not-supported' : 'n/a')
    if (!row) continue
    rows.push(row)
    known.push(row.provider_message_id)
  }
  for (const groupMessage of parsed.groupMessagesUnsupported) {
    const { unique } = dedupeProviderMessageIds([groupMessage.providerMessageId], known)
    if (!unique.length) continue
    const row = rowFromParsed(ownerId, parsed.phoneNumberId, groupMessage, 'inbound', 'not-supported')
    if (!row) continue
    rows.push(row)
    known.push(row.provider_message_id)
  }
  const deduped = dedupeProviderMessageIds(rows.map((row) => row.provider_message_id))
  if (!deduped.duplicates.length) return rows
  const keep = new Set(deduped.unique)
  const seen = new Set<string>()
  return rows.filter((row) => {
    if (!keep.has(row.provider_message_id) || seen.has(row.provider_message_id)) return false
    seen.add(row.provider_message_id)
    return true
  })
}

export function visibleWhatsappMessage(row: WhatsappMessageRow, lens: 'founder' | 'digikraal' | 'farm-feed' | 'northpoint') {
  if (lens === 'founder') return true
  if (row.privacy !== 'company-visible' || !row.company) return false
  return row.company === lens
}
