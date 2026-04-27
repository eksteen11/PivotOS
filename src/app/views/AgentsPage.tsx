import { useMemo, useState } from 'react'

import { aiBuildDailyPlan, aiCaptureToStructure } from '../../lib/ai/invoke'
import { hasSupabaseEnv } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { setTodayPlan } from '../../lib/plan/planRepo'
import { createPlannedTask, usePlannedTasks, useRecentInboxItems } from '../../lib/items/itemsRepo'
import { useAppState } from '../state/AppState'

export function AgentsPage() {
  const { entityId, divisionId } = useAppState()
  const { session } = useSupabaseSession()
  const inbox = useRecentInboxItems(1) ?? []
  const latest = inbox[0] ?? null
  const planned = usePlannedTasks(25) ?? []
  const [busy, setBusy] = useState<'none' | 'capture' | 'plan'>('none')
  const [note, setNote] = useState<string | null>(null)

  const plannedTitles = useMemo(() => planned.map((t) => ({ title: t.title ?? t.content ?? 'Task' })), [planned])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Agents</h2>
        <p className="muted" style={{ margin: 0 }}>
          Fast AI actions that turn messy inputs into clear execution.
        </p>
      </div>

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
                  context: divisionId ? `${entityId}:${divisionId}` : entityId,
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

