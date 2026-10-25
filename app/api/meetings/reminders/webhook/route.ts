import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { recordingAdmin } from '@/lib/meetings/recordingServer'
import { reminderReceiptState } from '@/lib/meetings/reminders'
import { decryptConnection, encryptConnection } from '@/lib/meetings/connectionSecrets'
import type { WhatsappReminderConfig } from '@/lib/meetings/reminders'
import { isUuid } from '@/lib/intake/shared'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams
  const expected = process.env.MEETINGS_WHATSAPP_VERIFY_TOKEN
  if (!expected || query.get('hub.mode') !== 'subscribe' || query.get('hub.verify_token') !== expected) return new Response('Forbidden', { status: 403 })
  return new Response(query.get('hub.challenge') ?? '', { headers: { 'Content-Type': 'text/plain' } })
}

export async function POST(request: Request) {
  const secret = process.env.MEETINGS_WHATSAPP_APP_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  const raw = await request.text()
  if (raw.length > 512_000) return new Response('Too large', { status: 413 })
  const expected = Buffer.from(`sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`)
  const actual = Buffer.from(request.headers.get('x-hub-signature-256') ?? '')
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return new Response('Forbidden', { status: 403 })
  const admin = recordingAdmin()
  if (!admin) return new Response('Unavailable', { status: 503 })
  let payload
  try { payload = JSON.parse(raw) } catch { return new Response('Invalid body', { status: 400 }) }
  for (const entry of Array.isArray(payload.entry) ? payload.entry : []) for (const change of Array.isArray(entry.changes) ? entry.changes : []) {
    const value = change.value
    // An inbound message proves control of the exact founder recipient. A config
    // checkbox alone cannot verify where private reminders should be sent.
    for (const message of Array.isArray(value?.messages) ? value.messages : []) {
      if (message.type !== 'text' || typeof message.text?.body !== 'string') continue
      const { data: connections } = await admin.from('meeting_connections').select('owner_id,configuration,encrypted_credentials').eq('provider', 'whatsapp').contains('configuration', { phoneNumberId: String(value.metadata?.phone_number_id ?? '') })
      for (const connection of connections ?? []) {
        const cfg = connection.configuration
        if (!cfg.verificationHash || !cfg.verificationExpires || Date.parse(cfg.verificationExpires) <= Date.now()) continue
        const digest = createHash('sha256').update(message.text.body.trim()).digest('hex')
        if (digest !== cfg.verificationHash) continue
        try {
          const credentials = decryptConnection<WhatsappReminderConfig>(connection.owner_id, connection.encrypted_credentials)
          if (String(message.from) !== credentials.recipient) continue
          const { error } = await admin.from('meeting_connections').update({ encrypted_credentials: encryptConnection(connection.owner_id, { ...credentials, verifiedRecipient: credentials.recipient }), configuration: { phoneNumberId: credentials.phoneNumberId, recipientVerifiedAt: new Date().toISOString() }, updated_at: new Date().toISOString() }).eq('owner_id', connection.owner_id).eq('provider', 'whatsapp').eq('encrypted_credentials', connection.encrypted_credentials)
          if (error) return new Response('Retry verification', { status: 503 })
        } catch { return new Response('Verification unavailable', { status: 503 }) }
      }
    }
    for (const status of Array.isArray(value?.statuses) ? value.statuses : []) {
      const callbackId = String(status.biz_opaque_callback_data ?? '').replace(/^meeting-reminder:/, '')
      let query = admin.from('meeting_reminder_jobs').select('id,state,provider_message_id,delivered_at').eq('sender_id', String(value.metadata?.phone_number_id ?? '')).eq('recipient', String(status.recipient_id ?? ''))
      if (isUuid(callbackId)) query = query.eq('id', callbackId)
      else query = query.eq('provider_message_id', String(status.id ?? ''))
      const { data: job } = await query.maybeSingle()
      if (!job || (job.provider_message_id && job.provider_message_id !== status.id)) continue
      const next = reminderReceiptState(job.state, String(status.status))
      const { data: saved, error } = await admin.from('meeting_reminder_jobs').update({ state: next, provider_message_id: status.id, ...(next === 'delivered' ? { delivered_at: job.delivered_at ?? new Date().toISOString(), error: null } : {}), updated_at: new Date().toISOString() }).eq('id', job.id).eq('state', job.state).select('id').maybeSingle()
      if (error || !saved) return new Response('Retry receipt', { status: 503 })
    }
  }
  return NextResponse.json({ received: true })
}
