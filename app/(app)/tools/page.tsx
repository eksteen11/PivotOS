import { ToolCard } from '@/components/tools/ToolCard'
import { getEntities, getToolConnections, getTools } from '@/lib/data/queries'

export default async function ToolsPage() {
  const entities = await getEntities()
  const [tools, connections] = await Promise.all([
    getTools(),
    getToolConnections(entities.map((e) => e.id)),
  ])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tool Connection Centre</h1>
        <p className="mt-1 text-muted">Connect APIs your agents can use. Placeholders until OAuth is wired.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const connection = connections.find((c) => c.tool_id === tool.id)
          return <ToolCard key={tool.id} tool={tool} connection={connection} />
        })}
      </div>
    </section>
  )
}
