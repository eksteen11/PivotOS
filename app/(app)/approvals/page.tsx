import { ApprovalCard } from '@/components/approvals/ApprovalCard'
import { getEntities, getPendingApprovals } from '@/lib/data/queries'

export default async function ApprovalsPage() {
  const entities = await getEntities()
  const approvals = await getPendingApprovals(entities.map((e) => e.id))

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Centre</h1>
        <p className="mt-1 text-muted">Review sensitive actions before agents execute them.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {approvals.map((a) => (
          <ApprovalCard key={a.id} approval={a} />
        ))}
        {approvals.length === 0 && <p className="text-muted">No pending approvals.</p>}
      </div>
    </section>
  )
}
