import Link from 'next/link'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Agent } from '@/lib/types/database'

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/agents?id=${agent.id}`} className="block rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-accent/30">
      <div className="mb-2 flex items-center gap-2">
        <StatusBadge label={agent.status} tone={agent.status} />
        {agent.entities?.name ? <StatusBadge label={agent.entities.name} tone="active" /> : null}
      </div>
      <h3 className="text-base font-semibold">{agent.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent">{agent.role}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{agent.job_description}</p>
    </Link>
  )
}
