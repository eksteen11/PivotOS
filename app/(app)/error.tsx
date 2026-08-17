'use client'

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="deck-card space-y-3">
      <h1 className="text-xl font-bold tracking-tight">This screen failed to load</h1>
      <p className="text-sm text-muted">Nothing was changed. Try again, or go back home.</p>
      <button type="button" className="btn-primary" onClick={reset}>
        Retry
      </button>
    </section>
  )
}
