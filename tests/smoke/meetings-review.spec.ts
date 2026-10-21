import { expect, test } from '@playwright/test'

import { isUuid } from '@/lib/intake/shared'
import { normalizeAnalysisContent } from '@/lib/intake/analyse'
import { createAutosave } from '@/lib/meetings/autosave'
import { clarificationPatch, clarificationUserPayload } from '@/lib/meetings/clarify'
import { applyMeetingPatch, createMeetingCore, type MeetingAction, type MeetingCore } from '@/lib/meetings/core'
import { mergeIntakeMeeting, saveExistingIntakeMeeting } from '@/lib/meetings/intakeMeeting'
import { noteRecoveryDecision } from '@/lib/meetings/noteRecovery'
import { workRecordHref, workSummary } from '@/lib/workspace/workLink'
import { commitReviewedFollowUp, type ReviewRow, type ReviewStore, type ReviewTask } from '@/lib/meetings/reviewCommit'

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
  const tasks = new Map<string, ReviewTask>()
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
      tasks.set(task.id, task)
      return { ok: true }
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

test('unsaved notes resume only when the server version is unchanged', () => {
  expect(noteRecoveryDecision({ serverNotes: '', serverTranscript: '', serverUpdatedAt: 't0', stored: null })).toBe('none')
  expect(noteRecoveryDecision({ serverNotes: 'saved', serverTranscript: '', serverUpdatedAt: 't0', stored: { liveNotes: 'saved', meetingTranscript: '', baseUpdatedAt: 't0' } })).toBe('none')
  expect(noteRecoveryDecision({ serverNotes: '', serverTranscript: '', serverUpdatedAt: 't0', stored: { liveNotes: 'typed', meetingTranscript: '', baseUpdatedAt: 't0' } })).toBe('resume')
  expect(noteRecoveryDecision({ serverNotes: 'server copy', serverTranscript: '', serverUpdatedAt: 't1', stored: { liveNotes: 'typed', meetingTranscript: '', baseUpdatedAt: 't0' } })).toBe('ask')
  const href = workRecordHref('bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee')
  expect(href).toBe('/today?view=work&work=bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee')
  expect(href.includes('/processes')).toBe(false)
  expect(workSummary({ id: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee', title: 'Confirm prices', status: 'planned' })?.title).toBe('Confirm prices')
  expect(workSummary({ id: 'not-an-id', title: 'Confirm prices', status: 'planned' })).toBeNull()
})
