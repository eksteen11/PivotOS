import { Link } from 'react-router-dom'

import { MarketingLanding } from './MarketingLanding'

export function HomePage() {
  return (
    <main className="marketingMain">
      <MarketingLanding />

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
          <div className="heroCtas heroCtasCenter">
            <Link className="btn btnInline accent" to="/command">
              Open Command Centre
            </Link>
            <Link className="btn btnInline secondary" to="/today">
              Open Today view
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
