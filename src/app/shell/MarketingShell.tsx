import { Link, Outlet } from 'react-router-dom'

import { useSupabaseSession } from '../../lib/supabase/useSession'
import { AccountMenu } from './AccountMenu'
import { useAuthModal } from './authModal/AuthModalContext'
import { AuthModalHost } from './authModal/AuthModalHost'

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const joinPath = '/home/join' as const

type Props = {
  children?: React.ReactNode
}

/**
 * Shared marketing chrome (header + footer). Pass children, or omit to render an Outlet (layout route).
 */
export function MarketingShell({ children }: Props) {
  const { loading, session } = useSupabaseSession()
  const authed = Boolean(session)
  const { openSignUp, openSignIn } = useAuthModal()

  return (
    <section className="marketingShell">
      <header className="marketingHeader">
        <div className="marketingHeaderInner">
          <Link to="/home" className="marketingLogo" aria-label="PivotOS home">
            <span className="marketingLogoMark" aria-hidden />
            <span className="marketingLogoWord">PivotOS</span>
          </Link>
          <nav className="marketingNav" aria-label="Marketing">
            <button type="button" className="marketingNavLink" onClick={() => scrollToSection('marketing-product')}>
              Product
            </button>
            <button type="button" className="marketingNavLink" onClick={() => scrollToSection('marketing-entities')}>
              Entities
            </button>
            <button type="button" className="marketingNavLink" onClick={() => scrollToSection('marketing-ai')}>
              AI
            </button>
            <button type="button" className="marketingNavLink" onClick={() => scrollToSection('marketing-meetings')}>
              Meetings
            </button>
            {authed ? (
              <Link className="marketingNavLink" to="/settings">
                Settings
              </Link>
            ) : null}
          </nav>
          <div className="marketingHeaderCtas">
            {loading || !authed ? (
              <>
                <button type="button" className="btn btnInline btnSm secondary" onClick={() => openSignIn()}>
                  Sign in
                </button>
                <button type="button" className="btn btnInline btnSm accent" onClick={() => openSignUp()}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                <Link className="btn btnInline btnSm accent" to="/command">
                  Open app
                </Link>
                <Link className="btn btnInline btnSm secondary" to="/today">
                  Today
                </Link>
                <AccountMenu variant="marketing" />
              </>
            )}
          </div>
        </div>
      </header>

      {children ?? <Outlet />}

      <footer className="marketingFooter">
        <div className="marketingFooterInner">
          <div className="marketingFooterBrand">
            <span className="marketingLogoMark marketingLogoMarkSm" aria-hidden />
            <span className="marketingFooterTitle">PivotOS</span>
            <p className="marketingFooterTagline">One command centre. Many entities. Zero context loss.</p>
          </div>
          <div className="marketingFooterCols">
            <div className="marketingFooterCol">
              <div className="marketingFooterColTitle">Product</div>
              {authed ? (
                <>
                  <Link to="/command">Command Centre</Link>
                  <Link to="/today">Today</Link>
                  <Link to="/inbox">Inbox</Link>
                </>
              ) : (
                <>
                  <Link to={joinPath}>Command Centre</Link>
                  <Link to={joinPath}>Today</Link>
                  <Link to={joinPath}>Inbox</Link>
                </>
              )}
            </div>
            <div className="marketingFooterCol">
              <div className="marketingFooterColTitle">Work</div>
              {authed ? (
                <>
                  <Link to="/tasks">Tasks</Link>
                  <Link to="/meetings">Meetings</Link>
                  <Link to="/deals">Deals</Link>
                </>
              ) : (
                <>
                  <Link to={joinPath}>Tasks</Link>
                  <Link to={joinPath}>Meetings</Link>
                  <Link to={joinPath}>Deals</Link>
                </>
              )}
            </div>
            <div className="marketingFooterCol">
              <div className="marketingFooterColTitle">Company</div>
              {authed ? (
                <Link to="/settings">Settings</Link>
              ) : (
                <Link to={joinPath}>Settings</Link>
              )}
              <a href="https://stitch.withgoogle.com/" target="_blank" rel="noopener noreferrer">
                Design (Stitch)
              </a>
            </div>
          </div>
        </div>
        <div className="marketingFooterBottom">
          <span>© {new Date().getFullYear()} PivotOS</span>
          <span className="marketingFooterDot" aria-hidden />
          <span>Offline-first · Supabase sync</span>
        </div>
      </footer>

      <AuthModalHost />
    </section>
  )
}
