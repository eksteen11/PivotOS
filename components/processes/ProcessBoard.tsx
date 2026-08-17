import Link from 'next/link'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Process } from '@/lib/types/database'

export function ProcessCard({ process }: { process: Process }) {
  const steps = process.process_steps ?? []
  const done = steps.filter((s) => s.status === 'done').length
  const total = steps.length || 1
  const pct = Math.round((done / total) * 100)

  return (
    <Link href={`/processes/${process.id}`} className="block rounded-2xl border border-black/[0.07] bg-white/85 p-4 shadow-deck transition hover:border-accent/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <StatusBadge label={process.status} tone={process.status} />
        {process.template_slug ? <StatusBadge label={process.template_slug} tone="normal" /> : null}
        {process.entities?.name ? <StatusBadge label={process.entities.name} tone="active" /> : null}
      </div>
      <h3 className="text-base font-semibold">{process.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {process.agents?.name ? `Agent: ${process.agents.name}` : 'No agent'} · Owner: {process.human_owner ?? '—'}
      </p>
      {steps.length > 0 && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Steps</span>
            <span>{done}/{total}</span>
          </div>
          <div className="h-2 rounded-full bg-black/5">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {steps.slice(0, 4).map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-muted">
                <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'done' ? 'bg-accent' : 'bg-black/20'}`} />
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  )
}

export function ProcessBoard({ processes }: { processes: Process[] }) {
  const columns: { key: string; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'blocked', label: 'Blocked' },
    { key: 'draft', label: 'Draft' },
    { key: 'done', label: 'Done' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-5">
      {columns.map((col) => {
        const items = processes.filter((p) => p.status === col.key)
        return (
          <div key={col.key} className="min-w-0">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{col.label} ({items.length})</h3>
            <div className="space-y-3">
              {items.map((p) => (
                <ProcessCard key={p.id} process={p} />
              ))}
              {items.length === 0 && <p className="text-sm text-muted">None</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
