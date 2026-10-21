import { isUuid } from '@/lib/intake/shared'
import { statusLabels, type WorkStatus } from '@/lib/workspace/model'

export type WorkSummary = { id: string; title: string; status: WorkStatus }

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
  return { id, title: title.slice(0, 180), status }
}

export function workStatusLabel(status: WorkStatus) {
  return statusLabels[status]
}
