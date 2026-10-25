import { createHash } from 'node:crypto'
import { applyMeetingPatch, type MeetingCore } from '@/lib/meetings/core'
import { GoogleCalendar, calendarEventId, meetingCalendarEvent, type CalendarBinding } from '@/lib/meetings/calendar'

export type CalendarLink = { calendar_id: string; event_id: string; etag: string; local_fingerprint: string; company: string; deleted: boolean }
export type CalendarSnapshot = { id: string; title: string; core: MeetingCore; updatedAt: string; deleted: boolean }
export type CalendarSyncStore = {
  bindings: CalendarBinding[]
  links: CalendarLink[]
  saveLink: (link: CalendarLink) => Promise<void>
  importSchedule: (snapshot: CalendarSnapshot, core: MeetingCore, dueAt: string | null) => Promise<boolean>
  isCurrent: () => Promise<boolean>
}

function fingerprint(value: unknown) { return createHash('sha256').update(JSON.stringify(value)).digest('hex') }
function sastLocal(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return null
  // Explicit offset on imported events; all-day and floating events need review.
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) return null
  return new Date(Date.parse(value) + 2 * 60 * 60_000).toISOString().slice(0, 16)
}

export async function synchroniseMeetingCalendar(google: GoogleCalendar, store: CalendarSyncStore, meeting: CalendarSnapshot) {
  const target = store.bindings.find((binding) => binding.company === meeting.core.company)
  const event = meeting.deleted || !target ? null : meetingCalendarEvent(meeting.id, meeting.title, meeting.core, target)
  const targetLink = store.links.find((link) => link.calendar_id === target?.calendarId)
  if (event && targetLink) event.id = targetLink.deleted ? calendarEventId(meeting.id, `${targetLink.calendar_id}:${targetLink.etag}`) : targetLink.event_id
  const localFingerprint = fingerprint(event)
  // Cancel old-company events before publishing into a new company calendar.
  for (const link of store.links.filter((link) => !link.deleted && (link.calendar_id !== target?.calendarId || !event))) {
    const binding = store.bindings.find((binding) => binding.calendarId === link.calendar_id && binding.company === link.company)
    if (!binding) return { state: 'blocked' as const, error: 'The previous company calendar needs reconciliation.' }
    if (!await store.isCurrent()) return { state: 'pending' as const }
    const remote = await google.event(binding.calendarId, link.event_id)
    if (remote?.status !== 'cancelled' && remote) {
      if (remote.etag !== link.etag) return { state: 'conflict' as const, error: 'The previous Google event changed. Review it before moving or cancelling.' }
      await google.cancel(binding, link.event_id, link.etag)
    }
    await store.saveLink({ ...link, deleted: true })
  }
  if (!target) return { state: 'blocked' as const, error: 'Review the calendar for this company first.' }
  if (!event) return { state: 'synced' as const }
  await google.privacy(target)
  const existing = store.links.find((link) => link.calendar_id === target.calendarId && !link.deleted)
  const remote = existing ? await google.event(target.calendarId, existing.event_id) : null
  if (existing && (!remote || remote.status === 'cancelled' || remote.etag !== existing.etag)) {
    if (existing.local_fingerprint !== localFingerprint) return { state: 'conflict' as const, error: 'The meeting changed in both Pivot and Google. Review the schedule before syncing.' }
    const startAt = sastLocal(remote?.start?.dateTime)
    const endAt = sastLocal(remote?.end?.dateTime)
    const patch = !remote || remote.status === 'cancelled' ? { lifecycle: 'cancelled' as const } : startAt && endAt ? { startAt, endAt } : null
    if (!patch) return { state: 'conflict' as const, error: 'The Google event has an all-day or unsupported schedule. Review its exact time.' }
    const applied = applyMeetingPatch(meeting.core, patch)
    if (!applied.ok || !await store.importSchedule(meeting, applied.core, applied.dueAt)) return { state: 'conflict' as const, error: 'The meeting changed while importing Google’s schedule.' }
    const importedEvent = meetingCalendarEvent(meeting.id, meeting.title, applied.core, target)
    if (importedEvent) importedEvent.id = existing.event_id
    await store.saveLink({ ...existing, etag: remote?.etag ?? existing.etag, local_fingerprint: fingerprint(importedEvent), deleted: !remote || remote.status === 'cancelled' })
    return { state: 'pending' as const }
  }
  if (existing && existing.local_fingerprint === localFingerprint) return { state: 'synced' as const }
  if (!await store.isCurrent()) return { state: 'pending' as const }
  const saved = await google.save(target, event, existing?.etag)
  if (!saved?.etag || !saved.id) throw new Error('Google did not confirm the saved event.')
  // A replayed create may return a prior payload. Never mark a new schedule synced.
  const sameSchedule = saved.status !== 'cancelled' && saved.summary === event.summary && (saved.location ?? '') === event.location && sastLocal(saved.start?.dateTime) === meeting.core.schedule.startAt && sastLocal(saved.end?.dateTime) === meeting.core.schedule.endAt
  await store.saveLink({ calendar_id: target.calendarId, event_id: saved.id, etag: saved.etag, local_fingerprint: sameSchedule ? localFingerprint : 'reconcile-required', company: target.company, deleted: false })
  return { state: sameSchedule ? 'synced' as const : 'conflict' as const, ...(sameSchedule ? {} : { error: 'An earlier Google save was recovered. Review the current schedule.' }) }
}
