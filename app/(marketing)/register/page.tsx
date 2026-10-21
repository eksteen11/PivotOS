'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AuthConnectionBanner } from '@/components/auth/AuthConnectionBanner'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function RegisterPage() {
  const router = useRouter()
  const [seatOpen, setSeatOpen] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const sb = getSupabaseBrowser()
      if (!sb) {
        if (!cancelled) setSeatOpen(false)
        return
      }
      const { data, error: rpcError } = await sb.rpc('founder_seat_open')
      if (!cancelled) setSeatOpen(!rpcError && data === true)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    const sb = getSupabaseBrowser()
    if (!sb) {
      setError('Supabase not configured in .env.local')
      return
    }
    setBusy(true)
    try {
      const { data, error: signError } = await sb.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      })
      if (signError) {
        setError(signError.message.includes('not open')
          ? 'A founder already holds Pivot OS. Co-worker invitations are not open.'
          : signError.message)
        return
      }
      if (data.session) {
        router.push('/today')
        router.refresh()
        return
      }
      setNotice('Account created. Confirm the email if Supabase asks, then sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden bg-[#fbfaf5] px-5 py-12 sm:items-center">
      <section className="relative z-10 flex w-full max-w-sm flex-col gap-10">
        <Link href="/" className="text-center text-5xl font-extrabold tracking-[-0.06em] text-ink">Pivot OS</Link>
        <div className="w-full space-y-4 rounded-2xl border border-white/70 bg-white/55 p-5 shadow-deck backdrop-blur-xl sm:p-6">
          <div>
            <h1 className="text-lg font-semibold">Create the founder account</h1>
            <p className="mt-1 text-sm text-muted">This door is yours. Co-workers stay out until you invite them later.</p>
          </div>
          <AuthConnectionBanner />
          {seatOpen === null ? <p className="text-sm text-muted">Checking the founder seat…</p> : null}
          {seatOpen === false ? (
            <p className="text-sm leading-6 text-ink">A founder already holds this system. Co-worker access is not open yet.</p>
          ) : null}
          {seatOpen === true ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold">Email</span>
                <input className="field-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold">Password</span>
                <input className="field-input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold">Confirm password</span>
                <input className="field-input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </label>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              {notice ? <p className="text-sm leading-6 text-ink">{notice}</p> : null}
              <button type="submit" className="btn-primary w-full" disabled={busy}>
                {busy ? 'Creating…' : 'Create founder account'}
              </button>
            </form>
          ) : null}
          <Link href="/login" className="block text-center text-sm font-semibold text-accent">Back to sign in</Link>
        </div>
      </section>
    </main>
  )
}
