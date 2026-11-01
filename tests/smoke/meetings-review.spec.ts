import { expect, test } from '@playwright/test'

import { meetingTimeLabel } from '@/lib/door/meetings'
import { isUuid } from '@/lib/intake/shared'
import { normalizeAnalysisContent } from '@/lib/intake/analyse'
import { createAutosave } from '@/lib/meetings/autosave'
import { clarificationPatch, clarificationUserPayload } from '@/lib/meetings/clarify'
import { applyMeetingPatch, canTransition, createMeetingCore, readMeetingCore, type MeetingAction, type MeetingCore } from '@/lib/meetings/core'
import { mergeIntakeMeeting, saveExistingIntakeMeeting } from '@/lib/meetings/intakeMeeting'
import { noteRecoveryDecision } from '@/lib/meetings/noteRecovery'
import { boundedFetch, MEETING_REQUEST_MS, unconfirmedRequest } from '@/lib/meetings/request'
import { applyWorkAction, statusLabels, type WorkCase } from '@/lib/workspace/model'
import { isReviewedIntakeWork, reviewedWorkStart, workRecordHref, workStatusLabel, workSummary } from '@/lib/workspace/workLink'
import { commitReviewedFollowUp, type ReviewRow, type ReviewStore, type ReviewTask } from '@/lib/meetings/reviewCommit'
import { followUpStatusLabel, visibleFollowUp, type FollowUpStatus } from '@/lib/meetings/followUpView'

const meetingId = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
const sourceId = '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f'

function action(title: string, company: MeetingAction['company'] = 'northpoint'): MeetingAction {
  return { id: 'action-1', title, include: true, company, systemId: company === 'northpoint' ? '003' : '005', owner: 'Drikus', due: '2026-10-30' }
}

function readyCore(actions: MeetingAction[]): MeetingCore {
  const core = createMeetingCore({ company: 'digikraal', purpose: 'Sell the cattle', attendees: 'Drikus' })
  core.liveNotes = 'We agreed the price.'
  core.minutes = { revision: 2, discussion: 'Prices were discussed.', decisions: [], questions: [], actions, evidence: 'notes' }
  return core
}

function memoryStore(core: MeetingCore, options?: { failFirstCommit?: boolean; claimDelayMs?: number }) {
  let clock = 0
  let row: ReviewRow = { updatedAt: 't0', dueAt: null, meta: {}, core }
  const tasks = new Map<string, ReviewTask & { status: FollowUpStatus }>()
  let failedCommit = false
  const store: ReviewStore = {
    async load() {
      return { ...row, core: structuredClone(row.core), meta: { ...row.meta } }
    },
    async compareAndSet(_id, expected, next) {
      if (options?.claimDelayMs) await new Promise((resolve) => setTimeout(resolve, options.claimDelayMs))
      if (options?.failFirstCommit && !failedCommit && next.core.reviewClaim?.phase === 'committed') {
        failedCommit = true
        return { ok: false }
      }
      if (row.updatedAt !== expected) return { ok: false }
      clock += 1
      row = { ...row, updatedAt: `t${clock}`, core: structuredClone(next.core), meta: { ...next.meta, meeting_core: next.core } }
      return { ok: true, updatedAt: row.updatedAt }
    },
    async findTask(taskId) {
      const task = tasks.get(taskId)
      return task ? { id: task.id, fingerprint: task.fingerprint } : null
    },
    async insertTask(task) {
      if (tasks.has(task.id)) return { ok: false, duplicate: true }
      tasks.set(task.id, { ...task, status: 'planned' })
      return { ok: true }
    },
    async readOutcomes(ids) {
      const seen = new Set<string>()
      return ids.flatMap((id) => {
        if (seen.has(id)) return []
        seen.add(id)
        const task = tasks.get(id)
        if (!task) return []
        return [{ id: task.id, title: task.title, status: task.status, company: task.company, systemId: task.systemId, owner: task.owner, due: task.due, entityId: task.entityId, userId: 'founder', fingerprint: task.fingerprint, meetingId: task.meetingId }]
      })
    },
    async entityId() {
      return 'entity-1'
    },
  }
  return { store, tasks, read: () => row }
}

