'use client'
import Link from 'next/link'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Password recovery is temporarily unavailable.')
      const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` })
      if (error) throw error
      setSent(true)
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not request a reset. Please try again.') }
    finally { setBusy(false) }
  }
  return <AuthShell title="Let’s get you back in." description="We’ll send you a secure link to choose a new password.">
    {sent ? <p className="account-success" role="status">If an account exists for that address, a reset link has been sent. Check your inbox and spam folder.</p> : <form className="account-form" onSubmit={submit}><label className="account-field"><span>Email address</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} /></label>{error ? <p className="account-error" role="alert">{error}</p> : null}<button className="pivot-button account-submit" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button></form>}
    <Link className="account-text-link account-back" href="/login">← Back to sign in</Link>
  </AuthShell>
}
