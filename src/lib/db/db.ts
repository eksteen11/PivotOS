import Dexie, { type Table } from 'dexie'

export type DbEntity = {
  id: string
  slug: string
  name: string
  sortOrder: number
  updatedAt: string
}

export type DbDivision = {
  id: string
  entityId: string
  slug: string
  name: string
  sortOrder: number
  updatedAt: string
}

export type ItemType =
  | 'task'
  | 'goal'
  | 'process'
  | 'decision'
  | 'problem'
  | 'solution'
  | 'meeting'
  | 'deal'
  | 'lead'
  | 'note'

export type ItemStatus = 'inbox' | 'planned' | 'in_progress' | 'waiting' | 'done' | 'cancelled'

export type SyncState = 'synced' | 'dirty'

export type DbItem = {
  id: string
  entitySlug: string
  divisionSlug: string | null
  entityId: string | null
  divisionId: string | null
  type: ItemType
  status: ItemStatus
  priority: number
  title: string | null
  content: string
  dueAt: string | null
  scheduledBlocks: any[]
  meta: Record<string, any>
  clientUpdatedAt: string
  serverUpdatedAt: string | null
  deletedAt: string | null
  syncState: SyncState
}

export type KvRow = { key: string; value: any }

export class PivotDb extends Dexie {
  entities!: Table<DbEntity, string>
  divisions!: Table<DbDivision, string>
  items!: Table<DbItem, string>
  kv!: Table<KvRow, string>

  constructor() {
    super('pivotos')

    this.version(1).stores({
      entities: 'id, slug, sortOrder, updatedAt',
      divisions: 'id, entityId, slug, sortOrder, updatedAt',
      items:
        'id, status, clientUpdatedAt, serverUpdatedAt, syncState, deletedAt, entitySlug, divisionSlug, entityId, divisionId',
      kv: 'key',
    })
  }
}

export const db = new PivotDb()

