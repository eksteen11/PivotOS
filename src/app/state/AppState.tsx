import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { isAllEntitiesScope } from '../../lib/appScope'
import { db } from '../../lib/db/db'

export { ALL_ENTITIES_SLUG, isAllEntitiesScope } from '../../lib/appScope'

export type EntityId = string
export type DivisionId = string
export type WorkstreamId = string

export type Entity = { id: EntityId; label: string }
export type Division = { id: DivisionId; label: string }
export type Workstream = { id: WorkstreamId; label: string; divisionId: DivisionId | null }

const FALLBACK_ENTITIES: Entity[] = [
  { id: 'dj', label: 'DJ Eksteen' },
  { id: 'digikraal', label: 'Digikraal' },
  { id: 'farm_feed', label: 'Farm Feed' },
  { id: 'northpoint', label: 'Northpoint' },
]

type AppState = {
  entities: Entity[]
  divisionsForCurrentEntity: Division[]
  workstreamsForCurrentScope: Workstream[]
  entityId: EntityId
  currentEntityDbId: string | null
  setEntityId: (id: EntityId) => void
  divisionId: DivisionId | null
  setDivisionId: (id: DivisionId | null) => void
  workstreamId: WorkstreamId | null
  setWorkstreamId: (id: WorkstreamId | null) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const entitiesFromDb = useLiveQuery(async () => {
    const rows = await db.entities.orderBy('sortOrder').toArray()
    return rows.map((e) => ({ id: e.slug, label: e.name }))
  }, [])

  const [entityId, setEntityId] = useState<EntityId>('dj')
  const [divisionId, setDivisionId] = useState<DivisionId | null>(null)
  const [workstreamId, setWorkstreamId] = useState<WorkstreamId | null>(null)

  const entities = useMemo(() => {
    return entitiesFromDb && entitiesFromDb.length ? entitiesFromDb : FALLBACK_ENTITIES
  }, [entitiesFromDb])

  const [entitySlugToDbId, divisionsByEntitySlug] = useLiveQuery(async () => {
    const entitiesRows = await db.entities.toArray()
    const divisionsRows = await db.divisions.toArray()
    const slugToId = new Map<string, string>()
    for (const e of entitiesRows) slugToId.set(e.slug, e.id)
    const bySlug = new Map<string, Division[]>()

    for (const e of entitiesRows) {
      const rows = divisionsRows
        .filter((d) => d.entityId === e.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((d) => ({ id: d.slug, label: d.name }))
      bySlug.set(e.slug, rows)
    }

    return [slugToId, bySlug] as const
  }, []) ?? [new Map<string, string>(), new Map<string, Division[]>()]

  const workstreamsByEntitySlug = useLiveQuery(async () => {
    const rows = await db.workstreams.toArray()
    const bySlug = new Map<string, Workstream[]>()
    for (const w of rows) {
      if (!w.entitySlug) continue
      const list = bySlug.get(w.entitySlug) ?? []
      list.push({ id: w.slug, label: w.name, divisionId: w.divisionSlug })
      bySlug.set(w.entitySlug, list)
    }
    for (const [k, list] of bySlug) {
      bySlug.set(
        k,
        list.sort((a, b) => a.label.localeCompare(b.label)),
      )
    }
    return bySlug
  }, []) ?? new Map<string, Workstream[]>()

  const divisionsForCurrentEntity = isAllEntitiesScope(entityId)
    ? []
    : divisionsByEntitySlug.get(entityId) ?? []

  const workstreamsForCurrentScope = useMemo(() => {
    if (isAllEntitiesScope(entityId)) return []
    const all = workstreamsByEntitySlug.get(entityId) ?? []
    if (!divisionId) return all.filter((w) => w.divisionId == null || true)
    return all.filter((w) => w.divisionId === divisionId)
  }, [divisionId, entityId, workstreamsByEntitySlug])

  const value: AppState = useMemo(
    () => ({
      entities,
      divisionsForCurrentEntity,
      workstreamsForCurrentScope,
      entityId,
      currentEntityDbId: isAllEntitiesScope(entityId) ? null : entitySlugToDbId.get(entityId) ?? null,
      setEntityId: (id) => {
        setEntityId(id)
        setWorkstreamId(null)
        if (isAllEntitiesScope(id)) {
          setDivisionId(null)
          return
        }
        const firstDivision = divisionsByEntitySlug.get(id)?.[0]?.id ?? null
        setDivisionId((prev) => {
          if (!prev) return firstDivision
          return (divisionsByEntitySlug.get(id) ?? []).some((d) => d.id === prev) ? prev : firstDivision
        })
      },
      divisionId,
      setDivisionId: (id) => {
        setDivisionId(id)
        setWorkstreamId(null)
      },
      workstreamId,
      setWorkstreamId,
    }),
    [
      divisionsByEntitySlug,
      divisionsForCurrentEntity,
      workstreamsForCurrentScope,
      entities,
      entityId,
      divisionId,
      workstreamId,
      entitySlugToDbId,
    ],
  )

  useEffect(() => {
    if (entitySlugToDbId.size === 0) return
    if (isAllEntitiesScope(entityId)) return
    if (entitySlugToDbId.has(entityId)) return
    const first = entities[0]?.id
    if (!first || first === entityId) return
    setEntityId(first)
    setDivisionId((divisionsByEntitySlug.get(first) ?? [])[0]?.id ?? null)
  }, [divisionsByEntitySlug, entities, entityId, entitySlugToDbId])

  return (
    <>
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </>
  )
}

export function useAppState() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppState must be used within AppProvider')
  return v
}
