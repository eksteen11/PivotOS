'use client'

import { getCompany } from '@/lib/workspace/catalogue'
import { buildFounderCommand } from '@/lib/modules/002/prioritise'
import type { FounderLens, FounderQueueItem, FounderSignal } from '@/lib/modules/002/contract'
import './founder-command.css'

export type FounderCommandCentreProps = {
  signals: readonly FounderSignal[]
  lens: FounderLens
  today: string
  onOpen: (id: string) => void
}

const domainLabels: Record<FounderSignal['domain'], string> = {
  planning: 'Planning',
  communications: 'Communications',
  goals: 'Goals',
  agents: 'Agents',
  'personal-money': 'Personal money',
  family: 'Family',
  church: 'Church',
  health: 'Health',
  coding: 'Coding',
  ideas: 'Ideas',
}

export function FounderCommandCentre({ signals, lens, today, onOpen }: FounderCommandCentreProps) {
  const view = buildFounderCommand(signals, lens, today)
  const company = lens === 'founder' ? 'Founder' : getCompany(lens)?.name ?? 'This business'
  const rest = view.needsYou.slice(1)
  return (
    <section className="founder-command" aria-label="Founder Command Centre" data-module="002" data-lens={view.lens} data-focus-id={view.focus?.id ?? ''} data-needs-you={view.needsYou.length} data-leverage={view.leverage.length} data-provider={view.providerStatus}>
      <header>
        <p className="founder-command-kicker">002 · {company}</p>
        <h2>{view.focus ? 'What needs you' : 'Nothing needs you'}</h2>
        <p>Approval records a decision. Nothing is sent or paid from here.</p>
      </header>
      {view.focus ? <Focus item={view.focus} onOpen={onOpen} /> : <div className="founder-command-empty"><h3>Your next decision will show here.</h3><p>Capture it when it arrives. WhatsApp and email are not connected.</p></div>}
      {rest.length ? <div className="founder-command-queue"><h3>Also needs you</h3><ol>{rest.map((item) => <li key={item.id}><QueueButton item={item} onOpen={onOpen} className="founder-command-row" /></li>)}</ol></div> : null}
      <div className="founder-command-leverage">
        <h3>Highest leverage</h3>
        {view.leverage.length ? <ol>{view.leverage.map((item) => <li key={item.id}><QueueButton item={item} onOpen={onOpen} className="founder-command-card" /></li>)}</ol> : <p className="founder-command-note">No leverage action is ready.</p>}
        {view.parkedCount ? <p className="founder-command-note">{view.parkedCount} more can wait.</p> : null}
      </div>
      {view.rejections.length ? <p className="founder-command-note" role="status">{view.rejections.length} {view.rejections.length === 1 ? 'item was' : 'items were'} held back until the record is valid.</p> : null}
      {view.hiddenPrivateCount ? <p className="founder-command-note">Private family, church, health and personal money stay on the founder view.</p> : null}
      <footer>
        <span><strong>{view.bottleneck.count}</strong> {view.bottleneck.label}</span>
        <span><strong>{view.clearedCount}</strong> cleared</span>
        <span>WhatsApp and email are not connected</span>
      </footer>
    </section>
  )
}

function Focus({ item, onOpen }: { item: FounderQueueItem; onOpen: (id: string) => void }) {
  return (
    <article className="founder-command-focus">
      <p className="founder-command-kicker">Next</p>
      <h3>{item.title}</h3>
      <p className="founder-command-meta">{domainLabels[item.domain]} · {getCompany(item.company)?.name}</p>
      <p className="founder-command-detail">{item.next.detail}</p>
      <button className="founder-command-primary" type="button" aria-label={`${item.next.button}: ${item.title}`} onClick={() => onOpen(item.id)}>{item.next.button}</button>
    </article>
  )
}

function QueueButton({ item, onOpen, className }: { item: FounderQueueItem; onOpen: (id: string) => void; className: string }) {
  return <button className={className} type="button" aria-label={`${item.next.button}: ${item.title}`} onClick={() => onOpen(item.id)}><strong>{item.title}</strong><small>{item.next.label} · {domainLabels[item.domain]}</small></button>
}
