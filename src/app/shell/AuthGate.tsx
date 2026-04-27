import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { hasSupabaseEnv } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, session } = useSupabaseSession()
  const [offlineAllowed] = useState(() => {
    try {
      return localStorage.getItem('pivotos.offline.allowed') === '1'
    } catch {
      return false
    }
  })

  const message = !hasSupabaseEnv
    ? 'Demo mode: add Supabase env vars to enable sync + login.'
    : loading
      ? 'Checking session…'
      : null

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

  return <Navigate to="/home/join?m=signin" replace />
}
