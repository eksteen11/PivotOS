import { NextResponse } from 'next/server'

import { readJsonBody } from '@/lib/http/readJson'
import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { entitySlugFrom, founderCanAccess, itemStatusForLifecycle, readMeetingCore, type MeetingCore } from '@/lib/meetings/core'
import { commitReviewedFollowUp, type ReviewStore, type ReviewTask } from '@/lib/meetings/reviewCommit'
import { companies } from '@/lib/workspace/catalogue'
import { workSummary } from '@/lib/workspace/workLink'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const body = await readJsonBody(request)
  const id = String(body.id ?? '')
  const revision = Number(body.revision)
  const store: ReviewStore = {
    async load(meetingId) {
      const { data: row } = await auth.sb.from('items').select('*, entities(slug)').eq('id', meetingId).eq('user_id', auth.user.id).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
      if (!row || !founderCanAccess({ role: 'founder', ownerId: String(row.user_id), requesterId: auth.user.id })) return null
      const dueAt = row.due_at ? String(row.due_at) : null
      const meta = (row.meta as Record<string, unknown> | null) ?? {}
      const core = readMeetingCore(meta, dueAt, entitySlugFrom(row.entities))
      if (!core) return null
      return { updatedAt: String(row.updated_at), dueAt, meta, core }
    },
    async compareAndSet(meetingId, expectedUpdatedAt, next) {
      const now = new Date().toISOString()
      const { data } = await auth.sb.from('items').update({
        status: itemStatusForLifecycle(next.core.lifecycle),
        meta: { ...next.meta, meeting_core: next.core, people: next.core.attendees, place: next.core.place, link: next.core.link },
        updated_at: now,
      }).eq('id', meetingId).eq('user_id', auth.user.id).eq('updated_at', expectedUpdatedAt).select('updated_at').maybeSingle()
      return data?.updated_at ? { ok: true, updatedAt: String(data.updated_at) } : { ok: false }
    },
    async findTask(taskId) {
      const { data } = await auth.sb.from('items').select('id, meta').eq('id', taskId).eq('user_id', auth.user.id).is('deleted_at', null).maybeSingle()
      if (!data?.id) return null
      const meta = (data.meta as Record<string, unknown> | null) ?? {}
      return { id: String(data.id), fingerprint: String(meta.review_fingerprint ?? '') }
    },
    async insertTask(task: ReviewTask) {
      const now = new Date().toISOString()
      const { error } = await auth.sb.from('items').insert({
        id: task.id,
        user_id: auth.user.id,
        entity_id: task.entityId,
        type: 'process',
        status: 'planned',
        source: 'meeting-follow-up',
        title: task.title,
        content: `From meeting minutes revision ${task.revision}. Owner: ${task.owner || 'Unassigned'}. External actions remain blocked.`,
        due_at: task.due ? `${task.due}T00:00:00+02:00` : null,
        meta: {
          workspace_version: 1,
          review_fingerprint: task.fingerprint,
          meeting_action_key: `${task.meetingId}:${task.revision}:${task.actionId}:${task.fingerprint}`,
          meeting_id: task.meetingId,
          minutes_revision: task.revision,
          pivot_case: {
            id: task.id,
            entityId: task.entityId,
            company: task.company,
            systemId: task.systemId,
            kind: 'task',
            title: task.title,
            notes: `Linked to meeting ${task.meetingId}, minutes revision ${task.revision}.`,
            due: task.due,
            owner: task.owner,
            status: 'planned',
            source: 'Meeting follow-up',
            updatedAt: now,
            facts: {},
            checked: [],
            lessons: [],
            history: [{ at: now, text: 'Created after the founder reviewed the minutes and actions together.' }],
            intake: { sourceCaptureId: task.sourceCaptureId, proposalKind: 'task', externalBlocked: true },
          },
        },
        updated_at: now,
      })
      if (error?.code === '23505') return { ok: false, duplicate: true }
      return error ? { ok: false, duplicate: false } : { ok: true }
    },
    async entityId(company) {
      const slug = companies.find((entry) => entry.id === company)?.slug ?? ''
      const { data } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', slug).maybeSingle()
      return data?.id ? String(data.id) : ''
    },
  }
  const result = await commitReviewedFollowUp(store, { meetingId: id, expectedUpdatedAt: String(body.updatedAt ?? ''), revision, actions: body.actions })
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status })
  const actions = (result.meeting.reviewClaim?.actions ?? []).filter((action) => action.include)
  const followUps = result.followUpItemIds.flatMap((id, index) => {
    const summary = workSummary({ id, title: actions[index]?.title ?? '', status: 'planned', reviewed: true, source: 'meeting-follow-up' })
    return summary ? [summary] : []
  })
  return NextResponse.json({ followUpItemIds: result.followUpItemIds, followUps, alreadyApproved: result.alreadyApproved, updatedAt: result.updatedAt, meeting: result.meeting satisfies MeetingCore })
}
