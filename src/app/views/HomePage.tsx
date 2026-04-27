import { Link, Navigate, useSearchParams } from 'react-router-dom'

import { hasSupabaseEnv } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { MarketingLanding } from './MarketingLanding'

export function HomePage() {
  const [searchParams] = useSearchParams()
  const { loading, session } = useSupabaseSession()
  const showGuestAuth = hasSupabaseEnv && !loading && !session

  if (searchParams.get('signin') === '1') {
    return <Navigate to="/home/join?m=signin" replace />
  }

  return (
    <main className="marketingMain">
      {!hasSupabaseEnv ? (
        <p className="marketingContainer muted" style={{ paddingTop: 16, margin: 0 }}>
          Demo mode: add Supabase environment variables to enable sign-in and cloud sync.
        </p>
      ) : null}

      <MarketingLanding showGuestAuth={showGuestAuth} />

      <section className="marketingSection marketingSectionCta">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">How PivotOS works</h2>
          <p className="sectionLead sectionLeadCenter">Three steps. One calm operating rhythm.</p>
          <div className="howGrid">
            <div className="howCard">
              <div className="howStep">1</div>
              <div className="howTitle">Capture</div>
              <p className="howDesc">Everything lands in the Universal Inbox first — voice, paste, or type.</p>
            </div>
            <div className="howCard">
              <div className="howStep">2</div>
              <div className="howTitle">Prioritize</div>
              <p className="howDesc">Command Centre and Today show what matters now for the selected entity.</p>
            </div>
            <div className="howCard">
              <div className="howStep">3</div>
              <div className="howTitle">Execute</div>
              <p className="howDesc">Meetings, tasks, deals, and AI support run in one continuous flow.</p>
            </div>
          </div>
          {!showGuestAuth ? (
            <div className="heroCtas heroCtasCenter">
              <Link className="btn btnInline accent" to="/command">
                Open Command Centre
              </Link>
              <Link className="btn btnInline secondary" to="/today">
                Open Today view
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
