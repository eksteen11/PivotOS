'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { AuthConnectionBanner } from '@/components/auth/AuthConnectionBanner'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordField } from '@/components/auth/PasswordField'
import { safeNextPath } from '@/lib/auth/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Sign-in is temporarily unavailable. Please try again shortly.')
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      router.replace(safeNextPath(params.get('next'))); router.refresh()
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not sign in. Please try again.') }
    finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="account-form">
    <AuthConnectionBanner />
    {params.get('error') ? <p className="account-error" role="alert">That email link is invalid or has expired. Request a new link below.</p> : null}
    {params.get('confirmed') ? <p className="account-success" role="status">Email confirmed. You can sign in now.</p> : null}
    <label className="account-field"><span>Email address</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} /></label>
    <PasswordField value={password} onChange={setPassword} />
    <Link href="/forgot-password" className="account-text-link account-forgot">Forgot password?</Link>
    {error ? <p className="account-error" role="alert">{error}</p> : null}
    <button className="pivot-button account-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in →'}</button>
    <p className="account-form-foot">Joining Pivot? <Link href="/register">Account access</Link></p>
  </form>
}
export default function LoginPage() {
  return <AuthShell title="Welcome back." description="A little clarity starts here. Sign in to your workspace."><Suspense fallback={<p>Loading sign-in…</p>}><LoginForm /></Suspense></AuthShell>
}
