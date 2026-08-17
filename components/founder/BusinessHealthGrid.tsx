import type { Entity } from '@/lib/types/database'

export function BusinessHealthGrid({
  entities,
  counts,
}: {
  entities: Entity[]
  counts: Record<string, { processes: number; approvals: number; inbox: number }>
}) {
  return (
    <div className="relative mx-auto grid max-w-xl grid-cols-2 gap-x-12 gap-y-10 rounded-2xl bg-[#f3f0e9] p-6 sm:gap-x-24 sm:p-8">
      {entities.map((entity) => {
        const c = counts[entity.slug] ?? { processes: 0, approvals: 0, inbox: 0 }
        return (
          <article key={entity.id} className="relative z-10 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-white text-sm font-bold text-accent shadow-sm">
              {entity.name.slice(0, 2).toUpperCase()}
            </span>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ink">{entity.name}</p>
            <p className="mt-1 text-[10px] text-muted">
              {c.processes} active · {c.approvals + c.inbox} waiting
            </p>
          </article>
        )
      })}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/30 bg-[#dff0e5] text-center text-[9px] font-bold uppercase tracking-wide text-accent shadow-sm">
        Pivot
        <br />
        Core
      </div>
    </div>
  )
}
