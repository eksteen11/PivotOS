import { Link } from 'react-router-dom'

const MODULES = [
  { name: 'Today', badge: null, icon: '◉', color: '#10b981' },
  { name: 'Inbox', badge: null, icon: '✉', color: '#8b5cf6' },
  { name: 'Processes', badge: null, icon: '▤', color: '#0ea5e9' },
  { name: 'Agents', badge: 'AI', icon: '◎', color: '#d946ef' },
  { name: 'Approvals', badge: null, icon: '✓', color: '#f59e0b' },
  { name: 'Meetings', badge: null, icon: '◷', color: '#f43f5e' },
  { name: 'Deals', badge: null, icon: '◆', color: '#65a30d' },
  { name: 'Tools', badge: null, icon: '⚡', color: '#f97316' },
  { name: 'Memory', badge: 'AI', icon: '◈', color: '#6366f1' },
  { name: 'Entities', badge: null, icon: '⬡', color: '#0d9488' },
  { name: 'Command', badge: null, icon: '⊞', color: '#0891b2' },
  { name: 'Offline', badge: null, icon: '↻', color: '#475569' },
] as const

const CAPABILITIES = [
  'Universal Inbox', 'Process templates', 'Agent factory', 'Approval queue', 'Entity switcher',
  'Workstreams', 'Meeting grid', 'Deal pipeline', 'Quick capture', 'Kanban boards',
  'RLS privacy', 'Offline Dexie', 'Supabase sync', 'Daily briefing', 'Audit logs',
] as const

