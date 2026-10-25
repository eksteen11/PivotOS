import Link from 'next/link'
import { PivotMark, PivotIcon } from '@/components/workspace/PivotIcon'

export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="account-auth-page">
    <header className="account-auth-header"><Link href="/" className="pivot-logo account-auth-logo" aria-label="Pivot OS home"><PivotMark /><span>pivot<span className="pivot-logo-os">os</span></span></Link><Link href="/preview" className="account-auth-preview">Explore the preview <PivotIcon name="arrow" size={17} /></Link></header>
    <div className="account-auth-layout">
      <aside className="account-auth-story"><span className="account-eyebrow">YOUR WORLD, CONNECTED</span><h2>A little less noise.<br /><span>A lot more clarity.</span></h2><p>One private place for your businesses,<br />your next steps and the work that matters.</p><div className="account-auth-illustration" aria-hidden="true"><div><PivotIcon name="inbox" size={22} /><span>The context.</span></div><span>↓</span><div><PivotIcon name="desk" size={22} /><strong>One clear desk.</strong><span className="account-auth-mini-badge">YOURS</span></div><span>↓</span><div><PivotIcon name="check" size={22} /><span>Your next move.</span></div></div><span className="account-auth-story-note"><PivotIcon name="lock" size={15} /> Your judgement stays at the centre.</span></aside>
      <section className="account-auth-card"><span className="account-eyebrow">PIVOT OS · PRIVATE WORKSPACE</span><h1>{title}</h1><p className="account-lead">{description}</p>{children}</section>
    </div>
    <p className="account-auth-foot"><PivotIcon name="lock" size={14} /> Your account. Your private workspace.</p>
  </main>
}
