import Link from 'next/link'

import type { Process } from '@/lib/types/database'
import { COMMERCIAL_STAGES, FINANCE_STAGES, stageForProcess, type Stage } from '@/lib/engines/stages'

function StageBoard({
  title,
  stages,
  processes,
  kind,
}: {
  title: string
  stages: Stage[]
  processes: Process[]
  kind: 'commercial' | 'finance'
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {stages.map((stage) => {
          const items = processes.filter((p) => stageForProcess(p.title, p.template_slug, kind) === stage.key)
          return (
            <div key={stage.key} className="rounded-2xl border border-black/[0.07] bg-white/85 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{stage.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{items.length}</p>
              <ul className="mt-3 space-y-2">
                {items.slice(0, 4).map((p) => (
                  <li key={p.id}>
                    <Link href={`/processes/${p.id}`} className="text-sm font-semibold text-accent hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
                {items.length === 0 && <li className="text-xs text-muted">Empty</li>}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CommercialEngine({ processes }: { processes: Process[] }) {
  return <StageBoard title="Commercial engine" stages={COMMERCIAL_STAGES} processes={processes} kind="commercial" />
}

export function FinanceEngine({ processes }: { processes: Process[] }) {
  return <StageBoard title="Finance engine" stages={FINANCE_STAGES} processes={processes} kind="finance" />
}
