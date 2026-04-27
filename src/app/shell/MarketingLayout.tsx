import { Link, Outlet } from 'react-router-dom'

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function MarketingLayout() {
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
            <Link className="marketingNavLink" to="/settings">
              Connections
            </Link>
          </nav>
          <div className="marketingHeaderCtas">
            <Link className="btn btnInline btnSm accent" to="/command">
              Open app
            </Link>
            <Link className="btn btnInline btnSm secondary" to="/today">
              Today
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

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
              <Link to="/command">Command Centre</Link>
              <Link to="/today">Today</Link>
              <Link to="/inbox">Inbox</Link>
            </div>
            <div className="marketingFooterCol">
              <div className="marketingFooterColTitle">Work</div>
              <Link to="/tasks">Tasks</Link>
              <Link to="/meetings">Meetings</Link>
              <Link to="/deals">Deals</Link>
            </div>
            <div className="marketingFooterCol">
              <div className="marketingFooterColTitle">Company</div>
              <Link to="/settings">Settings</Link>
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
    </section>
  )
}
