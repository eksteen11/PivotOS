import Link from 'next/link'

const links = [
  { href: '/tools', label: 'Tools', desc: 'Connect Gmail, Xero, WhatsApp…' },
  { href: '/approvals', label: 'Approvals', desc: 'Review agent actions' },
  { href: '/settings', label: 'Settings', desc: 'Account and sync' },
]

export default function MorePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">More</h1>
        <p className="mt-1 text-muted">Tools, approvals, and settings.</p>
      </div>
      <div className="grid gap-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="deck-card block hover:border-accent/30">
            <h2 className="font-semibold">{l.label}</h2>
            <p className="mt-1 text-sm text-muted">{l.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
