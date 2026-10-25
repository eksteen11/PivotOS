import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { recordingAdmin } from '@/lib/meetings/recordingServer'
import { decryptConnection } from '@/lib/meetings/connectionSecrets'
import { sendWhatsappReminder, validReminderConfig, type WhatsappReminderConfig } from '@/lib/meetings/reminders'
import { entitySlugFrom, readMeetingCore } from '@/lib/meetings/core'
import { getCompany } from '@/lib/workspace/catalogue'

export async function GET(request: Request) {
  const secret = process.env.MEETINGS_JOB_SECRET
  const actual = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret ?? ''}`)
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 })
  const admin = recordingAdmin()
  if (!admin) return NextResponse.json({ error: 'Meeting storage is unavailable.' }, { status: 503 })
  const now = new Date().toISOString()
  // A worker that died after sending must not send the same message again.
  await admin.from('meeting_reminder_jobs').update({ state: 'uncertain', error: 'Delivery could not be confirmed. Check provider receipts before retrying.' }).eq('state', 'sending').lt('lease_until', now)
  const { data: jobs, error } = await admin.from('meeting_reminder_jobs').select('*').in('state', ['pending', 'unavailable']).lte('due_at', now).order('due_at').limit(10)
  if (error) return NextResponse.json({ error: 'Reminder jobs need database setup.' }, { status: 503 })
  for (const job of jobs ?? []) {
    if (Date.parse(job.due_at) < Date.now() - 5 * 60_000) {
      await admin.from('meeting_reminder_jobs').update({ state: 'expired', error: 'Reminder time passed before a connected sender was available.' }).eq('id', job.id).in('state', ['pending', 'unavailable'])
      continue
    }
    const { data: connection } = await admin.from('meeting_connections').select('encrypted_credentials').eq('owner_id', job.owner_id).eq('provider', 'whatsapp').maybeSingle()
    let config: WhatsappReminderConfig | null = null
    try { if (connection) config = decryptConnection<WhatsappReminderConfig>(job.owner_id, connection.encrypted_credentials) } catch { /* Remain unavailable. */ }
    if (!config || !validReminderConfig(config)) {
      await admin.from('meeting_reminder_jobs').update({ state: 'unavailable', error: 'Connect a supported sender, approved templates and the verified founder recipient.' }).eq('id', job.id).in('state', ['pending', 'unavailable'])
      continue
    }
    const { data: row } = await admin.from('items').select('*,entities(slug)').eq('id', job.meeting_id).eq('user_id', job.owner_id).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
    const core = row ? readMeetingCore(row.meta, row.due_at, entitySlugFrom(row.entities)) : null
    if (!row || !core?.schedule.confirmed || ['cancelled', 'to_arrange', 'closed'].includes(core.lifecycle) || Date.parse(`${core.schedule.startAt}:00+02:00`) !== Date.parse(job.meeting_start)) {
      await admin.from('meeting_reminder_jobs').update({ state: 'cancelled' }).eq('id', job.id).in('state', ['pending', 'unavailable'])
      continue
    }
    const { data: claim } = await admin.from('meeting_reminder_jobs').update({ state: 'sending', sender_id: config.phoneNumberId, recipient: config.recipient, lease_until: new Date(Date.now() + 120_000).toISOString(), attempts: job.attempts + 1 }).eq('id', job.id).in('state', ['pending', 'unavailable']).select('id').maybeSingle()
    if (!claim) continue
    let result: Awaited<ReturnType<typeof sendWhatsappReminder>> = { state: 'uncertain' }
    try { result = await sendWhatsappReminder(config, { id: job.id, kind: job.kind, company: getCompany(core.company)?.name ?? core.company, title: row.title ?? 'Meeting', start: core.schedule.startAt.replace('T', ' ') + ' SAST' }) } catch { /* Delivery may have happened; do not resend. */ }
    await admin.from('meeting_reminder_jobs').update({ state: result.state, provider_message_id: 'messageId' in result ? result.messageId : null, lease_until: null, error: result.state === 'accepted' ? null : 'Reminder delivery needs review.', updated_at: new Date().toISOString() }).eq('id', job.id).eq('state', 'sending')
    return NextResponse.json({ state: result.state }, { headers: { 'Cache-Control': 'no-store' } })
  }
  return NextResponse.json({ state: 'idle' }, { headers: { 'Cache-Control': 'no-store' } })
}
