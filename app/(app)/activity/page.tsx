import { getActivityLogs, getEntities } from '@/lib/data/queries'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'

export default async function ActivityPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)
  const logs = await getActivityLogs(entityIds)

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Audit trail</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Activity</h1>
        <p className="mt-2 text-sm text-muted">{logs.length} events in this business view. Simulated actions are labelled.</p>
      </div>
      {logs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-8 text-sm text-muted">
          No activity yet. Capture, classify, approve or analyse something to start the trail.
        </p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log: { id: string; action: string; created_at: string; payload?: Record<string, unknown> }) => (
            <li key={log.id} className="rounded-2xl border border-black/[0.07] bg-white/85 px-4 py-3">
              <p className="text-sm font-semibold">{log.action}</p>
              <p className="mt-1 text-xs text-muted">{new Date(log.created_at).toLocaleString()}</p>
              {log.payload && Object.keys(log.payload).length > 0 ? (
                <p className="mt-2 line-clamp-3 text-xs text-ink/70">{JSON.stringify(log.payload)}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
