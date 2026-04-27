import { useLiveQuery } from 'dexie-react-hooks'

import { db, type DbItem } from '../db/db'

export type MeetingMeta = {
  who?: string
  where?: string
  seed_batch?: string
  entity_slug?: string
  division_slug?: string
}

function isMeetingRow(it: DbItem): boolean {
  return it.type === 'meeting' && it.deletedAt == null
}

export function useMeetings(limit = 500) {
  return useLiveQuery(async () => {
    const rows = await db.items.filter(isMeetingRow).toArray()
    rows.sort((a, b) => {
      const ta = a.dueAt ? new Date(a.dueAt).getTime() : 0
      const tb = b.dueAt ? new Date(b.dueAt).getTime() : 0
      return tb - ta
    })
    return rows.slice(0, limit)
  }, [limit])
}

export async function createMeeting(input: {
  entitySlug: string
  divisionSlug: string | null
  title: string
  who: string
  where: string
  agenda?: string
  startsAtIso: string
}) {
  const now = new Date().toISOString()
  const item: DbItem = {
    id: crypto.randomUUID(),
    entitySlug: input.entitySlug,
    divisionSlug: input.divisionSlug,
    entityId: null,
    divisionId: null,
    type: 'meeting',
    status: 'planned',
    priority: 2,
    title: input.title.trim().slice(0, 200),
    content: (input.agenda ?? '').trim(),
    dueAt: input.startsAtIso,
    scheduledBlocks: [],
    meta: {
      who: input.who.trim(),
      where: input.where.trim(),
      entity_slug: input.entitySlug,
      division_slug: input.divisionSlug,
    },
    clientUpdatedAt: now,
    serverUpdatedAt: null,
    deletedAt: null,
    syncState: 'dirty',
  }
  await db.items.put(item)
  return item.id
}

export async function updateMeetingPatch(id: string, patch: Partial<Pick<DbItem, 'title' | 'content' | 'dueAt' | 'meta'>>) {
  const current = await db.items.get(id)
  if (!current || current.type !== 'meeting') return
  const now = new Date().toISOString()
  await db.items.put({
    ...current,
    ...patch,
    meta: { ...current.meta, ...(patch.meta ?? {}) },
    clientUpdatedAt: now,
    syncState: 'dirty',
  })
}

export function meetingStartsAt(m: DbItem): Date | null {
  if (!m.dueAt) return null
  const d = new Date(m.dueAt)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatMeetingLocal(d: Date, locale = 'en-ZA'): string {
  return d.toLocaleString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
