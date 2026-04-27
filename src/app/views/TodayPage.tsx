import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { setItemStatus, usePlannedTasks } from '../../lib/items/itemsRepo'
import { useTodayPlan } from '../../lib/plan/planRepo'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

export function TodayPage() {
  const { entities, entityId, divisionsForCurrentEntity, divisionId } = useAppState()
  const plan = useTodayPlan()
  const tasks = usePlannedTasks(25, entityId) ?? []
  const inProgress = tasks.find((t) => t.status === 'in_progress') ?? null
  const waitingCount = tasks.filter((t) => t.status === 'waiting').length
  const dueTodayCount = tasks.filter((t) => {
    if (!t.dueAt || t.status === 'done' || t.status === 'cancelled') return false
    const d = new Date(t.dueAt)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }).length

  const focusLabel = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) return 'All entities'
    const entity = entities.find((e) => e.id === entityId)?.label ?? '—'
    const division = divisionId ? divisionsForCurrentEntity.find((d) => d.id === divisionId)?.label ?? '—' : null
    return division ? `${entity} / ${division}` : entity
  }, [divisionId, divisionsForCurrentEntity, entities, entityId])

  return (
    <section>
      <div className="card">
        <p className="muted" style={{ margin: 0 }}>
          Focus: {focusLabel}
        </p>
        <div style={{ height: 10 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="statusPill">Due today {dueTodayCount}</span>
          <span className="statusPill">Waiting {waitingCount}</span>
          <span className="statusPill">In progress {inProgress ? 1 : 0}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">Top 3 outcomes</h2>
        {plan ? (
          <>
            <ol style={{ margin: 0, paddingLeft: 18, color: 'rgba(26, 28, 28, 0.92)' }}>
              {plan.top3.slice(0, 3).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
            <p className="muted" style={{ marginBottom: 0 }}>
              Updated {new Date(plan.createdAt).toLocaleString()}
            </p>
          </>
        ) : (
          <ol style={{ margin: 0, paddingLeft: 18, color: 'rgba(26, 28, 28, 0.92)' }}>
            <li>Protect money-making time</li>
            <li>Move one deal or ticket forward</li>
            <li>Close one admin loop</li>
          </ol>
        )}
        <div style={{ height: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button className="btn accent" type="button">
            Start next action
          </button>
          <Link className="btn secondary" to="/command" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Command Centre
          </Link>
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Link className="btn secondary" to="/meetings" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Meetings
          </Link>
          <Link className="btn secondary" to="/inbox" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Process inbox
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">Next actions</h2>
        {inProgress ? (
          <>
            <p className="muted" style={{ marginTop: 0 }}>
              In progress
            </p>
            <div
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16 }}>{inProgress.title ?? 'Task'}</div>
              <div style={{ height: 12 }} />
              <button className="btn accent" type="button" onClick={async () => setItemStatus(inProgress.id, 'done')}>
                Mark done
              </button>
            </div>
          </>
        ) : tasks.length ? (
          <>
            <p className="muted" style={{ marginTop: 0 }}>
              Planned
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
              {tasks
                .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
                .slice(0, 6)
                .map((t) => (
                  <li
                    key={t.id}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title ?? 'Task'}
                      </div>
                      <button
                        type="button"
                        className="btn secondary"
                        style={{ width: 'auto', padding: '10px 16px' }}
                        onClick={async () => setItemStatus(t.id, 'in_progress')}
                      >
                        Start
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            Add an inbox item and convert it to a task.
          </p>
        )}
      </div>
    </section>
  )
}

