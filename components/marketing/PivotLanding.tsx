'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AccountMenu } from '@/components/auth/AccountMenu'
import { PivotIcon, PivotMark } from '@/components/workspace/PivotIcon'
import type { Company } from '@/lib/workspace/catalogue'
import './landing.css'

const businesses: { id: Company; name: string; short: string; detail: string; message: string; task: string; facts: string[] }[] = [
  { id: 'digikraal', name: 'Digikraal', short: 'DK', detail: 'Livestock, property, partners & new ventures.', message: 'A seller has cattle ready. Can we arrange a farm visit?', task: 'Prepare the seller’s farm visit', facts: ['Confirm stock details', 'Prepare inspection checklist', 'Draft the visit confirmation'] },
  { id: 'northpoint', name: 'Northpoint Realty', short: 'NP', detail: 'Listings, buyers, viewings & the next opportunity.', message: 'We’re thinking of selling our farm. What happens next?', task: 'Prepare a new farm listing', facts: ['Collect property details', 'Review the mandate', 'Prepare the first viewing'] },
  { id: 'farm-feed', name: 'Farm Feed', short: 'FF', detail: 'Supply, buyers, transport & deal follow-through.', message: 'We need oat hay delivered. Can you help source it?', task: 'Match the enquiry to supply', facts: ['Confirm quantity and quality', 'Compare delivered prices', 'Draft the supply options'] },
  { id: 'personal', name: 'Personal', short: 'DJ', detail: 'Family, commitments & space for your own ideas.', message: 'Make space for family and the priorities that matter this week.', task: 'Plan the week with intention', facts: ['Capture commitments', 'Choose the next priorities', 'Review the weekly plan'] },
]
const stages = [
  { label: 'Capture', icon: 'inbox', title: 'Keep the original context.', description: 'A message, a call, an idea. Start with what actually happened.' },
  { label: 'Plan', icon: 'systems', title: 'Turn it into a next step.', description: 'The right business, the missing details and a plan you can review.' },
  { label: 'Review', icon: 'check', title: 'Your judgement stays central.', description: 'Check the facts and the draft. Every outgoing action needs your approval.' },
  { label: 'Follow through', icon: 'work', title: 'Keep the outcome in sight.', description: 'An owner, a next action and a saved history. Carry the work forward.' },
]

