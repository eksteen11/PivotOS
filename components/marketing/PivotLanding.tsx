import Link from 'next/link'

export function PivotLanding() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/" className="text-sm font-bold tracking-tight">Pivot OS</Link>
          <Link href="/login" className="btn-primary">Enter system</Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(23,114,75,0.10),transparent_28rem),radial-gradient(circle_at_12%_70%,rgba(214,205,184,0.36),transparent_24rem)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Clear Horizon OS</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-7xl">PIVOT</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
            DJ Eksteen&apos;s founder operating system. Capture what arrives, let AI prepare, approve what matters, then execute.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="btn-primary px-6">Enter your system</Link>
            <p className="text-sm text-muted">Private founder access. No public signup.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/[0.06] px-5 py-16">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Command Centre', desc: 'What needs you now across all businesses.' },
            { title: 'Universal Inbox', desc: 'Capture first. Classify and convert next.' },
            { title: 'Approvals', desc: 'One consequential decision at a time.' },
            { title: 'AI Workforce', desc: 'Agents propose. You remain the gate.' },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-black/[0.07] bg-white/80 p-5">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-black/[0.06] px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Honest status</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Built for daily command. Not a finished SaaS yet.</h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-muted">
            <li>Live today: inbox capture, classification, approvals, meetings notes, processes, agents and an operating map.</li>
            <li>Northpoint is the first commercial lane. Other business lanes stay marked not built until they are real.</li>
            <li>Gmail, WhatsApp send, calendar sync and money movement are not connected. Nothing is marked sent unless it actually sent.</li>
            <li>Offline capture is local only. Approvals require a connection.</li>
          </ul>
        </div>
      </section>

      <section className="border-t border-black/[0.06] bg-white/70 px-5 py-16 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">One account. All your businesses.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
          DJ Private, Digikraal, Farm Feed and Northpoint stay inside this Pivot account. Future customers will get isolated tenants.
        </p>
        <Link href="/login" className="btn-primary mt-8">Founder access</Link>
      </section>

      <footer className="border-t border-black/[0.06] px-5 py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} Pivot OS · Private founder workspace
      </footer>
    </>
  )
}
