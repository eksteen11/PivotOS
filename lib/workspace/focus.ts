import type { WorkCase } from './model'

// Dated work first; otherwise keep the plan waiting longest since its last update first.
// This is an explicit ordering rule, not an AI importance score.
export function reviewOrder(items: WorkCase[]) {
  return [...items].sort((a, b) => {
    if (a.due && b.due && a.due !== b.due) return a.due.localeCompare(b.due)
    if (Boolean(a.due) !== Boolean(b.due)) return a.due ? -1 : 1
    return a.updatedAt.localeCompare(b.updatedAt) || a.id.localeCompare(b.id)
  })
}

export function meetingOrder<T extends { startsAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const first = Date.parse(a.startsAt ?? '')
    const second = Date.parse(b.startsAt ?? '')
    return (Number.isFinite(first) ? first : Infinity) - (Number.isFinite(second) ? second : Infinity)
  })
}

export function focusMeeting<T extends { startsAt?: string }>(items: T[], now: number) {
  const ordered = meetingOrder(items)
  return ordered.find((item) => Date.parse(item.startsAt ?? '') >= now) ?? ordered[0]
}
