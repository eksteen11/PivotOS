'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Process, ProcessStep } from '@/lib/types/database'

export function ProcessDetailClient({
  process,
  steps,
}: {
  process: Process
  steps: ProcessStep[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  async function act(stepId: string, action: 'advance' | 'skip') {
    setBusyId(stepId)
    await fetch(`/api/processes/${process.id}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, action }),
    })
    setBusyId(null)
    router.refresh()
  }

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/processes" className="text-sm font-semibold text-accent">← Processes</Link>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge label={process.status} tone={process.status} />
          {process.template_slug ? <StatusBadge label={process.template_slug} tone="normal" /> : null}
          {process.entities?.name ? <StatusBadge label={process.entities.name} tone="active" /> : null}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{process.title}</h1>
        <p className="mt-1 text-muted">
          {process.agents?.name ? `Agent: ${process.agents.name}` : 'No agent'} · Owner: {process.human_owner ?? '—'}
        </p>
      </div>

      <div className="deck-card space-y-3">
        <h2 className="font-semibold">Steps</h2>
        {steps.length === 0 ? (
          <p className="text-sm text-muted">No steps on this process.</p>
        ) : (
          <ul className="space-y-3">
            {steps.map((step) => (
              <li key={step.id} className="rounded-xl border border-black/5 bg-surface/70 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-xs text-muted capitalize">{step.status}</p>
                  </div>
                  {step.status !== 'done' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn-primary text-sm"
                        disabled={busyId === step.id}
                        onClick={() => void act(step.id, 'advance')}
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-sm"
                        disabled={busyId === step.id}
                        onClick={() => void act(step.id, 'skip')}
                      >
                        Skip
                      </button>
                    </div>
                  ) : (
                    <StatusBadge label="done" tone="active" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
