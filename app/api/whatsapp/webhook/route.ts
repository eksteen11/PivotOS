import { NextResponse } from 'next/server'
import { authorizeWhatsappWebhookPost, handleWhatsappChallenge } from '@/lib/whatsapp/webhookHandlers'
import { whatsappAdmin, persistWebhookPayload } from '@/lib/whatsapp/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const result = handleWhatsappChallenge(request.url)
  return new Response(result.body, { status: result.status, headers: { 'Content-Type': result.contentType } })
}

export async function POST(request: Request) {
  const raw = await request.text()
  const auth = authorizeWhatsappWebhookPost(raw, request.headers.get('x-hub-signature-256'))
  if (!auth.ok) {
    if (auth.status === 503) return NextResponse.json({ error: 'WhatsApp webhook is not configured.', missing: auth.missing }, { status: 503 })
    if (auth.status === 413) return new Response('Payload too large', { status: 413 })
    if (auth.status === 400) return new Response('Invalid body', { status: 400 })
    return new Response('Forbidden', { status: 403 })
  }
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured yet.', sending: false }, { status: 503 })
  const result = await persistWebhookPayload(admin, auth.config.ownerId, auth.parsed)
  if (result.error && !result.missingTable) return new Response('Retry inbound', { status: 503 })
  return NextResponse.json({
    received: true,
    stored: result.stored,
    durable: !result.missingTable && !result.error,
    sending: false,
    phoneNumberId: result.phoneNumberId,
    ...(result.missingTable ? { notice: 'Migration 0024 is not applied. Message was acknowledged but not saved.' } : {}),
  })
}
