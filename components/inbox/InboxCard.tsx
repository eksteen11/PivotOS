import { StatusBadge } from '@/components/cards/StatusBadge'
import { SpawnProcessButton } from '@/components/inbox/SpawnProcessButton'
import type { InboxItem } from '@/lib/types/database'

export function InboxCard({ item }: { item: InboxItem }) {
  const urgency = item.urgency ?? 'normal'
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge label={item.source ?? 'manual'} tone="normal" />
        {urgency !== 'normal' ? <StatusBadge label={urgency} tone={urgency} /> : null}
        {item.entities?.name ? <StatusBadge label={item.entities.name} tone="active" /> : null}
      </div>
      <h3 className="text-base font-semibold">{item.title ?? 'Untitled'}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{item.content}</p>
      {(item.suggested_process || item.suggested_agent) && (
        <p className="mt-3 text-xs text-muted">
          Suggested: {item.suggested_process || '—'} · Agent: {item.suggested_agent || '—'}
        </p>
      )}
      <div className="mt-4">
        <SpawnProcessButton itemId={item.id} />
      </div>
    </article>
  )
}
