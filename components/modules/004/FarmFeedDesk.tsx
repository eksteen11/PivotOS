'use client'

import { useState } from 'react'
import { decideMargin, type MarginDecision } from '@/lib/modules/004/approval'
import type { CostComponent, Enquiry, EnquirySide } from '@/lib/modules/004/contract'
import { captureEnquiry, emptyDraft, type EnquiryDraft } from '@/lib/modules/004/enquiry'
import { proposeMatch, type MatchProposal } from '@/lib/modules/004/match'
import { parseRandToCents } from '@/lib/modules/004/money'
import { deliveredMargin } from '@/lib/modules/004/pricing'
import { FarmFeedEvidence } from './FarmFeedEvidence'
import './farm-feed.css'

const EXTRA_COSTS: CostComponent['key'][] = ['loading', 'storage_handling', 'agent_commission', 'insurance', 'finance_cost', 'export_shipping', 'other']
const SOURCES: Record<string, string> = { '0': 'Not verified', '1': 'Stated by counterparty', '2': 'Observed by Farm Feed', '3': 'Document confirmed', '4': 'Professional confirmed' }

export function FarmFeedDesk() {
  const [side, setSide] = useState<EnquirySide>('demand')
  const [drafts, setDrafts] = useState({ supply: emptyDraft('supply', 'supply'), demand: emptyDraft('demand', 'demand') })
  const [checked, setChecked] = useState<{ supply?: EnquiryDraft; demand?: EnquiryDraft }>({})
  const [transportText, setTransportText] = useState('')
  const [transportLowText, setTransportLowText] = useState('')
  const [transportHighText, setTransportHighText] = useState('')
  const [costs, setCosts] = useState<Record<string, string>>({})
  const [minimumText, setMinimumText] = useState('')
  const [comparison, setComparison] = useState<MatchProposal | null>(null)
  const [decision, setDecision] = useState<MarginDecision | null>(null)
  const [approver, setApprover] = useState('')
  const [message, setMessage] = useState('')
  const draft = drafts[side]

  function edit(partial: Partial<EnquiryDraft>) {
    setDrafts((current) => ({ ...current, [side]: { ...current[side], ...partial } }))
    setChecked((current) => ({ ...current, [side]: undefined }))
    setComparison(null)
    setDecision(null)
    setMessage('')
  }

  function onPrimary() {
    const current = sourced(draft)
    const supplyDraft = side === 'supply' ? current : checked.supply
    const demandDraft = side === 'demand' ? current : checked.demand
    const nextChecked = { ...checked, [side]: current }
    if (!supplyDraft || !demandDraft) {
      const captured = captureEnquiry(current)
      if ('error' in captured) { setMessage(captured.error); return }
      setDrafts({ ...drafts, [side]: current })
      setChecked(nextChecked)
      setMessage('This side is checked. Check the other side next.')
      return
    }
    const supply = captureEnquiry(supplyDraft)
    const demand = captureEnquiry(demandDraft)
    if ('error' in supply) { setMessage(supply.error); return }
    if ('error' in demand) { setMessage(demand.error); return }
    const transport = readMoney(transportText)
    const low = readMoney(transportLowText)
    const high = readMoney(transportHighText)
    if (typeof transport === 'string' || typeof low === 'string' || typeof high === 'string') { setMessage('Transport must be a rand amount, n/a, or blank.'); return }
    const minimum = readPercent(minimumText)
    if (minimum === 'error') { setMessage('Minimum margin must be a percent, such as 5.'); return }
    const waived: CostComponent['key'][] = []
    const entered: { key: CostComponent['key']; cents: number }[] = []
    for (const key of EXTRA_COSTS) {
      const parsed = parseRandToCents(costs[key] ?? '')
      if (parsed.error) { setMessage(parsed.error); return }
      if (parsed.state === 'not_applicable') waived.push(key)
      if ((parsed.state === 'known' || parsed.state === 'explicit_zero') && parsed.cents !== null) entered.push({ key, cents: parsed.cents })
    }
    if (transport?.state === 'not_applicable') waived.push('transport')
    setDrafts({ ...drafts, [side]: current })
    setChecked(nextChecked)
    setComparison(buildProposal(supply.enquiry, demand.enquiry, {
      transportCents: transport && transport.state !== 'not_applicable' && transport.state !== 'blank' ? transport.cents : null,
      transportLowCents: low?.cents ?? null,
      transportHighCents: high?.cents ?? null,
      waived,
      minimum,
      entered,
    }))
    setDecision(null)
    setMessage('Comparison updated. Nothing was sent.')
  }

  async function onDecide(outcome: 'approved' | 'rejected') {
    if (!comparison) return
    const result = await decideMargin({ proposal: comparison, outcome, approver, at: new Date().toISOString(), acknowledgeUnknowns: true })
    if ('error' in result) { setMessage(result.error); return }
    setDecision(result)
    setMessage(outcome === 'approved' ? 'Decision recorded. Nothing was sent or posted.' : 'Rejection recorded. Nothing was sent.')
  }

  return <section className="ff004" data-module="004" aria-label="Farm Feed">
    <p className="ff004-kicker">004 · Farm Feed</p>
    <h1>Supply and demand</h1>
    <p className="ff004-lead">Check quantity, quality, unit, delivery and margin before anyone offers a price. This stays inside Pivot. Nothing is sent, booked or posted to the ledger.</p>
    <div className="ff004-switch" role="group" aria-label="Enquiry side">
      <button type="button" aria-pressed={side === 'supply'} onClick={() => setSide('supply')}>Supply · VERKOOP</button>
      <button type="button" aria-pressed={side === 'demand'} onClick={() => setSide('demand')}>Demand · SOEK</button>
    </div>
    <div className="ff004-grid">
      <label>Product<input value={draft.productText} onChange={(event) => edit({ productText: event.target.value })} /></label>
      <label>Internal name<input value={draft.counterpartyName} onChange={(event) => edit({ counterpartyName: event.target.value })} /></label>
      <label>Quantity<input inputMode="decimal" value={draft.quantityText} onChange={(event) => edit({ quantityText: event.target.value })} /></label>
      <label>Unit<select value={draft.unit} onChange={(event) => edit({ unit: event.target.value as EnquiryDraft['unit'] })}><option value="">Choose</option><option value="kg">kg</option><option value="tonne">tonne</option><option value="bale">bale</option></select></label>
      {draft.unit === 'bale' ? <label>Kilograms per bale<input inputMode="decimal" value={draft.kgPerBaleText} onChange={(event) => edit({ kgPerBaleText: event.target.value })} /></label> : null}
      <label>Grade or quality<input value={draft.gradeText} onChange={(event) => edit({ gradeText: event.target.value })} /></label>
      <label>Quality evidence<select value={draft.qualityLevel} onChange={(event) => edit({ qualityLevel: event.target.value as EnquiryDraft['qualityLevel'] })}><option value="">Choose</option><option value="1">Stated by counterparty</option><option value="2">Observed by Farm Feed</option><option value="3">Document confirmed</option><option value="4">Professional confirmed</option><option value="0">Not verified</option></select></label>
      <label>{side === 'supply' ? 'Collection' : 'Delivery'}<input value={draft.placeText} onChange={(event) => edit({ placeText: event.target.value })} /></label>
      <label>Price per unit, rand<input inputMode="decimal" value={draft.priceText} onChange={(event) => edit({ priceText: event.target.value })} /></label>
      <label>VAT<select value={draft.vatTreatment} onChange={(event) => edit({ vatTreatment: event.target.value as EnquiryDraft['vatTreatment'] })}><option value="unknown">Unknown</option><option value="exclusive">Exclusive</option><option value="inclusive">Inclusive</option><option value="not_applicable">Not applicable</option></select></label>
      <label>Farm Feed role<select value={draft.commercialRole} onChange={(event) => edit({ commercialRole: event.target.value as EnquiryDraft['commercialRole'] })}><option value="">Choose</option><option value="principal">Principal</option><option value="agent">Agent</option><option value="facilitator">Facilitator</option></select></label>
    </div>
    <div className="ff004-actions">
      <button type="button" className="ff004-primary" onClick={onPrimary}>{checked.supply && checked.demand ? 'Compare delivered margin' : 'Check this enquiry'}</button>
    </div>
    {message ? <p className={message.endsWith('sent.') || message.startsWith('This side') || message.startsWith('Comparison') || message.startsWith('Decision') || message.startsWith('Rejection') ? 'ff004-note' : 'ff004-alert'} role={message.startsWith('This') || message.startsWith('Comparison') || message.startsWith('Decision') || message.startsWith('Rejection') ? 'status' : 'alert'}>{message}</p> : null}
    <div className="ff004-card">
      <h2>Delivery and other costs</h2>
      <p className="ff004-lead">Blank means unknown. Unknown is not zero. Type n/a only when that cost does not apply.</p>
      <div className="ff004-grid">
        <label>Transport, rand<input value={transportText} onChange={(event) => { setTransportText(event.target.value); setComparison(null); setDecision(null) }} /></label>
        <label>Minimum margin %<input value={minimumText} onChange={(event) => { setMinimumText(event.target.value); setComparison(null); setDecision(null) }} /></label>
        <label>Lower transport, optional<input value={transportLowText} onChange={(event) => { setTransportLowText(event.target.value); setComparison(null); setDecision(null) }} /></label>
        <label>Upper transport, optional<input value={transportHighText} onChange={(event) => { setTransportHighText(event.target.value); setComparison(null); setDecision(null) }} /></label>
        {EXTRA_COSTS.map((key) => <label key={key}>{labelFor(key)}<input aria-label={labelFor(key)} value={costs[key] ?? ''} onChange={(event) => { setCosts((current) => ({ ...current, [key]: event.target.value })); setComparison(null); setDecision(null) }} /></label>)}
      </div>
    </div>
    {comparison ? <FarmFeedEvidence proposal={comparison} decision={decision} /> : null}
    {comparison ? <div className="ff004-actions">
      <label>Decision by<input value={approver} onChange={(event) => setApprover(event.target.value)} /></label>
      <button type="button" className="ff004-primary" onClick={() => void onDecide('approved')}>Record decision</button>
      <button type="button" onClick={() => void onDecide('rejected')}>Reject</button>
    </div> : null}
  </section>
}

