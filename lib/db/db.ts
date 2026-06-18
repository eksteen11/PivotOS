/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type DbWorkstream = {
  id: string
  entityId: string
  entitySlug: string | null
  divisionId: string | null
  divisionSlug: string | null
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
  | 'opportunity'
  | 'idea'
  | 'follow_up'
  | 'call'
  | 'email'
  | 'message'
  | 'payment'
  | 'invoice'
  | 'expense'
  | 'sale'
  | 'listing'
  | 'project'
  | 'contact'
  | 'company'

export type ActivitySource =
  | 'manual'
  | 'whatsapp'
  | 'gmail'
  | 'email'
  | 'meeting'
  | 'call'
  | 'voice_note'
  | 'website'
  | 'airtable'
  | 'calendar'
  | 'sheet'

export type ItemStatus = 'inbox' | 'planned' | 'in_progress' | 'waiting' | 'done' | 'cancelled'

export type SyncState = 'synced' | 'dirty'

export type DbItem = {
  id: string
  entitySlug: string
  divisionSlug: string | null
  entityId: string | null
  divisionId: string | null
  workstreamSlug: string | null
  workstreamId: string | null
  type: ItemType
  status: ItemStatus
  priority: number
  source: ActivitySource
  owner: string | null
  value: number | null
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
  workstreams!: Table<DbWorkstream, string>
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

    this.version(2)
      .stores({
        entities: 'id, slug, sortOrder, updatedAt',
        divisions: 'id, entityId, slug, sortOrder, updatedAt',
        workstreams: 'id, entityId, entitySlug, divisionId, slug, sortOrder, updatedAt',
        items:
          'id, status, type, clientUpdatedAt, serverUpdatedAt, syncState, deletedAt, entitySlug, divisionSlug, entityId, divisionId, workstreamSlug, workstreamId',
        kv: 'key',
      })
      .upgrade(async (tx) => {
        await tx
          .table('items')
          .toCollection()
          .modify((it: any) => {
            if (it.workstreamSlug === undefined) it.workstreamSlug = null
            if (it.workstreamId === undefined) it.workstreamId = null
            if (it.source === undefined) it.source = 'manual'
            if (it.owner === undefined) it.owner = null
            if (it.value === undefined) it.value = null
          })
      })
  }
}

export const db = new PivotDb()
