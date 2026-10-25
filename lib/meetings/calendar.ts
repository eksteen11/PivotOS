import { createHash } from 'node:crypto'
import type { MeetingCore } from '@/lib/meetings/core'

export type CalendarBinding = { company: string; calendarId: string; ownerEmail: string; readers: string[] }
export type CalendarAcl = { role?: string; scope?: { type?: string; value?: string } }
export type CalendarEvent = {
  id: string; etag?: string; status?: string; summary?: string; location?: string
  start?: { dateTime?: string }; end?: { dateTime?: string }
  extendedProperties?: { private?: Record<string, string> }
}

// Verify every grant before publishing, including free/busy-only grants.
export function calendarPrivacyError(binding: CalendarBinding, rules: CalendarAcl[]) {
  const allowed = new Set([binding.ownerEmail, ...binding.readers].map((email) => email.trim().toLowerCase()))
  if (binding.company === 'personal' && binding.readers.length) return 'Personal calendars must remain private.'
  if (!rules.length) return 'Calendar sharing could not be verified.'
  for (const rule of rules) {
    if (rule.role === 'none') continue
    if (rule.scope?.type !== 'user' || !allowed.has(String(rule.scope.value ?? '').toLowerCase())) return 'Calendar sharing includes someone outside this company’s approved readers.'
  }
  return null
}

export function calendarEventId(meetingId: string, calendarId: string) {
  return createHash('sha256').update(`${meetingId}:${calendarId}`).digest('hex')
}

export function meetingCalendarEvent(meetingId: string, title: string, core: MeetingCore, binding: CalendarBinding) {
  if (binding.company !== core.company) throw new Error('Calendar belongs to a different company.')
  if (!core.schedule.confirmed || core.lifecycle === 'cancelled' || core.lifecycle === 'to_arrange') return null
  return {
    id: calendarEventId(meetingId, binding.calendarId),
    summary: title,
    location: core.place || core.link,
    start: { dateTime: `${core.schedule.startAt}:00+02:00`, timeZone: 'Africa/Johannesburg' },
    end: { dateTime: `${core.schedule.endAt}:00+02:00`, timeZone: 'Africa/Johannesburg' },
    visibility: core.company === 'personal' ? 'private' : 'default',
    reminders: { useDefault: false },
    extendedProperties: { private: { pivotMeetingId: meetingId, pivotCompany: core.company } },
  }
}

export class GoogleCalendar {
  constructor(private token: string, private request: typeof fetch = fetch) {}
  async call(path: string, init: RequestInit = {}) {
    const response = await this.request(`https://www.googleapis.com/calendar/v3/${path}`, {
      ...init, headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json', ...init.headers }, signal: AbortSignal.timeout(15_000),
    })
    if (response.status === 404 || response.status === 410) return null
    if (response.status === 409) return { conflict: true }
    if (response.status === 412) throw new Error('The Google event changed. Review the schedule conflict before syncing.')
    if (!response.ok) throw new Error(`Google Calendar request failed (${response.status}).`)
    return response.status === 204 ? {} : await response.json()
  }
  async calendars() {
    const calendars: { id: string; summary: string; accessRole: string }[] = []
    let page = ''
    do {
      const result = await this.call(`users/me/calendarList?minAccessRole=owner${page ? `&pageToken=${encodeURIComponent(page)}` : ''}`)
      if (!result) throw new Error('Calendars could not be read.')
      calendars.push(...(result.items ?? []))
      page = result.nextPageToken ?? ''
    } while (page)
    return calendars.filter((calendar) => calendar.accessRole === 'owner')
  }
  async privacy(binding: CalendarBinding) {
    const rules: CalendarAcl[] = []
    let page = ''
    do {
      const result = await this.call(`calendars/${encodeURIComponent(binding.calendarId)}/acl${page ? `?pageToken=${encodeURIComponent(page)}` : ''}`)
      if (!result) throw new Error('Calendar sharing could not be verified.')
      rules.push(...(result.items ?? []))
      page = result.nextPageToken ?? ''
    } while (page)
    const error = calendarPrivacyError(binding, rules)
    if (error) throw new Error(error)
  }
  async event(calendarId: string, eventId: string): Promise<CalendarEvent | null> {
    return this.call(`calendars/${encodeURIComponent(calendarId)}/events/${eventId}`)
  }
  async save(binding: CalendarBinding, event: NonNullable<ReturnType<typeof meetingCalendarEvent>>, expectedEtag?: string) {
    await this.privacy(binding)
    const base = `calendars/${encodeURIComponent(binding.calendarId)}/events`
    if (expectedEtag) return this.call(`${base}/${event.id}?sendUpdates=none`, { method: 'PUT', headers: { 'If-Match': expectedEtag }, body: JSON.stringify(event) })
    const created = await this.call(`${base}?sendUpdates=none`, { method: 'POST', body: JSON.stringify(event) })
    if (created?.conflict) {
      const existing = await this.event(binding.calendarId, event.id)
      if (existing?.extendedProperties?.private?.pivotMeetingId !== event.extendedProperties.private.pivotMeetingId) throw new Error('Calendar event identity did not match.')
      // Lost-create response: return the stored event; caller reconciles before edits.
      return existing
    }
    return created
  }
  async cancel(binding: CalendarBinding, eventId: string, etag: string) {
    await this.privacy(binding)
    return this.call(`calendars/${encodeURIComponent(binding.calendarId)}/events/${eventId}?sendUpdates=none`, { method: 'DELETE', headers: { 'If-Match': etag } })
  }
}
