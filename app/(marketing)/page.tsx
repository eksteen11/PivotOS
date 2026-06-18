import Link from 'next/link'

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold">Pivot OS</span>
        <Link href="/login" className="btn-primary">Sign in</Link>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Run companies through AI workers</h1>
        <p className="mt-6 text-lg text-muted">
          Universal Inbox → Processes → Agents → Tools → Approvals. A calm executive operating system for multi-entity operators.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/login" className="btn-primary">Open Pivot OS</Link>
          <Link href="/login" className="btn-secondary">Sign in</Link>
        </div>
      </section>
    </main>
  )
}
