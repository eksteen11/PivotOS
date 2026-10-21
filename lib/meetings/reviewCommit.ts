import { createHash } from 'node:crypto'

import type { Company } from '@/lib/workspace/catalogue'
import { actionTarget, reviewFollowUp, reviewedActions, type MeetingAction, type MeetingCore } from '@/lib/meetings/core'
import { followUpItemId } from '@/lib/meetings/followUp'

export function reviewFingerprint(revision: number, actions: MeetingAction[]) {
  const canonical = actions.map((action) => ({ id: action.id, title: action.title, include: action.include, company: action.company, systemId: action.systemId, owner: action.owner, due: action.due }))
  return createHash('sha256').update(JSON.stringify({ revision, actions: canonical })).digest('hex')
}

export type ReviewRow = { updatedAt: string; dueAt: string | null; meta: Record<string, unknown>; core: MeetingCore }
export type ReviewTask = {
  id: string
  fingerprint: string
  title: string
  company: Company
  systemId: string
  owner: string
  due: string
  entityId: string
  meetingId: string
  revision: number
  actionId: string
  sourceCaptureId: string | null
}
export type ReviewStore = {
  load: (meetingId: string) => Promise<ReviewRow | null>
  compareAndSet: (meetingId: string, expectedUpdatedAt: string, next: { core: MeetingCore; meta: Record<string, unknown> }) => Promise<{ ok: true; updatedAt: string } | { ok: false }>
  findTask: (taskId: string) => Promise<{ id: string; fingerprint: string } | null>
  insertTask: (task: ReviewTask) => Promise<{ ok: true } | { ok: false; duplicate: boolean }>
  entityId: (company: Company) => Promise<string>
  afterClaim?: () => Promise<void>
}

export type CommitResult =
  | { ok: true; alreadyApproved: boolean; followUpItemIds: string[]; updatedAt: string; meeting: MeetingCore }
  | { ok: false; status: number; error: string }

function approvedResult(row: ReviewRow, ids: string[], alreadyApproved: boolean): CommitResult {
  return { ok: true, alreadyApproved, followUpItemIds: ids, updatedAt: row.updatedAt, meeting: row.core }
}

export async function commitReviewedFollowUp(store: ReviewStore, input: { meetingId: string; expectedUpdatedAt: string; revision: number; actions: unknown }): Promise<CommitResult> {
  const requested = reviewedActions(input.actions)
  const fingerprint = reviewFingerprint(input.revision, requested)
  const loaded = await store.load(input.meetingId)
  if (!loaded) return { ok: false, status: 404, error: 'Meeting not found.' }
  if (loaded.core.approvedRevision === input.revision) {
    const stored = loaded.core.reviewClaim?.fingerprint || reviewFingerprint(input.revision, loaded.core.minutes?.actions ?? [])
    if (stored === fingerprint) return approvedResult(loaded, loaded.core.followUpItemIds, true)
    return { ok: false, status: 409, error: 'These actions differ from the approved review. Draft the minutes again before a new follow-up.' }
  }
  const pending = loaded.core.reviewClaim
  if (pending?.phase === 'pending' && (pending.revision !== input.revision || pending.fingerprint !== fingerprint)) {
    return { ok: false, status: 409, error: 'A different review is already being saved. Reload before changing the actions.' }
  }
  let working = loaded
  if (pending?.phase !== 'pending') {
    if (loaded.updatedAt !== input.expectedUpdatedAt) return { ok: false, status: 409, error: 'This meeting changed in another window. Reload before saving.' }
    if (!loaded.core.minutes) return { ok: false, status: 400, error: 'Review the current minutes revision before follow-up work is created.' }
    const preview: MeetingCore = { ...loaded.core, minutes: { ...loaded.core.minutes, actions: requested } }
    const review = reviewFollowUp(preview, input.revision)
    if (!review.ok) return { ok: false, status: 400, error: review.error }
    const claimedCore: MeetingCore = { ...preview, reviewClaim: { revision: input.revision, fingerprint, phase: 'pending', actions: requested } }
    const claimed = await store.compareAndSet(input.meetingId, loaded.updatedAt, { core: claimedCore, meta: loaded.meta })
    if (!claimed.ok) {
      const latest = await store.load(input.meetingId)
      if (latest?.core.approvedRevision === input.revision && (latest.core.reviewClaim?.fingerprint || '') === fingerprint) return approvedResult(latest, latest.core.followUpItemIds, true)
      if (latest?.core.reviewClaim?.phase === 'pending' && latest.core.reviewClaim.fingerprint === fingerprint) working = latest
      else return { ok: false, status: 409, error: 'This meeting changed in another window. Reload before saving.' }
    } else {
      working = { ...loaded, core: claimedCore, updatedAt: claimed.updatedAt }
      if (store.afterClaim) await store.afterClaim()
    }
  }
  const actions = working.core.reviewClaim?.phase === 'pending' ? working.core.reviewClaim.actions : requested
  const ids: string[] = []
  for (const action of actions.filter((item) => item.include)) {
    const target = actionTarget(action)
    if (!target) return { ok: false, status: 400, error: `Choose a valid business and subdivision for “${action.title}”.` }
    const entityId = await store.entityId(target.company)
    if (!entityId) return { ok: false, status: 403, error: 'This business is not available for your account.' }
    const taskId = followUpItemId(input.meetingId, input.revision, action.id, fingerprint)
    const existing = await store.findTask(taskId)
    if (existing) {
      if (existing.fingerprint !== fingerprint) return { ok: false, status: 409, error: 'A different review is already being saved. Reload before changing the actions.' }
      ids.push(existing.id)
      continue
    }
    const inserted = await store.insertTask({
      id: taskId,
      fingerprint,
      title: action.title,
      company: target.company,
      systemId: target.systemId,
      owner: target.owner,
      due: target.due,
      entityId,
      meetingId: input.meetingId,
      revision: input.revision,
      actionId: action.id,
      sourceCaptureId: working.core.sourceCaptureId,
    })
    if (!inserted.ok && !inserted.duplicate) return { ok: false, status: 500, error: 'A follow-up task was not saved. Retry the same review.' }
    ids.push(taskId)
  }
  const finished: MeetingCore = {
    ...working.core,
    lifecycle: 'follow_up',
    approvedRevision: input.revision,
    followUpItemIds: ids,
    reviewClaim: { revision: input.revision, fingerprint, phase: 'committed', actions },
  }
  const done = await store.compareAndSet(input.meetingId, working.updatedAt, { core: finished, meta: working.meta })
  if (!done.ok) {
    const latest = await store.load(input.meetingId)
    if (latest?.core.approvedRevision === input.revision && latest.core.reviewClaim?.fingerprint === fingerprint) return approvedResult(latest, latest.core.followUpItemIds, true)
    return { ok: false, status: 409, error: 'The review was not saved. Retry the same actions.' }
  }
  return { ok: true, alreadyApproved: false, followUpItemIds: ids, updatedAt: done.updatedAt, meeting: finished }
}