test('two approvals race on one snapshot and a notes edit cannot land after the claim', async () => {
  const actions = [action('Confirm prices')]
  const { store, tasks, read } = memoryStore(readyCore(actions), { claimDelayMs: 20 })
  let notesResult: { ok: boolean } = { ok: true }
  store.afterClaim = async () => {
    const current = await store.load(meetingId)
    const patched = current ? applyMeetingPatch(current.core, { liveNotes: 'Changed during review' }) : null
    notesResult = patched?.ok ? await store.compareAndSet(meetingId, 't0', { core: patched.core, meta: current!.meta }) : { ok: false }
  }
  const [first, second] = await Promise.all([
    commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions }),
    commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions }),
  ])
  expect(first.ok && second.ok).toBe(true)
  if (first.ok && second.ok) expect(second.followUpItemIds).toEqual(first.followUpItemIds)
  expect(tasks.size).toBe(1)
  expect(read().core.approvedRevision).toBe(2)
  expect(read().core.reviewClaim?.phase).toBe('committed')
  expect(notesResult.ok).toBe(false)
  expect(read().core.liveNotes).toBe('We agreed the price.')
})

test('a changed action retries the claimed snapshot instead of reusing the old task', async () => {
  const original = [action('Confirm prices')]
  const { store, tasks } = memoryStore(readyCore(original), { failFirstCommit: true })
  const first = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions: original })
  expect(first.ok).toBe(false)
  expect(tasks.size).toBe(1)
  const oldId = [...tasks.keys()][0]
  const changed = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions: [action('Confirm ages')] })
  expect(changed.ok).toBe(false)
  if (!changed.ok) expect(changed.error).toMatch(/different review/i)
  expect([...tasks.keys()]).toEqual([oldId])
  const retry = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't1', revision: 2, actions: original })
  expect(retry.ok).toBe(true)
  if (retry.ok) {
    expect(retry.followUpItemIds).toEqual([oldId])
    expect(isUuid(oldId)).toBe(true)
  }
  expect(tasks.size).toBe(1)
  expect(tasks.get(oldId)?.title).toBe('Confirm prices')
})

test('saving unchanged approved routing keeps the reviewed revision and does not create another task', async () => {
  const actions = [action('Confirm prices')]
  const { store, tasks, read } = memoryStore(readyCore(actions))
  const first = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions })
  expect(first.ok).toBe(true)
  if (!first.ok) return
  const saved = applyMeetingPatch(read().core, { minutesActions: structuredClone(actions) })
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  expect(saved.core.minutes?.revision).toBe(2)
  expect(saved.core.approvedRevision).toBe(2)
  expect(saved.core.lifecycle).toBe('follow_up')
  expect(saved.core.followUpItemIds).toEqual(first.followUpItemIds)
  const write = await store.compareAndSet(meetingId, read().updatedAt, { core: saved.core, meta: read().meta })
  expect(write.ok).toBe(true)
  const repeat = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 2, actions })
  expect(repeat.ok && repeat.alreadyApproved).toBe(true)
  expect(tasks.size).toBe(1)

  const changed = applyMeetingPatch(read().core, { minutesActions: [{ ...actions[0], owner: 'Another owner' }] })
  expect(changed.ok).toBe(true)
  if (!changed.ok) return
  expect(changed.core.minutes?.revision).toBe(3)
  expect(changed.core.approvedRevision).toBeNull()
  expect(changed.core.lifecycle).toBe('minutes_review')
  expect(changed.core.followUpItemIds).toEqual(first.followUpItemIds)
})

function linkedUuid(index: number) {
  return `00000000-0000-4000-8000-${index.toString(16).padStart(12, '0')}`
}

