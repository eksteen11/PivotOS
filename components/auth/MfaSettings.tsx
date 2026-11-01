'use client'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

type Setup = { id: string; qr: string; secret: string }
export function MfaSettings() {
  const [enabled, setEnabled] = useState(false)
  const [available, setAvailable] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [setup, setSetup] = useState<Setup | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState<string[]>([])
  useEffect(() => {
    let active = true
    async function load() {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Unavailable')
      const [readiness, factors] = await Promise.all([sb.rpc('account_mfa_ready'), sb.auth.mfa.listFactors()])
      if (factors.error) throw factors.error
      if (active) {
        setAvailable(!readiness.error && readiness.data === true)
        setEnabled(factors.data.totp.some((factor) => factor.status === 'verified'))
        setPending(factors.data.all.filter((factor) => factor.factor_type === 'totp' && factor.status === 'unverified').map((factor) => factor.id))
      }
    }
    void load().catch(() => { if (active) setError('Could not load authenticator settings. Refresh to try again.') }).finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])
  async function start() {
    setBusy(true); setError(''); setNotice('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb || !available) throw new Error('Unavailable')
      const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Pivot authenticator', issuer: 'Pivot OS' })
      if (error) throw error
      // Keep setup material in this mounted component only, never storage, URLs or logs.
      setSetup({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret })
    } catch { setError('Could not start authenticator setup. Please try again.') }
    finally { setBusy(false) }
  }
  async function cancel() {
    setBusy(true); setError('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Unavailable')
      for (const factorId of setup ? [setup.id] : pending) {
        const { error } = await sb.auth.mfa.unenroll({ factorId })
        if (error) throw error
      }
      setSetup(null); setPending([]); setCode('')
    } catch { setError('Could not cancel the unfinished setup. Please try again.') }
    finally { setBusy(false) }
  }
  async function verify(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb || !setup) throw new Error('Unavailable')
      const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: setup.id, code })
      if (error) throw error
      setSetup(null); setCode(''); setEnabled(true); setNotice('Authenticator protection is on. Future sign-ins will ask for a code.')
    } catch { setCode(''); setError('That code could not be verified. Use the latest code from your authenticator and try again.') }
    finally { setBusy(false) }
  }
  return <section className="account-panel" aria-labelledby="authenticator-heading"><h2 id="authenticator-heading">Authenticator protection</h2><p className="account-lead">Add a second check when signing in to Pivot.</p>{error ? <p className="account-error" role="alert">{error}</p> : null}{notice ? <p className="account-success" role="status">{notice}</p> : null}{!loaded ? <p>Checking protection…</p> : enabled ? <><p className="account-success">Authenticator enabled</p><p className="account-hint">Keep your authenticator backed up. If you lose it, the workspace owner must recover access through Supabase. Resetting your password does not remove this protection.</p></> : !available ? <p className="account-hint">Authenticator setup will be available once the workspace security update is applied.</p> : setup ? <form className="account-form" onSubmit={verify}><p>Scan this code with your authenticator app. Back up the authenticator before continuing.</p>{/* Supabase supplies the inline QR data image. */}<img src={setup.qr} alt="Scan this private setup code with your authenticator" width={220} height={220} /><details><summary>Can’t scan the code?</summary><p className="account-hint">Enter this setup key manually. Keep it private.</p><code style={{ overflowWrap: 'anywhere' }}>{setup.secret}</code></details><label className="account-field"><span>Six-digit authenticator code</span><input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} /></label><button className="pivot-button" disabled={busy}>{busy ? 'Verifying…' : 'Enable authenticator'}</button><button type="button" className="account-text-link" disabled={busy} onClick={() => void cancel()}>Cancel setup</button></form> : pending.length ? <><p className="account-hint">An unfinished setup was found. Clear it to start again; it has not enabled protection.</p><button className="pivot-button-secondary" disabled={busy} onClick={() => void cancel()}>Clear unfinished setup</button></> : <><p className="account-hint">After setup, your password and authenticator code will both be needed. Keep a secure backup of your authenticator.</p><button className="pivot-button-secondary" disabled={busy} onClick={() => void start()}>{busy ? 'Starting…' : 'Set up authenticator'}</button></>}</section>
}
