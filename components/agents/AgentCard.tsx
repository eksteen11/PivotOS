import Link from 'next/link'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Agent } from '@/lib/types/database'

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/agents?id=${agent.id}`} className="block rounded-2xl border border-black/[0.07] bg-[#f5f2eb] p-4 transition hover:border-accent/30">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-accent">
          {agent.name.slice(0, 2).toUpperCase()}
        </span>
        <StatusBadge label={agent.status} tone={agent.status} />
      </div>
      <h3 className="text-base font-semibold">{agent.name}</h3>
      <p className="mt-1 text-xs font-medium text-accent">{agent.role}</p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{agent.job_description}</p>
      {agent.entities?.name ? <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{agent.entities.name}</p> : null}
    </Link>
  )
}
