import { PivotLanding } from '@/components/marketing/PivotLanding'
import { hasSupabaseEnv } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function MarketingPage() {
  let signedIn = false
  if (hasSupabaseEnv) {
    try {
      const sb = await createClient()
      const { data } = await sb.auth.getUser()
      signedIn = Boolean(data.user)
    } catch {
      signedIn = false
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F3EC] text-[#1A1C1C]">
      <PivotLanding signedIn={signedIn} />
    </main>
  )
}
