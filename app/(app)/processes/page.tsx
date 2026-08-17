import { ProcessBoard } from '@/components/processes/ProcessBoard'
import { getEntities, getProcesses } from '@/lib/data/queries'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'
import { resolveEntityIds } from '@/lib/scope/entityScope'

export default async function ProcessesPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const processes = await getProcesses(resolveEntityIds(entities, scope))

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Work in motion</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Processes</h1>
        <p className="mt-2 text-sm text-muted">Live workflows for the businesses in this view.</p>
      </div>
      {processes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-8 text-sm text-muted">
          No processes yet. Capture something in Inbox, then start a process from there.
        </p>
      ) : (
        <ProcessBoard processes={processes} />
      )}
    </section>
  )
}
