import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/http/readJson'
import { sameOrigin } from '@/lib/intake/server'
import { recordingContext } from '@/lib/meetings/recordingServer'
import { googleAccessToken } from '@/lib/meetings/googleConnection'
import { GoogleCalendar } from '@/lib/meetings/calendar'
import { applyMeetingPatch, entitySlugFrom, itemStatusForLifecycle, readMeetingCore } from '@/lib/meetings/core'

async function conflictContext(meetingId: string) {
  const context = await recordingContext(meetingId)
  if (!context.ok) throw new Error(context.error)
  const { data: row } = await context.admin.from('items').select('*,entities(slug)').eq('id', meetingId).eq('user_id', context.ownerId).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
  const core = row ? readMeetingCore(row.meta, row.due_at, entitySlugFrom(row.entities)) : null
  if (!core || !row) throw new Error('Meeting not found.')
  const { data: job } = await context.admin.from('meeting_calendar_jobs').select('*').eq('meeting_id', meetingId).eq('owner_id', context.ownerId).eq('state', 'conflict').maybeSingle()
  if (!job) throw new Error('The conflict changed. Refresh this meeting first.')
  const { data: bindings } = await context.admin.from('meeting_calendar_bindings').select('*').eq('owner_id', context.ownerId)
  const { data: links } = await context.admin.from('meeting_calendar_links').select('*').eq('owner_id', context.ownerId).eq('meeting_id', meetingId).eq('deleted', false)
  const link = links?.find((item) => item.company === core.company)
  const binding = bindings?.find((item) => item.company === core.company && item.calendar_id === link?.calendar_id)
  if (!link || !binding || links?.length !== 1) throw new Error('A conflict in the previous company calendar needs separate reconciliation before moving this meeting.')
  const account = await googleAccessToken(context.admin, context.ownerId)
  const google = new GoogleCalendar(account.token)
  await google.privacy({ company: core.company, calendarId: binding.calendar_id, readers: binding.approved_readers, ownerEmail: account.email })
  const remote = await google.event(binding.calendar_id, link.event_id)
  return { ...context, row, core, job, link, remote }
}
function localTime(value?: string) {
  return value && /(Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value)) ? new Date(Date.parse(value) + 7200_000).toISOString().slice(0, 16) : null
}
export async function GET(request: Request) {
  try {
    const context = await conflictContext(new URL(request.url).searchParams.get('meetingId') ?? '')
    return NextResponse.json({ updatedAt: context.row.updated_at, generation: context.job.generation, remoteEtag: context.remote?.etag ?? '', startAt: localTime(context.remote?.start?.dateTime), endAt: localTime(context.remote?.end?.dateTime), cancelled: !context.remote || context.remote.status === 'cancelled' }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (failure) { return NextResponse.json({ error: failure instanceof Error ? failure.message : 'Conflict could not be opened.' }, { status: 409 }) }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const body = await readJsonBody(request)
  if (!['pivot', 'google'].includes(String(body.choice))) return NextResponse.json({ error: 'Review which schedule to keep.' }, { status: 400 })
  try {
    const context = await conflictContext(String(body.meetingId ?? ''))
    if (body.updatedAt !== context.row.updated_at || String(body.generation) !== String(context.job.generation) || body.remoteEtag !== (context.remote?.etag ?? '')) throw new Error('The meeting or Google event changed. Review the conflict again.')
    const token = randomUUID()
    const { data: claim } = await context.admin.from('meeting_calendar_jobs').update({ state: 'running', lease_token: token, lease_until: new Date(Date.now() + 120_000).toISOString() }).eq('meeting_id', context.row.id).eq('generation', context.job.generation).eq('state', 'conflict').select('meeting_id').maybeSingle()
    if (!claim) throw new Error('Another review changed this conflict.')
    try {
      if (body.choice === 'google') {
        const startAt = localTime(context.remote?.start?.dateTime)
        const endAt = localTime(context.remote?.end?.dateTime)
        const patch = !context.remote || context.remote.status === 'cancelled' ? { lifecycle: 'cancelled' as const } : startAt && endAt ? { startAt, endAt } : null
        if (!patch) throw new Error('Google has no exact start/end time. Adjust that event first or keep Pivot’s time.')
        const applied = applyMeetingPatch(context.core, patch, context.row.due_at)
        if (!applied.ok) throw new Error(applied.error)
        const { data, error } = await context.admin.from('items').update({ meta: { ...context.row.meta, meeting_core: applied.core }, due_at: applied.dueAt, status: itemStatusForLifecycle(applied.core.lifecycle), updated_at: new Date().toISOString() }).eq('id', context.row.id).eq('user_id', context.ownerId).eq('updated_at', context.row.updated_at).select('id').maybeSingle()
        if (error || !data) throw new Error('The meeting changed before the review could be saved.')
      }
      const { error } = await context.admin.from('meeting_calendar_links').update({ etag: context.remote?.etag ?? context.link.etag, local_fingerprint: 'reviewed-conflict-resolution', deleted: !context.remote || context.remote.status === 'cancelled' }).eq('meeting_id', context.row.id).eq('owner_id', context.ownerId).eq('calendar_id', context.link.calendar_id)
      if (error) throw new Error('The reviewed calendar receipt could not be saved.')
      await context.admin.from('meeting_calendar_jobs').update({ state: 'pending', error: null, next_attempt_at: new Date().toISOString(), lease_until: null, lease_token: null }).eq('meeting_id', context.row.id).eq('lease_token', token)
      return NextResponse.json({ saved: true, reload: body.choice === 'google' })
    } catch (failure) {
      await context.admin.from('meeting_calendar_jobs').update({ state: 'conflict', error: 'The reviewed conflict could not be saved. Review it again.', lease_until: null, lease_token: null }).eq('meeting_id', context.row.id).eq('lease_token', token)
      throw failure
    }
  } catch (failure) { return NextResponse.json({ error: failure instanceof Error ? failure.message : 'Conflict review was not saved.' }, { status: 409 }) }
}
