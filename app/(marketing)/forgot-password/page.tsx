'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { recoveryMessage } from '@/lib/auth/recovery'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [retryAt, setRetryAt] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const emailInput = useRef<HTMLInputElement>(null)
  const confirmation = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (!retryAt) return
    const tick = () => setRemaining(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)))
    tick(); const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [retryAt])
  useEffect(() => { if (sent) confirmation.current?.focus() }, [sent])
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy || Date.now() < retryAt) return
    setBusy(true); setError('')
    // The cooldown applies even if the connection fails after the provider accepts a request.
    setRemaining(60); setRetryAt(Date.now() + 60_000)
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Recovery unavailable')
      const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` })
      if (error) throw error
      setSent(true)
    } catch (error) { setError(recoveryMessage(error)) }
    finally { setBusy(false) }
  }
  return <AuthShell title="Let’s get you back in." description="We’ll send you a secure link to choose a new password.">
    <form className="account-form" onSubmit={submit}>
      {sent ? <><p ref={confirmation} tabIndex={-1} className="account-success" role="status">If an account exists for that address, a reset link has been sent. Check your inbox and spam folder.</p><p className="account-hint">Requested for <strong>{email.trim()}</strong>. Use the newest email and open it in this browser.</p></> : <label className="account-field"><span>Email address</span><input ref={emailInput} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} /></label>}
      {error ? <p className="account-error" role="alert">{error}</p> : null}
      <button className="pivot-button account-submit" disabled={busy || remaining > 0}>{busy ? 'Sending…' : remaining > 0 ? `Try again in ${remaining}s` : sent ? 'Resend reset link' : 'Send reset link'}</button>
      {sent ? <button type="button" className="account-text-link" disabled={busy} onClick={() => { setSent(false); setError(''); requestAnimationFrame(() => emailInput.current?.focus()) }}>Use a different email address</button> : null}
      <p className="account-hint">Links expire after one hour. Requesting a link does not change your password.</p>
    </form>
    <Link className="account-text-link account-back" href="/login">← Back to sign in</Link>
  </AuthShell>
}
