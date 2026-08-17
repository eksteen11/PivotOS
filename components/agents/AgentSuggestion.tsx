import Link from 'next/link'

import type { Memory } from '@/lib/types/database'

export function AgentSuggestion({ memory }: { memory: Memory }) {
  return (
    <div className="rounded-2xl border border-warn/20 bg-[#fbf4ec] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-warn">Agent suggestion</p>
      <p className="mt-2 text-sm text-ink">{memory.content}</p>
      <Link
        href="/agents/new?suggest=debtors"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        Create suggested agent
      </Link>
    </div>
  )
}
