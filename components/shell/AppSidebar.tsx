'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EntityScopeBar } from '@/components/shell/EntityScopeBar'
import { NavIcon, type NavIconName } from '@/components/shell/NavIcon'
import { useEntityScope } from '@/lib/hooks/useEntityScope'
import type { Entity } from '@/lib/types/database'

const primary = [
  { href: '/today', label: 'Command Centre', icon: 'home' },
  { href: '/inbox', label: 'Universal Inbox', icon: 'inbox' },
  { href: '/approvals', label: 'Approvals', icon: 'approval' },
  { href: '/meetings', label: 'Meetings', icon: 'calendar' },
  { href: '/activity', label: 'Activity', icon: 'activity' },
] satisfies { href: string; label: string; icon: NavIconName }[]

const systems = [
  { href: '/processes', label: 'Processes', icon: 'process' },
  { href: '/agents', label: 'AI Workforce', icon: 'agent' },
  { href: '/map', label: 'Operating Map', icon: 'map' },
  { href: '/workspaces/northpoint', label: 'Northpoint', icon: 'home' },
  { href: '/tools', label: 'Integrations', icon: 'tools' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
] satisfies { href: string; label: string; icon: NavIconName }[]

type Props = {
  email: string
  entities: Entity[]
}

export function AppSidebar({ email, entities }: Props) {
  const pathname = usePathname()
  const { entitySlug, setScope } = useEntityScope(entities)
  const linkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`)
    return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
      active ? 'bg-accent text-white shadow-sm' : 'text-ink/70 hover:bg-accent/10 hover:text-accent'
    }`
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-black/[0.06] bg-white/80 px-5 py-6 backdrop-blur-xl lg:flex">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Pivot OS</p>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight">DJ&apos;s Pivot account</h1>
        <p className="mt-1 truncate text-xs text-muted">{email}</p>
      </div>

      <nav className="space-y-1" aria-label="Primary navigation">
        {primary.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            <NavIcon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-7">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Your businesses</p>
        <EntityScopeBar entities={entities} value={entitySlug} onChange={setScope} />
        <p className="mt-2 px-3 text-xs leading-5 text-muted">Private, Digikraal divisions, Farm Feed and Northpoint stay inside this account.</p>
      </div>

      <nav className="mt-7 space-y-1 border-t border-black/5 pt-5" aria-label="System navigation">
        {systems.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            <NavIcon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
