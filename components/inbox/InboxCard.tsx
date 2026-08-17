'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/cards/StatusBadge'
import { SpawnProcessButton } from '@/components/inbox/SpawnProcessButton'
import type { InboxItem } from '@/lib/types/database'

export function InboxCard({ item }: { item: InboxItem }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const urgency = item.urgency ?? 'normal'
  const ai = item.meta?.ai_classification as
    | { summary?: string; reason?: string; confidence?: number; nextAction?: string }
    | undefined

  async function classify() {
    setBusy(true)
    await fetch(`/api/inbox/${item.id}/classify`, { method: 'POST' })
    setBusy(false)
    router.refresh()
  }

  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-white/85 p-4 shadow-deck ${urgency !== 'normal' ? 'border-warn/30' : 'border-black/[0.07]'}`}>
      {urgency !== 'normal' ? <span className="absolute inset-y-0 left-0 w-0.5 bg-warn" /> : null}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge label={item.source ?? 'manual'} tone="normal" />
        {urgency !== 'normal' ? <StatusBadge label={urgency} tone={urgency} /> : null}
        {item.entities?.name ? <StatusBadge label={item.entities.name} tone="active" /> : null}
      </div>
      <h3 className="text-base font-semibold tracking-tight">{item.title ?? 'Untitled'}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.content}</p>
      {(item.suggested_process || item.suggested_agent) && (
        <p className="mt-3 text-xs text-muted">
          Suggested: {item.suggested_process || '—'} · Agent: {item.suggested_agent || '—'}
        </p>
      )}
      {ai ? (
        <div className="mt-3 rounded-xl bg-[#edf5ef] px-3 py-2 text-xs text-ink/80">
          <p className="font-semibold">{ai.summary}</p>
          <p className="mt-1 text-muted">{ai.reason}</p>
          {ai.nextAction ? <p className="mt-1 font-semibold text-accent">{ai.nextAction}</p> : null}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary text-sm" disabled={busy} onClick={() => void classify()}>
          {busy ? 'Classifying…' : 'AI classify'}
        </button>
        <SpawnProcessButton itemId={item.id} />
        <button
          type="button"
          className="min-h-11 px-3 text-xs font-bold uppercase tracking-[0.14em] text-muted hover:text-ink"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            await fetch(`/api/inbox/${item.id}/archive`, { method: 'POST' })
            setBusy(false)
            router.refresh()
          }}
        >
          Archive
        </button>
      </div>
    </article>
  )
}
