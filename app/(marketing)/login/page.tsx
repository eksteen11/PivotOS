'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { AuthConnectionBanner } from '@/components/auth/AuthConnectionBanner'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/today'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const sb = getSupabaseBrowser()
    if (!sb) {
      setError('Supabase not configured in .env.local')
      setBusy(false)
      return
    }
    try {
      const result = await Promise.race([
        sb.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Supabase timed out — project URL may be down')), 12000)),
      ])
      if (result.error) {
        setError(result.error.message)
        return
      }
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach Supabase')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 rounded-2xl border border-white/70 bg-white/55 p-5 shadow-deck backdrop-blur-xl sm:p-6">
      <div>
        <h1 className="text-lg font-semibold">Enter your system</h1>
        <p className="mt-1 text-sm text-muted">Private, secure access to Pivot OS.</p>
      </div>
      <AuthConnectionBanner />
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Email</span>
        <input
          className="field-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Password</span>
        <input
          className="field-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? 'Entering…' : 'Enter system →'}
      </button>
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Private founder access</p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden bg-[#fbfaf5] px-5 py-12 sm:items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(23,114,75,0.10),transparent_28rem),radial-gradient(circle_at_20%_75%,rgba(214,205,184,0.36),transparent_24rem)]" />
      <section className="relative z-10 flex w-full max-w-sm flex-col justify-between gap-16 sm:justify-center">
        <div className="pt-8 text-center sm:pt-0">
          <p className="text-6xl font-extrabold tracking-[-0.09em] text-ink sm:text-7xl">PIVOT</p>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.36em] text-accent">Clear Horizon OS</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  )
}
