import { Link } from 'react-router-dom'

import type { DbItem } from '../../lib/db/db'
import {
  ACTION_TYPES,
  OPERATIONS_TYPES,
  OPPORTUNITY_TYPES,
  REVENUE_TYPES,
  useActivities,
} from '../../lib/items/itemsRepo'
import { dueLabel, formatZar, isOverdue, typeLabel } from '../../lib/items/activityView'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

export function CommandCentrePage() {
  const { entities, entityId, divisionId, workstreamId } = useAppState()
  const scope = { entityScope: entityId, divisionScope: divisionId, workstreamScope: workstreamId }

  const all = useActivities({ ...scope, limit: 400 }) ?? []
  const action = useActivities({ ...scope, types: ACTION_TYPES, limit: 100 }) ?? []
  const revenue = useActivities({ ...scope, types: REVENUE_TYPES, limit: 100 }) ?? []
  const operations = useActivities({ ...scope, types: OPERATIONS_TYPES, limit: 100 }) ?? []
  const opportunity = useActivities({ ...scope, types: OPPORTUNITY_TYPES, limit: 100 }) ?? []

  const entityLabel =
    entityId === ALL_ENTITIES_SLUG
      ? 'All entities'
      : entities.find((e) => e.id === entityId)?.label ?? 'Current entity'

  const open = (x: DbItem) => x.status !== 'done' && x.status !== 'cancelled'
  const overdue = all.filter(isOverdue)
  const waiting = all.filter((x) => x.status === 'waiting')
  const pipelineValue = revenue.filter(open).reduce((sum, x) => sum + (x.value ?? 0), 0)
  const openOpportunities = opportunity.filter(open)

  return (
    <section>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <h2 className="cardTitle" style={{ marginBottom: 6 }}>
              Mission Control
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              Focus scope: {entityLabel}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Link className="btn secondary" to="/today" style={{ textDecoration: 'none', width: 'auto', padding: '10px 16px' }}>
              Today
            </Link>
            <Link className="btn secondary" to="/inbox" style={{ textDecoration: 'none', width: 'auto', padding: '10px 16px' }}>
              Inbox
            </Link>
            <Link className="btn secondary" to="/activity" style={{ textDecoration: 'none', width: 'auto', padding: '10px 16px' }}>
              Timeline
            </Link>
            <Link className="btn secondary" to="/agents" style={{ textDecoration: 'none', width: 'auto', padding: '10px 16px' }}>
              Chief of Staff
            </Link>
          </div>
        </div>
      </div>

      <div className="kpiGrid">
        <KpiCard label="Overdue" value={overdue.length} tone="danger" to="/today" />
        <KpiCard label="Waiting on others" value={waiting.length} tone="neutral" to="/today" />
        <KpiCard label="Pipeline value" text={formatZar(pipelineValue)} tone="ok" to="/deals" />
        <KpiCard label="Open opportunities" value={openOpportunities.length} tone="neutral" to="/deals" />
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Panel
          title="Action"
          subtitle="Tasks, meetings, calls, follow-ups"
          to="/tasks"
          items={action.filter(open)}
          empty="Nothing scheduled. Capture or plan a task."
        />
        <Panel
          title="Revenue"
          subtitle={`Deals, sales, opportunities · ${formatZar(pipelineValue)}`}
          to="/deals"
          items={revenue.filter(open)}
          showValue
          empty="No live revenue activities."
        />
        <Panel
          title="Operations"
          subtitle="Development, finance, admin, projects"
          to="/projects"
          items={operations.filter(open)}
          empty="Operations are clear."
        />
        <Panel
          title="Opportunity"
          subtitle="Ideas, new ventures, leads, partnerships"
          to="/deals"
          items={openOpportunities}
          showValue
          empty="Capture an idea to start the pipeline."
        />
      </div>
    </section>
  )
}

function Panel({
  title,
  subtitle,
  to,
  items,
  empty,
  showValue,
}: {
  title: string
  subtitle: string
  to: string
  items: DbItem[]
  empty: string
  showValue?: boolean
}) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <h2 className="cardTitle" style={{ marginBottom: 2 }}>
          {title}
        </h2>
        <span className="statusPill">{items.length}</span>
      </div>
      <p className="muted" style={{ marginTop: 0, marginBottom: 14, fontSize: 13 }}>
        {subtitle}
      </p>
      {items.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          {empty}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
          {items.slice(0, 6).map((x) => {
            const overdue = isOverdue(x)
            const due = dueLabel(x)
            return (
              <li
                key={x.id}
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
                  <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em' }}>{x.title ?? 'Activity'}</div>
                  {showValue && x.value != null ? (
                    <div style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{formatZar(x.value)}</div>
                  ) : null}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="statusPill">{typeLabel(x.type)}</span>
                  <span className="statusPill">{x.entitySlug}</span>
                  {x.status === 'waiting' ? <span className="statusPill">Waiting</span> : null}
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
      )}
      <div style={{ height: 12 }} />
      <Link className="btn secondary" to={to} style={{ textDecoration: 'none', textAlign: 'center' }}>
        Open {title}
      </Link>
    </div>
  )
}

function KpiCard({
  label,
  value,
  text,
  tone,
  to,
}: {
  label: string
  value?: number
  text?: string
  tone: 'ok' | 'danger' | 'neutral'
  to: string
}) {
  const toneStyle =
    tone === 'danger'
      ? { borderColor: 'rgba(244, 33, 46, 0.4)', background: 'rgba(244, 33, 46, 0.05)' }
      : tone === 'ok'
        ? { borderColor: 'rgba(0, 214, 118, 0.4)', background: 'rgba(0, 214, 118, 0.05)' }
        : {}

  return (
    <Link
      to={to}
      className="card"
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
        ...toneStyle,
      }}
    >
      <div className="muted" style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: text ? 26 : 36, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--text)' }}>
        {text ?? value ?? 0}
      </div>
    </Link>
  )
}
