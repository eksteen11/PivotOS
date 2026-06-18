import { InboxCapture } from '@/components/inbox/InboxCapture'
import { InboxCard } from '@/components/inbox/InboxCard'
import { getEntities, getInboxItems } from '@/lib/data/queries'

export default async function InboxPage() {
  const entities = await getEntities()
  const items = await getInboxItems(entities.map((e) => e.id))

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Universal Inbox</h1>
        <p className="mt-1 text-muted">Everything enters here first. Classify, then start a process.</p>
      </div>
      <InboxCapture entities={entities} />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <InboxCard key={item.id} item={item} />
        ))}
        {items.length === 0 && <p className="text-muted">Inbox is empty.</p>}
      </div>
    </section>
  )
}
