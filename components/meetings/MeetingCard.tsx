'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { MeetingItem } from '@/lib/data/meetings'

export function MeetingCard({ meeting }: { meeting: MeetingItem }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const prep = Array.isArray(meeting.meta?.prep) ? (meeting.meta.prep as string[]) : []
  const transcript = typeof meeting.meta?.transcript === 'string' ? meeting.meta.transcript : null

  async function importTranscript(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    setBusy(true)
    setError(null)
    const response = await fetch(`/api/meetings/${meeting.id}/analyse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: draft }),
    })
    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: string }
      setError(body.error ?? 'Could not save transcript')
    } else {
      setDraft('')
      router.refresh()
    }
    setBusy(false)
  }

  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white/85 p-5 shadow-deck">
      <div className="mb-3 flex flex-wrap gap-2">
        <StatusBadge label="meeting" tone="normal" />
        {meeting.entities?.name ? <StatusBadge label={meeting.entities.name} tone="active" /> : null}
      </div>
      <h3 className="text-base font-semibold">{meeting.title ?? 'Meeting'}</h3>
      <p className="mt-1 text-sm text-muted">
        {meeting.due_at ? new Date(meeting.due_at).toLocaleString() : 'Unscheduled'}
      </p>
      <p className="mt-2 text-sm text-muted">{meeting.content}</p>
      {prep.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-ink/70">
          {prep.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : null}
      {transcript ? (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Imported transcript</p>
          <pre className="mt-2 max-h-32 overflow-auto rounded-xl bg-black/[0.03] p-3 text-xs text-muted">{transcript}</pre>
        </div>
      ) : (
        <form onSubmit={(e) => void importTranscript(e)} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold">
            Paste a real transcript
            <textarea
              className="field-input mt-2 min-h-24 resize-y"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Paste notes from a real recording or attendee. Pivot will not invent this."
            />
          </label>
          <button type="submit" className="btn-primary text-sm" disabled={busy || !draft.trim()}>
            {busy ? 'Saving…' : 'Save transcript'}
          </button>
        </form>
      )}
      {error ? <p className="mt-2 text-sm font-semibold text-danger">{error}</p> : null}
    </article>
  )
}
