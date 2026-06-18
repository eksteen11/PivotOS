import Link from 'next/link'

import { AgentCard } from '@/components/agents/AgentCard'
import { AgentSuggestion } from '@/components/agents/AgentSuggestion'
import { getAgents, getEntities, getMemories } from '@/lib/data/queries'

export default async function AgentsPage() {
  const entities = await getEntities()
  const entityIds = entities.map((e) => e.id)
  const [agents, memories] = await Promise.all([getAgents(entityIds), getMemories(entityIds)])

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="mt-1 text-muted">Your AI workforce — digital employees with roles and tools.</p>
        </div>
        <Link href="/agents/new" className="btn-primary">Agent Factory</Link>
      </div>
      {memories[0] ? <AgentSuggestion memory={memories[0]} /> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
        {agents.length === 0 && <p className="text-muted">No agents yet. Create one in Agent Factory.</p>}
      </div>
    </section>
  )
}
