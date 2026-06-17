import { useMemo, useState } from 'react'

import type { DbItem, ItemStatus } from '../../lib/db/db'
import { REVENUE_TYPES, setItemStatus, useActivities } from '../../lib/items/itemsRepo'
import { dueLabel, formatZar, typeLabel } from '../../lib/items/activityView'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

const COLUMNS: { status: ItemStatus; label: string }[] = [
  { status: 'planned', label: 'Pipeline' },
  { status: 'in_progress', label: 'Active' },
  { status: 'waiting', label: 'Waiting' },
]

export function DealsPage() {
  const { entities, entityId, divisionId, workstreamId } = useAppState()
  const deals =
    useActivities({
      entityScope: entityId,
      divisionScope: divisionId,
      workstreamScope: workstreamId,
      types: REVENUE_TYPES,
      limit: 200,
    }) ?? []

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = useMemo(() => deals.find((d) => d.id === selectedId) ?? deals[0] ?? null, [deals, selectedId])

  const entityLabel =
    entityId === ALL_ENTITIES_SLUG ? 'All entities' : entities.find((e) => e.id === entityId)?.label ?? entityId

  const openDeals = deals.filter((d) => d.status !== 'done' && d.status !== 'cancelled')
  const pipelineValue = openDeals.reduce((sum, d) => sum + (d.value ?? 0), 0)
  const wonValue = deals.filter((d) => d.status === 'done').reduce((sum, d) => sum + (d.value ?? 0), 0)

  const byStatus = COLUMNS.map((c) => ({ ...c, items: deals.filter((d) => d.status === c.status) }))

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Deals & Revenue</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Stage, value, and next action for {entityLabel}.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="statusPill">Open {openDeals.length}</span>
          <span className="statusPill">Pipeline {formatZar(pipelineValue)}</span>
          <span className="statusPill">Won {formatZar(wonValue)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {byStatus.map((g) => (
          <div key={g.status} className="card">
            <h2 className="cardTitle">
              {g.label} ({g.items.length})
            </h2>
            {g.items.length === 0 ? (
              <p className="muted" style={{ margin: 0 }}>
                No deals.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                {g.items.map((d) => (
                  <li
                    key={d.id}
                    style={{
                      border: selected?.id === d.id ? '1px solid var(--accent, #00a85a)' : '1px solid var(--border)',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedId(d.id)}
                  >
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{d.title ?? 'Deal'}</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>
                      {typeLabel(d.type)} · {formatZar(d.value)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="cardTitle">Selected deal</h2>
        {!selected ? (
          <p className="muted" style={{ margin: 0 }}>
            No revenue activities yet. Capture a deal or opportunity from Quick Capture.
          </p>
        ) : (
          <DealDetail deal={selected} />
        )}
      </div>
    </section>
  )
}

function DealDetail({ deal }: { deal: DbItem }) {
  const due = dueLabel(deal)
  return (
    <>
      <div style={{ fontWeight: 800, fontSize: 18 }}>{deal.title ?? 'Deal'}</div>
      <p className="muted" style={{ marginTop: 4 }}>
        {deal.entitySlug}
        {deal.workstreamSlug ? ` · ${deal.workstreamSlug}` : ''} · {formatZar(deal.value)}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <span className="statusPill">{typeLabel(deal.type)}</span>
        <span className="statusPill">Status {deal.status}</span>
        {deal.owner ? <span className="statusPill">{deal.owner}</span> : null}
        {due ? <span className="statusPill">Due {due}</span> : null}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <button
          className="btn accent"
          type="button"
          onClick={async () =>
            setItemStatus(deal.id, deal.status === 'planned' ? 'in_progress' : 'done')
          }
        >
          {deal.status === 'planned' ? 'Activate' : 'Mark won'}
        </button>
        <button className="btn secondary" type="button" onClick={async () => setItemStatus(deal.id, 'waiting')}>
          Waiting
        </button>
        <button
          className="btn secondary"
          type="button"
          style={{ color: 'var(--danger)' }}
          onClick={async () => setItemStatus(deal.id, 'cancelled')}
        >
          Mark lost
        </button>
      </div>
    </>
  )
}
