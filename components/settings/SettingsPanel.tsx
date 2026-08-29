'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getSupabaseBrowser } from '@/lib/supabase/browser'

export function SettingsPanel({ allowDemoReset }: { allowDemoReset: boolean }) {
  const router = useRouter()
  const [resetState, setResetState] = useState<'idle' | 'working' | 'done' | 'error'>('idle')

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

  async function resetCloudDemo() {
    if (!window.confirm('Restore seeded example workflows? This does not change your private records.')) return
    setResetState('working')
    const response = await fetch('/api/demo/reset', { method: 'POST' })
    setResetState(response.ok ? 'done' : 'error')
    if (response.ok) router.refresh()
  }

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Account</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted">Private founder access. Collaborator invites stay off until a pilot is approved.</p>
      </div>
      <div className="space-y-3 rounded-2xl border border-black/[0.07] bg-white/85 p-5 shadow-deck">
        <button type="button" className="btn-secondary w-full" onClick={() => void signOut()}>Sign out</button>
        <button type="button" className="btn-secondary w-full" onClick={() => void resetLocal()}>Clear offline capture cache</button>
        {allowDemoReset ? (
          <div className="border-t border-black/[0.07] pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Development only</p>
            <button
              type="button"
              className="btn-secondary mt-3 w-full"
              disabled={resetState === 'working'}
              onClick={() => void resetCloudDemo()}
            >
              {resetState === 'working' ? 'Restoring examples…' : 'Restore example workflows'}
            </button>
            <p className="mt-2 text-xs leading-5 text-muted">Only seeded example workflows are replaced. Your account and businesses stay intact.</p>
            {resetState === 'done' && <p className="mt-2 text-sm font-semibold text-accent">Example workflows restored.</p>}
            {resetState === 'error' && <p className="mt-2 text-sm font-semibold text-danger">Restore failed. Try again.</p>}
          </div>
        ) : null}
      </div>
    </section>
  )
}
