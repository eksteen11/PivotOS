'use client'

import { useState } from 'react'
import { applyDeskAction, ceilingFor, nextMove, type DeskState } from '../../../lib/modules/006/desk'
import { achievedSaleRange, presentEvidence } from '../../../lib/modules/006/evidence'
import { formatPercentBps, formatZar } from '../../../lib/modules/006/format'
import './property-investment.css'

const bindingCopy = { profit: 'Set by the profit and safety test.', return: 'Set by the return on cash.', capital: 'Set by the capital available.' }

export function PropertyInvestmentDesk({ initial }: { initial: DeskState }) {
  const [state, setState] = useState(initial)
  const [amount, setAmount] = useState('')
  const [adjustment, setAdjustment] = useState('')
  const [source, setSource] = useState('')
  const [sourceDate, setSourceDate] = useState('2026-08-01')
  const [grade, setGrade] = useState<'registered_transfer' | 'signed_transaction'>('registered_transfer')
  const [costAmount, setCostAmount] = useState('')
  const [costSource, setCostSource] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [approved, setApproved] = useState('')
  const [reason, setReason] = useState('')
  const move = nextMove(state)
  const range = achievedSaleRange(state.evidence)
  const ceiling = ceilingFor(state)
  const now = () => new Date().toISOString()
  return <section className="p006" aria-label="DigiKraal property investment">
    <p className="p006-kicker">DigiKraal · Property investment · Principal</p>
    <h1>{move.title}</h1>
    <p className="p006-lane">Not Northpoint. This is principal property, not an agency file.</p>
    {state.example ? <p className="p006-note">Example only. Not a live property and not a valuation. The formula gate is open so this screen can be reviewed. It is not approval of a live bid.</p> : null}
    <p role="status">{state.message}</p>
    {state.alert ? <p role="alert">{state.alert}</p> : null}
    <section className="p006-action" aria-label="Your next action">
      <h2>{move.detail}</h2>
      {move.action === 'evidence' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'add-sale-evidence', amountRands: amount, adjustmentRands: adjustment, source, sourceDate, grade, at: now() }))
      }}>
        <label>Evidence grade<select value={grade} onChange={(event) => setGrade(event.target.value as typeof grade)}><option value="registered_transfer">Registered transfer</option><option value="signed_transaction">Signed transaction evidence</option></select></label>
        <label>Registered price (R)<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
        <label>Adjustment (R)<input inputMode="decimal" value={adjustment} onChange={(event) => setAdjustment(event.target.value)} /></label>
        <p>Use 0 only when no adjustment is needed. A blank adjustment stays unknown.</p>
        <label>Source<input value={source} onChange={(event) => setSource(event.target.value)} /></label>
        <label>Source date<input type="date" value={sourceDate} onChange={(event) => setSourceDate(event.target.value)} /></label>
        <button className="p006-primary" type="submit">Add achieved-sale evidence</button>
      </form> : null}
      {move.action === 'cost' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'set-cost-known', costId: move.costId ?? '', amountRands: costAmount, source: costSource, at: now() }))
      }}>
        <label>Known amount (R)<input inputMode="decimal" value={costAmount} onChange={(event) => setCostAmount(event.target.value)} /></label>
        <label>Source<input value={costSource} onChange={(event) => setCostSource(event.target.value)} /></label>
        <button className="p006-primary" type="submit">Save known cost</button>
      </form> : null}
      {move.action === 'review' || move.action === 'done' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'review-ceiling', reviewedBy: reviewer, approvedRands: approved, reason, reviewedAt: now() }))
      }}>
        <label>Reviewer<input value={reviewer} onChange={(event) => setReviewer(event.target.value)} /></label>
        <label>Approved ceiling (R)<input inputMode="decimal" value={approved} onChange={(event) => setApproved(event.target.value)} /></label>
        <label>Reason<input value={reason} onChange={(event) => setReason(event.target.value)} /></label>
        <button className="p006-primary" type="submit">Review ceiling</button>
      </form> : null}
    </section>
    <section className="p006-block" aria-label="Opportunity">
      <h2>{state.opportunity.name}</h2>
      <dl>
        <div><dt>Address</dt><dd>{state.opportunity.address}</dd></div>
        <div><dt>Legal description</dt><dd>{state.opportunity.legalDescription || 'Not recorded'}</dd></div>
        <div><dt>Role</dt><dd>Principal · DigiKraal</dd></div>
        <div><dt>Preparer</dt><dd>{state.opportunity.preparedBy}</dd></div>
        <div><dt>Deadline</dt><dd>{state.opportunity.deadline ?? 'Not recorded'}</dd></div>
        <div><dt>Underwriting version</dt><dd>{state.version}</dd></div>
      </dl>
    </section>
    <section className="p006-block" aria-label="Evidence">
      <h2>Evidence</h2>
      <ul>{state.evidence.map((item) => {
        const view = presentEvidence(item)
        return <li key={item.id}><h3>{view.label}</h3><p className="p006-amount">{view.amount}</p><p>{view.caution}</p><p>{item.source} · {item.sourceDate}</p><p>Original wording: {item.originalWording}</p><p>Distance: {item.distanceNote}. Similarity: {item.similarityNote}. Confidence: not scored.</p></li>
      })}</ul>
    </section>
    <section className="p006-block" aria-label="Assumptions">
      <h2>Assumptions</h2>
      <dl>
        <div><dt>Formula</dt><dd>{state.policy.formulaVersion}</dd></div>
        <div><dt>Formula review</dt><dd>{state.policy.formulaReviewed ? state.example ? 'Reviewed for this example' : 'Reviewed' : 'Not reviewed'}</dd></div>
        <div><dt>Minimum net profit</dt><dd>{formatZar(state.policy.minimumNetProfitCents)}</dd></div>
        <div><dt>Margin of safety</dt><dd>{state.policy.marginOfSafetyBps === null ? 'Unknown' : formatPercentBps(state.policy.marginOfSafetyBps)}</dd></div>
        <div><dt>Return on cash</dt><dd>{state.policy.minimumReturnOnCashBps === null ? 'Unknown' : formatPercentBps(state.policy.minimumReturnOnCashBps)}</dd></div>
        <div><dt>Capital available</dt><dd>{formatZar(state.policy.maximumCapitalCents)}</dd></div>
        <div><dt>Deposit</dt><dd>{state.policy.depositBps === null ? 'Unknown' : formatPercentBps(state.policy.depositBps)}</dd></div>
      </dl>
      <p>{state.policy.formulaNote}</p>
    </section>
    <section className="p006-block" aria-label="Costs">
      <h2>Costs</h2>
      <ul>{state.costs.map((item) => <li key={item.id}><h3>{item.name}</h3><p className="p006-amount">{item.status === 'known' ? formatZar(item.amountCents) : 'Unknown'}</p><p>{item.status === 'known' ? item.source : 'Unknown costs are not treated as zero.'}</p></li>)}</ul>
    </section>
    <section className="p006-block" aria-label="Valuation">
      <h2>Achieved-sale range</h2>
      <p>{range.statement}</p>
    </section>
    <section className="p006-block" aria-label="Bid ceiling">
      <h2>Bid ceiling</h2>
      {ceiling.cents === null ? <ul>{ceiling.blockers.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Recommended ceiling {formatZar(ceiling.cents)}. {ceiling.binding ? bindingCopy[ceiling.binding] : ''}</p>}
      {state.review ? <p>Reviewed ceiling {formatZar(state.review.approvedCeilingCents)} by {state.review.reviewedBy}. This is a limit, not a bid.</p> : <p>No ceiling has been reviewed.</p>}
      {state.history.map((item) => <p key={`${item.version}-${item.at}`}>Version {item.version}: {item.reason}</p>)}
    </section>
    <section className="p006-block" aria-label="Outside this module">
      <h2>Not done here</h2>
      <p>Bidding, contracts and finance stay refused.</p>
      <div className="p006-refused">
        <button className="p006-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'record-bid' }))}>Record a bid</button>
        <button className="p006-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'prepare-contract' }))}>Prepare a contract</button>
        <button className="p006-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'release-finance' }))}>Release finance</button>
      </div>
    </section>
  </section>
}