/** Guests: no hero buttons (use header). Signed in: app CTAs. */
export function MarketingLanding({ showGuestAuth }: { showGuestAuth?: boolean }) {
  return (
    <>
      <section className="marketingHero marketingHeroClickUp" aria-labelledby="marketing-hero-title">
        <div className="marketingContainer">
          <p className="heroEyebrow">The operator OS</p>
          <h1 id="marketing-hero-title" className="heroTitle">
            Software to <span className="heroTitleMuted">replace spreadsheet chaos</span>
          </h1>
          <ul className="marketingCheckList">
            <li>
              <span className="marketingCheckIcon" aria-hidden>✓</span>
              <span>
                <strong>Save money.</strong> Inbox, processes, agents, meetings, deals — one stack.
              </span>
            </li>
            <li>
              <span className="marketingCheckIcon" aria-hidden>✓</span>
              <span>
                <strong>Save time.</strong> Entity → division → workstream context that never leaks.
              </span>
            </li>
            <li>
              <span className="marketingCheckIcon" aria-hidden>✓</span>
              <span>
                <strong>Create infinite leverage.</strong> AI agents propose; you approve; tools execute.
              </span>
            </li>
          </ul>
          {showGuestAuth ? null : (
            <div className="heroCtas" style={{ marginTop: 28 }}>
              <Link className="btn btnInline marketingCtaDark" to="/command">
                Get started. It&apos;s FREE
              </Link>
              <span className="marketingHeroNote">Free to start · Multi-entity ready</span>
            </div>
          )}
        </div>
      </section>

      <section className="marketingSection" id="marketing-product" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="marketingContainer">
          <div className="marketingModuleGrid" aria-label="Product modules">
            {MODULES.map((m) => (
              <div key={m.name} className="marketingModuleTile">
                <span className="marketingModuleIcon" style={{ background: m.color }} aria-hidden>
                  {m.icon}
                </span>
                <span className="marketingModuleName">
                  {m.name}
                  {m.badge ? <span className="marketingModuleBadge">{m.badge}</span> : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketingSection marketingSectionAlt">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">
            60% of operator context is lost between sheets, WhatsApp, and memory
          </h2>
          <p className="sectionLead sectionLeadCenter">
            Work sprawl kills clarity. PivotOS unifies intake, execution, and AI — scoped per entity.
          </p>
        </div>
      </section>

      <section className="marketingSection" id="marketing-platform">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">All entities, agents, and humans in PivotOS</h2>
          <p className="sectionLead sectionLeadCenter">30+ capabilities to replace fragmented spreadsheets and inbox tabs.</p>
          <div className="marketingCapabilityCloud">
            {CAPABILITIES.map((cap) => (
              <span key={cap} className="marketingCapabilityPill">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="marketingSection marketingSectionAlt" id="marketing-ai">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">The only AI that actually knows your businesses</h2>
          <p className="sectionLead sectionLeadCenter">
            Entity-scoped memory, ambient Today surfacing, and approval-safe execution.
          </p>
          <div className="marketingBrainGrid">
            <BrainCard title="Entity memory" desc="Agents remember divisions, deals, and preferences per company — never mixed." />
            <BrainCard title="Ambient Today" desc="Approvals, blocked work, and agent suggestions surface before you ask." />
            <BrainCard title="Approval-safe AI" desc="Draft first. Send money, email, or WhatsApp only after you approve." />
            <BrainCard title="Connected tools" desc="Gmail, WhatsApp, Xero, Sheets — scoped permissions per agent." />
            <BrainCard title="Daily briefing" desc="Chief of Staff compiles what matters across entities each morning." />
            <BrainCard title="Deep search" desc="Find activities, meetings, and deals across workstreams in one query." />
          </div>
          {showGuestAuth ? null : (
            <div className="heroCtas heroCtasCenter" style={{ marginTop: 24 }}>
              <Link className="btn btnInline accent" to="/agents">
                Open AI workspace
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="marketingSection" id="marketing-entities">
        <div className="marketingContainer">
          <h2 className="sectionTitle sectionTitleCenter">AI workflows for every entity you run</h2>
          <p className="sectionLead sectionLeadCenter">Your operating rhythms — powered by PivotOS agents and processes.</p>
          <div className="marketingVerticalGrid">
            <VerticalCard
              title="Run DigiKraal without spreadsheet sprawl"
              lead="Agency, property, projects, and finance — one cockpit."
              replaces={['Sheets', 'WhatsApp', 'Email']}
              agents={['Sales Agent', 'Finance Agent', 'Meeting Agent']}
            />
            <VerticalCard
              title="Move Farm Feed quotes and logistics faster"
              lead="Trading, sourcing, and admin lanes with process templates."
              replaces={['Sheets', 'Calls', 'Email']}
              agents={['Quote Agent', 'Logistics Agent', 'Finance Agent']}
            />
            <VerticalCard
              title="Close Northpoint deals with full context"
              lead="Listings, viewings, and mandates — form lead to signed mandate."
              replaces={['CRM notes', 'Sheets', 'Email']}
              agents={['Property Agent', 'Sales Agent', 'Document Agent']}
            />
            <VerticalCard
              title="Personal ops without losing the businesses"
              lead="Life admin and ideas — separated but reachable from one login."
              replaces={['Notes', 'Calendar', 'Reminders']}
              agents={['Chief of Staff', 'Ideas Agent', 'Planner Agent']}
            />
          </div>
        </div>
      </section>

      <section className="marketingStats">
        <div className="marketingContainer marketingStatsGrid">
          <div className="statCell">
            <div className="statValue">4+</div>
            <div className="statLabel">Entities unified</div>
          </div>
          <div className="statCell">
            <div className="statValue">100%</div>
            <div className="statLabel">Approval-safe AI</div>
          </div>
          <div className="statCell">
            <div className="statValue">24/7</div>
            <div className="statLabel">Offline-ready PWA</div>
          </div>
        </div>
      </section>

      <section className="marketingSection marketingSectionCta">
        <div className="marketingContainer" style={{ textAlign: 'center' }}>
          <h2 className="sectionTitle sectionTitleCenter">All your entities. All your agents. One calm command centre.</h2>
          <p className="sectionLead sectionLeadCenter">
            Universal Inbox → Processes → Agents → Tools → Approvals. ClickUp clarity. Operator control.
          </p>
          {showGuestAuth ? null : (
            <div className="heroCtas heroCtasCenter">
              <Link className="btn btnInline marketingCtaDark" to="/command">
                Get started FREE
              </Link>
              <Link className="btn btnInline secondary" to="/today">
                Open Today view
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function BrainCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="marketingBrainCard">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function VerticalCard({
  title,
  lead,
  replaces,
  agents,
}: {
  title: string
  lead: string
  replaces: string[]
  agents: string[]
}) {
  return (
    <article className="marketingVerticalCard">
      <h3 className="marketingVerticalTitle">{title}</h3>
      <p className="marketingVerticalLead">{lead}</p>
      <p className="marketingReplacesLabel">Replaces</p>
      <div className="marketingReplacesRow">
        {replaces.map((r) => (
          <span key={r} className="marketingReplacesPill">
            {r}
          </span>
        ))}
      </div>
      <p className="marketingReplacesLabel">Agents</p>
      <div className="marketingReplacesRow">
        {agents.map((a) => (
          <span key={a} className="marketingAgentPill">
            {a}
          </span>
        ))}
      </div>
    </article>
  )
}
