export type ReminderState = 'pending' | 'unavailable' | 'sending' | 'accepted' | 'delivered' | 'failed' | 'uncertain' | 'cancelled' | 'expired'
export type WhatsappReminderConfig = {
  token: string; phoneNumberId: string; recipient: string; verifiedRecipient: string
  graphVersion: string; preparationTemplate: string; startTemplate: string; language: string
}

export function validReminderConfig(config: WhatsappReminderConfig) {
  return Boolean(config.token && /^\d+$/.test(config.phoneNumberId) && /^\d{8,15}$/.test(config.recipient) && config.verifiedRecipient === config.recipient && /^v\d+\.\d+$/.test(config.graphVersion) && /^[a-z0-9_]+$/.test(config.preparationTemplate) && /^[a-z0-9_]+$/.test(config.startTemplate) && /^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(config.language))
}

export function reminderReceiptState(current: ReminderState, incoming: string): ReminderState {
  if (current === 'delivered') return current
  if (incoming === 'delivered' || incoming === 'read') return 'delivered'
  if (incoming === 'failed') return 'failed'
  if (incoming === 'sent' && current !== 'failed') return 'accepted'
  return current
}

// Only an approved template to the exact verified founder recipient is permitted.
export async function sendWhatsappReminder(config: WhatsappReminderConfig, input: { id: string; kind: 'preparation' | 'start'; company: string; title: string; start: string }, request: typeof fetch = fetch) {
  if (!validReminderConfig(config)) return { state: 'unavailable' as const }
  const response = await request(`https://graph.facebook.com/${config.graphVersion}/${config.phoneNumberId}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: config.recipient, type: 'template',
      biz_opaque_callback_data: `meeting-reminder:${input.id}`,
      template: { name: input.kind === 'preparation' ? config.preparationTemplate : config.startTemplate, language: { code: config.language }, components: [{ type: 'body', parameters: [input.company, input.title, input.start].map((text) => ({ type: 'text', text })) }] },
    }),
  })
  if (!response.ok) return { state: 'failed' as const }
  const body = await response.json()
  const id = body.messages?.[0]?.id
  // Accepted is not a delivery receipt. Unknown outcomes are never auto-retried.
  return typeof id === 'string' ? { state: 'accepted' as const, messageId: id } : { state: 'uncertain' as const }
}
