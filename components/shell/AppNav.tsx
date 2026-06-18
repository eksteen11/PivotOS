'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const primary = [
  { href: '/today', label: 'Today' },
  { href: '/inbox', label: 'Inbox' },
  { href: '/processes', label: 'Processes' },
  { href: '/agents', label: 'Agents' },
  { href: '/more', label: 'More' },
]

export function AppNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
        {primary.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${active ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'}`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
