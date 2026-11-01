import { clampText } from '@/lib/intake/shared'
import { isWhatsappContext, type WhatsappContext } from './contexts'

export type WhatsappMediaKind = 'none' | 'image' | 'audio' | 'document' | 'video' | 'sticker' | 'unknown'
export type WhatsappInboundStatus = 'received' | 'needs-context' | 'linked' | 'uncertain'

export type WhatsappInboundMessage = {
  id: string
  providerMessageId: string
  from: string
  toPhoneNumberId: string
  receivedAt: string
  text: string
  mediaKind: WhatsappMediaKind
  mediaPresent: boolean
  originalRetained: boolean
  extraction: string
  uncertain: boolean
  context: WhatsappContext | null
  companyInferred: false
  status: WhatsappInboundStatus
  providerStatus: 'not-connected'
}

export type WhatsappInboundInput = {
  id: string
  providerMessageId: string
  from: string
  toPhoneNumberId: string
  receivedAt: string
  text?: string
  mediaKind?: WhatsappMediaKind
  extraction?: string
  uncertain?: boolean
  context?: string | null
}

function validTimestamp(value: string) {
  return Number.isFinite(Date.parse(value))
}

function validPhone(value: string) {
  return /^\d{8,15}$/.test(value)
}

/** Capture an inbound WhatsApp message without assigning a business by contact alone. */
export function captureInboundMessage(input: WhatsappInboundInput): { ok: true; message: WhatsappInboundMessage } | { ok: false; error: string } {
  if (!input.id?.trim() || !input.providerMessageId?.trim()) return { ok: false, error: 'A durable message id is required.' }
  if (!validPhone(input.from)) return { ok: false, error: 'The sender number must be digits only, 8 to 15 characters.' }
  if (!/^\d+$/.test(input.toPhoneNumberId)) return { ok: false, error: 'The receiving phone number id is missing.' }
  if (!validTimestamp(input.receivedAt)) return { ok: false, error: 'A real received time is required.' }
  const text = clampText(input.text ?? '', 12_000)
  const mediaKind = input.mediaKind ?? 'none'
  const mediaPresent = mediaKind !== 'none'
  if (!text && !mediaPresent) return { ok: false, error: 'The message needs text or retained media.' }
  const context = input.context == null || input.context === '' ? null : isWhatsappContext(input.context) ? input.context : null
  if (input.context && !context) return { ok: false, error: 'Choose a known WhatsApp context, or leave it unset.' }
  const extraction = clampText(input.extraction ?? '', 4_000)
  const uncertain = Boolean(input.uncertain) || Boolean(extraction && !text && mediaPresent)
  return {
    ok: true,
    message: {
      id: input.id.trim(),
      providerMessageId: input.providerMessageId.trim(),
      from: input.from,
      toPhoneNumberId: input.toPhoneNumberId,
      receivedAt: input.receivedAt,
      text,
      mediaKind,
      mediaPresent,
      originalRetained: true,
      extraction,
      uncertain,
      context,
      companyInferred: false,
      status: context ? 'linked' : 'needs-context',
      providerStatus: 'not-connected',
    },
  }
}

export function assignInboundContext(message: WhatsappInboundMessage, context: WhatsappContext): WhatsappInboundMessage {
  return { ...message, context, status: 'linked', companyInferred: false }
}
