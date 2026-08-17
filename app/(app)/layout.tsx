import { redirect } from 'next/navigation'

import { AppNav } from '@/components/shell/AppNav'
import { AppSidebar } from '@/components/shell/AppSidebar'
import { MobileChrome } from '@/components/shell/MobileChrome'
import { SyncRunner } from '@/components/providers/SyncRunner'
import { getEntities } from '@/lib/data/queries'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const entities = await getEntities()

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-72">
      <AppSidebar email={user.email ?? 'Founder'} entities={entities} />
      <div className="min-h-screen">
        <MobileChrome email={user.email ?? 'Founder'} entities={entities} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <AppNav />
      <SyncRunner />
    </div>
  )
}
