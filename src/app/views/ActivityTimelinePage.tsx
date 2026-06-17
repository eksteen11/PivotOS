import { useMemo, useState } from 'react'

import type { ItemType } from '../../lib/db/db'
import { useActivities } from '../../lib/items/itemsRepo'
import { dueLabel, formatZar, isOverdue, typeLabel } from '../../lib/items/activityView'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

const FILTERS: { id: 'all' | ItemType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'task', label: 'Tasks' },
  { id: 'meeting', label: 'Meetings' },
  { id: 'deal', label: 'Deals' },
  { id: 'opportunity', label: 'Opportunities' },
  { id: 'follow_up', label: 'Follow-ups' },
  { id: 'payment', label: 'Payments' },
]

export function ActivityTimelinePage() {
  const { entities, entityId, divisionId, workstreamId } = useAppState()
  const [filter, setFilter] = useState<'all' | ItemType>('all')

  const activities =
    useActivities({
      entityScope: entityId,
      divisionScope: divisionId,
      workstreamScope: workstreamId,
      types: filter === 'all' ? undefined : [filter],
      limit: 200,
    }) ?? []

  const entityLabel =
    entityId === ALL_ENTITIES_SLUG ? 'All entities' : entities.find((e) => e.id === entityId)?.label ?? entityId

  const grouped = useMemo(() => {
    const map = new Map<string, typeof activities>()
    for (const a of activities) {
      const key = new Date(a.clientUpdatedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
      const list = map.get(key) ?? []
      list.push(a)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [activities])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Activity Timeline</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Every activity across {entityLabel}, newest first.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? 'statusPill accent' : 'statusPill'}
              style={{ cursor: 'pointer', border: 0 }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            No activities yet. Capture something or process the inbox.
          </p>
        </div>
      ) : (
        grouped.map(([day, list]) => (
          <div key={day} className="card">
            <h2 className="cardTitle" style={{ fontSize: 14 }}>
              {day}
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
              {list.map((a) => {
                const overdue = isOverdue(a)
                const due = dueLabel(a)
                return (
                  <li
                    key={a.id}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-md)',
                      padding: 12,
                      display: 'grid',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{a.title ?? a.content ?? 'Activity'}</div>
                      {a.value != null ? (
                        <div style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{formatZar(a.value)}</div>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="statusPill">{typeLabel(a.type)}</span>
                      <span className="statusPill">{a.entitySlug}</span>
                      {a.workstreamSlug ? <span className="statusPill">{a.workstreamSlug}</span> : null}
                      <span className="statusPill">{a.status}</span>
                      {a.owner ? <span className="statusPill">{a.owner}</span> : null}
                      {due ? (
                        <span className="statusPill" style={overdue ? { color: 'var(--danger)', borderColor: 'var(--danger)' } : {}}>
                          {overdue ? 'Overdue' : 'Due'} {due}
                        </span>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}
