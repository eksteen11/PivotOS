import { AgentFactoryShell } from '@/components/agents/AgentFactoryShell'
import { getEntities, getMemories } from '@/lib/data/queries'

export default async function NewAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ suggest?: string }>
}) {
  const params = await searchParams
  const entities = await getEntities()
  const memories = await getMemories(entities.map((e) => e.id))

  const suggestion =
    params.suggest === 'debtors' && memories[0]
      ? {
          title: memories[0].content,
          description: 'Follow up on overdue invoices and debtor communications.',
          preset: { name: 'Debtors Agent', role: 'Collections', slug: 'debtors' },
        }
      : undefined

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Create with care</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Agent Factory</h1>
        <p className="mt-2 text-sm text-muted">Create a digital employee. Risky actions still need your approval.</p>
      </div>
      <AgentFactoryShell entities={entities} suggestion={suggestion} />
    </section>
  )
}
