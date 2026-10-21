'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function ClosedPage() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function signOut() {
    setBusy(true)
    const sb = getSupabaseBrowser()
    if (sb) await sb.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F3EC] px-5">
      <section className="max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-[-0.04em]">This door is the founder’s</h1>
        <p className="text-[15px] leading-6 text-[#5c5c5c]">
          Pivot OS stays private. A co-worker account cannot open it. Invitations are not turned on.
        </p>
        <button type="button" onClick={signOut} className="btn-primary" disabled={busy}>
          {busy ? 'Signing out…' : 'Sign out'}
        </button>
      </section>
    </main>
  )
}
