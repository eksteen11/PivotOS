import Link from 'next/link'

import { ApprovalCard } from '@/components/approvals/ApprovalCard'
import { DeckCard } from '@/components/cards/DeckCard'
import { InboxCard } from '@/components/inbox/InboxCard'
import { ProcessCard } from '@/components/processes/ProcessBoard'
import { AgentSuggestion } from '@/components/agents/AgentSuggestion'
import {
  getEntities,
  getInboxItems,
  getMemories,
  getOverdueTasks,
  getPendingApprovals,
  getProcesses,
} from '@/lib/data/queries'

export default async function TodayPage() {
  const entities = await getEntities()
  const entityIds = entities.map((e) => e.id)

  const [approvals, processes, overdue, inbox, memories] = await Promise.all([
    getPendingApprovals(entityIds),
    getProcesses(entityIds),
    getOverdueTasks(entityIds),
    getInboxItems(entityIds),
    getMemories(entityIds),
  ])

  const active = processes.filter((p) => p.status === 'active')
  const blocked = processes.filter((p) => p.status === 'blocked')
  const suggestion = memories[0]

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        <p className="mt-1 text-muted">What matters now — approvals, processes, and incoming work.</p>
      </div>

      <DeckCard title="Urgent approvals" subtitle={`${approvals.length} waiting for you`} action={<Link href="/approvals" className="text-sm text-accent">View all</Link>}>
        {approvals.length === 0 ? (
          <p className="text-sm text-muted">No pending approvals.</p>
        ) : (
          <div className="space-y-3">
            {approvals.slice(0, 3).map((a) => (
              <ApprovalCard key={a.id} approval={a} />
            ))}
          </div>
        )}
      </DeckCard>

      <DeckCard title="Active processes" subtitle={`${active.length} in progress`} action={<Link href="/processes" className="text-sm text-accent">Open board</Link>}>
        <div className="grid gap-3 md:grid-cols-2">
          {active.slice(0, 4).map((p) => (
            <ProcessCard key={p.id} process={p} />
          ))}
          {active.length === 0 && <p className="text-sm text-muted">No active processes.</p>}
        </div>
      </DeckCard>

      <DeckCard title="Overdue tasks" subtitle={`${overdue.length} overdue`}>
        <ul className="space-y-2">
          {overdue.slice(0, 6).map((t: { id: string; title: string | null }) => (
            <li key={t.id} className="text-sm">{t.title ?? 'Task'}</li>
          ))}
          {overdue.length === 0 && <p className="text-sm text-muted">Nothing overdue.</p>}
        </ul>
      </DeckCard>

      {suggestion ? <AgentSuggestion memory={suggestion} /> : null}

      <DeckCard title="Blocked work" subtitle={`${blocked.length} blocked`}>
        {blocked.length === 0 ? (
          <p className="text-sm text-muted">Nothing blocked.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {blocked.map((p) => (
              <ProcessCard key={p.id} process={p} />
            ))}
          </div>
        )}
      </DeckCard>

      <DeckCard title="Important incoming" subtitle={`${inbox.length} in inbox`} action={<Link href="/inbox" className="text-sm text-accent">Open inbox</Link>}>
        <div className="grid gap-4 md:grid-cols-2">
          {inbox.slice(0, 4).map((item) => (
            <InboxCard key={item.id} item={item} />
          ))}
          {inbox.length === 0 && <p className="text-sm text-muted">Inbox is clear.</p>}
        </div>
      </DeckCard>
    </section>
  )
}
