'use client'

import { useState } from 'react'
import { applyDeskAction, deskDecision, nextMove, pillarLabels, policyTopicLabels, stageLabels, type DeskState } from '../../../lib/modules/008/desk'
import { formatZar } from '../../../lib/modules/008/format'
import { presentFigures } from '../../../lib/modules/008/evidence'
import { groupLabels, shareholderGroups } from '../../../lib/modules/008/governance'
import { scorePortfolio } from '../../../lib/modules/008/score'
import './capital.css'

export function CapitalDesk({ initial }: { initial: DeskState }) {
  const [state, setState] = useState(initial)
  const [policyIts, setPolicyIts] = useState('')
  const [policyCj, setPolicyCj] = useState('')
  const [policyDj, setPolicyDj] = useState('')
  const [policySource, setPolicySource] = useState('')
  const [policyDate, setPolicyDate] = useState('2026-10-20')
  const [signed, setSigned] = useState(false)
  const [evidenceSource, setEvidenceSource] = useState('')
  const [evidenceDate, setEvidenceDate] = useState('2026-10-20')
  const [agreementSource, setAgreementSource] = useState('')
  const [agreementDate, setAgreementDate] = useState('2026-10-20')
  const [cashAmount, setCashAmount] = useState('')
  const [cashSource, setCashSource] = useState('')
  const [cashDate, setCashDate] = useState('2026-10-20')
  const [voteIts, setVoteIts] = useState('')
  const [voteCj, setVoteCj] = useState('')
  const [voteDj, setVoteDj] = useState('')
  const [verifier, setVerifier] = useState('')
  const move = nextMove(state)
  const decision = deskDecision(state)
  const score = scorePortfolio(state.score)
  const figures = presentFigures(state.figures)
  const now = () => new Date().toISOString()
  const topics = policyTopicLabels().map((topic) => topic.label).join(', ')
  return <section className="p008" aria-label="DigiKraal strategic growth and capital">
    <p className="p008-kicker">DigiKraal · Strategic growth and capital</p>
    <h1>{move.title}</h1>
    {state.example ? <p className="p008-note">Example only. Not a live venture, not a statutory share register, and not an investment.</p> : null}
    <p role="status">{state.message}</p>
    {state.alert ? <p role="alert">{state.alert}</p> : null}
    <section className="p008-action" aria-label="Your next action">
      <h2>{move.detail}</h2>
      {move.action === 'policy' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'record-policy', its: policyIts, cj: policyCj, dj: policyDj, source: policySource, sourceDate: policyDate, signed, at: now() }))
      }}>
        <p>Recording this says the signed pack decides every required risk point for this product: {topics}.</p>
        <label>ITS representative<input autoComplete="off" value={policyIts} onChange={(event) => setPolicyIts(event.target.value)} /></label>
        <label>CJ du Plessis<input autoComplete="off" value={policyCj} onChange={(event) => setPolicyCj(event.target.value)} /></label>
        <label>DJ Eksteen<input autoComplete="off" value={policyDj} onChange={(event) => setPolicyDj(event.target.value)} /></label>
        <label>Policy source<input autoComplete="off" value={policySource} onChange={(event) => setPolicySource(event.target.value)} /></label>
        <label>Policy date<input type="date" value={policyDate} onChange={(event) => setPolicyDate(event.target.value)} /></label>
        <label className="p008-check"><input type="checkbox" checked={signed} onChange={(event) => setSigned(event.target.checked)} /> Signed pack, not a draft</label>
        <button className="p008-primary" type="submit">Record signed policy</button>
      </form> : null}
      {move.action === 'stop' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'clear-stop', conditionId: move.conditionId ?? '', source: evidenceSource, sourceDate: evidenceDate, at: now() }))
      }}>
        <label>Evidence source<input autoComplete="off" value={evidenceSource} onChange={(event) => setEvidenceSource(event.target.value)} /></label>
        <label>Evidence date<input type="date" value={evidenceDate} onChange={(event) => setEvidenceDate(event.target.value)} /></label>
        <button className="p008-primary" type="submit">Record current evidence</button>
      </form> : null}
      {move.action === 'condition' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'satisfy-agreement', conditionId: move.conditionId ?? '', source: agreementSource, sourceDate: agreementDate, at: now() }))
      }}>
        <label>Agreement source<input autoComplete="off" value={agreementSource} onChange={(event) => setAgreementSource(event.target.value)} /></label>
        <label>Agreement date<input type="date" value={agreementDate} onChange={(event) => setAgreementDate(event.target.value)} /></label>
        <button className="p008-primary" type="submit">Record signed agreements</button>
      </form> : null}
      {move.action === 'cash' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'record-cash', amountRands: cashAmount, source: cashSource, sourceDate: cashDate, at: now() }))
      }}>
        <label>Verified cash (R)<input inputMode="decimal" value={cashAmount} onChange={(event) => setCashAmount(event.target.value)} /></label>
        <label>Cash source<input autoComplete="off" value={cashSource} onChange={(event) => setCashSource(event.target.value)} /></label>
        <label>Cash date<input type="date" value={cashDate} onChange={(event) => setCashDate(event.target.value)} /></label>
        <button className="p008-primary" type="submit">Record verified cash</button>
      </form> : null}
      {move.action === 'votes' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'record-votes', its: voteIts, cj: voteCj, dj: voteDj, verifier, at: now() }))
      }}>
        <label>ITS representative<input autoComplete="off" value={voteIts} onChange={(event) => setVoteIts(event.target.value)} /></label>
        <label>CJ du Plessis<input autoComplete="off" value={voteCj} onChange={(event) => setVoteCj(event.target.value)} /></label>
        <label>DJ Eksteen<input autoComplete="off" value={voteDj} onChange={(event) => setVoteDj(event.target.value)} /></label>
        <label>Verifier<input autoComplete="off" value={verifier} onChange={(event) => setVerifier(event.target.value)} /></label>
        <button className="p008-primary" type="submit">Record board decision</button>
      </form> : null}
    </section>
    <section className="p008-block" aria-label="Venture">
      <h2>{state.venture.name}</h2>
      <dl>
        <div><dt>Stage</dt><dd>{stageLabels[state.venture.stage]}</dd></div>
        <div><dt>Pillar</dt><dd>{state.venture.pillar ? pillarLabels[state.venture.pillar] : 'Not recorded'}</dd></div>
        <div><dt>Participant</dt><dd>{state.venture.participantType ? `Type ${state.venture.participantType}` : 'Not an Ubuntu participant'}</dd></div>
        <div><dt>Product</dt><dd>{state.venture.product === 'camp_cattle' ? 'Camp and cattle' : state.venture.product === 'working_capital' ? 'Working capital' : 'Not set'}</dd></div>
        <div><dt>Tranche</dt><dd>{formatZar(state.amountCents)}</dd></div>
        <div><dt>Requester</dt><dd>{state.requester}</dd></div>
      </dl>
    </section>
    <section className="p008-block" aria-label="Governance">
      <h2>Approval required</h2>
      <p>Before a vote, capital release needs a formal record from {shareholderGroups.map((group) => groupLabels[group]).join(', ')}. A WhatsApp message does not decide it.</p>
      <p>The requester cannot verify their own request. Nothing on this screen moves money.</p>
    </section>
    <section className="p008-block" aria-label="Release gate">
      <h2>Release gate</h2>
      {decision.status === 'authorised' ? <p>{decision.statement} Receipt is unconfirmed.</p> : <ul>{decision.blockers.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>}
    </section>
    <section className="p008-block" aria-label="Money figures">
      <h2>Money figures</h2>
      <p>These figures are not added together.</p>
      <ul>{figures.map((item) => <li key={item.label}><h3>{item.label}</h3><p className="p008-amount">{item.amount}</p><p>{item.caution}</p></li>)}</ul>
    </section>
    <section className="p008-block" aria-label="Conditions">
      <h2>Conditions</h2>
      <ul>{state.conditions.map((item) => <li key={item.id}><h3>{item.label}</h3><p>{item.state === 'satisfied' ? 'Satisfied on the recorded grade' : item.state === 'overdue' ? 'Overdue' : 'Open'}</p></li>)}</ul>
    </section>
    <section className="p008-block" aria-label="Portfolio score">
      <h2>Portfolio score</h2>
      {score.points === null ? <ul>{score.blockers.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{score.points} points</p>}
      <p>{score.statement}</p>
    </section>
    <section className="p008-block" aria-label="Outside this module">
      <h2>Not done here</h2>
      <p>Transfers, investments and distributions stay refused.</p>
      <div className="p008-refused">
        <button className="p008-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'transfer' }))}>Transfer funds</button>
        <button className="p008-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'invest' }))}>Invest</button>
        <button className="p008-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'distribute' }))}>Pay a distribution</button>
        <button className="p008-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'record-whatsapp', at: now() }))}>Record a WhatsApp approval</button>
      </div>
    </section>
  </section>
}