export function PivotLanding({ signedIn, account }: { signedIn: boolean; account?: { name: string; email: string } }) {
  const [company, setCompany] = useState<Company>('digikraal')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const demo = useRef<HTMLDivElement>(null)
  const selected = businesses.find((business) => business.id === company)!

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(motion.matches)
    update()
    motion.addEventListener('change', update)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .2 })
    if (demo.current) observer.observe(demo.current)
    return () => { motion.removeEventListener('change', update); observer.disconnect() }
  }, [])
  useEffect(() => {
    if (!playing || reducedMotion || !inView) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setStep((current) => (current + 1) % stages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [playing, reducedMotion, inView, company])

  function chooseStep(index: number) { setPlaying(false); setStep(index) }

  return <div className="pivot-landing landing-v2">
    <a className="pl-skip" href="#landing-content">Skip to content</a>
    <header className="pivot-landing-header" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false)
    }} onKeyDown={(event) => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }}>
      <div className="pivot-landing-header-inner">
        <Link href="/" className="pivot-logo" aria-label="Pivot OS home"><PivotMark /><span>pivot<span className="pivot-logo-os">os</span></span></Link>
        <nav id="pivot-page-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Page navigation">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#your-businesses" onClick={() => setMenuOpen(false)}>Your businesses</a>
          <a href="#the-workforce" onClick={() => setMenuOpen(false)}>The AI workforce</a>
          {!signedIn && <Link className="pivot-mobile-sign-in" href="/login">Sign in</Link>}
        </nav>
        <div className="pivot-header-actions">
          {signedIn ? <><Link className="pivot-button" href="/today">Open my desk <PivotIcon name="arrow" size={17} /></Link>{account && <AccountMenu name={account.name} email={account.email} />}</> : <><Link className="pivot-login-link" href="/login">Sign in</Link><Link className="pivot-button" href="/preview">Explore the desk <PivotIcon name="arrow" size={17} /></Link></>}
          <button ref={menuButton} type="button" className="pivot-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="pivot-page-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <PivotIcon name="close" size={22} /> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
      </div>
    </header>
    <main id="landing-content">
      <section className="pl-hero">
        <div className="pl-eyebrow"><span className="pl-dot" /> YOUR PERSONAL OPERATING SYSTEM</div>
        <h1>Your whole world.<br /><span>One clear desk.</span></h1>
        <p>Less juggling. More moving forward.<br />Your businesses, your next steps, your space to think.</p>
        <div className="pl-actions"><Link className="pivot-button" href={signedIn ? '/today' : '/preview'}>{signedIn ? 'Open my desk' : 'Explore the desk'}<PivotIcon name="arrow" size={20} /></Link><a href="#how-it-works" className="pl-text-link">Watch the workflow <span aria-hidden="true">↘</span></a></div>
        <div className="pl-trust"><PivotIcon name="lock" size={14} /> Private by default <span>·</span> You stay in control</div>
        <div className="pl-demo" ref={demo}>
          <div className="pl-demo-toolbar"><span><span className="pl-dot" /> THE CONNECTED DESK</span><span className="pl-sample-label">Interactive concept · sample data</span></div>
          <div className="pl-demo-layout">
            <aside className="pl-demo-businesses"><span className="pl-label">YOUR WORLD</span>{businesses.map((business) => <button key={business.id} aria-pressed={business.id === company} onClick={() => { setCompany(business.id); setStep(0) }}><span className="pl-monogram">{business.short}</span><span>{business.name}</span>{company === business.id && <span className="pl-company-active" />}</button>)}<div className="pl-demo-private"><PivotIcon name="lock" size={16} /><span>Separate context.<br />One place to focus.</span></div></aside>
            <div className="pl-demo-main">
              <div className="pl-demo-heading"><div><span className="pl-label">{selected.name} / NEEDS DRIKUS</span><h2>A little context.<br />A clear next move.</h2></div><span className="pl-avatar">DJ</span></div>
              <div className="pl-stage-buttons" role="group" aria-label="Workflow steps">{stages.map((stage, index) => <button key={stage.label} aria-pressed={step === index} onClick={() => chooseStep(index)}><span>{String(index + 1).padStart(2, '0')}</span>{stage.label}</button>)}</div>
              <div className="pl-scene" key={`${company}-${step}`}>
                <div className="pl-scene-heading"><span className="pl-scene-icon"><PivotIcon name={stages[step].icon} size={22} /></span><span>{['ORIGINAL CONTEXT', 'PROPOSED WORK PLAN', 'WAITING FOR YOUR REVIEW', 'TRACK THE NEXT ACTION'][step]}</span><span className="pl-scene-status">{step === 2 ? 'Approval required' : 'Sample'}</span></div>
                {step === 0 ? <><blockquote>“{selected.message}”</blockquote><div className="pl-context-tags"><span>Source preserved</span><span>{selected.name}</span><span>No details invented</span></div></> : step === 1 ? <><h3>{selected.task}</h3><ul className="pl-demo-checklist">{selected.facts.map((fact, index) => <li key={fact}><span>{index + 1}</span>{fact}</li>)}</ul></> : step === 2 ? <><h3>Ready for your judgement.</h3><p>{selected.facts[2]}. Review the details before anything moves.</p><div className="pl-review-note"><PivotIcon name="lock" size={18} />Nothing is sent from this demonstration.</div></> : <><h3>{selected.task}</h3><div className="pl-follow-row"><span>Owner</span><strong>Drikus</strong></div><div className="pl-follow-row"><span>Next action</span><strong>{selected.facts[0]}</strong></div><div className="pl-follow-row"><span>State</span><strong>Awaiting review</strong></div></>}
              </div>
              <div className="pl-demo-controls"><span>{stages[step].title}</span><div>{!reducedMotion && <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause workflow animation' : 'Play workflow animation'}>{playing ? 'Ⅱ Pause' : '▷ Play'}</button>}<button type="button" onClick={() => chooseStep((step + 1) % stages.length)} aria-label="Preview next workflow step">Next <PivotIcon name="arrow" size={16} /></button></div></div>
            </div>
          </div>
          <div className="pl-demo-foot"><PivotIcon name="lock" size={14} /><span>Explore the idea. Live channel connections and autonomous execution are still being built.</span></div>
        </div>
      </section>
      <section className="pl-section pl-how" id="how-it-works"><div className="pl-section-heading"><div><span className="pl-eyebrow">FROM INCOMING TO OUTCOME</span><h2>Less explaining.<br />More doing.</h2></div><p>One thread from the first conversation<br />to the next clear action.</p></div><div className="pl-flow-grid">{stages.map((stage, index) => <button key={stage.label} className={step === index ? 'is-active' : ''} onClick={() => { chooseStep(index); demo.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' }) }}><span className="pl-flow-top"><PivotIcon name={stage.icon} size={26} /><span>0{index + 1}</span></span><h3>{stage.label}.</h3><p>{stage.description}</p><span className="pl-flow-try">See the example <PivotIcon name="arrow" size={17} /></span></button>)}</div></section>
      <section className="pl-section pl-world" id="your-businesses"><div className="pl-section-heading"><div><span className="pl-eyebrow">FOUR DOORS. ONE YOU.</span><h2>A place for every<br />part of your world.</h2></div><p>Each business keeps its context.<br />Personal stays personal.</p></div><div className="pl-world-grid">{businesses.map((business) => <button key={business.id} onClick={() => { setCompany(business.id); setStep(0); demo.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' }) }}><span className="pl-world-top"><span className="pl-monogram">{business.short}</span><PivotIcon name="arrow" size={20} /></span><h3>{business.name}</h3><p>{business.detail}</p><span className="pl-label">EXPLORE THE EXAMPLE</span></button>)}</div></section>
      <section className="pl-workforce" id="the-workforce"><div className="pl-workforce-inner"><div className="pl-agent-diagram" aria-label="Planned workflow: Drikus directs a chief of staff, with business specialists and reviewed lessons"><span className="pl-diagram-label">THE WORKFORCE VISION</span><div className="pl-agent-owner"><span className="pl-avatar">DJ</span><div><strong>You set the direction.</strong><span>Decisions & approvals</span></div></div><div className="pl-connector" /><div className="pl-agent-chief"><PivotIcon name="workforce" size={26} /><div><strong>A chief of staff.</strong><span>Context, coordination, follow-through</span></div></div><div className="pl-agent-specialists"><span>Business context</span><span>Specialist work</span><span>Reviewed lessons</span></div><span className="pl-diagram-caption"><PivotIcon name="lock" size={14} /> Learning never expands permissions.</span></div><div className="pl-workforce-copy"><span className="pl-eyebrow">YOUR JUDGEMENT. MORE REACH.</span><h2>You lead.<br />The work connects.</h2><p>The vision: a chief of staff and specialist agents that build on your context, corrections and real outcomes.</p><ul><li><PivotIcon name="check" size={18} />Organise and draft with context.</li><li><PivotIcon name="check" size={18} />Keep you in charge of outgoing actions.</li><li><PivotIcon name="check" size={18} />Turn reviewed lessons into better playbooks.</li></ul><span className="pl-planned">Planned capability · being built in stages</span></div></div></section>
      <section className="pl-final"><span className="pl-eyebrow">MAKE SPACE FOR WHAT’S NEXT</span><h2>A clearer desk.<br />A little more possibility.</h2><Link href={signedIn ? '/today' : '/preview'} className="pivot-button">{signedIn ? 'Open my desk' : 'Step inside the preview'}<PivotIcon name="arrow" size={20} /></Link><p>{signedIn ? 'Your private workspace, ready when you are.' : 'Explore sample work. Your real workspace stays private.'}</p></section>
    </main>
    <footer className="pl-footer"><Link className="pivot-logo" href="/" aria-label="Pivot OS home"><PivotMark /><span>pivot<span className="pivot-logo-os">os</span></span></Link><span>Your world, connected.</span><div><Link href={signedIn ? '/account' : '/login'}>{signedIn ? 'My account' : 'Sign in'}</Link><span><PivotIcon name="lock" size={13} />Founder private</span></div></footer>
  </div>
}
