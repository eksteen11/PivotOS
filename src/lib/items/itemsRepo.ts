import { useLiveQuery } from 'dexie-react-hooks'

import { db, type DbItem } from '../db/db'

export async function setItemStatus(id: string, status: DbItem['status']) {
  const current = await db.items.get(id)
  if (!current) return
  const now = new Date().toISOString()
  await db.items.put({
    ...current,
    status,
    clientUpdatedAt: now,
    syncState: 'dirty',
  })
}

export async function softDeleteItem(id: string) {
  const current = await db.items.get(id)
  if (!current) return
  const now = new Date().toISOString()
  await db.items.put({
    ...current,
    deletedAt: now,
    clientUpdatedAt: now,
    syncState: 'dirty',
  })
}

export async function convertInboxNoteToTask(id: string) {
  const current = await db.items.get(id)
  if (!current) return
  if (current.status !== 'inbox') return
  const now = new Date().toISOString()
  const title = (current.title ?? current.content).trim().slice(0, 140)
  await db.items.put({
    ...current,
    type: 'task',
    status: 'planned',
    title: title || 'Task',
    content: '',
    clientUpdatedAt: now,
    syncState: 'dirty',
  })
}

export function usePlannedTasks(limit = 25) {
  return useLiveQuery(async () => {
    const rows = await db.items
      .where('status')
      .anyOf(['planned', 'in_progress', 'waiting'])
      .and((x) => x.type === 'task' && x.deletedAt == null)
      .sortBy('clientUpdatedAt')

    return rows.slice(-limit).reverse()
  }, [limit])
}

export function useRecentInboxItems(limit = 12) {
  return useLiveQuery(async () => {
    const rows = await db.items
      .where('status')
      .equals('inbox')
      .and((x) => x.deletedAt == null)
      .sortBy('clientUpdatedAt')

    return rows.slice(-limit).reverse()
  }, [limit])
}

export async function createInboxItem(input: {
  entitySlug: string
  divisionSlug: string | null
  content: string
}) {
  const now = new Date().toISOString()
  const item: DbItem = {
    id: crypto.randomUUID(),
    entitySlug: input.entitySlug,
    divisionSlug: input.divisionSlug,
    entityId: null,
    divisionId: null,
    type: 'note',
    status: 'inbox',
    priority: 2,
    title: null,
    content: input.content,
    dueAt: null,
    scheduledBlocks: [],
    meta: {},
    clientUpdatedAt: now,
    serverUpdatedAt: null,
    deletedAt: null,
    syncState: 'dirty',
  }

  await db.items.put(item)
  return item.id
}

export async function createPlannedTask(input: {
  entitySlug: string
  divisionSlug: string | null
  title: string
  dueAt?: string | null
  priority?: number
  sourceItemId?: string
}) {
  const now = new Date().toISOString()
  const item: DbItem = {
    id: crypto.randomUUID(),
    entitySlug: input.entitySlug,
    divisionSlug: input.divisionSlug,
    entityId: null,
    divisionId: null,
    type: 'task',
    status: 'planned',
    priority: typeof input.priority === 'number' ? input.priority : 2,
    title: input.title.trim().slice(0, 140),
    content: '',
    dueAt: input.dueAt ?? null,
    scheduledBlocks: [],
    meta: input.sourceItemId ? { source_item_id: input.sourceItemId } : {},
    clientUpdatedAt: now,
    serverUpdatedAt: null,
    deletedAt: null,
    syncState: 'dirty',
  }

  await db.items.put(item)
  return item.id
}

