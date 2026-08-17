import { ToolCard } from '@/components/tools/ToolCard'
import { CONNECTORS } from '@/lib/connectors/catalog'
import { getEntities, getToolConnections, getTools } from '@/lib/data/queries'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'

export default async function ToolsPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)
  const [tools, connections] = await Promise.all([
    getTools(),
    getToolConnections(entityIds),
  ])

  const bySlug = new Map(tools.map((t) => [t.slug, t]))

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">External systems</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Integrations</h1>
        <p className="mt-2 text-sm text-muted">Connection readiness only. Nothing is connected or sent without real credentials.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECTORS.map((connector) => {
          const tool = bySlug.get(connector.slug)
          const connection = tool ? connections.find((c) => c.tool_id === tool.id) : undefined
          if (!tool) {
            return (
              <article key={connector.slug} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <h3 className="font-semibold">{connector.name}</h3>
                <p className="mt-1 text-sm text-muted">{connector.provider} · {connector.category}</p>
                <p className="mt-3 text-xs text-muted">{connector.lastActivity}</p>
                <p className="mt-2 text-xs font-semibold text-accent">{connector.defaultStatus}</p>
              </article>
            )
          }
          return <ToolCard key={tool.id} tool={tool} connection={connection} />
        })}
      </div>
    </section>
  )
}
