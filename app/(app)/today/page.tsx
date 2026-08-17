import Link from 'next/link'

import { BusinessHealthGrid } from '@/components/founder/BusinessHealthGrid'
import {
  getActivityLogs,
  getEntities,
  getInboxItems,
  getOverdueTasks,
  getPendingApprovals,
  getProcesses,
} from '@/lib/data/queries'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'

export default async function TodayPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)

  const [approvals, processes, overdue, inbox, logs] = await Promise.all([
    getPendingApprovals(entityIds),
    getProcesses(entityIds),
    getOverdueTasks(entityIds),
    getInboxItems(entityIds),
    getActivityLogs(entityIds),
  ])

  const blocked = processes.filter((p) => p.status === 'blocked')
  const waiting = processes.filter((p) => p.status === 'waiting')
  const overnightCount = logs.filter((l: { action: string }) => l.action.startsWith('agent.') || l.action.startsWith('ai.')).length
  const scopeLabel = scope === '__all__' ? 'All businesses' : entities.find((e) => e.slug === scope)?.name ?? 'Selected business'

  const priorities = [
    approvals[0] ? { label: `Approve: ${approvals[0].reason.slice(0, 72)}`, href: '/approvals' } : null,
    blocked[0] ? { label: `Unblock: ${blocked[0].title}`, href: '/processes' } : null,
    inbox[0] ? { label: `Triage inbox: ${inbox[0].title ?? 'Incoming item'}`, href: '/inbox' } : null,
    overdue[0] ? { label: `Clear overdue: ${(overdue[0] as { title: string | null }).title ?? 'Task'}`, href: '/processes' } : null,
  ].filter(Boolean).slice(0, 3) as { label: string; href: string }[]
  const topPriority = priorities[0]

  const healthCounts: Record<string, { processes: number; approvals: number; inbox: number }> = {}
  for (const entity of entities) {
    healthCounts[entity.slug] = {
      processes: processes.filter((p) => p.entity_id === entity.id).length,
      approvals: approvals.filter((a) => a.entity_id === entity.id).length,
      inbox: inbox.filter((i) => i.entity_id === entity.id).length,
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{scopeLabel}</p>
          <h1 className="mt-3 max-w-sm text-4xl font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-5xl">What needs<br />you now</h1>
        </div>
        <Link href="/inbox" className="text-xs font-semibold text-muted hover:text-accent">Capture +</Link>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white/90 p-5 shadow-deck sm:p-7">
        <span className="absolute inset-y-0 left-0 w-1 bg-warn" />
        {topPriority ? (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-warn">Urgent review</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{topPriority.label}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Pivot has surfaced this as your highest-leverage next move.</p>
            </div>
            <Link href={topPriority.href} className="btn-primary">Review now →</Link>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Clear horizon</p>
            <h2 className="mt-2 text-xl font-bold">Nothing urgent needs you.</h2>
            <p className="mt-2 text-sm text-muted">Your businesses are clear for now.</p>
          </div>
        )}
      </section>

      <p className="-mt-5 text-xs text-muted">{Math.max(priorities.length - 1, 0)} more items waiting · {overnightCount} recent AI actions</p>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Entity ecosystem</p>
          <h2 className="mt-1 text-lg font-bold">One account, all your businesses</h2>
        </div>
        <BusinessHealthGrid entities={entities} counts={healthCounts} />
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted">
          <Link href="/approvals" className="hover:text-accent">{approvals.length} approvals</Link>
          <Link href="/inbox" className="hover:text-accent">{inbox.length} inbox</Link>
          <Link href="/processes" className="hover:text-accent">{blocked.length + waiting.length} need attention</Link>
        </div>
      </section>
    </section>
  )
}
