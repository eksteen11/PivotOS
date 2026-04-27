import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { hasSupabaseEnv, supabase } from '../../../lib/supabase/client'
import { useAuthModal } from './AuthModalContext'

export function AuthModalHost() {
  const { open, close } = useAuthModal()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  if (!open) return null

  return (
    <div className="authModalRoot" role="presentation">
      <button type="button" className="authModalBackdrop" aria-label="Close dialog" onClick={close} />
      <div className="authModalDialog" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button type="button" className="authModalClose" onClick={close} aria-label="Close">
          ×
        </button>
        {open.kind === 'signup' ? <SignUpModalBody onClose={close} /> : null}
        {open.kind === 'signin' ? <SignInModalBody onClose={close} /> : null}
        {open.kind === 'offline' ? <OfflineModalBody onClose={close} /> : null}
      </div>
    </div>
  )
}

function SignUpModalBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (!hasSupabaseEnv) {
    return (
      <>
        <p className="authPanelEyebrow">Account</p>
        <h2 id="auth-modal-title" className="authModalTitle">
          Sign up
        </h2>
        <p className="authPanelLead">Configure Supabase in your environment to enable accounts.</p>
      </>
    )
  }

  if (needsConfirm && sentTo) {
    return (
      <>
        <p className="authPanelEyebrow">Account</p>
        <h2 id="auth-modal-title" className="authModalTitle">
          Confirm your email
        </h2>
        <p className="authPanelLead">
          Supabase should send a link to <strong>{sentTo}</strong>. Open it, then use <strong>Sign in</strong> here.
        </p>
        <p className="authFineprint" style={{ marginTop: 12 }}>
          No email? Check spam and promotions. On free projects, delivery can be slow or blocked by your provider. In the
          Supabase dashboard go to <strong>Authentication → Users</strong> to see if the user was created, and{' '}
          <strong>Authentication → Providers → Email</strong> to turn off “Confirm email” while you develop (then sign-ups
          log in immediately).
        </p>
        <button
          type="button"
          className="btn secondary btnInline"
          style={{ marginTop: 16 }}
          onClick={() => {
            setNeedsConfirm(false)
            setSentTo(null)
            onClose()
          }}
        >
          Close
        </button>
      </>
    )
  }

  return (
    <>
      <p className="authPanelEyebrow">Account</p>
      <h2 id="auth-modal-title" className="authModalTitle">
        Sign up
      </h2>
      <p className="authPanelLead">Email and password. Your workspace is set up after you register.</p>
      {errorText ? (
        <div className="authError" role="alert">
          {errorText}
        </div>
      ) : null}
      <div className="authField">
        <label htmlFor="modal-su-email">Email</label>
        <input
          id="modal-su-email"
          className="authFieldInput"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="authField">
        <label htmlFor="modal-su-pw">Password</label>
        <input
          id="modal-su-pw"
          className="authFieldInput"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn"
        disabled={!email.trim() || !password || busy}
        onClick={async () => {
          const e = email.trim()
          const p = password
          if (!e || !p || !supabase) return
          if (p.length < 6) {
            setErrorText('Password must be at least 6 characters.')
            return
          }
          setBusy(true)
          setErrorText(null)
          const { data, error } = await supabase.auth.signUp({
            email: e,
            password: p,
            options: { emailRedirectTo: `${window.location.origin}/#/home/join` },
          })
          setBusy(false)
          if (error) {
            setErrorText(error.message)
            return
          }
          if (data.session) {
            onClose()
            navigate('/command', { replace: true })
            return
          }
          setSentTo(e)
          setNeedsConfirm(true)
        }}
      >
        {busy ? 'Please wait…' : 'Sign up'}
      </button>
      <p className="authFineprint">Already have an account? Close this and open Sign in.</p>
    </>
  )
}

function SignInModalBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  if (!hasSupabaseEnv) {
    return (
      <>
        <p className="authPanelEyebrow">Account</p>
        <h2 id="auth-modal-title" className="authModalTitle">
          Sign in
        </h2>
        <p className="authPanelLead">Configure Supabase to enable sign-in.</p>
      </>
    )
  }

  return (
    <>
      <p className="authPanelEyebrow">Account</p>
      <h2 id="auth-modal-title" className="authModalTitle">
        Sign in
      </h2>
      <p className="authPanelLead">Use the email and password you registered with.</p>
      {errorText ? (
        <div className="authError" role="alert">
          {errorText}
        </div>
      ) : null}
      <div className="authField">
        <label htmlFor="modal-si-email">Email</label>
        <input
          id="modal-si-email"
          className="authFieldInput"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="authField">
        <label htmlFor="modal-si-pw">Password</label>
        <input
          id="modal-si-pw"
          className="authFieldInput"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn"
        disabled={!email.trim() || !password || busy}
        onClick={async () => {
          const e = email.trim()
          const p = password
          if (!e || !p || !supabase) return
          setBusy(true)
          setErrorText(null)
          const { error } = await supabase.auth.signInWithPassword({ email: e, password: p })
          setBusy(false)
          if (error) {
            setErrorText(error.message)
          } else {
            onClose()
            navigate('/command', { replace: true })
          }
        }}
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="authFineprint">Need an account? Close this and choose Sign up.</p>
    </>
  )
}

function OfflineModalBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <>
      <p className="authPanelEyebrow">Account</p>
      <h2 id="auth-modal-title" className="authModalTitle">
        Continue offline
      </h2>
      <p className="authPanelLead">Data stays on this device until you add an account later.</p>
      <button
        type="button"
        className="btn"
        onClick={() => {
          try {
            localStorage.setItem('pivotos.offline.allowed', '1')
          } catch {}
          onClose()
          navigate('/command', { replace: true })
        }}
      >
        Open PivotOS
      </button>
    </>
  )
}
