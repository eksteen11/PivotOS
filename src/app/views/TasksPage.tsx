import { useMemo } from 'react'

import { setItemStatus, softDeleteItem, usePlannedTasks } from '../../lib/items/itemsRepo'

export function TasksPage() {
  const tasks = usePlannedTasks(80) ?? []

  const groups = useMemo(() => {
    const active = tasks.filter((t) => t.status === 'in_progress')
    const urgent = tasks.filter((t) => t.priority >= 3 && t.status !== 'done' && t.status !== 'cancelled')
    const waiting = tasks.filter((t) => t.status === 'waiting')
    const planned = tasks.filter((t) => t.status === 'planned')
    return { active, urgent, waiting, planned }
  }, [tasks])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Tasks</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="statusPill">Urgent {groups.urgent.length}</span>
          <span className="statusPill">In progress {groups.active.length}</span>
          <span className="statusPill">Waiting {groups.waiting.length}</span>
          <span className="statusPill">Planned {groups.planned.length}</span>
        </div>
      </div>

      <TaskLane
        title="In progress"
        items={groups.active}
        empty="No task in progress."
        actionLabel="Mark done"
        onAction={(id) => setItemStatus(id, 'done')}
      />

      <TaskLane
        title="Urgent"
        items={groups.urgent}
        empty="No urgent tasks."
        actionLabel="Start now"
        onAction={(id) => setItemStatus(id, 'in_progress')}
      />

      <TaskLane
        title="Waiting on others"
        items={groups.waiting}
        empty="No waiting tasks."
        actionLabel="Resume"
        onAction={(id) => setItemStatus(id, 'in_progress')}
      />

      <TaskLane
        title="Planned"
        items={groups.planned}
        empty="No planned tasks yet."
        actionLabel="Start"
        onAction={(id) => setItemStatus(id, 'in_progress')}
      />
    </section>
  )
}

function TaskLane({
  title,
  items,
  empty,
  actionLabel,
  onAction,
}: {
  title: string
  items: Array<{ id: string; title: string | null; dueAt: string | null; priority: number }>
  empty: string
  actionLabel: string
  onAction: (id: string) => Promise<void>
}) {
  return (
    <div className="card">
      <h2 className="cardTitle">{title}</h2>
      {items.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          {empty}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {items.slice(0, 10).map((t) => (
            <li
              key={t.id}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title ?? 'Task'}
                    </div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Priority {t.priority} {t.dueAt ? `· Due ${new Date(t.dueAt).toLocaleDateString()}` : ''}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn accent" type="button" style={{ width: 'auto', padding: '10px 16px' }} onClick={() => onAction(t.id)}>
                    {actionLabel}
                  </button>
                  <button
                    className="btn secondary"
                    type="button"
                    style={{
                      width: 'auto',
                      padding: '10px 16px',
                      color: 'var(--danger)',
                    }}
                    onClick={() => softDeleteItem(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

