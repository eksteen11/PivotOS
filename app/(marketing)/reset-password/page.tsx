'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordField } from '@/components/auth/PasswordField'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    const sb = getSupabaseBrowser()
    if (!sb) { setError('Password recovery is temporarily unavailable.'); return }
    void sb.auth.getUser().then(({ data, error }) => { if (!cancelled) { setReady(Boolean(data.user) && !error); if (!data.user || error) setError('Open a valid password reset link from your email to continue.') } }).catch(() => { if (!cancelled) setError('Could not verify the reset link. Request a new one.') })
    return () => { cancelled = true }
  }, [])
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('The two passwords do not match.'); return }
    setBusy(true)
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Password recovery is temporarily unavailable.')
      const { error } = await sb.auth.updateUser({ password })
      if (error) throw error
      const { error: signOutError } = await sb.auth.signOut({ scope: 'global' })
      setDone(true)
      if (signOutError) setError('Your password was updated, but signing out did not complete. Open Account & security to sign out your other sessions.')
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not update your password.') }
    finally { setBusy(false) }
  }
  return <AuthShell title={done ? 'You’re all set.' : 'A fresh start.'} description={done ? 'Your password has been updated. Sign in with your new password.' : 'Choose a unique password for your Pivot account.'}>
    {!done ? <form onSubmit={submit} className="account-form"><PasswordField label="New password" autoComplete="new-password" minLength={12} value={password} onChange={setPassword} /><p className="account-hint">At least 12 characters.</p><PasswordField label="Confirm password" autoComplete="new-password" minLength={12} value={confirm} onChange={setConfirm} />{error ? <p className="account-error" role="alert">{error}</p> : null}<button disabled={!ready || busy} className="pivot-button account-submit">{busy ? 'Updating…' : 'Save new password'}</button></form> : null}
    {done && error ? <p className="account-error" role="alert">{error}</p> : null}
    <Link className="account-text-link account-back" href={done ? '/login' : '/forgot-password'}>{done ? 'Sign in →' : 'Request a new reset link'}</Link>
  </AuthShell>
}
