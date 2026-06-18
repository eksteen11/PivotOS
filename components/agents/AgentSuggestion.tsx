import Link from 'next/link'

import type { Memory } from '@/lib/types/database'

export function AgentSuggestion({ memory }: { memory: Memory }) {
  return (
    <div className="deck-card border-amber-200 bg-amber-50/50">
      <p className="text-sm font-medium text-amber-900">Agent suggestion</p>
      <p className="mt-2 text-sm text-amber-950">{memory.content}</p>
      <Link
        href="/agents/new?suggest=debtors"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        Create suggested agent
      </Link>
    </div>
  )
}
