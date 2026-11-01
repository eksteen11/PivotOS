import { readWhatsappChannelConfig } from './config'
import {
  assertWhatsappWebhookBinding,
  parseWhatsappWebhook,
  verifyWhatsappChallenge,
  verifyWhatsappSignature,
  WHATSAPP_WEBHOOK_MAX_BODY_BYTES,
} from './webhook'

export function handleWhatsappChallenge(url: string) {
  const { config, missing } = readWhatsappChannelConfig()
  if (!config) return { status: 503 as const, body: `WhatsApp webhook is not configured (${missing.join(', ')}).`, contentType: 'text/plain' as const }
  const query = new URL(url).searchParams
  const result = verifyWhatsappChallenge({
    mode: query.get('hub.mode'),
    token: query.get('hub.verify_token'),
    challenge: query.get('hub.challenge'),
    expectedToken: config.verifyToken,
  })
  if (!result.ok) return { status: 403 as const, body: 'Forbidden', contentType: 'text/plain' as const }
  return { status: 200 as const, body: result.challenge, contentType: 'text/plain' as const }
}

export function authorizeWhatsappWebhookPost(rawBody: string, signatureHeader: string | null) {
  if (rawBody.length > WHATSAPP_WEBHOOK_MAX_BODY_BYTES) return { ok: false as const, status: 413 as const }
  const { config, missing } = readWhatsappChannelConfig()
  if (!config) return { ok: false as const, status: 503 as const, missing }
  if (!verifyWhatsappSignature(rawBody, signatureHeader, config.appSecret)) return { ok: false as const, status: 403 as const }
  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return { ok: false as const, status: 400 as const }
  }
  const parsed = parseWhatsappWebhook(payload)
  const binding = assertWhatsappWebhookBinding(parsed, {
    phoneNumberId: config.phoneNumberId,
    wabaId: config.wabaId || undefined,
    displayE164: config.displayE164,
  })
  if (!binding.ok) return { ok: false as const, status: 403 as const, reason: binding.reason }
  return { ok: true as const, config, parsed, payload }
}
