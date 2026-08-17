import Link from 'next/link'

import { AgentCard } from '@/components/agents/AgentCard'
import { AgentSuggestion } from '@/components/agents/AgentSuggestion'
import { getAgents, getEntities, getMemories } from '@/lib/data/queries'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'
import { resolveEntityIds } from '@/lib/scope/entityScope'

export default async function AgentsPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)
  const [agents, memories] = await Promise.all([getAgents(entityIds), getMemories(entityIds)])
  const featured = agents[0]

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">AI workforce</p>
        <h1 className="mt-3 max-w-md text-4xl font-extrabold leading-none tracking-[-0.045em]">Your digital<br />workforce</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">Active agents managing operations across your businesses with human oversight.</p>
      </div>

      {featured ? (
        <section className="mx-auto max-w-xl rounded-2xl border border-black/[0.07] bg-white/90 p-6 text-center shadow-deck sm:p-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-accent/20 bg-[#e5f2e9] text-3xl font-extrabold text-accent">
            {featured.name.slice(0, 2).toUpperCase()}
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{featured.status}</p>
          <h2 className="mt-2 text-2xl font-bold">{featured.name}</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{featured.role}</p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted">{featured.job_description}</p>
          <p className="mt-4 text-xs text-muted">Scope: {featured.entities?.name ?? 'Selected business'} · approval-gated execution</p>
          <Link href={`/agents?id=${featured.id}`} className="btn-primary mt-6 w-full sm:w-auto">Open command console →</Link>
        </section>
      ) : null}

      {memories[0] ? <AgentSuggestion memory={memories[0]} /> : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Other active agents</h2>
          <Link href="/agents/new" className="text-xs font-semibold text-accent">Agent Factory +</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.slice(1).map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
        {agents.length === 0 && <p className="text-muted">No agents for this scope.</p>}
        </div>
      </section>
    </section>
  )
}
