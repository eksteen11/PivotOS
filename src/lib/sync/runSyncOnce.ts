import type { Session } from '@supabase/supabase-js'

import { db, type DbItem } from '../db/db'
import { supabase } from '../supabase/client'

type RemoteEntity = {
  id: string
  slug: string
  name: string
  sort_order: number
  updated_at: string
}

type RemoteDivision = {
  id: string
  entity_id: string
  slug: string
  name: string
  sort_order: number
  updated_at: string
}

type RemoteWorkstream = {
  id: string
  entity_id: string
  division_id: string | null
  slug: string
  name: string
  sort_order: number
  updated_at: string
}

type RemoteItem = {
  id: string
  entity_id: string | null
  division_id: string | null
  workstream_id: string | null
  type: DbItem['type']
  status: DbItem['status']
  priority: number
  source: DbItem['source'] | null
  owner: string | null
  value: number | null
  title: string | null
  content: string
  due_at: string | null
  scheduled_blocks: any[]
  meta: Record<string, any>
  client_updated_at: string
  updated_at: string
  deleted_at: string | null
}

export async function runSyncOnce(session: Session) {
  if (!supabase) return
  if (!navigator.onLine) return

  await syncEntitiesAndDivisions(session)
  await pullUpdatedItems(session.user.id)
  try {
    await pushDirtyItems(session)
  } catch {
    // Local uploads can fail (RLS, validation); remote data was already pulled above.
  }

  await db.kv.put({ key: 'lastSyncOkAt', value: new Date().toISOString() })
}

async function syncEntitiesAndDivisions(_session: Session) {
  const { data: entities, error: eErr } = await supabase!
    .from('entities')
    .select('id,slug,name,sort_order,updated_at')
    .order('sort_order', { ascending: true })

  if (eErr) throw eErr

  const now = new Date().toISOString()
  await db.entities.bulkPut(
    (entities as RemoteEntity[]).map((e) => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      sortOrder: e.sort_order ?? 0,
      updatedAt: e.updated_at ?? now,
    })),
  )

  const { data: divisions, error: dErr } = await supabase!
    .from('divisions')
    .select('id,entity_id,slug,name,sort_order,updated_at')
    .order('sort_order', { ascending: true })

  if (dErr) throw dErr

  await db.divisions.bulkPut(
    (divisions as RemoteDivision[]).map((d) => ({
      id: d.id,
      entityId: d.entity_id,
      slug: d.slug,
      name: d.name,
      sortOrder: d.sort_order ?? 0,
      updatedAt: d.updated_at ?? now,
    })),
  )

  const { data: workstreams, error: wErr } = await supabase!
    .from('workstreams')
    .select('id,entity_id,division_id,slug,name,sort_order,updated_at')
    .order('sort_order', { ascending: true })

  if (wErr) throw wErr

  const entityRows = entities as RemoteEntity[]
  const divisionRows = divisions as RemoteDivision[]
  await db.workstreams.bulkPut(
    (workstreams as RemoteWorkstream[]).map((w) => ({
      id: w.id,
      entityId: w.entity_id,
      entitySlug: entityRows.find((e) => e.id === w.entity_id)?.slug ?? null,
      divisionId: w.division_id,
      divisionSlug: divisionRows.find((d) => d.id === w.division_id)?.slug ?? null,
      slug: w.slug,
      name: w.name,
      sortOrder: w.sort_order ?? 0,
      updatedAt: w.updated_at ?? now,
    })),
  )
}

