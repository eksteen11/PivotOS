import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { aiBuildDailyPlan, aiCaptureToStructure } from '../../lib/ai/invoke'
import { hasSupabaseEnv } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { setTodayPlan } from '../../lib/plan/planRepo'
import {
  OPPORTUNITY_TYPES,
  REVENUE_TYPES,
  createPlannedTask,
  useActivities,
  usePlannedTasks,
  useRecentInboxItems,
} from '../../lib/items/itemsRepo'
import { formatZar, isDueToday, isOverdue } from '../../lib/items/activityView'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

export function AgentsPage() {
  const { entityId, divisionId, workstreamId } = useAppState()
  const { session } = useSupabaseSession()
  const inbox = useRecentInboxItems(1, entityId) ?? []
  const latest = inbox[0] ?? null
  const planned = usePlannedTasks(25, entityId) ?? []
  const [busy, setBusy] = useState<'none' | 'capture' | 'plan'>('none')
  const [note, setNote] = useState<string | null>(null)

  const plannedTitles = useMemo(() => planned.map((t) => ({ title: t.title ?? t.content ?? 'Task' })), [planned])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">AI Chief of Staff</h2>
        <p className="muted" style={{ margin: 0 }}>
          Your operational assistant — daily briefing, triage, and fast AI actions.
        </p>
      </div>

      <DailyBriefing scope={{ entityScope: entityId, divisionScope: divisionId, workstreamScope: workstreamId }} />


      <div className="card">
        <h2 className="cardTitle">Quick actions</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          <button
            className="btn"
            type="button"
            disabled={!hasSupabaseEnv || !session || busy !== 'none' || !latest}
            onClick={async () => {
              if (!latest) return
              setBusy('capture')
              setNote(null)
              try {
                const result = await aiCaptureToStructure({ text: latest.content })
                const tasks = Array.isArray(result.tasks) ? result.tasks.slice(0, 10) : []

                for (const t of tasks) {
                  const title = (t.title ?? '').trim()
                  if (!title) continue
                  await createPlannedTask({
                    entitySlug: typeof t.entity_slug === 'string' ? t.entity_slug : latest.entitySlug,
                    divisionSlug:
                      typeof t.division_slug === 'string' || t.division_slug === null
                        ? (t.division_slug as any)
                        : latest.divisionSlug,
                    title,
                    dueAt: typeof t.due_at === 'string' ? t.due_at : null,
                    priority: typeof t.priority === 'number' ? t.priority : undefined,
                    sourceItemId: latest.id,
                  })
                }

                setNote(tasks.length ? `Created ${tasks.length} planned task(s).` : 'No tasks found.')
              } catch (e: any) {
                setNote(e?.message ?? 'Failed.')
              } finally {
                setBusy('none')
              }
            }}
          >
            Capture → structured items
          </button>
          <button
            className="btn"
            type="button"
            disabled={!hasSupabaseEnv || !session || busy !== 'none' || plannedTitles.length === 0}
            onClick={async () => {
              setBusy('plan')
              setNote(null)
              try {
                const res = await aiBuildDailyPlan({
                  context:
                    entityId === ALL_ENTITIES_SLUG
                      ? 'all'
                      : divisionId
                        ? `${entityId}:${divisionId}`
                        : entityId,
                  tasks: plannedTitles.slice(0, 25),
                })
                await setTodayPlan({ createdAt: new Date().toISOString(), top3: res.top3 ?? [], blocks: res.blocks ?? [] })
                setNote('Updated Today plan.')
              } catch (e: any) {
                setNote(e?.message ?? 'Failed.')
              } finally {
                setBusy('none')
              }
            }}
          >
            Build today’s plan
          </button>
          <button className="btn" type="button" disabled>
            Weekly review (lite)
          </button>
        </div>
        {note ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            {note}
          </p>
        ) : !session ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            Sign in to enable AI actions.
          </p>
        ) : latest ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            Latest inbox item ready.
          </p>
        ) : (
          <p className="muted" style={{ marginBottom: 0 }}>
            Add an inbox item first.
          </p>
        )}
      </div>
    </section>
  )
}

function DailyBriefing({
  scope,
}: {
  scope: { entityScope: string; divisionScope: string | null; workstreamScope: string | null }
}) {
  const all = useActivities({ ...scope, limit: 400 }) ?? []
  const revenue = useActivities({ ...scope, types: REVENUE_TYPES, limit: 200 }) ?? []
  const opportunities = useActivities({ ...scope, types: OPPORTUNITY_TYPES, limit: 200 }) ?? []

  const open = (x: { status: string }) => x.status !== 'done' && x.status !== 'cancelled'
  const overdue = all.filter(isOverdue)
  const today = all.filter(isDueToday)
  const waiting = all.filter((x) => x.status === 'waiting')
  const pipeline = revenue.filter(open).reduce((sum, x) => sum + (x.value ?? 0), 0)
  const topMoney = [...revenue.filter(open)].sort((a, b) => (b.value ?? 0) - (a.value ?? 0)).slice(0, 3)

  const lines = [
    `${today.length} due today, ${overdue.length} overdue, ${waiting.length} waiting on others.`,
    `Open pipeline ${formatZar(pipeline)} across ${revenue.filter(open).length} revenue activities.`,
    `${opportunities.filter(open).length} open opportunities to convert into revenue.`,
  ]

  return (
    <div className="card">
      <h2 className="cardTitle">Daily briefing</h2>
      <ul style={{ margin: '0 0 14px', paddingLeft: 18, display: 'grid', gap: 6 }}>
        {lines.map((l) => (
          <li key={l} style={{ fontSize: 14, fontWeight: 600 }}>
            {l}
          </li>
        ))}
      </ul>
      {topMoney.length ? (
        <>
          <div className="muted" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            What will make money
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {topMoney.map((m) => (
              <li
                key={m.id}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 14 }}>{m.title ?? 'Deal'}</span>
                <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{formatZar(m.value)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div style={{ height: 12 }} />
      <Link className="btn secondary" to="/command" style={{ textDecoration: 'none', textAlign: 'center' }}>
        Open Mission Control
      </Link>
    </div>
  )
}

