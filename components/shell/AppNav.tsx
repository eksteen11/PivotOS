'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavIcon, type NavIconName } from '@/components/shell/NavIcon'

const primary = [
  { href: '/today', label: 'Home', icon: 'home' },
  { href: '/inbox', label: 'Inbox', icon: 'inbox' },
  { href: '/approvals', label: 'Approvals', icon: 'approval' },
  { href: '/meetings', label: 'Meetings', icon: 'calendar' },
  { href: '/more', label: 'More', icon: 'more' },
] satisfies { href: string; label: string; icon: NavIconName }[]

export function AppNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 px-2 py-2">
        {primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${
              isActive(item.href) ? 'text-accent' : 'text-muted hover:text-ink'
            }`}
          >
            {isActive(item.href) ? <span className="absolute top-0 h-0.5 w-5 rounded-full bg-accent" /> : null}
            <NavIcon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
