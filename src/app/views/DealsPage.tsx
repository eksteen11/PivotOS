import { useMemo, useState } from 'react'

import { useAppState } from '../state/AppState'

type Stage = 'lead' | 'active' | 'negotiation' | 'won' | 'lost'
type Deal = {
  id: string
  title: string
  entity: string
  value: number
  stage: Stage
  risk: 'low' | 'medium' | 'high'
  nextAction: string
}

export function DealsPage() {
  const { entities, entityId } = useAppState()
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: crypto.randomUUID(),
      title: 'Livestock Bulk Sale',
      entity: 'Digikraal',
      value: 450000,
      stage: 'negotiation',
      risk: 'medium',
      nextAction: 'Confirm transport pricing and payment terms',
    },
    {
      id: crypto.randomUUID(),
      title: 'Farm Listing Mandate',
      entity: 'North Point Realty',
      value: 1200000,
      stage: 'active',
      risk: 'low',
      nextAction: 'Schedule viewing with top 3 buyers',
    },
    {
      id: crypto.randomUUID(),
      title: 'Commodity Export Opportunity',
      entity: 'Farm Feed',
      value: 900000,
      stage: 'lead',
      risk: 'high',
      nextAction: 'Validate quality specs and buyer terms',
    },
  ])

  const entityLabel = entities.find((e) => e.id === entityId)?.label ?? entityId
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = useMemo(() => deals.find((d) => d.id === selectedId) ?? deals[0] ?? null, [deals, selectedId])

  const byStage = useMemo(() => {
    const stages: Stage[] = ['lead', 'active', 'negotiation']
    return stages.map((s) => ({ stage: s, items: deals.filter((d) => d.stage === s) }))
  }, [deals])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Deals cockpit</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Stage, risk, value, and next best action for {entityLabel}.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {byStage.map((g) => (
          <div key={g.stage} className="card">
            <h2 className="cardTitle" style={{ textTransform: 'capitalize' }}>
              {g.stage} ({g.items.length})
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
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedId(d.id)}
                  >
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{d.title}</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>
                      R {d.value.toLocaleString()}
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
            Select a deal to view details.
          </p>
        ) : (
          <>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.title}</div>
            <p className="muted" style={{ marginTop: 4 }}>
              {selected.entity} · Value R {selected.value.toLocaleString()}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <span className="statusPill">Stage {selected.stage}</span>
              <span className="statusPill">Risk {selected.risk}</span>
            </div>
            <div className="field" style={{ marginBottom: 10 }}>
              <label>Next best action</label>
              <input
                style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                value={selected.nextAction}
                onChange={(e) => {
                  const v = e.target.value
                  setDeals((prev) => prev.map((x) => (x.id === selected.id ? { ...x, nextAction: v } : x)))
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                className="btn accent"
                type="button"
                onClick={() => {
                  setDeals((prev) =>
                    prev.map((x) =>
                      x.id === selected.id
                        ? { ...x, stage: x.stage === 'lead' ? 'active' : x.stage === 'active' ? 'negotiation' : 'won' }
                        : x,
                    ),
                  )
                }}
              >
                Advance stage
              </button>
              <button
                className="btn secondary"
                type="button"
                style={{ color: 'var(--danger)' }}
                onClick={() => {
                  setDeals((prev) => prev.map((x) => (x.id === selected.id ? { ...x, stage: 'lost' } : x)))
                }}
              >
                Mark lost
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

