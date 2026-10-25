import { expect, test } from '@playwright/test'
import { calendarPrivacyError, GoogleCalendar, meetingCalendarEvent, type CalendarBinding } from '@/lib/meetings/calendar'
import { synchroniseMeetingCalendar, type CalendarLink, type CalendarSnapshot, type CalendarSyncStore } from '@/lib/meetings/calendarSync'
import { createMeetingCore } from '@/lib/meetings/core'
import { companies } from '@/lib/workspace/catalogue'
import { decryptConnection, encryptConnection } from '@/lib/meetings/connectionSecrets'

const binding: CalendarBinding = { company: 'digikraal', calendarId: 'company@calendar', ownerEmail: 'owner@example.com', readers: ['reader@example.com'] }
const ownerRule = { role: 'owner', scope: { type: 'user', value: 'owner@example.com' } }

test('all four companies publish only their own schedule with no attendees, notes, audio or busy shadows', () => {
  for (const company of companies) {
    const core = createMeetingCore({ company: company.id, schedule: { startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00', confirmed: true } })
    core.liveNotes = 'PRIVATE NOTES'
    core.meetingTranscript = 'PRIVATE AUDIO'
    const event = meetingCalendarEvent('meeting', 'Visit', core, { ...binding, company: company.id })!
    expect(event.extendedProperties.private.pivotCompany).toBe(company.id)
    expect(event.start.dateTime).toBe('2026-10-28T08:00:00+02:00')
    expect(event).not.toHaveProperty('attendees')
    expect(event).not.toHaveProperty('description')
    expect(JSON.stringify(event)).not.toMatch(/PRIVATE/)
    expect(() => meetingCalendarEvent('meeting', 'Visit', core, { ...binding, company: 'wrong' })).toThrow(/different company/)
  }
})

test('sharing rejects public, domain and anonymous busy grants and keeps Personal private', () => {
  expect(calendarPrivacyError(binding, [ownerRule, { role: 'reader', scope: { type: 'user', value: 'reader@example.com' } }])).toBeNull()
  for (const rule of [
    { role: 'freeBusyReader', scope: { type: 'default' } },
    { role: 'reader', scope: { type: 'domain', value: 'example.com' } },
    { role: 'reader', scope: { type: 'user', value: 'other-company@example.com' } },
  ]) expect(calendarPrivacyError(binding, [ownerRule, rule])).toMatch(/outside/)
  expect(calendarPrivacyError({ ...binding, company: 'personal' }, [ownerRule])).toMatch(/private/)
  expect(calendarPrivacyError({ ...binding, company: 'personal', readers: [] }, [ownerRule])).toBeNull()
  expect(calendarPrivacyError(binding, [])).toMatch(/verified/)
})

test('encrypted connection credentials cannot be opened under another owner or after tampering', () => {
  const original = process.env.MEETINGS_TOKEN_KEY
  process.env.MEETINGS_TOKEN_KEY = Buffer.alloc(32, 7).toString('base64')
  try {
    const token = encryptConnection('owner-1', { refreshToken: 'secret' })
    expect(decryptConnection('owner-1', token)).toEqual({ refreshToken: 'secret' })
    expect(token).not.toContain('secret')
    expect(() => decryptConnection('owner-2', token)).toThrow()
    expect(() => decryptConnection('owner-1', token.slice(0, -4))).toThrow()
  } finally { if (original === undefined) delete process.env.MEETINGS_TOKEN_KEY; else process.env.MEETINGS_TOKEN_KEY = original }
})

function syncFixture() {
  const core = createMeetingCore({ company: 'digikraal', schedule: { startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00', confirmed: true } })
  const meeting: CalendarSnapshot = { id: 'meeting', title: 'Visit', core, updatedAt: 'v1', deleted: false }
  const remote = new Map<string, Record<string, unknown>>()
  const calls: { path: string; method: string; body?: Record<string, unknown>; headers: Record<string, string> }[] = []
  let version = 0
  const google = new GoogleCalendar('token', (async (url: string | URL | Request, init: RequestInit = {}) => {
    const path = String(url)
    const method = init.method ?? 'GET'
    const body = init.body ? JSON.parse(String(init.body)) : undefined
    calls.push({ path, method, body, headers: init.headers as Record<string, string> })
    const json = (status: number, value: unknown) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
    if (path.includes('/acl')) return json(200, { items: [ownerRule] })
    const key = path.split('/events/')[1]?.split('?')[0] ?? body?.id
    if (method === 'GET') return remote.has(key) ? json(200, remote.get(key)) : json(404, {})
    if (method === 'DELETE') { remote.delete(key); return new Response(null, { status: 204 }) }
    if (method === 'POST' && remote.has(key)) return json(409, {})
    if (method === 'PUT' && remote.get(key)?.etag !== (init.headers as Record<string, string>)['If-Match']) return json(412, {})
    const saved = { ...body, etag: `etag-${++version}` }
    remote.set(key, saved)
    return json(200, saved)
  }) as typeof fetch)
  const links: CalendarLink[] = []
  const store: CalendarSyncStore = {
    bindings: [binding], links,
    async saveLink(link) { const index = links.findIndex((existing) => existing.calendar_id === link.calendar_id); if (index >= 0) links[index] = link; else links.push(link) },
    async isCurrent() { return true },
    async importSchedule(snapshot, next) { if (snapshot.updatedAt !== meeting.updatedAt) return false; meeting.core = next; return true },
  }
  return { google, meeting, remote, calls, links, store }
}

test('sync creates once, reschedules with an etag, imports Google changes and blocks simultaneous edits', async () => {
  const f = syncFixture()
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  expect(f.calls.filter((call) => call.method === 'POST')).toHaveLength(1)
  f.meeting.core.schedule = { startAt: '2026-10-28T10:00', endAt: '2026-10-28T11:00', confirmed: true }
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  expect(f.calls.find((call) => call.method === 'PUT')?.headers['If-Match']).toBe('etag-1')
  const id = f.links[0].event_id
  const remote = f.remote.get(id)!
  f.remote.set(id, { ...remote, etag: 'remote-change', start: { dateTime: '2026-10-29T08:00:00Z' }, end: { dateTime: '2026-10-29T09:00:00Z' } })
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('pending')
  expect(f.meeting.core.schedule.startAt).toBe('2026-10-29T10:00')
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  f.remote.set(id, { ...f.remote.get(id), etag: 'remote-change-again' })
  f.meeting.core.schedule.startAt = '2026-10-29T12:00'
  const writes = f.calls.filter((call) => call.method !== 'GET').length
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('conflict')
  expect(f.calls.filter((call) => call.method !== 'GET')).toHaveLength(writes)
  expect(f.calls.filter((call) => call.method !== 'GET').every((call) => call.path.includes('sendUpdates=none'))).toBe(true)
})

test('cancel and reopen preserve meeting identity without trying to recreate a deleted Google event', async () => {
  const f = syncFixture()
  await synchroniseMeetingCalendar(f.google, f.store, f.meeting)
  const originalId = f.links[0].event_id
  f.meeting.core.lifecycle = 'cancelled'
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  expect(f.links[0].deleted).toBe(true)
  f.meeting.core.lifecycle = 'scheduled'
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  expect(f.links[0].event_id).not.toBe(originalId)
  expect((await synchroniseMeetingCalendar(f.google, f.store, f.meeting)).state).toBe('synced')
  expect(f.calls.filter((call) => call.method === 'POST')).toHaveLength(2)
})
