import { Link } from 'react-router-dom'

import { usePlannedTasks, useRecentInboxItems } from '../../lib/items/itemsRepo'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

export function CommandCentrePage() {
  const { entities, entityId } = useAppState()
  const tasks = usePlannedTasks(50, entityId) ?? []
  const inbox = useRecentInboxItems(30, entityId) ?? []

  const entityLabel =
    entityId === ALL_ENTITIES_SLUG
      ? 'All entities'
      : entities.find((e) => e.id === entityId)?.label ?? 'Current entity'
  const urgentTasks = tasks.filter((t) => t.priority >= 3 && t.status !== 'done' && t.status !== 'cancelled')
  const waitingTasks = tasks.filter((t) => t.status === 'waiting')
  const inProgress = tasks.filter((t) => t.status === 'in_progress')
  const dueSoon = tasks.filter((t) => Boolean(t.dueAt))

  return (
    <section>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <h2 className="cardTitle" style={{ marginBottom: 6 }}>
              Global Command Centre
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              Focus scope: {entityLabel}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className="statusPill">Today</span>
            <span className="statusPill">Revenue Focus</span>
            <span className="statusPill">AI Assisted</span>
          </div>
        </div>
        <div style={{ height: 10 }} />
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <Link className="btn secondary" to="/home" style={{ textDecoration: 'none' }}>
            Open Landing / Home
          </Link>
          <Link
            className="btn"
            to="/today"
            style={{
              textDecoration: 'none',
            }}
          >
            Open Today View
          </Link>
        </div>
      </div>

      <div className="kpiGrid">
        <KpiCard label="Urgent tasks" value={urgentTasks.length} tone="danger" to="/today" />
        <KpiCard label="In progress" value={inProgress.length} tone="ok" to="/today" />
        <KpiCard label="Waiting on others" value={waitingTasks.length} tone="neutral" to="/today" />
        <KpiCard label="Inbox to process" value={inbox.length} tone="neutral" to="/inbox" />
      </div>

      <div className="card">
        <h2 className="cardTitle">Next best actions</h2>
        {urgentTasks.length ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {urgentTasks.slice(0, 5).map((t) => (
              <li
                key={t.id}
                style={{
                  border: '1px solid rgba(26, 28, 28, 0.12)',
                  background: 'rgba(255, 255, 255, 0.76)',
                  borderRadius: 14,
                  padding: 12,
                  display: 'grid',
                  gap: 6,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em' }}>{t.title ?? 'Task'}</div>
                <div className="muted" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Priority {t.priority} {t.dueAt ? `· Due ${new Date(t.dueAt).toLocaleDateString()}` : ''}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            No urgent tasks. Move one strategic task to in-progress in Today View.
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card">
          <h2 className="cardTitle">Core module jumps</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            Jump into key operational areas in one tap.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Link className="btn secondary" to="/tasks" style={{ textDecoration: 'none' }}>
              Tasks
            </Link>
            <Link className="btn secondary" to="/meetings" style={{ textDecoration: 'none' }}>
              Meetings
            </Link>
            <Link className="btn secondary" to="/contacts" style={{ textDecoration: 'none' }}>
              Contacts
            </Link>
            <Link className="btn secondary" to="/deals" style={{ textDecoration: 'none' }}>
              Deals
            </Link>
            <Link className="btn secondary" to="/projects" style={{ textDecoration: 'none' }}>
              Projects
            </Link>
            <Link className="btn secondary" to="/documents" style={{ textDecoration: 'none' }}>
              Documents
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="cardTitle">Landing & How-to</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            View the public home and product narrative anytime.
          </p>
          <Link className="btn secondary" to="/home" style={{ textDecoration: 'none' }}>
            Open home page
          </Link>
        </div>

        <div className="card">
          <h2 className="cardTitle">Meetings & timeline</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            Keep calendar and execution aligned.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <Link className="btn" to="/meetings" style={{ textDecoration: 'none' }}>
              Open meetings
            </Link>
            <p className="muted" style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
              Planned tasks with due dates: {dueSoon.length}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="cardTitle">Follow-up radar</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            Process fresh communication into action.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <Link className="btn accent" to="/inbox" style={{ textDecoration: 'none' }}>
              Process inbox
            </Link>
            <Link
              className="btn secondary"
              to="/contacts"
              style={{
                textDecoration: 'none',
              }}
            >
              Open contacts
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="cardTitle">AI Agent updates</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            Generate structure, plans, and next actions from your latest inputs.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <Link className="btn" to="/agents" style={{ textDecoration: 'none' }}>
              Open AI agents
            </Link>
            <Link
              className="btn secondary"
              to="/deals"
              style={{
                textDecoration: 'none',
              }}
            >
              Open deals cockpit
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function KpiCard({ label, value, tone, to }: { label: string; value: number; tone: 'ok' | 'danger' | 'neutral'; to: string }) {
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
      <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--text)' }}>{value}</div>
    </Link>
  )
}

