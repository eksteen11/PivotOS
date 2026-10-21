import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { isUuid } from '@/lib/intake/shared'
import { clarificationPatch } from '@/lib/meetings/clarify'
import { applyMeetingPatch, appearsOnCalendar, createMeetingCore, founderCanAccess, incompleteMeeting, readMeetingCore, reviewFollowUp, sourceLink } from '@/lib/meetings/core'
import { followUpItemId } from '@/lib/meetings/followUp'
import { minutesEvidence } from '@/lib/meetings/minutes'

const sourceId = '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f'
const due = '2026-10-28T06:00:00.000Z'

test('an incomplete weekday request stays unscheduled', () => {
  const draft = incompleteMeeting({ title: 'Besoek', company: 'digikraal', note: 'Besoek Woensdag 08:00' })
  expect(draft.ok).toBe(true)
  if (!draft.ok) return
  expect(draft.dueAt).toBeNull()
  expect(draft.core.schedule).toEqual({ startAt: '', endAt: '', confirmed: false })
  expect(draft.core.lifecycle).toBe('to_arrange')
  expect(appearsOnCalendar(draft.core)).toBe(false)
  expect(draft.core.purpose).toContain('Woensdag')
})

test('a legacy meeting keeps its saved time and business', () => {
  const core = readMeetingCore({ people: 'CP', place: 'Ceres' }, due, 'northpoint')
  expect(core?.company).toBe('northpoint')
  expect(core?.legacySchedule).toBe(true)
  const saved = applyMeetingPatch(core!, { purpose: 'Prices' }, due)
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  expect(saved.dueAt).toBe(due)
  expect(saved.core.company).toBe('northpoint')
  const reloaded = readMeetingCore({ meeting_core: saved.core }, saved.dueAt, 'northpoint')
  expect(reloaded?.company).toBe('northpoint')
  expect(reloaded?.legacyDueAt).toBe(due)
  expect(appearsOnCalendar(reloaded!)).toBe(true)
  expect(readMeetingCore({}, due, 'missing-business')).toBeNull()
})

test('completed and custom preparation stays when details change', () => {
  const core = createMeetingCore({ company: 'digikraal', purpose: 'Sell the cattle', attendees: 'CP' })
  core.prep = [
    { id: 'custom-1', text: 'Bring certificates', done: true, source: 'custom' },
    { id: 'prep-people', text: 'Check who is attending', done: true, source: 'auto' },
  ]
  const saved = applyMeetingPatch(core, { attendees: 'Drikus + CP' })
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  expect(saved.core.prep.find((item) => item.text === 'Bring certificates')?.done).toBe(true)
  expect(saved.core.prep.find((item) => item.id === 'prep-people')?.done).toBe(true)
})

test('a natural reply can set the time and business without inventing a weekday', () => {
  const confirmed = clarificationPatch(JSON.stringify({
    company: 'digikraal', systemId: '005', purpose: '', desiredOutcome: '', attendees: 'Drikus + CP', place: 'CP plaas Ceres', link: '', startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00',
  }))
  const core = createMeetingCore({ company: 'northpoint', purpose: 'Visit' })
  const saved = applyMeetingPatch(core, confirmed)
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  expect(saved.core.company).toBe('digikraal')
  expect(saved.core.systemId).toBe('005')
  expect(saved.core.schedule).toEqual({ startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00', confirmed: true })
  expect(saved.dueAt).toBe('2026-10-28T08:00:00+02:00')
  expect(saved.core.attendees).toBe('Drikus + CP')

  const weekday = clarificationPatch(JSON.stringify({
    company: '', systemId: '', purpose: '', desiredOutcome: '', attendees: '', place: '', link: '', startAt: '', endAt: '',
  }))
  expect(weekday.startAt).toBeUndefined()
  const subdivision = clarificationPatch(JSON.stringify({
    company: '', systemId: '005', purpose: '', desiredOutcome: '', attendees: '', place: '', link: '', startAt: 'Wednesday', endAt: '09:00',
  }))
  expect(subdivision.company).toBe('digikraal')
  expect(subdivision.systemId).toBe('005')
  expect(subdivision.startAt).toBeUndefined()
})

test('the original request is never meeting evidence', () => {
  const core = createMeetingCore({ company: 'digikraal', purpose: 'Ruan called about a visit', sourceCaptureId: sourceId })
  expect(minutesEvidence(core).kind).toBe('none')
  expect(minutesEvidence(core).text).not.toContain('Ruan called')
  expect(minutesEvidence({ liveNotes: 'We agreed the price.' }).kind).toBe('notes')
  expect(minutesEvidence({ meetingTranscript: 'Ruan said the calves are ready.' }).kind).toBe('transcript')
  const route = readFileSync('app/api/meetings/core/minutes/route.ts', 'utf8')
  const workspace = readFileSync('components/meetings/MeetingWorkspace.tsx', 'utf8')
  expect(route).toContain('minutesEvidence')
  expect(route).not.toContain('body.transcript')
  expect(route).not.toContain('sourceCapture')
  const minutesStart = workspace.indexOf('async function draftMinutes')
  const minutesFn = workspace.slice(minutesStart, workspace.indexOf('async function approve'))
  expect(minutesFn).not.toContain('sourceHref')
  expect(minutesFn).not.toContain('/api/intake/source')
  expect(workspace).toContain('aria-label="Original request"')
  expect(sourceLink(core)).toBe(`/api/intake/source/${sourceId}`)
})

test('reviewed action edits survive reload and a repeat approval does not duplicate', () => {
  const core = createMeetingCore({ company: 'digikraal', purpose: 'Sell the cattle' })
  core.liveNotes = 'Confirm the prices.'
  core.minutes = { revision: 2, discussion: 'Prices were discussed.', decisions: [], questions: [], actions: [], evidence: 'notes' }
  const edited = { id: 'action-1', title: 'Confirm prices', include: true, company: 'northpoint' as const, systemId: '003', owner: 'Drikus', due: '2026-10-30' }
  const saved = applyMeetingPatch(core, { minutesActions: [edited] })
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  const reloaded = readMeetingCore({ meeting_core: saved.core }, null, 'digikraal')
  expect(reloaded?.minutes?.actions).toEqual([edited])
  const approved = { ...reloaded!, approvedRevision: 2, followUpItemIds: ['11111111-1111-4111-8111-111111111111'] }
  const repeat = reviewFollowUp(approved, 2)
  expect(repeat.ok && repeat.alreadyApproved).toBe(true)
  if (repeat.ok) expect(repeat.existingIds).toEqual(approved.followUpItemIds)
  const changed = applyMeetingPatch(approved, { liveNotes: 'The price changed after the meeting.' })
  expect(changed.ok).toBe(true)
  if (!changed.ok) return
  expect(changed.core.minutesStale).toBe(true)
  expect(changed.core.approvedRevision).toBeNull()
  expect(reviewFollowUp(changed.core, 2).ok).toBe(false)
  const first = followUpItemId('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', 2, 'action-1')
  expect(followUpItemId('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', 2, 'action-1')).toBe(first)
  expect(isUuid(first)).toBe(true)
})

test('another founder cannot open the meeting', () => {
  expect(founderCanAccess({ role: 'founder', ownerId: 'owner', requesterId: 'owner' })).toBe(true)
  expect(founderCanAccess({ role: 'founder', ownerId: 'owner', requesterId: 'other' })).toBe(false)
  expect(founderCanAccess({ role: 'member', ownerId: 'owner', requesterId: 'owner' })).toBe(false)
})
