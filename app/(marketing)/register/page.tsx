'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { AuthConnectionBanner } from '@/components/auth/AuthConnectionBanner'
import { PasswordField } from '@/components/auth/PasswordField'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function RegisterPage() {
  const router = useRouter()
  const [available, setAvailable] = useState<boolean | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        const sb = getSupabaseBrowser()
        if (!sb) throw new Error('Account creation is temporarily unavailable.')
        const { data, error } = await sb.rpc('account_registration_open')
        if (!cancelled) { setAvailable(!error && data === true); if (error) setError('Account registration is being set up. Please try again later.') }
      } catch { if (!cancelled) { setAvailable(false); setError('Could not check account registration. Please try again later.') } }
    }
    void check()
    return () => { cancelled = true }
  }, [])
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setNotice('')
    if (!available) return
    if (password !== confirm) { setError('The two passwords do not match.'); return }
    setBusy(true)
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Account creation is temporarily unavailable.')
      const { data, error } = await sb.auth.signUp({ email: email.trim(), password, options: { data: { display_name: displayName.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/today` } })
      if (error) throw error
      if (data.session) { router.replace('/today'); router.refresh(); return }
      setNotice('Check your email for a confirmation link. If you already have an account, sign in or reset your password.')
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not create your account. Please try again.') }
    finally { setBusy(false) }
  }
  return <AuthShell title={available === false ? "By invitation. By design." : "Make room for momentum."} description={available === false ? "Your work belongs in a private workspace." : "Create your account and a private place for your work."}>
    <AuthConnectionBanner />
    {available === null ? <p role="status">Checking account availability…</p> : null}
    {available === false ? <p className="account-notice">Pivot is private. Sign in with your existing account. Teammates will join through invitations when team sharing opens.</p> : null}
    {notice ? <div className="account-success" role="status">{notice}<button type="button" className="account-text-link" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { const sb = getSupabaseBrowser(); if (!sb) throw new Error('Email is unavailable. Please try again.'); const { error } = await sb.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/today` } }); if (error) throw error; setNotice('Confirmation email requested. Check your inbox and spam folder.') } catch (error) { setError(error instanceof Error ? error.message : 'Could not resend. Please try again.') } finally { setBusy(false) } }}>Resend confirmation email</button></div> : available === true ? <form onSubmit={submit} className="account-form">
      <label className="account-field"><span>Your name</span><input autoComplete="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} minLength={2} maxLength={80} required /></label>
      <label className="account-field"><span>Email address</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} required /></label>
      <PasswordField value={password} onChange={setPassword} autoComplete="new-password" minLength={12} />
      <p className="account-hint">Use at least 12 characters. A unique passphrase works well.</p>
      <PasswordField label="Confirm password" value={confirm} onChange={setConfirm} autoComplete="new-password" minLength={12} />
      <button className="pivot-button account-submit" disabled={busy || !available}>{busy ? 'Creating your account…' : 'Create account →'}</button>
    </form> : null}
    {error ? <p role="alert" className="account-error">{error}</p> : null}
    <p className="account-form-foot">Already have an account? <Link href="/login">Sign in</Link></p>
  </AuthShell>
}
