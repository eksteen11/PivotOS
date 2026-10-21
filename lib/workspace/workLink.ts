import { isUuid } from '@/lib/intake/shared'
import { statusLabels, type WorkStatus } from '@/lib/workspace/model'

export type WorkSummary = { id: string; title: string; status: WorkStatus; reviewed?: boolean }

export function isReviewedMeetingWork(source: string) {
  return source === 'meeting-follow-up' || source === 'Meeting follow-up'
}

const statuses = new Set<WorkStatus>(['planned', 'in_progress', 'waiting', 'done'])

export function workRecordHref(id: string) {
  return `/today?view=work&work=${id}`
}

export function workSummary(value: unknown): WorkSummary | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const id = String(row.id ?? '')
  const status = String(row.status ?? '') as WorkStatus
  const title = String(row.title ?? '').trim()
  if (!isUuid(id) || !statuses.has(status) || !title) return null
  const reviewed = row.reviewed === true || isReviewedMeetingWork(String(row.source ?? ''))
  return { id, title: title.slice(0, 180), status, reviewed }
}

export function workStatusLabel(status: WorkStatus, reviewed = false) {
  if (reviewed && status === 'planned') return 'Ready to start'
  return statusLabels[status]
}

export function reviewedWorkStart(status: WorkStatus, source: string) {
  if (status !== 'planned' || !isReviewedMeetingWork(source)) return null
  return {
    heading: 'Ready to start',
    detail: 'This internal task is ready to start. Replies, bookings, posts and transactions still need their own review and a connected tool.',
    action: 'Start this work',
    checklistNote: 'Start this work from Overview before using the checklist. External actions stay blocked.',
  }
}