function sourced(draft: EnquiryDraft): EnquiryDraft {
  return { ...draft, qualitySource: SOURCES[draft.qualityLevel] ?? '', originalWording: draft.originalWording || draft.productText }
}

function labelFor(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function readMoney(text: string) {
  if (!text.trim()) return null
  const parsed = parseRandToCents(text)
  if (parsed.error) return parsed.error
  return parsed
}

function readPercent(text: string): number | null | 'error' {
  if (!text.trim()) return null
  if (!/^\d+(\.\d)?$/.test(text.trim())) return 'error'
  const bps = Math.round(Number(text.trim()) * 100)
  return bps >= 0 && bps <= 10000 ? bps : 'error'
}

function buildProposal(supply: Enquiry, demand: Enquiry, input: {
  transportCents: number | null
  transportLowCents: number | null
  transportHighCents: number | null
  waived: CostComponent['key'][]
  minimum: number | null
  entered: { key: CostComponent['key']; cents: number }[]
}): MatchProposal {
  const proposal = proposeMatch(supply, demand, {
    transportCents: input.transportCents,
    transportLowCents: input.transportLowCents,
    transportHighCents: input.transportHighCents,
    waivedCosts: input.waived,
    minimumMarginBps: input.minimum,
  })
  if (!input.entered.length) return proposal
  const components = proposal.margin.components.map((component) => {
    const entered = input.entered.find((cost) => cost.key === component.key)
    return entered ? { ...component, state: entered.cents === 0 ? 'explicit_zero' as const : 'known' as const, cents: entered.cents, note: 'Entered on the enquiry.' } : component
  })
  const revenueCents = proposal.margin.scenarios.find((scenario) => scenario.label === 'expected')?.revenueCents ?? null
  return {
    ...proposal,
    margin: deliveredMargin({
      quantityMilli: proposal.allocatedMilli,
      revenueCents,
      components,
      transportLowCents: input.transportLowCents,
      transportExpectedCents: input.transportCents,
      transportHighCents: input.transportHighCents,
      minimumMarginBps: input.minimum,
    }),
  }
}
