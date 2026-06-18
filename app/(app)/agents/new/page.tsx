import { AgentFactoryWizard } from '@/components/agents/AgentFactoryWizard'
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
        <h1 className="text-2xl font-bold tracking-tight">Agent Factory</h1>
        <p className="mt-1 text-muted">Create a new digital employee without code.</p>
      </div>
      <AgentFactoryWizard entities={entities} suggestion={suggestion} />
    </section>
  )
}
