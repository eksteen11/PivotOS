'use client'

import { useState } from 'react'
import { receivingCapabilities, type EvidenceKind, type ExperimentResult, type MoneyLabel, type ReceivingCapability } from '../../../lib/modules/010/contract'
import { applyDeskAction, currentHandover, nextMove, type DeskState } from '../../../lib/modules/010/desk'
import { budgetStatement } from '../../../lib/modules/010/decisions'
import { advisoryScore } from '../../../lib/modules/010/evidence'
import { formatZar } from '../../../lib/modules/010/format'
import { capabilityLabel } from '../../../lib/modules/010/route'
import './opportunity-lab.css'

const kinds: { value: EvidenceKind; label: string }[] = [
  { value: 'conversation', label: 'Level 0 · Conversation' },
  { value: 'indication', label: 'Level 1 · Named contact or problem' },
  { value: 'external', label: 'Level 2 · Interview, quote or site evidence' },
  { value: 'commercial', label: 'Level 3 · Written interest or verified economics' },
  { value: 'pilot', label: 'Level 4 · Pilot result' },
  { value: 'investment-ready', label: 'Level 5 · Brief for Capability 008' },
]

const moneyLabels: { value: MoneyLabel; label: string }[] = [
  { value: 'not-money', label: 'Not a money figure' },
  { value: 'estimate', label: 'Estimate' },
  { value: 'quote', label: 'Quotation' },
  { value: 'approved-case', label: 'Approved case, from the source' },
  { value: 'actual', label: 'Actual, from the source' },
]

