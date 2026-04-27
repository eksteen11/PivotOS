import { Link } from 'react-router-dom'

/** Guests: no hero buttons (use header). Signed in: app CTAs. */
export function MarketingLanding({ showGuestAuth }: { showGuestAuth?: boolean }) {
  return (
    <>
      <section className="marketingHero" aria-labelledby="marketing-hero-title">
        <div className="marketingContainer">
          <p className="heroEyebrow">The command centre for serious operators</p>
          <h1 id="marketing-hero-title" className="heroTitle">
            The #1 <span className="heroAccent">work operating system</span> for multi-entity life.
          </h1>
          <p className="heroSub">
            Build lasting clarity across personal work, DigiKraal, Farm Feed, and North Point Realty — one inbox, one Today
            view, and AI that executes with you.
          </p>
          {showGuestAuth ? null : (
            <div className="heroCtas">
              <Link className="btn btnInline accent" to="/command">
                Open Command Centre
              </Link>
              <Link className="btn btnInline secondary" to="/today">
                See Today view
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="marketingBand" aria-label="Social proof">
        <div className="marketingContainer">
          <p className="logoStripLabel">Built for teams who run many worlds at once</p>
          <div className="logoStrip">
            {['Personal', 'DigiKraal', 'Farm Feed', 'North Point', 'Ops', 'Finance'].map((name) => (
              <span key={name} className="logoStripPill">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="marketingSection" id="marketing-product">
        <div className="marketingContainer marketingSplit">
          <div>
            <h2 className="sectionTitle">Work at the core. Context everywhere.</h2>
            <p className="sectionLead">
              Capture once in the Universal Inbox, pivot entities without losing history, and let Command Centre surface what
              matters now — the same rhythm as the best SaaS landing pages, inside your actual workflow.
            </p>
            <ul className="sectionList">
              <li>Global Command Centre &amp; Today View</li>
              <li>Meetings, tasks, deals, and documents in one flow</li>
              <li>Offline-first; sync when you are back online</li>
            </ul>
            <Link className="textLink" to="/inbox">
              Start from Inbox →
            </Link>
          </div>
          <div className="marketingVisualCard" aria-hidden>
            <div className="marketingVisualUi">
              <div className="marketingVisualBar" />
              <div className="marketingVisualRows">
                <span />
                <span />
                <span />
              </div>
            </div>
            <p className="marketingVisualCaption">Command Centre · live scope · next actions</p>
          </div>
        </div>
      </section>

      <section className="marketingSection marketingSectionAlt" id="marketing-entities">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">One hub. Four worlds.</h2>
          <p className="sectionLead sectionLeadCenter">
            Strict separation between entities — nothing leaks across companies unless you choose to share.
          </p>
          <div className="featureGrid">
            <MiniFeature title="Personal" desc="Life admin, goals, and family scheduling centralized." />
            <MiniFeature title="DigiKraal" desc="Divisions, ops, and execution without spreadsheet chaos." />
            <MiniFeature title="Farm Feed" desc="Trading, follow-ups, and logistics in one cockpit." />
            <MiniFeature title="North Point Realty" desc="Mandates, leads, and viewings with full context." />
          </div>
        </div>
      </section>

      <section className="marketingSection" id="marketing-ai">
        <div className="marketingContainer marketingSplit marketingSplitReverse">
          <div className="marketingVisualCard" aria-hidden>
            <div className="marketingAiOrb" />
            <p className="marketingVisualCaption">10× leverage — structure, plans, and next actions from raw capture</p>
          </div>
          <div>
            <h2 className="sectionTitle">10× your output with AI agents</h2>
            <p className="sectionLead">
              Not a chat toy — workers that draft, tag, and propose next steps. You stay in control; AI reduces drag on
              repetitive thinking.
            </p>
            <ul className="sectionList">
              <li>Capture-to-structure from messy notes</li>
              <li>Daily plan and priority suggestions</li>
              <li>Document and meeting summaries (roadmap)</li>
            </ul>
            <Link className="btn btnInline accent" to="/agents">
              Open AI workspace
            </Link>
          </div>
        </div>
      </section>

      <section className="marketingSection" id="marketing-meetings">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">Meetings workflow — from spreadsheet to command centre</h2>
          <p className="sectionLead sectionLeadCenter">
            Your DJ Werk sheet is now the blueprint: one place for new meetings, the week grid, today&apos;s list, and a
            master list per entity — Digikraal, DJ Eksteen, Northpoint — with Who, Where, and Description.
          </p>
          <div className="meetingJourneyGrid">
            <div className="meetingJourneyCard">
              <div className="meetingJourneyStep">1</div>
              <h3 className="meetingJourneyTitle">Landing → context</h3>
              <p className="meetingJourneyDesc">
                Understand how entities split your world, then open the app. Real schedule data can load from Supabase after
                sync.
              </p>
            </div>
            <div className="meetingJourneyCard">
              <div className="meetingJourneyStep">2</div>
              <h3 className="meetingJourneyTitle">New meeting</h3>
              <p className="meetingJourneyDesc">
                Capture Entity, Date, Time, Who, Description, Where — same fields as your &quot;New Meeting&quot; form.
              </p>
            </div>
            <div className="meetingJourneyCard">
              <div className="meetingJourneyStep">3</div>
              <h3 className="meetingJourneyTitle">Week &amp; day</h3>
              <p className="meetingJourneyDesc">
                Scan Sunday–Saturday like &quot;Meetings of the week&quot;, or focus a single day like &quot;Meetings of the
                day&quot;.
              </p>
            </div>
            <div className="meetingJourneyCard">
              <div className="meetingJourneyStep">4</div>
              <h3 className="meetingJourneyTitle">Detail &amp; follow-ups</h3>
              <p className="meetingJourneyDesc">
                Edit notes, then spawn tasks into Today View without losing meeting context.
              </p>
            </div>
          </div>
          <div className="heroCtas heroCtasCenter" style={{ marginTop: 20 }}>
            <Link className="btn btnInline accent" to="/meetings">
              Open Meetings
            </Link>
            <Link className="btn btnInline secondary" to="/command">
              Back to Command Centre
            </Link>
          </div>
        </div>
      </section>

      <section className="marketingSection marketingSectionAlt">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">Connect PivotOS with your existing stack</h2>
          <p className="sectionLead sectionLeadCenter">
            Manual today — Zapier, Make, and native integrations next. Your data stays behind RLS on Supabase.
          </p>
          <div className="integrationHub" aria-hidden>
            <span className="integrationHubCenter">PivotOS</span>
            {['WhatsApp', 'Gmail', 'Sheets', 'Airtable', 'Calendar', 'Slack'].map((name) => (
              <span key={name} className="integrationSpoke">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="marketingStats">
        <div className="marketingContainer marketingStatsGrid">
          <div className="statCell">
            <div className="statValue">∞</div>
            <div className="statLabel">Inbox captures</div>
          </div>
          <div className="statCell">
            <div className="statValue">100%</div>
            <div className="statLabel">Entity-scoped privacy</div>
          </div>
          <div className="statCell">
            <div className="statValue">24/7</div>
            <div className="statLabel">Offline-ready PWA</div>
          </div>
        </div>
      </section>
    </>
  )
}

function MiniFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="featureCard">
      <div className="featureCardTitle">{title}</div>
      <p className="featureCardDesc">{desc}</p>
    </div>
  )
}
