import { useMemo, useState } from 'react'

import { hasSupabaseEnv, supabase } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { MarketingLanding } from '../views/MarketingLanding'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, session } = useSupabaseSession()
  const [method, setMethod] = useState<'magic' | 'password' | 'offline'>(() => {
    try {
      return localStorage.getItem('pivotos.auth.method') === 'password' ? 'password' : 'magic'
    } catch {
      return 'magic'
    }
  })
  const [offlineAllowed, setOfflineAllowed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pivotos.offline.allowed') === '1'
    } catch {
      return false
    }
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorText, setErrorText] = useState<string | null>(null)

  const message = useMemo(() => {
    if (!hasSupabaseEnv) return 'Demo mode: add Supabase env vars to enable sync + login.'
    if (loading) return 'Checking session…'
    if (session) return null
    if (method === 'offline') return 'Offline mode: no sync or AI.'
    if (status === 'sent') return 'Check your email for the sign-in link.'
    if (status === 'error') return errorText ? `Could not send link: ${errorText}` : 'Could not send link. Try again.'
    return 'Sign in to sync across devices.'
  }, [errorText, loading, method, session, status])

  if (!hasSupabaseEnv) {
    return (
      <>
        {children}
        <div style={{ padding: 12, maxWidth: 980, margin: '0 auto', color: 'rgba(232, 238, 252, 0.68)' }}>
          {message}
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <section className="content">
        <div className="contentInner">
          <div className="card">
            <h2 className="cardTitle">PivotOS</h2>
            <p className="muted" style={{ margin: 0 }}>
              {message}
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (session) return <>{children}</>
  if (offlineAllowed) return <>{children}</>

  return (
    <section className="content">
      <div className="contentInner">
        <MarketingLanding
          onPrimary={() => {
            setMethod('magic')
            try {
              localStorage.setItem('pivotos.auth.method', 'magic')
            } catch {}
          }}
        />

        <div id="pivotos-sign-in" className="card" style={{ marginTop: 12 }}>
          <h2 className="cardTitle">Sign in</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            {message}
          </p>
          <p className="muted" style={{ marginTop: 0, fontSize: 12 }}>
            Choose a method, then continue into your Global Command Centre.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setMethod('magic')
                try {
                  localStorage.setItem('pivotos.auth.method', 'magic')
                } catch {}
              }}
              style={{
                opacity: method === 'magic' ? 1 : 0.55,
                borderColor: method === 'magic' ? 'rgba(0, 231, 133, 0.5)' : 'rgba(26, 28, 28, 0.12)',
              }}
            >
              Email link
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setMethod('password')
                try {
                  localStorage.setItem('pivotos.auth.method', 'password')
                } catch {}
              }}
              style={{
                opacity: method === 'password' ? 1 : 0.55,
                borderColor: method === 'password' ? 'rgba(0, 231, 133, 0.5)' : 'rgba(26, 28, 28, 0.12)',
              }}
            >
              Password
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => setMethod('offline')}
              style={{
                opacity: method === 'offline' ? 1 : 0.55,
                borderColor: method === 'offline' ? 'rgba(0, 231, 133, 0.5)' : 'rgba(26, 28, 28, 0.12)',
              }}
            >
              Offline
            </button>
          </div>

          {method === 'password' ? (
            <>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Email</label>
                <input
                  style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Password</label>
                <input
                  style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="btn"
                type="button"
                onClick={async () => {
                  const e = email.trim()
                  const p = password
                  if (!e || !p || !supabase) return
                  setStatus('sending')
                  setErrorText(null)
                  const { error } = await supabase.auth.signInWithPassword({ email: e, password: p })
                  if (error) {
                    setErrorText(error.message)
                    setStatus('error')
                  } else {
                    setStatus('idle')
                  }
                }}
                disabled={!email.trim() || !password || status === 'sending'}
              >
                Sign in
              </button>
              <p className="muted" style={{ marginBottom: 0 }}>
                If you don’t have a password user yet, create one once in Supabase → Authentication → Users.
              </p>
            </>
          ) : method === 'offline' ? (
            <>
              <p className="muted" style={{ marginTop: 0 }}>
                Use the app now. Data stays on this device until you sign in later.
              </p>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setOfflineAllowed(true)
                  try {
                    localStorage.setItem('pivotos.offline.allowed', '1')
                  } catch {}
                }}
              >
                Continue offline
              </button>
            </>
          ) : (
            <>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Email</label>
            <input
              style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="btn"
            type="button"
            onClick={async () => {
              const trimmed = email.trim()
              if (!trimmed || !supabase) return
              setStatus('sending')
              setErrorText(null)
              const { error } = await supabase.auth.signInWithOtp({
                email: trimmed,
                options: { emailRedirectTo: window.location.origin },
              })
              if (error) {
                setErrorText(error.message)
                setStatus('error')
              } else {
                setStatus('sent')
              }
            }}
            disabled={!email.trim() || status === 'sending'}
          >
            Send sign-in link
          </button>
          <p className="muted" style={{ marginBottom: 0 }}>
            If you hit email limits, use Password or Offline.
          </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

