'use client'

import { useRouter } from 'next/navigation'

import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function SettingsPage() {
  const router = useRouter()

  async function signOut() {
    const sb = getSupabaseBrowser()
    await sb?.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function resetLocal() {
    const { db } = await import('@/lib/db/db')
    await db.delete()
    window.location.reload()
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted">Account, sync, and local data.</p>
      </div>
      <div className="deck-card space-y-3">
        <button type="button" className="btn-secondary" onClick={() => void signOut()}>Sign out</button>
        <button type="button" className="btn-secondary" onClick={() => void resetLocal()}>Reset local cache</button>
      </div>
    </section>
  )
}
