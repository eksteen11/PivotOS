import { clampText } from '@/lib/intake/shared'

/**
 * Cloud API mark-as-read request builder.
 * Official: POST /{phone-number-id}/messages with status=read + message_id (wamid).
 * Marks earlier messages in the thread as read too.
 *
 * Evidence gap: Meta docs define customer-facing read status; phone Business-app
 * unread-badge clearing under coexistence is partner-reported, not a dedicated
 * Meta “clear phone badge” API. Pivot must not claim badge parity until verified live.
 */
export type WhatsappMarkReadRequest = {
  messaging_product: 'whatsapp'
  status: 'read'
  message_id: string
}

export type WhatsappMarkReadPlan = {
  ok: true
  executes: false | true
  endpointPath: string
  body: WhatsappMarkReadRequest
  effect: string
  phoneBadgeClears: 'unverified' | 'partner-reported-possible'
} | {
  ok: false
  executes: false
  error: string
}

export function planMarkConversationRead(input: {
  phoneNumberId: string
  latestInboundProviderMessageId: string
  accessTokenPresent: boolean
  graphVersion?: string
}): WhatsappMarkReadPlan {
  const phoneNumberId = clampText(input.phoneNumberId, 64)
  const messageId = clampText(input.latestInboundProviderMessageId, 256)
  if (!phoneNumberId) return { ok: false, executes: false, error: 'WHATSAPP_PHONE_NUMBER_ID is required to plan mark-as-read.' }
  if (!messageId) return { ok: false, executes: false, error: 'A provider inbound message id is required.' }
  const version = clampText(input.graphVersion || 'v21.0', 16) || 'v21.0'
  return {
    ok: true,
    executes: false,
    endpointPath: `/${version}/${phoneNumberId}/messages`,
    body: {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    },
    effect: 'Plans Cloud API mark-as-read for the opened conversation’s latest inbound wamid. Does not send until explicitly executed with live credentials.',
    phoneBadgeClears: 'unverified',
  }
}

/** Hard refuse execution until a later authorized live path exists. */
export function executeMarkConversationRead(_plan: Extract<WhatsappMarkReadPlan, { ok: true }>): {
  ok: false
  executes: false
  error: string
} {
  void _plan
  return {
    ok: false,
    executes: false,
    error: 'Mark-as-read execution is disabled until live WhatsApp credentials and founder-authorized phone unread verification exist.',
  }
}