async function openNextRevision(store: ReviewStore, read: () => ReviewRow, revision: number, actions: MeetingAction[]) {
  const current = read()
  const core = structuredClone(current.core)
  if (!core.minutes) throw new Error('minutes missing')
  core.minutes = { ...core.minutes, revision, actions }
  core.approvedRevision = null
  core.lifecycle = 'minutes_review'
  core.reviewClaim = null
  return store.compareAndSet(meetingId, current.updatedAt, { core, meta: current.meta })
}

test('later minutes keep completed work, reuse an unchanged commitment, and do not rewrite it', async () => {
  const original = [action('Confirm prices')]
  const { store, tasks, read } = memoryStore(readyCore(original))
  const first = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions: original })
  expect(first.ok).toBe(true)
  if (!first.ok) return
  const oldId = first.followUpItemIds[0]
  const saved = tasks.get(oldId)
  expect(saved).toBeTruthy()
  if (!saved) return
  saved.status = 'done'
  saved.title = 'Confirm prices'
  const redrafted = [{ ...original[0], id: 'action-9' }]
  expect((await openNextRevision(store, read, 3, redrafted)).ok).toBe(true)
  const again = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 3, actions: redrafted })
  expect(again.ok).toBe(true)
  if (!again.ok) return
  expect(tasks.size).toBe(1)
  expect(again.followUpItemIds).toEqual([oldId])
  expect(tasks.get(oldId)?.status).toBe('done')
  expect(tasks.get(oldId)?.owner).toBe('Drikus')
  expect(again.outcomes.map((item) => item.status)).toEqual(['done'])
  expect(followUpStatusLabel(again.outcomes[0].status, true)).toBe('Done')
  expect(followUpStatusLabel(again.outcomes[0].status, true)).not.toBe('Ready to start')
  const reordered = [action('Book the viewing', 'digikraal'), redrafted[0]]
  reordered[0].id = 'action-b'
  expect((await openNextRevision(store, read, 4, [reordered[1], reordered[0]])).ok).toBe(true)
  const swapped = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 4, actions: [reordered[1], reordered[0]] })
  expect(swapped.ok).toBe(true)
  if (!swapped.ok) return
  expect(tasks.size).toBe(2)
  expect(swapped.followUpItemIds).toContain(oldId)
  expect(tasks.get(oldId)?.status).toBe('done')
  const changed = [{ ...redrafted[0], id: 'action-c', owner: 'Another owner' }]
  expect((await openNextRevision(store, read, 5, changed)).ok).toBe(true)
  const routed = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 5, actions: changed })
  expect(routed.ok).toBe(true)
  if (!routed.ok) return
  expect(tasks.size).toBe(3)
  expect(routed.followUpItemIds).toContain(oldId)
  expect(tasks.get(oldId)?.owner).toBe('Drikus')
  expect(tasks.get(oldId)?.status).toBe('done')
  expect((await openNextRevision(store, read, 6, [])).ok).toBe(true)
  const removed = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 6, actions: [] })
  expect(removed.ok).toBe(true)
  if (!removed.ok) return
  expect(removed.followUpItemIds).toEqual(routed.followUpItemIds)
  expect(tasks.size).toBe(3)
  const historical = Array.from({ length: 21 }, (_, index) => linkedUuid(index + 1))
  for (const id of historical) {
    tasks.set(id, { id, fingerprint: 'old', title: `Kept ${id.slice(-2)}`, company: 'northpoint', systemId: '003', owner: 'Drikus', due: '2026-01-01', entityId: 'entity-1', meetingId, revision: 1, actionId: id, sourceCaptureId: null, status: 'cancelled' })
  }
  const current = read()
  current.core.followUpItemIds = [...removed.followUpItemIds, ...historical]
  expect((await store.compareAndSet(meetingId, current.updatedAt, { core: current.core, meta: current.meta })).ok).toBe(true)
  const added = [action('Send the summary')]
  added[0].id = 'action-new'
  expect((await openNextRevision(store, read, 7, added)).ok).toBe(true)
  const wide = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 7, actions: added })
  expect(wide.ok).toBe(true)
  if (!wide.ok) return
  expect(wide.followUpItemIds.length).toBeGreaterThan(20)
  expect(historical.every((id) => wide.followUpItemIds.includes(id))).toBe(true)
  expect(wide.outcomes.filter((item) => item.status === 'cancelled')).toHaveLength(21)
  expect(wide.outcomes.some((item) => item.status === 'done' && item.title === 'Confirm prices')).toBe(true)
  const stored = readMeetingCore({ meeting_core: wide.meeting }, null, 'digikraal')
  expect(stored?.followUpItemIds).toEqual(wide.followUpItemIds)
  const owned = new Map([['entity-np', 'northpoint' as const]])
  const hiddenOwner = visibleFollowUp({ id: oldId, user_id: 'other-user', entity_id: 'entity-np', title: 'Secret prices', status: 'done', meta: { meeting_id: meetingId, pivot_case: { company: 'northpoint', systemId: '003', owner: 'Drikus', due: '2026-10-30' } } }, 'founder', owned)
  expect(hiddenOwner).toBeNull()
  const hiddenCompany = visibleFollowUp({ id: oldId, user_id: 'founder', entity_id: 'entity-dk', title: 'Secret prices', status: 'done', meta: { meeting_id: meetingId, pivot_case: { company: 'digikraal', systemId: '005', owner: 'Drikus', due: '2026-10-30' } } }, 'founder', owned)
  expect(hiddenCompany).toBeNull()
  const wrongCompany = visibleFollowUp({ id: oldId, user_id: 'founder', entity_id: 'entity-np', title: 'Secret prices', status: 'done', meta: { meeting_id: meetingId, pivot_case: { company: 'digikraal', systemId: '005', owner: 'Drikus', due: '2026-10-30' } } }, 'founder', owned)
  expect(wrongCompany).toBeNull()
  const shown = visibleFollowUp({ id: oldId, user_id: 'founder', entity_id: 'entity-np', title: 'Confirm prices', status: 'done', meta: { meeting_id: meetingId, review_fingerprint: 'abc', pivot_case: { company: 'northpoint', systemId: '003', owner: 'Drikus', due: '2026-10-30' } } }, 'founder', owned)
  expect(shown?.status).toBe('done')
  expect(shown?.title).toBe('Confirm prices')
})

