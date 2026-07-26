import Link from 'next/link'

const MODULES = [
  { name: 'Today', badge: null, icon: '◉', color: 'bg-emerald-500', desc: 'Command centre' },
  { name: 'Inbox', badge: null, icon: '✉', color: 'bg-violet-500', desc: 'Universal intake' },
  { name: 'Processes', badge: null, icon: '▤', color: 'bg-sky-500', desc: 'Workflow engine' },
  { name: 'Agents', badge: 'AI', icon: '◎', color: 'bg-fuchsia-500', desc: 'Digital workforce' },
  { name: 'Approvals', badge: null, icon: '✓', color: 'bg-amber-500', desc: 'Human gates' },
  { name: 'Meetings', badge: null, icon: '◷', color: 'bg-rose-500', desc: 'Schedule & notes' },
  { name: 'Deals', badge: null, icon: '◆', color: 'bg-lime-600', desc: 'Revenue pipeline' },
  { name: 'Tools', badge: null, icon: '⚡', color: 'bg-orange-500', desc: 'Connected apps' },
  { name: 'Memory', badge: 'AI', icon: '◈', color: 'bg-indigo-500', desc: 'Entity context' },
  { name: 'Entities', badge: null, icon: '⬡', color: 'bg-teal-600', desc: 'Multi-company' },
  { name: 'Command', badge: null, icon: '⊞', color: 'bg-cyan-600', desc: 'Mission control' },
  { name: 'Offline', badge: null, icon: '↻', color: 'bg-slate-600', desc: 'PWA sync' },
] as const

const CAPABILITIES = [
  'Universal Inbox', 'Process templates', 'Agent factory', 'Approval queue', 'Entity switcher',
  'Workstreams', 'Meeting grid', 'Deal pipeline', 'Activity timeline', 'Tool permissions',
  'Memory search', 'Daily briefing', 'Quick capture', 'Kanban boards', 'Revenue panel',
  'Document links', 'Follow-up drafts', 'RLS privacy', 'Offline Dexie', 'Supabase sync',
  'WhatsApp intake', 'Email triage', 'Form leads', 'Voice notes', 'Calendar view',
  'Custom statuses', 'Overdue alerts', 'Blocked work', 'Agent suggestions', 'Audit logs',
] as const

const VERTICALS = [
  {
    id: 'digikraal',
    title: 'Run DigiKraal without spreadsheet sprawl',
    lead: 'Agency, property, projects, and finance — one cockpit with entity-scoped agents.',
    replaces: ['Sheets', 'WhatsApp', 'Email', 'Notes'],
    outcomes: ['Track divisions and workstreams', 'Meeting → task in one flow', 'Invoice follow-ups with approval'],
    agents: ['Sales Agent', 'Finance Agent', 'Meeting Agent', 'Follow-up Agent'],
  },
  {
    id: 'farmfeed',
    title: 'Move Farm Feed quotes and logistics faster',
    lead: 'Trading, sourcing, and admin lanes — classified intake and process templates.',
    replaces: ['Sheets', 'Calls', 'Email'],
    outcomes: ['Quote processes with deadlines', 'SAFEX and listing context', 'Overdue task surfacing'],
    agents: ['Quote Agent', 'Logistics Agent', 'Finance Agent', 'Chief of Staff'],
  },
  {
    id: 'northpoint',
    title: 'Close Northpoint deals with full context',
    lead: 'Listings, viewings, and mandates — from form lead to signed mandate.',
    replaces: ['CRM notes', 'Sheets', 'Email'],
    outcomes: ['Viewing → follow-up process', 'Deal intelligence alerts', 'Mandate document links'],
    agents: ['Property Agent', 'Sales Agent', 'Document Agent', 'EA Agent'],
  },
  {
    id: 'personal',
    title: 'Personal ops without losing the businesses',
    lead: 'Life admin, ideas, and coding pipeline — separated but reachable from one login.',
    replaces: ['Notes', 'Calendar', 'Reminders'],
    outcomes: ['Ideas → opportunities', 'Personal Today view', 'Zero cross-entity leak'],
    agents: ['Chief of Staff', 'Ideas Agent', 'Meeting Agent', 'Planner Agent'],
  },
] as const