async function pushDirtyItems(session: Session) {
  const dirty = await db.items.where('syncState').equals('dirty').toArray()
  if (dirty.length === 0) return

  const entities = await db.entities.toArray()
  const divisions = await db.divisions.toArray()
  const workstreams = await db.workstreams.toArray()

  const toRemote = dirty.map((it) => {
    const entity = entities.find((e) => e.slug === it.entitySlug)
    const division =
      it.divisionSlug && entity
        ? divisions.find((d) => d.slug === it.divisionSlug && d.entityId === entity.id)
        : null
    const workstream =
      it.workstreamSlug && entity
        ? workstreams.find((w) => w.slug === it.workstreamSlug && w.entityId === entity.id)
        : null

    return {
      id: it.id,
      user_id: session.user.id,
      entity_id: entity?.id ?? null,
      division_id: division?.id ?? null,
      workstream_id: workstream?.id ?? null,
      type: it.type,
      status: it.status,
      priority: it.priority,
      source: it.source ?? 'manual',
      owner: it.owner,
      value: it.value,
      title: it.title,
      content: it.content,
      due_at: it.dueAt,
      scheduled_blocks: it.scheduledBlocks,
      meta: {
        ...it.meta,
        entity_slug: it.entitySlug,
        division_slug: it.divisionSlug,
        workstream_slug: it.workstreamSlug,
      },
      client_updated_at: it.clientUpdatedAt,
      deleted_at: it.deletedAt,
    }
  })

  const { error } = await supabase!.from('items').upsert(toRemote, { onConflict: 'id' })
  if (error) throw error

  const now = new Date().toISOString()
  await db.items.bulkPut(
    dirty.map((it) => ({
      ...it,
      syncState: 'synced' as const,
      serverUpdatedAt: it.serverUpdatedAt ?? now,
    })),
  )
}

function pullCursorKey(userId: string) {
  return `lastPullUpdatedAt:${userId}` as const
}

async function pullUpdatedItems(userId: string) {
  const meta = await db.kv.get(pullCursorKey(userId))
  let lastPullUpdatedAt = (meta?.value as string | undefined) ?? '1970-01-01T00:00:00.000Z'

  const entities = await db.entities.toArray()
  const divisions = await db.divisions.toArray()
  const workstreams = await db.workstreams.toArray()

  for (;;) {
    const { data, error } = await supabase!
      .from('items')
      .select(
        'id,entity_id,division_id,workstream_id,type,status,priority,source,owner,value,title,content,due_at,scheduled_blocks,meta,client_updated_at,updated_at,deleted_at',
      )
      .gt('updated_at', lastPullUpdatedAt)
      .order('updated_at', { ascending: true })
      .limit(500)

    if (error) throw error
    const rows = (data ?? []) as RemoteItem[]
    if (rows.length === 0) break

    for (const r of rows) {
    const local = await db.items.get(r.id)
    if (local?.syncState === 'dirty') continue

    const entitySlug =
      entities.find((e) => e.id === r.entity_id)?.slug ??
      (typeof r.meta?.entity_slug === 'string' ? r.meta.entity_slug : 'dj')

    const divisionSlug =
      divisions.find((d) => d.id === r.division_id)?.slug ??
      (typeof r.meta?.division_slug === 'string' ? r.meta.division_slug : null)

    const workstreamSlug =
      workstreams.find((w) => w.id === r.workstream_id)?.slug ??
      (typeof r.meta?.workstream_slug === 'string' ? r.meta.workstream_slug : null)

    const mapped: DbItem = {
      id: r.id,
      entitySlug,
      divisionSlug,
      entityId: r.entity_id,
      divisionId: r.division_id,
      workstreamSlug,
      workstreamId: r.workstream_id ?? null,
      type: r.type,
      status: r.status,
      priority: r.priority ?? 2,
      source: r.source ?? 'manual',
      owner: r.owner ?? null,
      value: typeof r.value === 'number' ? r.value : null,
      title: r.title ?? null,
      content: r.content ?? '',
      dueAt: r.due_at ?? null,
      scheduledBlocks: r.scheduled_blocks ?? [],
      meta: r.meta ?? {},
      clientUpdatedAt: r.client_updated_at ?? r.updated_at,
      serverUpdatedAt: r.updated_at,
      deletedAt: r.deleted_at ?? null,
      syncState: 'synced',
    }

      await db.items.put(mapped)
    }

    lastPullUpdatedAt = rows[rows.length - 1]!.updated_at
    await db.kv.put({ key: pullCursorKey(userId), value: lastPullUpdatedAt })
    if (rows.length < 500) break
  }
}

