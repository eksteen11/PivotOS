import Link from 'next/link'

import { BusinessHealthGrid } from '@/components/founder/BusinessHealthGrid'
import {
  getAgents,
  getEntities,
  getInboxItems,
  getPendingApprovals,
  getProcesses,
} from '@/lib/data/queries'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'

export default async function OperatingMapPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)
  const [processes, approvals, inbox, agents] = await Promise.all([
    getProcesses(entityIds),
    getPendingApprovals(entityIds),
    getInboxItems(entityIds),
    getAgents(entityIds),
  ])

  const healthCounts: Record<string, { processes: number; approvals: number; inbox: number }> = {}
  for (const entity of entities) {
    healthCounts[entity.slug] = {
      processes: processes.filter((p) => p.entity_id === entity.id).length,
      approvals: approvals.filter((a) => a.entity_id === entity.id).length,
      inbox: inbox.filter((i) => i.entity_id === entity.id).length,
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Structure</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Operating Map</h1>
        <p className="mt-2 text-sm text-muted">One account. Companies first. Drill into live work when you need it.</p>
      </div>

      <BusinessHealthGrid entities={entities} counts={healthCounts} />

      <div className="grid gap-3">
        {entities.map((entity) => {
          const c = healthCounts[entity.slug]
          const entityAgents = agents.filter((a) => a.entity_id === entity.id)
          return (
            <article key={entity.id} className="rounded-2xl border border-black/[0.07] bg-white/85 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{entity.name}</p>
              <p className="mt-2 text-sm text-muted">
                {c.processes} processes · {c.approvals} approvals · {c.inbox} inbox · {entityAgents.length} agents
              </p>
              {entityAgents.length > 0 ? (
                <p className="mt-3 text-xs leading-5 text-ink/70">
                  Agents: {entityAgents.slice(0, 4).map((a) => a.name).join(', ')}
                  {entityAgents.length > 4 ? ` +${entityAgents.length - 4}` : ''}
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted">No agents scoped to this company yet.</p>
              )}
            </article>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/processes" className="text-accent">Open processes</Link>
        <Link href="/agents" className="text-accent">Open agents</Link>
        <Link href="/tools" className="text-accent">Open integrations</Link>
      </div>
    </section>
  )
}
