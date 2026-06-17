import { useLiveQuery } from 'dexie-react-hooks'

import { ALL_ENTITIES_SLUG } from '../appScope'
import { db, type ActivitySource, type DbItem, type ItemType } from '../db/db'

function itemMatchesEntityScope(row: DbItem, entityScope: string): boolean {
  if (entityScope === ALL_ENTITIES_SLUG) return true
  return row.entitySlug === entityScope
}

function matchesScope(
  row: DbItem,
  entityScope: string,
  divisionScope?: string | null,
  workstreamScope?: string | null,
): boolean {
  if (!itemMatchesEntityScope(row, entityScope)) return false
  if (divisionScope && row.divisionSlug !== divisionScope) return false
  if (workstreamScope && row.workstreamSlug !== workstreamScope) return false
  return true
}

export const REVENUE_TYPES: ItemType[] = ['deal', 'sale', 'opportunity', 'invoice', 'payment']
export const OPPORTUNITY_TYPES: ItemType[] = ['opportunity', 'idea', 'lead']
export const ACTION_TYPES: ItemType[] = ['task', 'meeting', 'call', 'follow_up']
export const OPERATIONS_TYPES: ItemType[] = ['project', 'process', 'expense', 'invoice', 'payment', 'problem']

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

/** Convert an inbox note into any activity type (deal, opportunity, follow-up, ...). */
export async function convertInboxItem(
  id: string,
  type: ItemType,
  patch?: { value?: number | null; owner?: string | null; priority?: number },
) {
  const current = await db.items.get(id)
  if (!current) return
  const now = new Date().toISOString()
  const title = (current.title ?? current.content).trim().slice(0, 140)
  await db.items.put({
    ...current,
    type,
    status: 'planned',
    title: title || 'Activity',
    content: current.content,
    value: patch?.value ?? current.value,
    owner: patch?.owner ?? current.owner,
    priority: typeof patch?.priority === 'number' ? patch.priority : current.priority,
    clientUpdatedAt: now,
    syncState: 'dirty',
  })
}

export function usePlannedTasks(limit = 25, entityScope: string = ALL_ENTITIES_SLUG) {
  return useLiveQuery(async () => {
    const rows = await db.items
      .where('status')
      .anyOf(['planned', 'in_progress', 'waiting'])
      .and((x) => x.type === 'task' && x.deletedAt == null)
      .sortBy('clientUpdatedAt')

    const scoped = rows.filter((x) => itemMatchesEntityScope(x, entityScope))
    return scoped.slice(-limit).reverse()
  }, [limit, entityScope])
}

export function useRecentInboxItems(limit = 12, entityScope: string = ALL_ENTITIES_SLUG) {
  return useLiveQuery(async () => {
    const rows = await db.items
      .where('status')
      .equals('inbox')
      .and((x) => x.deletedAt == null)
      .sortBy('clientUpdatedAt')

    const scoped = rows.filter((x) => itemMatchesEntityScope(x, entityScope))
    return scoped.slice(-limit).reverse()
  }, [limit, entityScope])
}

/** Generic activity query used by Mission Control and the Activity Timeline. */
export function useActivities(opts: {
  entityScope?: string
  divisionScope?: string | null
  workstreamScope?: string | null
  types?: ItemType[]
  limit?: number
}) {
  const {
    entityScope = ALL_ENTITIES_SLUG,
    divisionScope = null,
    workstreamScope = null,
    types,
    limit = 200,
  } = opts
  const typeKey = types ? types.join(',') : 'all'

  return useLiveQuery(async () => {
    const rows = await db.items
      .filter((x) => x.deletedAt == null && x.status !== 'inbox')
      .toArray()

    const scoped = rows.filter((x) => {
      if (!matchesScope(x, entityScope, divisionScope, workstreamScope)) return false
      if (types && !types.includes(x.type)) return false
      return true
    })

    scoped.sort((a, b) => (b.clientUpdatedAt > a.clientUpdatedAt ? 1 : -1))
    return scoped.slice(0, limit)
  }, [entityScope, divisionScope, workstreamScope, typeKey, limit])
}

export async function createInboxItem(input: {
  entitySlug: string
  divisionSlug: string | null
  workstreamSlug?: string | null
  source?: ActivitySource
  content: string
}) {
  const now = new Date().toISOString()
  const item: DbItem = {
    id: crypto.randomUUID(),
    entitySlug: input.entitySlug,
    divisionSlug: input.divisionSlug,
    entityId: null,
    divisionId: null,
    workstreamSlug: input.workstreamSlug ?? null,
    workstreamId: null,
    type: 'note',
    status: 'inbox',
    priority: 2,
    source: input.source ?? 'manual',
    owner: null,
    value: null,
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
  workstreamSlug?: string | null
  title: string
  dueAt?: string | null
  priority?: number
  type?: ItemType
  source?: ActivitySource
  value?: number | null
  owner?: string | null
  sourceItemId?: string
}) {
  const now = new Date().toISOString()
  const item: DbItem = {
    id: crypto.randomUUID(),
    entitySlug: input.entitySlug,
    divisionSlug: input.divisionSlug,
    entityId: null,
    divisionId: null,
    workstreamSlug: input.workstreamSlug ?? null,
    workstreamId: null,
    type: input.type ?? 'task',
    status: 'planned',
    priority: typeof input.priority === 'number' ? input.priority : 2,
    source: input.source ?? 'manual',
    owner: input.owner ?? null,
    value: typeof input.value === 'number' ? input.value : null,
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
