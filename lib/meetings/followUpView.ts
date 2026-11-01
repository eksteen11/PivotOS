import { isUuid } from '@/lib/intake/shared'
import type { Company } from '@/lib/workspace/catalogue'
import { workStatusLabel } from '@/lib/workspace/workLink'

export const followUpStatuses = ['planned', 'in_progress', 'waiting', 'done', 'cancelled'] as const
export type FollowUpStatus = (typeof followUpStatuses)[number]
export type FollowUpView = { id: string; title: string; status: FollowUpStatus; reviewed: boolean }
export type FollowUpOutcome = {
  id: string
  title: string
  status: FollowUpStatus
  company: Company
  systemId: string
  owner: string
  due: string
  entityId: string
  userId: string
  fingerprint: string
  meetingId: string
}

export function commitmentKey(action: { title: string; company: string; systemId: string; owner: string; due: string }) {
  return JSON.stringify({
    title: action.title.trim(),
    company: action.company,
    systemId: action.systemId,
    owner: action.owner.trim(),
    due: action.due,
  })
}

export function followUpStatusLabel(status: FollowUpStatus, reviewed = false) {
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'done') return 'Done'
  return workStatusLabel(status, reviewed)
}

export function followUpView(value: unknown): FollowUpView | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const id = String(row.id ?? '')
  const status = String(row.status ?? '') as FollowUpStatus
  const title = String(row.title ?? '').trim()
  if (!isUuid(id) || !followUpStatuses.includes(status) || !title) return null
  const reviewed = row.reviewed === true || row.source === 'meeting-follow-up' || row.source === 'Meeting follow-up'
  return { id, title: title.slice(0, 180), status, reviewed }
}

export function visibleFollowUp(
  row: { id: string; user_id: string; entity_id: string | null; title: string | null; status: string | null; meta: Record<string, unknown> | null },
  requesterId: string,
  entityCompany: ReadonlyMap<string, Company>,
): FollowUpOutcome | null {
  if (!requesterId || row.user_id !== requesterId) return null
  const entityId = row.entity_id ?? ''
  const company = entityCompany.get(entityId)
  if (!company) return null
  const meta = row.meta ?? {}
  const pivot = meta.pivot_case && typeof meta.pivot_case === 'object' ? meta.pivot_case as Record<string, unknown> : {}
  const caseCompany = typeof pivot.company === 'string' ? pivot.company : ''
  if (caseCompany && caseCompany !== company) return null
  const status = followUpStatuses.find((item) => item === row.status)
  const title = String(row.title ?? '').trim()
  if (!status || !isUuid(row.id) || !title) return null
  return {
    id: row.id,
    title: title.slice(0, 180),
    status,
    company,
    systemId: typeof pivot.systemId === 'string' ? pivot.systemId : '',
    owner: typeof pivot.owner === 'string' ? pivot.owner : '',
    due: typeof pivot.due === 'string' ? pivot.due : '',
    entityId,
    userId: requesterId,
    fingerprint: typeof meta.review_fingerprint === 'string' ? meta.review_fingerprint : '',
    meetingId: typeof meta.meeting_id === 'string' ? meta.meeting_id : '',
  }
}
