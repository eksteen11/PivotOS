import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { useSupabaseSession } from '../../lib/supabase/useSession'
import { useAuthModal } from '../shell/authModal/AuthModalContext'

export function JoinPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loading, session } = useSupabaseSession()
  const { openSignUp, openSignIn, openOffline } = useAuthModal()

  useEffect(() => {
    const m = searchParams.get('m')
    if (!m) return
    if (m === 'signin') openSignIn()
    else if (m === 'create' || m === 'signup') openSignUp()
    navigate('/home/join', { replace: true })
  }, [searchParams, navigate, openSignIn, openSignUp])

  if (!loading && session) {
    return <Navigate to="/command" replace />
  }

  return (
    <main className="marketingMain authPage">
      <div className="marketingContainer authPageNarrow">
        <Link to="/home" className="authBack">
          ← Back to overview
        </Link>

        <div className="joinPickCard">
          <h1 className="joinPickTitle">Join PivotOS</h1>
          <p className="joinPickLead">New here: sign up. Returning: sign in.</p>

          <div className="joinPickGrid">
            <button type="button" className="btn" onClick={() => openSignUp()}>
              Sign up
            </button>
            <button type="button" className="btn secondary" onClick={() => openSignIn()}>
              Sign in
            </button>
          </div>

          <button type="button" className="joinPickOffline" onClick={() => openOffline()}>
            Continue without an account (offline)
          </button>
        </div>
      </div>
    </main>
  )
}
