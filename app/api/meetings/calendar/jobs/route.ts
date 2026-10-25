import { randomUUID, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { recordingAdmin } from '@/lib/meetings/recordingServer'
import { googleAccessToken } from '@/lib/meetings/googleConnection'
import { GoogleCalendar } from '@/lib/meetings/calendar'
import { synchroniseMeetingCalendar } from '@/lib/meetings/calendarSync'
import { entitySlugFrom, itemStatusForLifecycle, readMeetingCore } from '@/lib/meetings/core'

export async function GET(request: Request) {
  const secret = process.env.MEETINGS_JOB_SECRET
  const actual = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret ?? ''}`)
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 })
  const admin = recordingAdmin()
  if (!admin) return NextResponse.json({ error: 'Meeting storage is unavailable.' }, { status: 503 })
  const now = new Date().toISOString()
  const { data: jobs, error } = await admin.from('meeting_calendar_jobs').select('*').lte('next_attempt_at', now).or(`lease_until.is.null,lease_until.lt.${now}`).neq('state', 'conflict').order('next_attempt_at').limit(5)
  if (error) return NextResponse.json({ error: 'Calendar jobs need database setup.' }, { status: 503 })
  for (const job of jobs ?? []) {
    const token = randomUUID()
    const { data: claim } = await admin.from('meeting_calendar_jobs').update({ state: 'running', lease_token: token, lease_until: new Date(Date.now() + 120_000).toISOString() })
      .eq('meeting_id', job.meeting_id).eq('generation', job.generation).or(`lease_until.is.null,lease_until.lt.${now}`).select('meeting_id').maybeSingle()
    if (!claim) continue
    let result: { state: string; error?: string }
    try {
      const { data: row } = await admin.from('items').select('*,entities(slug)').eq('id', job.meeting_id).eq('user_id', job.owner_id).eq('type', 'meeting').maybeSingle()
      const core = row ? readMeetingCore(row.meta, row.due_at, entitySlugFrom(row.entities)) : null
      if (!row || !core) throw new Error('Meeting scope could not be read.')
      const account = await googleAccessToken(admin, job.owner_id)
      const { data: bindings } = await admin.from('meeting_calendar_bindings').select('*').eq('owner_id', job.owner_id)
      const { data: links } = await admin.from('meeting_calendar_links').select('*').eq('owner_id', job.owner_id).eq('meeting_id', row.id)
      result = await synchroniseMeetingCalendar(new GoogleCalendar(account.token), {
        bindings: (bindings ?? []).map((binding) => ({ company: binding.company, calendarId: binding.calendar_id, readers: binding.approved_readers, ownerEmail: account.email })),
        links: links ?? [],
        async isCurrent() {
          const { data } = await admin.from('meeting_calendar_jobs').select('generation').eq('meeting_id', row.id).eq('generation', job.generation).eq('lease_token', token).maybeSingle()
          return Boolean(data)
        },
        async saveLink(link) {
          const { error } = await admin.from('meeting_calendar_links').upsert({ ...link, meeting_id: row.id, owner_id: job.owner_id }, { onConflict: 'meeting_id,calendar_id' })
          if (error) throw new Error('Calendar receipt could not be saved.')
        },
        async importSchedule(snapshot, nextCore, dueAt) {
          const { data } = await admin.from('items').update({ meta: { ...row.meta, meeting_core: nextCore }, due_at: dueAt, status: itemStatusForLifecycle(nextCore.lifecycle), updated_at: new Date().toISOString() }).eq('id', row.id).eq('user_id', job.owner_id).eq('updated_at', snapshot.updatedAt).select('id').maybeSingle()
          return Boolean(data)
        },
      }, { id: row.id, title: row.title ?? 'Meeting', core, updatedAt: row.updated_at, deleted: Boolean(row.deleted_at) })
    } catch (failure) {
      result = { state: 'blocked', error: failure instanceof Error ? failure.message : 'Calendar sync failed.' }
    }
    const delay = result.state === 'synced' ? 300_000 : result.state === 'pending' ? 0 : Math.min(3600_000, 60_000 * 2 ** Math.min(job.attempts, 6))
    await admin.from('meeting_calendar_jobs').update({ state: result.state, error: result.error ?? null, attempts: result.state === 'synced' ? 0 : job.attempts + 1, lease_until: null, lease_token: null, next_attempt_at: new Date(Date.now() + delay).toISOString(), ...(result.state === 'synced' ? { synced_at: now } : {}) }).eq('meeting_id', job.meeting_id).eq('generation', job.generation).eq('lease_token', token)
    // If an import or an edit queued another generation, release only this lease.
    await admin.from('meeting_calendar_jobs').update({ lease_until: null, lease_token: null }).eq('meeting_id', job.meeting_id).eq('lease_token', token)
    return NextResponse.json({ state: result.state }, { headers: { 'Cache-Control': 'no-store' } })
  }
  return NextResponse.json({ state: 'idle' }, { headers: { 'Cache-Control': 'no-store' } })
}