test('a failed later review keeps the earlier links and the same review can be retried', async () => {
  const original = [action('Confirm prices')]
  const { store, tasks, read } = memoryStore(readyCore(original))
  const first = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions: original })
  expect(first.ok).toBe(true)
  if (!first.ok) return
  const oldId = first.followUpItemIds[0]
  tasks.get(oldId)!.status = 'done'
  const extra = [action('Book the viewing')]
  extra[0].id = 'action-extra'
  expect((await openNextRevision(store, read, 3, extra)).ok).toBe(true)
  const failing = store.insertTask
  store.insertTask = async () => ({ ok: false, duplicate: false })
  const failed = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 3, actions: extra })
  expect(failed.ok).toBe(false)
  expect(read().core.followUpItemIds).toEqual([oldId])
  expect(read().core.approvedRevision).toBeNull()
  expect(read().core.reviewClaim?.phase).toBe('pending')
  expect(tasks.get(oldId)?.status).toBe('done')
  store.insertTask = failing
  const retried = await commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 3, actions: extra })
  expect(retried.ok).toBe(true)
  if (!retried.ok) return
  expect(retried.followUpItemIds).toContain(oldId)
  expect(tasks.size).toBe(2)
  expect(tasks.get(oldId)?.status).toBe('done')
  const [left, right] = await Promise.all([
    commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 3, actions: extra }),
    commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: read().updatedAt, revision: 3, actions: extra }),
  ])
  expect(left.ok && right.ok).toBe(true)
  expect(tasks.size).toBe(2)
})

