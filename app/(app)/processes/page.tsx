import { ProcessBoard } from '@/components/processes/ProcessBoard'
import { getEntities, getProcesses } from '@/lib/data/queries'

export default async function ProcessesPage() {
  const entities = await getEntities()
  const processes = await getProcesses(entities.map((e) => e.id))

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Processes</h1>
        <p className="mt-1 text-muted">Business workflows across your entities.</p>
      </div>
      <ProcessBoard processes={processes} />
    </section>
  )
}
