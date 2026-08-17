'use client'

import { useState } from 'react'

import type { GeneratedAgent } from '@/lib/ai/generateAgent'
import type { Entity } from '@/lib/types/database'

type Props = {
  entities: Entity[]
  onGenerated: (agent: GeneratedAgent) => void
}

export function AgentAiSpark({ entities, onGenerated }: Props) {
  const [brief, setBrief] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    if (!brief.trim()) return
    setBusy(true)
    setError(null)
    const res = await fetch('/api/agents/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief }),
    })
    setBusy(false)
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Generation failed')
      return
    }
    onGenerated(data.agent)
  }

  const examples = [
    'Debtors agent that chases overdue invoices via email and WhatsApp',
    'Inbox triage agent that sorts email into processes',
    'Chief of staff that plans my day from calendar and tasks',
  ]

  return (
    <div className="rounded-2xl border border-accent/20 bg-[#edf5ef] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">AI designs the role</p>
      <p className="mt-2 text-sm text-muted">
        Describe the job. Pivot drafts an agent for {entities[0]?.name ?? 'your business'}. Risky actions still need your approval.
      </p>
      <textarea
        className="field-input mt-3 min-h-[88px]"
        placeholder="e.g. Agent that follows up on overdue invoices every Monday…"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-muted hover:border-accent/30 hover:text-accent"
            onClick={() => setBrief(ex)}
          >
            {ex.slice(0, 42)}…
          </button>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <button type="button" className="btn-primary mt-4" disabled={busy || !brief.trim()} onClick={generate}>
        {busy ? 'Designing agent…' : 'Generate with AI'}
      </button>
    </div>
  )
}