test('a previous approval cannot advance redrafted or stale minutes into follow-up', () => {
  const core = readyCore([action('Confirm prices')])
  core.lifecycle = 'minutes_review'
  core.approvedRevision = 1
  expect(canTransition('minutes_review', 'follow_up', core)).toBe(false)
  core.approvedRevision = 2
  expect(canTransition('minutes_review', 'follow_up', core)).toBe(true)
  core.minutesStale = true
  expect(canTransition('minutes_review', 'follow_up', core)).toBe(false)
})

test('clarification keeps earlier replies and does not invent a date', () => {
  const core = createMeetingCore({ company: 'digikraal', purpose: 'Visit CP', attendees: 'Ruan and me' })
  core.clarifications = [
    { field: 'reply', question: 'Who needs to be there?', answer: 'Ruan and me' },
    { field: 'reply', question: 'Add the exact date', answer: '28 October at 8' },
  ]
  const payload = clarificationUserPayload(core, 'one hour')
  expect(payload).toContain('Current question:')
  expect(payload).toContain('Ruan and me')
  expect(payload).toContain('28 October at 8')
  expect(payload).toContain('one hour')
  expect(payload).not.toContain('Who needs to be there?')
  const invented = clarificationPatch(JSON.stringify({ company: '', systemId: '', purpose: '', desiredOutcome: '', attendees: '', place: '', link: '', startAt: '', endAt: '' }))
  expect(invented.startAt).toBeUndefined()
  const accumulated = clarificationPatch(JSON.stringify({ company: '', systemId: '', purpose: '', desiredOutcome: '', attendees: 'Ruan and me', place: '', link: '', startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00' }))
  const saved = applyMeetingPatch(core, accumulated)
  expect(saved.ok).toBe(true)
  if (saved.ok) {
    expect(saved.core.attendees).toBe('Ruan and me')
    expect(saved.core.schedule).toEqual({ startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00', confirmed: true })
    expect(saved.dueAt).toBe('2026-10-28T08:00:00+02:00')
  }
})

test('an incomplete meeting keeps its id and source while clarification updates it', () => {
  const content = JSON.stringify({
    language: 'en',
    summary: 'Visit',
    questions: [],
    proposals: [{ kind: 'meeting', title: 'Visit CP', company: 'digikraal', systemId: '005', notes: 'Ruan called', requiresExternalApproval: false, uncertainties: [], meeting: { confirmedSchedule: false, startAt: '', endAt: '', people: '', place: '' } }],
  })
  const first = normalizeAnalysisContent(content)
  const again = normalizeAnalysisContent(content, [first.proposals[0].proposalId])
  expect(again.proposals[0].proposalId).toBe(first.proposals[0].proposalId)
  const existing = createMeetingCore({ company: 'digikraal', purpose: 'Ruan called', sourceCaptureId: sourceId, clarifications: [{ field: 'reply', question: 'Who?', answer: 'Ruan and me' }] })
  existing.liveNotes = 'Do not lose these notes.'
  const merged = mergeIntakeMeeting({
    existing,
    existingDueAt: null,
    proposal: { ...again.proposals[0], meeting: { confirmedSchedule: true, startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00', people: 'Ruan and me', place: 'Ceres' } },
    clarifications: [{ field: 'reply', answer: '28 October at 8 for one hour' }],
    sourceCaptureId: sourceId,
  })
  expect(merged.ok).toBe(true)
  if (merged.ok) {
    expect(merged.core.sourceCaptureId).toBe(sourceId)
    expect(merged.core.liveNotes).toBe('Do not lose these notes.')
    expect(merged.core.clarifications.map((item) => item.answer)).toEqual(['Ruan and me', '28 October at 8 for one hour'])
    expect(merged.dueAt).toBe('2026-10-28T08:00:00+02:00')
  }
})

test('note saves stay in order when the first response is slow', async () => {
  const calls: { notes: string; updatedAt: string }[] = []
  let releaseFirst: (() => void) | null = null
  const saver = createAutosave({
    initialUpdatedAt: 't0',
    delayMs: 30,
    send: async ({ updatedAt, patch }) => {
      calls.push({ notes: String(patch.liveNotes), updatedAt })
      if (calls.length === 1) await new Promise<void>((resolve) => { releaseFirst = resolve })
      return { ok: true, updatedAt: `t${calls.length}` }
    },
  })
  saver.schedule({ liveNotes: 'a' })
  saver.schedule({ liveNotes: 'ab' })
  const flushed = saver.flush({ liveNotes: 'ab' })
  await new Promise((resolve) => setTimeout(resolve, 50))
  expect(calls.map((call) => call.notes)).toEqual(['ab'])
  const second = saver.flush({ liveNotes: 'abc' })
  await new Promise((resolve) => setTimeout(resolve, 10))
  releaseFirst?.()
  const [firstResult, secondResult] = await Promise.all([flushed, second])
  expect(calls.map((call) => call.notes)).toEqual(['ab', 'abc'])
  expect(calls[1].updatedAt).toBe('t1')
  expect(firstResult.status).toBe('saved')
  expect(secondResult.updatedAt).toBe('t2')
  let tries = 0
  const retried = createAutosave({
    initialUpdatedAt: 't0',
    send: async () => {
      tries += 1
      return tries === 1 ? { ok: false, error: 'This meeting changed in another window. Reload before saving.' } : { ok: true, updatedAt: 't9' }
    },
  })
  expect((await retried.flush({ liveNotes: 'kept' })).status).toBe('error')
  expect((await retried.retry()).status).toBe('saved')
  expect((await retried.retry()).updatedAt).toBe('t9')
  let thrown = 0
  const offline = createAutosave({
    initialUpdatedAt: 't0',
    send: async () => {
      thrown += 1
      if (thrown === 1) throw new Error('network down')
      return { ok: true, updatedAt: 't4' }
    },
  })
  const failed = await offline.flush({ liveNotes: 'keep me' })
  expect(failed.status).toBe('error')
  expect(failed.error).toBe('network down')
  const recovered = await offline.retry()
  expect(recovered.status).toBe('saved')
  expect(recovered.updatedAt).toBe('t4')
})

test('an intake update loses to a review claim and keeps the progressed notes', async () => {
  const progressed = readyCore([action('Confirm prices')])
  progressed.liveNotes = 'Progressed notes stay.'
  const { store, read } = memoryStore(progressed, { claimDelayMs: 15 })
  const [claimed, updated] = await Promise.all([
    commitReviewedFollowUp(store, { meetingId, expectedUpdatedAt: 't0', revision: 2, actions: [action('Confirm prices')] }),
    saveExistingIntakeMeeting({
      expectedUpdatedAt: 't0',
      existing: structuredClone(progressed),
      existingDueAt: null,
      proposal: { proposalId: meetingId, kind: 'meeting', title: 'Sell the cattle', company: 'digikraal', systemId: '005', notes: 'Ruan called again', requiresExternalApproval: false, uncertainties: [], meeting: { confirmedSchedule: false, startAt: '', endAt: '', people: 'Drikus', place: '' } },
      clarifications: [],
      sourceCaptureId: sourceId,
      write: async (expected, next) => {
        await new Promise((resolve) => setTimeout(resolve, 40))
        return store.compareAndSet(meetingId, expected, { core: next.core, meta: {} })
      },
    }),
  ])
  expect(claimed.ok).toBe(true)
  expect(updated.ok).toBe(false)
  if (!updated.ok) expect(updated.status).toBe(409)
  expect(read().core.liveNotes).toBe('Progressed notes stay.')
  expect(read().core.reviewClaim?.phase).toBe('committed')
})

test('unsaved notes resume only when the server version is unchanged', async () => {
  expect(noteRecoveryDecision({ serverNotes: '', serverTranscript: '', serverUpdatedAt: 't0', stored: null })).toBe('none')
  expect(noteRecoveryDecision({ serverNotes: 'saved', serverTranscript: '', serverUpdatedAt: 't0', stored: { liveNotes: 'saved', meetingTranscript: '', baseUpdatedAt: 't0' } })).toBe('none')
  expect(noteRecoveryDecision({ serverNotes: '', serverTranscript: '', serverUpdatedAt: 't0', stored: { liveNotes: 'typed', meetingTranscript: '', baseUpdatedAt: 't0' } })).toBe('resume')
  expect(noteRecoveryDecision({ serverNotes: 'server copy', serverTranscript: '', serverUpdatedAt: 't1', stored: { liveNotes: 'typed', meetingTranscript: '', baseUpdatedAt: 't0' } })).toBe('ask')
  const href = workRecordHref('bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee')
  expect(href).toBe('/today?view=work&work=bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee')
  expect(href.includes('/processes')).toBe(false)
  expect(workSummary({ id: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee', title: 'Confirm prices', status: 'planned' })?.title).toBe('Confirm prices')
  expect(workSummary({ id: 'not-an-id', title: 'Confirm prices', status: 'planned' })).toBeNull()
  const open = createMeetingCore({ company: 'northpoint', purpose: 'Visit' })
  expect(meetingTimeLabel(open)).toBe('')
  const booked = createMeetingCore({ company: 'northpoint', purpose: 'Visit', schedule: { startAt: '2026-10-28T08:00', endAt: '2026-10-28T09:00', confirmed: true } })
  expect(meetingTimeLabel(booked)).toMatch(/28 Oct/)
  expect(meetingTimeLabel(booked)).toMatch(/08:00/)
  expect(statusLabels.planned).toBe('Needs approval')
  expect(workStatusLabel('planned', true)).toBe('Ready to start')
  expect(workStatusLabel('planned')).toBe('Needs approval')
  const start = reviewedWorkStart('planned', 'Meeting follow-up')
  expect(start?.heading).toBe('Ready to start')
  expect(start?.action).toBe('Start this work')
  expect(start?.detail).toMatch(/own review/)
  expect(reviewedWorkStart('planned', 'Manual capture')).toBeNull()
  expect(isReviewedIntakeWork('WhatsApp intake approval')).toBe(true)
  const intakeStart = reviewedWorkStart('planned', 'WhatsApp intake approval')
  expect(intakeStart?.heading).toBe('Ready to start')
  expect(intakeStart?.detail).toMatch(/WhatsApp intake/)
  expect(workSummary({ id: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee', title: 'Draft listing', status: 'planned', source: 'WhatsApp intake approval' })?.reviewed).toBe(true)
  const reviewed: WorkCase = { id: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee', entityId: 'entity', company: 'northpoint', systemId: '003', title: 'Confirm prices', notes: '', due: '', status: 'planned', source: 'Meeting follow-up', updatedAt: 't0', facts: {}, checked: [], history: [], lessons: [], kind: 'task', intake: { sourceCaptureId: '', proposalKind: 'task', externalBlocked: true } }
  expect(() => applyWorkAction(reviewed, { kind: 'task', index: 0, checked: true }, 't1')).toThrow(/Approve the work plan/)
  const originalFetch = globalThis.fetch
  globalThis.fetch = () => Promise.reject(new TypeError('network down'))
  let busy = true
  try {
    try {
      await boundedFetch('/api/meetings/core/clarify', { method: 'POST', body: '{}' })
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    } finally {
      busy = false
    }
  } finally {
    globalThis.fetch = originalFetch
  }
  expect(busy).toBe(false)
  expect(MEETING_REQUEST_MS).toBe(35_000)
  expect(unconfirmedRequest).not.toMatch(/Nothing was changed|Nothing new was saved/)
  const slowBody = globalThis.fetch
  globalThis.fetch = () => Promise.resolve(new Response(new ReadableStream({ start() {} }), { status: 200, headers: { 'content-type': 'application/json' } }))
  await expect(boundedFetch('/api/meetings/core/approve', { method: 'POST', body: '{}' }, 40)).rejects.toThrow(/could not be confirmed/)
  globalThis.fetch = slowBody
})
