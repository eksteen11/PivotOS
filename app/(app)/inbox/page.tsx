import { InboxCapture } from '@/components/inbox/InboxCapture'
import { InboxCard } from '@/components/inbox/InboxCard'
import { getEntities, getInboxItems } from '@/lib/data/queries'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'
import { resolveEntityIds } from '@/lib/scope/entityScope'

export default async function InboxPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const items = await getInboxItems(resolveEntityIds(entities, scope))

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Capture and organise</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Universal Inbox</h1>
        <p className="mt-2 text-sm text-muted">Capture first. Pivot will help organise it next.</p>
      </div>
      <InboxCapture entities={entities} />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Waiting to be processed</h2>
          <p className="mt-1 text-sm text-muted">{items.length} items in this business view</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <InboxCard key={item.id} item={item} />
        ))}
        {items.length === 0 && <p className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-sm text-muted">Inbox is clear. Capture something above when it arrives.</p>}
      </div>
    </section>
  )
}
