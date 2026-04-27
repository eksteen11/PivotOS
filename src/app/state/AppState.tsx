import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../../lib/db/db'

export type EntityId = string
export type DivisionId = string

export type Entity = { id: EntityId; label: string }
export type Division = { id: DivisionId; label: string }

const FALLBACK_ENTITIES: Entity[] = [
  { id: 'dj', label: 'DJ Eksteen' },
  { id: 'digikraal', label: 'Digikraal' },
  { id: 'farm_feed', label: 'Farm Feed' },
  { id: 'northpoint', label: 'Northpoint' },
]

type AppState = {
  entities: Entity[]
  divisionsForCurrentEntity: Division[]
  entityId: EntityId
  currentEntityDbId: string | null
  setEntityId: (id: EntityId) => void
  divisionId: DivisionId | null
  setDivisionId: (id: DivisionId | null) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const entitiesFromDb = useLiveQuery(async () => {
    const rows = await db.entities.orderBy('sortOrder').toArray()
    return rows.map((e) => ({ id: e.slug, label: e.name }))
  }, [])

  const [entityId, setEntityId] = useState<EntityId>('dj')
  const [divisionId, setDivisionId] = useState<DivisionId | null>(null)

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

  const divisionsForCurrentEntity = divisionsByEntitySlug.get(entityId) ?? []

  const value: AppState = useMemo(
    () => ({
      entities,
      divisionsForCurrentEntity,
      entityId,
      currentEntityDbId: entitySlugToDbId.get(entityId) ?? null,
      setEntityId: (id) => {
        setEntityId(id)
        const firstDivision = divisionsByEntitySlug.get(id)?.[0]?.id ?? null
        setDivisionId((prev) => {
          if (!prev) return firstDivision
          return (divisionsByEntitySlug.get(id) ?? []).some((d) => d.id === prev) ? prev : firstDivision
        })
      },
      divisionId,
      setDivisionId,
    }),
    [divisionsByEntitySlug, divisionsForCurrentEntity, entities, entityId, divisionId, entitySlugToDbId],
  )

  useEffect(() => {
    if (entitySlugToDbId.size === 0) return
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

