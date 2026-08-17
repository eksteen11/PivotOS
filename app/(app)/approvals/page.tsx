import { ApprovalCard } from '@/components/approvals/ApprovalCard'
import { getEntities, getPendingApprovals } from '@/lib/data/queries'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'
import { resolveEntityIds } from '@/lib/scope/entityScope'

export default async function ApprovalsPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const approvals = await getPendingApprovals(resolveEntityIds(entities, scope))

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          {approvals.length > 0 ? `Decision 1 of ${approvals.length}` : 'Decision queue'}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Decide with confidence</h1>
        <p className="mt-2 text-sm text-muted">One consequential decision at a time.</p>
      </div>
      <div className="rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(23,114,75,0.10),transparent_65%)] p-1 sm:p-6">
        {approvals.slice(0, 1).map((a) => (
          <ApprovalCard key={a.id} approval={a} />
        ))}
        {approvals.length === 0 && <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-8 text-center text-sm text-muted">No pending approvals. Nothing is waiting on your decision.</p>}
      </div>
      {approvals.length > 1 ? <p className="text-center text-xs text-muted">{approvals.length - 1} more decisions will follow</p> : null}
    </section>
  )
}
