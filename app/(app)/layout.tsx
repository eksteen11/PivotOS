import { redirect } from 'next/navigation'

import { AppNav } from '@/components/shell/AppNav'
import { SyncRunner } from '@/components/providers/SyncRunner'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Pivot OS</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <AppNav />
      <SyncRunner />
    </div>
  )
}
