import Link from 'next/link'

export function NotBuiltLane({ name, note }: { name: string; note: string }) {
  return (
    <section className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Not built yet</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{name}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{note}</p>
      </div>
      <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-5 text-sm leading-6 text-muted">
        This lane is planned. Until it is built for real, work for this business stays in Inbox, Processes and Approvals.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/inbox" className="btn-primary">Open inbox</Link>
        <Link href="/today" className="btn-secondary">Back home</Link>
      </div>
    </section>
  )
}
