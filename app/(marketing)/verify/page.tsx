'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthShell } from '@/components/auth/AuthShell'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { needsSecondFactor } from '@/lib/auth/mfa'
import { safeNextPath } from '@/lib/auth/navigation'
function Verification() {
  const params = useSearchParams()
  const next = safeNextPath(params.get('next'))
  const [factors, setFactors] = useState<{ id: string; friendly_name?: string }[]>([])
  const [factorId, setFactorId] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    async function load() {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Sign-in is temporarily unavailable.')
      const { data: userData } = await sb.auth.getUser()
      if (!userData.user) { window.location.replace(`/login?next=${encodeURIComponent(next)}`); return }
      if (!await needsSecondFactor(sb)) { window.location.replace(next); return }
      const { data, error } = await sb.auth.mfa.listFactors()
      if (error) throw error
      if (active) { setFactors(data.totp); setFactorId(data.totp[0]?.id || ''); if (!data.totp.length) setError('No authenticator was found. Contact the workspace owner for help.') }
    }
    void load().catch(() => { if (active) setError('Could not load sign-in protection. Refresh to try again.') })
    return () => { active = false }
  }, [next])
  async function verify(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb || !factorId) throw new Error('No authenticator available')
      const { error } = await sb.auth.mfa.challengeAndVerify({ factorId, code })
      if (error) throw error
      setCode(''); window.location.replace(next)
    } catch { setCode(''); setError('That code could not be verified. Use the latest code from your authenticator and try again.') }
    finally { setBusy(false) }
  }
  async function signOut() {
    const sb = getSupabaseBrowser()
    if (!sb) return
    const { error } = await sb.auth.signOut({ scope: 'local' })
    if (error) { setError('Could not sign out. Please try again.'); return }
    window.location.assign('/login')
  }
  return <form className="account-form" onSubmit={verify}>{factors.length > 1 ? <label className="account-field"><span>Authenticator</span><select value={factorId} onChange={(e) => setFactorId(e.target.value)}>{factors.map((factor) => <option key={factor.id} value={factor.id}>{factor.friendly_name || 'Authenticator'}</option>)}</select></label> : null}<label className="account-field"><span>Six-digit code</span><input autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} /></label>{error ? <p className="account-error" role="alert">{error}</p> : null}<button className="pivot-button account-submit" disabled={busy || !factorId}>{busy ? 'Verifying…' : 'Verify and continue'}</button><p className="account-hint">Lost access to your authenticator? The workspace owner must recover access through Supabase. A password-reset email does not remove this protection.</p><button className="account-text-link" type="button" disabled={busy} onClick={() => void signOut()}>Sign out and use another account</button></form>
}
export default function VerifyPage() {
  return <AuthShell title="One more check." description="Enter the code from your authenticator to unlock your workspace."><Suspense fallback={<p>Loading sign-in protection…</p>}><Verification /></Suspense></AuthShell>
}