const BRAIN_FEATURES = [
  { title: 'Entity memory', desc: 'Agents remember your divisions, deals, and preferences per company — never mixed.' },
  { title: 'Ambient Today', desc: 'Approvals, blocked work, and agent suggestions surface before you ask.' },
  { title: 'Approval-safe AI', desc: 'Draft and propose first. Send money, email, or WhatsApp only after you approve.' },
  { title: 'Connected tools', desc: 'Gmail, WhatsApp, Xero, Sheets — scoped permissions per agent.' },
  { title: 'Daily briefing', desc: 'Chief of Staff compiles what matters across all entities each morning.' },
  { title: 'Deep search', desc: 'Find activities, meetings, and deals across workstreams in one query.' },
] as const

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-base font-medium text-ink/90 sm:text-lg">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden>
        ✓
      </span>
      {children}
    </li>
  )
}

function ModuleTile({ name, badge, icon, color, desc }: (typeof MODULES)[number]) {
  return (
    <div className="group flex flex-col items-center justify-center gap-2 border border-black/[0.06] bg-white px-4 py-8 text-center transition hover:bg-slate-50">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white shadow-sm ${color}`} aria-hidden>
        {icon}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold text-ink">{name}</span>
        {badge ? (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
            {badge}
          </span>
        ) : null}
      </div>
      <span className="text-xs font-medium text-muted">{desc}</span>
    </div>
  )
}

export function PivotLanding() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-black text-white shadow-md shadow-emerald-500/30">
              P
            </span>
            PivotOS
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/80 md:flex" aria-label="Marketing">
            <a href="#modules" className="hover:text-emerald-700">Product</a>
            <a href="#brain" className="hover:text-emerald-700">AI</a>
            <a href="#verticals" className="hover:text-emerald-700">Workflows</a>
            <a href="#platform" className="hover:text-emerald-700">Platform</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-ink hover:bg-black/5 sm:inline-flex">
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90"
            >
              Get started — free
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-black/[0.06] bg-gradient-to-b from-white to-slate-50 px-5 pb-16 pt-14 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-700">The operator OS</p>
          <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            Software to{' '}
            <span className="text-ink/45">replace spreadsheet chaos</span>
          </h1>
          <ul className="mt-8 grid max-w-2xl gap-4">
            <CheckItem>
              <span>
                <strong className="font-bold text-ink">Save money.</strong> Inbox, processes, agents, meetings, deals — one stack.
              </span>
            </CheckItem>
            <CheckItem>
              <span>
                <strong className="font-bold text-ink">Save time.</strong> Entity → division → workstream context that never leaks.
              </span>
            </CheckItem>
            <CheckItem>
              <span>
                <strong className="font-bold text-ink">Create infinite leverage.</strong> AI agents propose; you approve; tools execute.
              </span>
            </CheckItem>
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="rounded-2xl bg-ink px-8 py-4 text-base font-bold text-white shadow-lg shadow-black/10 transition hover:bg-ink/90"
            >
              Get started. It&apos;s FREE
            </Link>
            <span className="text-sm font-medium text-muted">Free to start · No credit card · Multi-entity ready</span>
          </div>
        </div>
      </section>

      <section id="modules" className="border-b border-black/[0.06] bg-white px-5 py-4" aria-label="Product modules">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {MODULES.map((m) => (
              <ModuleTile key={m.name} {...m} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.06] bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            60% of operator context is lost between sheets, WhatsApp, and memory
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-muted">
            Work sprawl kills clarity. PivotOS unifies intake, execution, and AI — scoped per entity.
          </p>
        </div>
      </section>

      <section id="platform" className="border-b border-black/[0.06] bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            All entities, agents, and humans in PivotOS
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-medium text-muted">
            30+ capabilities to replace fragmented spreadsheets and inbox tabs.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {CAPABILITIES.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-black/[0.08] bg-slate-50 px-3.5 py-2 text-xs font-bold text-ink/75"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="brain" className="border-b border-black/[0.06] bg-gradient-to-b from-slate-50 to-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Pivot Brain</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              The only AI that actually knows your businesses
            </h2>
            <p className="mt-4 text-lg font-medium text-muted">
              Entity-scoped memory, ambient Today surfacing, and approval-safe execution — not a generic chat box.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BRAIN_FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/login" className="btn-primary px-8 py-3.5 text-base font-bold">
              Open Pivot OS
            </Link>
          </div>
        </div>
      </section>

      <section id="verticals" className="border-b border-black/[0.06] bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            AI workflows for every entity you run
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-medium text-muted">
            Your key operating rhythms — powered by PivotOS agents and processes.
          </p>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {VERTICALS.map((v) => (
              <article key={v.id} className="rounded-2xl border border-black/[0.06] bg-slate-50 p-8">
                <h3 className="text-xl font-extrabold tracking-tight text-ink">{v.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted">{v.lead}</p>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-muted">Replaces</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {v.replaces.map((r) => (
                    <span key={r} className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-ink/60 ring-1 ring-black/[0.06]">
                      {r}
                    </span>
                  ))}
                </div>
                <ul className="mt-5 space-y-2 text-sm font-semibold text-ink/85">
                  {v.outcomes.map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="text-emerald-600">→</span> {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-muted">Agents</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {v.agents.map((a) => (
                    <span key={a} className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-bold text-emerald-800">
                      {a}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built for operators who run many worlds at once
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-emerald-400">4+</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wide text-white/60">Entities unified</div>
              <p className="mt-2 text-sm text-white/70">DJ Eksteen, DigiKraal, Farm Feed, Northpoint — strict separation.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-emerald-400">100%</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wide text-white/60">Approval-safe</div>
              <p className="mt-2 text-sm text-white/70">Agents draft and propose. You approve before external sends.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-emerald-400">24/7</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wide text-white/60">Offline-ready</div>
              <p className="mt-2 text-sm text-white/70">Capture in the field. Sync when you&apos;re back online.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.06] bg-white px-5 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            All your entities. All your agents. One calm command centre.
          </h2>
          <p className="mt-4 text-lg font-medium text-muted">
            Universal Inbox → Processes → Agents → Tools → Approvals. The ClickUp clarity. The operator control.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="rounded-2xl bg-ink px-8 py-4 text-base font-bold text-white hover:bg-ink/90">
              Get started FREE
            </Link>
            <Link href="/today" className="rounded-2xl border border-black/10 bg-white px-8 py-4 text-base font-bold text-ink hover:bg-black/5">
              Open Today view
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-xs font-black text-white">P</span>
              PivotOS
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium text-muted">One command centre. Many entities. Zero context loss.</p>
          </div>
          <div className="flex flex-wrap gap-12 text-sm">
            <div>
              <p className="font-bold text-ink">Product</p>
              <ul className="mt-3 space-y-2 font-medium text-muted">
                <li><Link href="/today" className="hover:text-ink">Today</Link></li>
                <li><Link href="/inbox" className="hover:text-ink">Inbox</Link></li>
                <li><Link href="/agents" className="hover:text-ink">Agents</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-ink">Plan</p>
              <ul className="mt-3 space-y-2 font-medium text-muted">
                <li><a href="https://github.com/eksteen11/PivotOS" className="hover:text-ink" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><span>Offline-first · Supabase</span></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-black/[0.06] pt-6 text-center text-xs font-medium text-muted">
          © {new Date().getFullYear()} PivotOS · Inspired by ClickUp clarity, built for multi-entity operators
        </p>
      </footer>
    </>
  )
}
