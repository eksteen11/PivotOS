import { PivotLanding } from '@/components/marketing/PivotLanding'
import { accountName } from '@/lib/auth/navigation'
import { hasSupabaseEnv } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function MarketingPage() {
  let signedIn = false
  let account: { name: string; email: string } | undefined
  if (hasSupabaseEnv) {
    try {
      const sb = await createClient()
      const { data } = await sb.auth.getUser()
      signedIn = Boolean(data.user)
      if (data.user) account = { name: accountName(data.user), email: data.user.email ?? '' }
    } catch {
      signedIn = false
    }
  }

  return (
    <div className="min-h-screen">
      <PivotLanding signedIn={signedIn} account={account} />
    </div>
  )
}
