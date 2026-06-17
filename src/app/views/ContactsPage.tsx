import { useMemo, useState } from 'react'

import type { DbItem } from '../../lib/db/db'
import { useActivities } from '../../lib/items/itemsRepo'
import { dueLabel, formatZar, isOverdue, typeLabel } from '../../lib/items/activityView'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

type Relationship = {
  name: string
  activities: DbItem[]
  openCount: number
  value: number
  nextDue: DbItem | null
}

export function ContactsPage() {
  const { entities, entityId, divisionId, workstreamId } = useAppState()
  const [query, setQuery] = useState('')
  const activities =
    useActivities({
      entityScope: entityId,
      divisionScope: divisionId,
      workstreamScope: workstreamId,
      limit: 400,
    }) ?? []

  const entityLabel =
    entityId === ALL_ENTITIES_SLUG ? 'All entities' : entities.find((e) => e.id === entityId)?.label ?? entityId

  const relationships = useMemo(() => {
    const map = new Map<string, Relationship>()
    for (const a of activities) {
      const name = (a.owner ?? '').trim()
      if (!name) continue
      const rel = map.get(name) ?? { name, activities: [], openCount: 0, value: 0, nextDue: null }
      rel.activities.push(a)
      if (a.status !== 'done' && a.status !== 'cancelled') rel.openCount += 1
      rel.value += a.value ?? 0
      if (a.dueAt && a.status !== 'done' && a.status !== 'cancelled') {
        if (!rel.nextDue || new Date(a.dueAt) < new Date(rel.nextDue.dueAt!)) rel.nextDue = a
      }
      map.set(name, rel)
    }
    return Array.from(map.values()).sort((a, b) => b.openCount - a.openCount)
  }, [activities])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return relationships
    return relationships.filter((r) => r.name.toLowerCase().includes(q))
  }, [relationships, query])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Contacts / Relationships</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          People with open activities across {entityLabel}.
        </p>
        <div className="field">
          <label>Search people</label>
          <input
            style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
            placeholder="Name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">Relationship radar</h2>
        {filtered.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No people linked yet. Add an owner when capturing a deal, follow-up, or meeting.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {filtered.map((r) => {
              const overdue = r.nextDue ? isOverdue(r.nextDue) : false
              return (
                <li
                  key={r.name}
                  style={{
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'grid',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{r.name}</div>
                    <span className="statusPill">{r.openCount} open</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    {r.value > 0 ? <span className="statusPill">{formatZar(r.value)}</span> : null}
                    {r.nextDue ? (
                      <span className="statusPill" style={overdue ? { color: 'var(--danger)', borderColor: 'var(--danger)' } : {}}>
                        {overdue ? 'Overdue' : 'Next'} {dueLabel(r.nextDue)} · {typeLabel(r.nextDue.type)}
                      </span>
                    ) : (
                      <span className="statusPill">No due date</span>
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                    {r.activities
                      .slice(0, 3)
                      .map((a) => a.title ?? 'Activity')
                      .join(' · ')}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
