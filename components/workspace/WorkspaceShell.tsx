import Link from 'next/link'

import { CommercialEngine, FinanceEngine } from '@/components/engines/StageEngines'
import { DeckCard } from '@/components/cards/DeckCard'
import { ProcessCard } from '@/components/processes/ProcessBoard'
import { InboxCard } from '@/components/inbox/InboxCard'
import type { InboxItem, Process } from '@/lib/types/database'

export function WorkspaceShell({
  title,
  subtitle,
  entityName,
  processes,
  inbox,
  focusItems,
  engine = 'none',
}: {
  title: string
  subtitle: string
  entityName: string
  processes: Process[]
  inbox: InboxItem[]
  focusItems: string[]
  engine?: 'commercial' | 'finance' | 'none'
}) {
  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{entityName}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
      </div>

      <DeckCard title="Operating focus" subtitle="What this workspace owns">
        <ul className="grid gap-2 sm:grid-cols-2">
          {focusItems.map((item) => (
            <li key={item} className="rounded-xl bg-surface/80 px-3 py-2 text-sm font-medium">
              {item}
            </li>
          ))}
        </ul>
      </DeckCard>

      {engine === 'commercial' ? <CommercialEngine processes={processes} /> : null}
      {engine === 'finance' ? <FinanceEngine processes={processes} /> : null}

      <DeckCard title="Active work" subtitle={`${processes.length} processes`} action={<Link href="/processes" className="text-sm text-accent">All processes</Link>}>
        <div className="grid gap-3 md:grid-cols-2">
          {processes.slice(0, 6).map((p) => (
            <ProcessCard key={p.id} process={p} />
          ))}
          {processes.length === 0 && <p className="text-sm text-muted">No processes in this workspace yet.</p>}
        </div>
      </DeckCard>

      <DeckCard title="Incoming" subtitle={`${inbox.length} inbox items`} action={<Link href="/inbox" className="text-sm text-accent">Open inbox</Link>}>
        <div className="grid gap-4 md:grid-cols-2">
          {inbox.slice(0, 4).map((item) => (
            <InboxCard key={item.id} item={item} />
          ))}
          {inbox.length === 0 && <p className="text-sm text-muted">No incoming items for this workspace.</p>}
        </div>
      </DeckCard>
    </section>
  )
}
