import { createHash, randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/http/readJson'
import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { encryptConnection } from '@/lib/meetings/connectionSecrets'
import { recordingAdmin } from '@/lib/meetings/recordingServer'
import { validReminderConfig, type WhatsappReminderConfig } from '@/lib/meetings/reminders'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const body = await readJsonBody(request)
  const recipient = String(body.recipient ?? '').replace(/^\+/, '').trim()
  const env = process.env
  const config: WhatsappReminderConfig = {
    token: env.MEETINGS_WHATSAPP_TOKEN ?? '', phoneNumberId: env.MEETINGS_WHATSAPP_PHONE_ID ?? '', recipient,
    verifiedRecipient: recipient, graphVersion: env.MEETINGS_WHATSAPP_GRAPH_VERSION ?? '',
    preparationTemplate: env.MEETINGS_WHATSAPP_PREPARATION_TEMPLATE ?? '', startTemplate: env.MEETINGS_WHATSAPP_START_TEMPLATE ?? '', language: env.MEETINGS_WHATSAPP_LANGUAGE ?? 'en',
  }
  const admin = recordingAdmin()
  if (!admin || env.MEETINGS_WHATSAPP_OWNER_ID !== auth.user.id || !env.MEETINGS_WHATSAPP_APP_SECRET || !env.MEETINGS_WHATSAPP_VERIFY_TOKEN || !validReminderConfig(config)) return NextResponse.json({ error: 'Configure the supported WhatsApp sender and approved reminder templates first. Enter your own number in international format.' }, { status: 503 })
  try {
    const response = await fetch(`https://graph.facebook.com/${config.graphVersion}/${config.phoneNumberId}?fields=display_phone_number,code_verification_status`, { headers: { Authorization: `Bearer ${config.token}` }, signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error('WhatsApp sender could not be verified.')
    const phone = await response.json()
    if (phone.code_verification_status !== 'VERIFIED' || !phone.display_phone_number) throw new Error('Verify the business sender with the provider first.')
    const code = `PIVOT-${randomBytes(12).toString('hex').toUpperCase()}`
    const { error } = await admin.from('meeting_connections').upsert({ owner_id: auth.user.id, provider: 'whatsapp', encrypted_credentials: encryptConnection(auth.user.id, { ...config, verifiedRecipient: '' }), configuration: { phoneNumberId: config.phoneNumberId, verificationHash: createHash('sha256').update(code).digest('hex'), verificationExpires: new Date(Date.now() + 10 * 60_000).toISOString(), recipientVerifiedAt: null }, updated_at: new Date().toISOString() }, { onConflict: 'owner_id,provider' })
    if (error) throw new Error('WhatsApp connection could not be saved.')
    return NextResponse.json({ code, sender: phone.display_phone_number, message: 'From your own WhatsApp number, send this code to the business sender within 10 minutes. This verifies where private reminders may be delivered.' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: 'WhatsApp setup or sender verification failed. No reminder was sent.' }, { status: 503 }) }
}