export function OpportunityLabDesk({ initial }: { initial: DeskState }) {
  const [state, setState] = useState(initial)
  const [kind, setKind] = useState<EvidenceKind>('indication')
  const [claim, setClaim] = useState('')
  const [source, setSource] = useState('')
  const [sourceDate, setSourceDate] = useState('2026-10-25')
  const [wording, setWording] = useState('')
  const [moneyLabel, setMoneyLabel] = useState<MoneyLabel>('not-money')
  const [owner, setOwner] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [method, setMethod] = useState('')
  const [testOwner, setTestOwner] = useState(initial.idea.explorationOwner)
  const [start, setStart] = useState('2026-10-26')
  const [end, setEnd] = useState('2026-11-08')
  const [cost, setCost] = useState('')
  const [noMoney, setNoMoney] = useState(false)
  const [capacity, setCapacity] = useState('')
  const [success, setSuccess] = useState('')
  const [stop, setStop] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [result, setResult] = useState<ExperimentResult>('supported')
  const [lesson, setLesson] = useState('')
  const [lane, setLane] = useState<ReceivingCapability>('004')
  const [decisionMaker, setDecisionMaker] = useState('')
  const [receivingOwner, setReceivingOwner] = useState('')
  const [milestone, setMilestone] = useState('')
  const [scope, setScope] = useState('')
  const [assumptions, setAssumptions] = useState('')
  const [questions, setQuestions] = useState('')
  const [risks, setRisks] = useState('')
  const [handoverOn, setHandoverOn] = useState('2026-10-25')
  const [acceptName, setAcceptName] = useState('')
  const [parkReason, setParkReason] = useState('')
  const [parkMissing, setParkMissing] = useState('')
  const [parkOn, setParkOn] = useState('2026-12-01')
  const [parkTrigger, setParkTrigger] = useState('')
  const [parkOwner, setParkOwner] = useState('')
  const [rejectBy, setRejectBy] = useState('')
  const [rejectReasons, setRejectReasons] = useState('')
  const [rejectLesson, setRejectLesson] = useState('')
  const [reopenWhen, setReopenWhen] = useState('')
  const move = nextMove(state)
  const handover = currentHandover(state)
  const score = advisoryScore(state.evidence)
  const now = () => new Date().toISOString()
  const act = (action: Parameters<typeof applyDeskAction>[1]) => setState(applyDeskAction(state, action))
  return <section className="p010" aria-label="DigiKraal opportunity lab" data-module="010" data-stage={state.idea.stage} data-commitment="none" data-executes="false" data-handover={handover?.status ?? 'none'} data-route={state.route.capabilities.join(',') || 'unassigned'} data-provider="not-connected">
    <p className="p010-kicker">010 · DigiKraal · Opportunity Lab</p>
    <h1>{move.title}</h1>
    <p className="p010-promise">{state.idea.commitment.statement}</p>
    <p className="p010-lane">One canonical record. Another lane receives it only after the receiving owner accepts.</p>
    {state.example ? <p className="p010-note">Example only. This custom-feeding note is not an approved venture.</p> : null}
    <p role="status">{state.message}</p>
    {state.alert ? <p role="alert">{state.alert}</p> : null}
    <section className="p010-action" aria-label="Your next action">
      <h2>{move.detail}</h2>
      {move.action === 'owner' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'name-owner', owner, at: now() }) }}>
        <label>Exploration owner<input value={owner} onChange={(event) => setOwner(event.target.value)} /></label>
        <button className="p010-primary" type="submit">Save the owner</button>
      </form> : null}
      {move.action === 'evidence' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'add-evidence', kind, claim, source, sourceDate, originalWording: wording, moneyLabel, at: now() }) }}>
        <label>Evidence<select value={kind} onChange={(event) => setKind(event.target.value as EvidenceKind)}>{kinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>What is known<input value={claim} onChange={(event) => setClaim(event.target.value)} /></label>
        <label>Source<input value={source} onChange={(event) => setSource(event.target.value)} /></label>
        <label>Source date<input type="date" value={sourceDate} onChange={(event) => setSourceDate(event.target.value)} /></label>
        <label>Original wording<textarea value={wording} onChange={(event) => setWording(event.target.value)} /></label>
        <label>Money figure<select value={moneyLabel} onChange={(event) => setMoneyLabel(event.target.value as MoneyLabel)}>{moneyLabels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <button className="p010-primary" type="submit">Add evidence</button>
      </form> : null}
      {move.action === 'experiment' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'propose-experiment', hypothesis, method, owner: testOwner, start, end, costRands: cost, explicitZero: noMoney, capacityNote: capacity, successThreshold: success, stopCondition: stop, at: now() }) }}>
        <label>Hypothesis<input value={hypothesis} onChange={(event) => setHypothesis(event.target.value)} /></label>
        <label>Method<input value={method} onChange={(event) => setMethod(event.target.value)} /></label>
        <label>Test owner<input value={testOwner} onChange={(event) => setTestOwner(event.target.value)} /></label>
        <label>Start<input type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label>
        <label>End<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label>
        <label>Cost (R)<input inputMode="decimal" value={cost} onChange={(event) => setCost(event.target.value)} /></label>
        <label className="p010-check"><input type="checkbox" checked={noMoney} onChange={(event) => setNoMoney(event.target.checked)} /> No money is required</label>
        <label>Capacity<input value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label>
        <label>Success line<input value={success} onChange={(event) => setSuccess(event.target.value)} /></label>
        <label>Stop line<input value={stop} onChange={(event) => setStop(event.target.value)} /></label>
        <button className="p010-primary" type="submit">Propose the test</button>
      </form> : null}
      {move.action === 'approve-experiment' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'approve-experiment', by: reviewer, at: now() }) }}>
        <label>Decision-maker<input value={reviewer} onChange={(event) => setReviewer(event.target.value)} /></label>
        <button className="p010-primary" type="submit">Approve the test limit</button>
      </form> : null}
      {move.action === 'start-experiment' ? <button className="p010-primary" type="button" onClick={() => act({ type: 'start-experiment', by: state.experiment?.owner ?? '', at: now() })}>Record the test as started</button> : null}
      {move.action === 'complete-experiment' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'complete-experiment', by: state.experiment?.owner ?? '', result, lesson, at: now() }) }}>
        <label>Result<select value={result} onChange={(event) => setResult(event.target.value as ExperimentResult)}><option value="supported">Supported</option><option value="not_supported">Not supported</option><option value="inconclusive">Inconclusive</option></select></label>
        <label>Lesson<input value={lesson} onChange={(event) => setLesson(event.target.value)} /></label>
        <button className="p010-primary" type="submit">Record the result</button>
      </form> : null}
      {move.action === 'route' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'set-route', capabilities: [lane], by: state.idea.explorationOwner || 'Exploration owner', at: now() }) }}>
        <label>Receiving capability<select value={lane} onChange={(event) => setLane(event.target.value as ReceivingCapability)}>{receivingCapabilities.map((id) => <option key={id} value={id}>{capabilityLabel(id)}</option>)}</select></label>
        <button className="p010-primary" type="submit">Save the suggested route</button>
      </form> : null}
      {move.action === 'handover' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'propose-handover', proposedBy: decisionMaker, receivingOwner, scope, assumptions, openQuestions: questions, risks, nextMilestone: milestone, handoverOn, at: now() }) }}>
        <label>Decision-maker<input value={decisionMaker} onChange={(event) => setDecisionMaker(event.target.value)} /></label>
        <label>Receiving owner<input value={receivingOwner} onChange={(event) => setReceivingOwner(event.target.value)} /></label>
        <label>Next milestone<input value={milestone} onChange={(event) => setMilestone(event.target.value)} /></label>
        <label>Scope<textarea value={scope} onChange={(event) => setScope(event.target.value)} /></label>
        <label>Assumptions<textarea value={assumptions} onChange={(event) => setAssumptions(event.target.value)} /></label>
        <label>Open questions<textarea value={questions} onChange={(event) => setQuestions(event.target.value)} /></label>
        <label>Risks<textarea value={risks} onChange={(event) => setRisks(event.target.value)} /></label>
        <label>Handover date<input type="date" value={handoverOn} onChange={(event) => setHandoverOn(event.target.value)} /></label>
        <button className="p010-primary" type="submit">Propose handover</button>
      </form> : null}
      {move.action === 'accept-handover' ? <form onSubmit={(event) => { event.preventDefault(); act({ type: 'accept-handover', by: acceptName, at: now() }) }}>
        <label>Your name<input value={acceptName} onChange={(event) => setAcceptName(event.target.value)} /></label>
        <button className="p010-primary" type="submit">Accept handover</button>
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'decline-handover', by: acceptName, at: now() })}>Decline handover</button>
      </form> : null}
      {move.action === 'evidence' ? <details>
        <summary>Park or reject</summary>
        <form onSubmit={(event) => { event.preventDefault(); act({ type: 'park', reason: parkReason, missingCondition: parkMissing, reviewOn: parkOn, trigger: parkTrigger, owner: parkOwner, at: now() }) }}>
          <label>Reason<input value={parkReason} onChange={(event) => setParkReason(event.target.value)} /></label>
          <label>Missing condition<input value={parkMissing} onChange={(event) => setParkMissing(event.target.value)} /></label>
          <label>Review date<input type="date" value={parkOn} onChange={(event) => setParkOn(event.target.value)} /></label>
          <label>Trigger<input value={parkTrigger} onChange={(event) => setParkTrigger(event.target.value)} /></label>
          <label>Park owner<input value={parkOwner} onChange={(event) => setParkOwner(event.target.value)} /></label>
          <button className="p010-quiet" type="submit">Park this idea</button>
        </form>
        <form onSubmit={(event) => { event.preventDefault(); act({ type: 'reject', by: rejectBy, reasons: rejectReasons, lesson: rejectLesson, reopenWhen, at: now() }) }}>
          <label>Decision-maker<input value={rejectBy} onChange={(event) => setRejectBy(event.target.value)} /></label>
          <label>Reasons<textarea value={rejectReasons} onChange={(event) => setRejectReasons(event.target.value)} /></label>
          <label>Lesson<input value={rejectLesson} onChange={(event) => setRejectLesson(event.target.value)} /></label>
          <label>What could reopen it<input value={reopenWhen} onChange={(event) => setReopenWhen(event.target.value)} /></label>
          <button className="p010-quiet" type="submit">Reject this idea</button>
        </form>
      </details> : null}
    </section>
    <section className="p010-block" aria-label="Idea">
      <h2>{state.idea.title}</h2>
      <dl>
        <div><dt>Originator</dt><dd>{state.idea.originator}</dd></div>
        <div><dt>Source</dt><dd>{state.idea.source}</dd></div>
        <div><dt>Stage</dt><dd>{state.idea.stage}</dd></div>
        <div><dt>Status</dt><dd>{state.idea.status}</dd></div>
        <div><dt>Exploration owner</dt><dd>{state.idea.explorationOwner || 'Not named'}</dd></div>
        <div><dt>Company</dt><dd>{state.idea.company === 'digikraal' ? 'DigiKraal' : 'Personal'}</dd></div>
      </dl>
      <p>Original wording: {state.idea.originalWording}</p>
    </section>
    <section className="p010-block" aria-label="Route">
      <h2>Suggested route</h2>
      {state.route.capabilities.length ? <p className="p010-routes">{state.route.capabilities.map((id) => capabilityLabel(id)).join(' · ')}</p> : <p>No lane is suggested yet.</p>}
      <p>{state.route.reason}</p>
      {state.route.requires008 ? <p>Capability 008 stays on this route. Capital is not approved.</p> : null}
    </section>
    <section className="p010-block" aria-label="Evidence">
      <h2>Evidence</h2>
      <p>{score.statement}{score.strongest === null ? '' : ` Strongest level: ${score.strongest}.`}</p>
      {state.evidence.length ? <ul>{state.evidence.map((item) => <li key={item.id}><h3>Level {item.level}</h3><p>{item.claim}</p><p>{item.caution}</p><p>{item.source} · {item.sourceDate}</p><p>Original wording: {item.originalWording}</p></li>)}</ul> : <p>No evidence yet.</p>}
    </section>
    <section className="p010-block" aria-label="Test">
      <h2>Test</h2>
      {state.experiment ? <>
        <p>{state.experiment.hypothesis}</p>
        <p>Status: {state.experiment.status}. Limit: {formatZar(state.experiment.approvedCostCents ?? state.experiment.costCents)}. No payment is released.</p>
        {state.experiment.lesson ? <p>Lesson: {state.experiment.lesson}</p> : null}
      </> : <p>No test has been proposed.</p>}
    </section>
    <section className="p010-block" aria-label="Handover">
      <h2>Handover</h2>
      {handover ? <>
        <p>{handover.status}. Receiving owner: {handover.receivingOwner}.</p>
        <p>Next milestone: {handover.nextMilestone}.</p>
        <p>{budgetStatement(handover.budgetStatus)}</p>
      </> : <p>No handover has been proposed.</p>}
    </section>
    <section className="p010-block" aria-label="Outside this module">
      <h2>Not done here</h2>
      <p>Orders, signatures, spending, launches and scale stay refused.</p>
      <div className="p010-refused">
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'place-order', by: 'Founder', at: now() })}>Place an order</button>
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'sign', by: 'Founder', at: now() })}>Sign an agreement</button>
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'spend', by: 'Founder', at: now() })}>Spend money</button>
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'announce', by: 'Founder', at: now() })}>Announce a launch</button>
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'scale', by: 'Founder', at: now() })}>Scale this up</button>
        <button className="p010-quiet" type="button" onClick={() => act({ type: 'mark-profit', by: 'Founder', at: now() })}>Mark an estimate as profit</button>
      </div>
    </section>
  </section>
}
