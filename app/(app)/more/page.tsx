import Link from 'next/link'

const links = [
  { href: '/processes', label: 'Processes', desc: 'Workflows across your businesses' },
  { href: '/agents', label: 'AI Workforce', desc: 'Digital employees with approval gates' },
  { href: '/activity', label: 'Activity', desc: 'What people and agents did' },
  { href: '/map', label: 'Operating Map', desc: 'Companies, systems and live work' },
  { href: '/workspaces/northpoint', label: 'Northpoint', desc: 'First commercial lane' },
  { href: '/contacts', label: 'Contacts', desc: 'People linked to live work' },
  { href: '/documents', label: 'Documents', desc: 'Files linked to live work' },
  { href: '/tools', label: 'Integrations', desc: 'Connection status only' },
  { href: '/settings', label: 'Settings', desc: 'Account and local capture' },
]

export default function MorePage() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">The rest of Pivot</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">More</h1>
        <p className="mt-2 text-sm text-muted">Everything that is not in the daily five.</p>
      </div>
      <div className="grid gap-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block rounded-2xl border border-black/[0.07] bg-white/85 p-4 shadow-deck transition hover:border-accent/30">
            <h2 className="font-semibold">{l.label}</h2>
            <p className="mt-1 text-sm text-muted">{l.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
