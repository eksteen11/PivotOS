'use client'

import { useState } from 'react'
import { legalEntities } from '../../../lib/modules/009/entities'
import { applyDeskAction, exampleDeskState, laneCopy, nextMove, privateNoteFor, visibleMoney, type DeskState } from '../../../lib/modules/009/desk'
import { viewLabels } from '../../../lib/modules/009/obligation'
import './finance.css'

export function FinanceDesk({ initial }: { initial?: DeskState }) {
  const [state, setState] = useState(initial ?? exampleDeskState())
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const [date, setDate] = useState('2026-10-20')
  const [reference, setReference] = useState('')
  const [actor, setActor] = useState('')
  const [resolution, setResolution] = useState('')
  const [vatRate, setVatRate] = useState('')
  const [vatAmount, setVatAmount] = useState('')
  const move = nextMove(state)
  const money = visibleMoney(state)
  const note = money.obligation ? privateNoteFor(state) : ''
  const entity = legalEntities[state.entityId]
  const now = () => new Date().toISOString()
  const forecast = laneCopy(money.forecast)
  const accrual = laneCopy(money.accrual)
  const cash = laneCopy(money.cash)
  return <section className="p009" data-module="009" aria-label="Finance, treasury and administration">
    <p className="p009-kicker">009 · Finance, treasury and administration</p>
    <h1>{move.title}</h1>
    <p className="p009-quiet-copy">Inside Pivot OS. Clark is the shared finance workspace. Xero and Sage keep the statutory books.</p>
    <p className="p009-note">Example only. Not live finance data. Nothing on this screen is posted or paid.</p>
    <div className="p009-switch" role="group" aria-label="Legal entity">
      {(Object.keys(legalEntities) as (keyof typeof legalEntities)[]).map((id) => <button key={id} className="p009-quiet" type="button" aria-pressed={state.entityId === id} onClick={() => setState(applyDeskAction(state, { type: 'switch-entity', entityId: id }))}>{legalEntities[id].legalName}</button>)}
    </div>
    <div className="p009-switch" role="group" aria-label="Audience">
      <button className="p009-quiet" type="button" aria-pressed={state.audience === 'founder'} onClick={() => setState(applyDeskAction(state, { type: 'set-audience', audience: 'founder' }))}>Founder view</button>
      <button className="p009-quiet" type="button" aria-pressed={state.audience === 'shared'} onClick={() => setState(applyDeskAction(state, { type: 'set-audience', audience: 'shared' }))}>Shared finance view</button>
    </div>
    <p role="status">{state.message}</p>
    {state.alert ? <p role="alert">{state.alert}</p> : null}
    <section className="p009-action" aria-label="Your next action">
      <h2>{move.detail}</h2>
      {move.action === 'document' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'add-document', amountRands: amount, source, date, documentNumber: reference, at: now() }))
      }}>
        <label>Document amount (R)<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
        <label>Document number<input value={reference} onChange={(event) => setReference(event.target.value)} /></label>
        <label>Document source<input value={source} onChange={(event) => setSource(event.target.value)} /></label>
        <label>Document date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <button className="p009-primary" type="submit">Add supplier document</button>
      </form> : null}
      {move.action === 'bank' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'add-bank-evidence', amountRands: amount, source, date, reference, at: now() }))
      }}>
        <label>Bank amount (R)<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
        <label>Bank reference<input value={reference} onChange={(event) => setReference(event.target.value)} /></label>
        <label>Bank source<input value={source} onChange={(event) => setSource(event.target.value)} /></label>
        <label>Bank date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <button className="p009-primary" type="submit">Add bank evidence</button>
      </form> : null}
      {move.action === 'match' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'approve-match', actor, resolution, at: now() }))
      }}>
        <label>Finance user<input value={actor} onChange={(event) => setActor(event.target.value)} /></label>
        <label>Resolution<input value={resolution} onChange={(event) => setResolution(event.target.value)} /></label>
        <button className="p009-primary" type="submit">Approve the match</button>
      </form> : null}
      {move.action === 'decision' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'approve-accounting', actor, at: now() }))
      }}>
        <label>Finance user<input value={actor} onChange={(event) => setActor(event.target.value)} /></label>
        <button className="p009-primary" type="submit">Record the decision</button>
      </form> : null}
      {move.action === 'prepare' ? <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'prepare-payment', actor, at: now() }))
      }}>
        <label>Finance user<input value={actor} onChange={(event) => setActor(event.target.value)} /></label>
        <button className="p009-primary" type="submit">Prepare the instruction</button>
      </form> : null}
      {move.action === 'done' ? <p>Prepared is not paid. Released stays false.</p> : null}
      {move.action === 'other-entity' ? <p>Switch back to the obligation’s legal entity. Balances are not pooled.</p> : null}
    </section>
    <section className="p009-block" aria-label="Amount lanes">
      <h2>Three amounts, kept apart</h2>
      <div className="p009-lanes">
        <article className="p009-lane" data-basis="forecast"><h3>Forecast</h3><p className="p009-amount">{forecast.figure}</p><p>{forecast.caution}</p></article>
        <article className="p009-lane" data-basis="accrual"><h3>Accrual</h3><p className="p009-amount">{accrual.figure}</p><p>{accrual.caution}</p></article>
        <article className="p009-lane" data-basis="cash"><h3>Cash-backed</h3><p className="p009-amount">{cash.figure}</p><p>{cash.caution}</p></article>
      </div>
    </section>
    <section className="p009-block" aria-label="Obligation">
      <h2>One obligation</h2>
      {money.obligation ? <>
        <p>{money.obligation.title}</p>
        <p>{money.obligation.id} · {entity.legalName} · {entity.ledger === 'xero' ? 'Xero' : 'Sage'}</p>
        <ul>{money.obligation.views.map((view) => <li key={view}>{viewLabels[view]}</li>)}</ul>
      </> : <p>No obligation is shown for {entity.legalName}. {entity.ledger === 'xero' ? 'Xero' : 'Sage'} remains its statutory ledger.</p>}
    </section>
    {money.obligation ? <section className="p009-block" aria-label="Exception">
      <h2>{state.exception.closed ? 'Exception closed' : 'Exception open'}</h2>
      <p>{state.exception.proposedResolution}</p>
      <p>{state.exception.closed ? state.exception.decision : 'Missing evidence is not treated as zero.'}</p>
    </section> : null}
    {note ? <section className="p009-block" aria-label="Private founder note"><h2>Private founder note</h2><p>{note}</p><p>Not shown to Clark users.</p></section> : null}
    <section className="p009-block" aria-label="VAT check">
      <h2>VAT check</h2>
      <p>{state.vatNote || 'VAT is calculated only for the entity on screen. DK Agri cannot inherit Digikraal’s code. Nothing is submitted.'}</p>
      <form onSubmit={(event) => {
        event.preventDefault()
        setState(applyDeskAction(state, { type: 'apply-vat', ratePercent: vatRate, amountRands: vatAmount }))
      }}>
        <label>Exclusive amount (R)<input inputMode="decimal" value={vatAmount} onChange={(event) => setVatAmount(event.target.value)} /></label>
        <label>VAT rate<input inputMode="decimal" value={vatRate} onChange={(event) => setVatRate(event.target.value)} /></label>
        <button className="p009-quiet" type="submit">Check VAT</button>
      </form>
    </section>
    <section className="p009-block" aria-label="Outside this module">
      <h2>Not done here</h2>
      <p>Posting, bank release and payment claims stay refused. Payroll source is not confirmed.</p>
      {money.obligation && state.match ? <p>Match {state.match.status}. {state.match.explanation} Confidence is not scored.</p> : null}
      {money.obligation && state.approval ? <p>Accounting decision recorded. Posted: no.</p> : null}
      {money.obligation && state.payment ? <p>Payment instruction {state.payment.status}. Released: no.</p> : null}
      <div className="p009-refused">
        <button className="p009-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'post-ledger' }))}>Post to the ledger</button>
        <button className="p009-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'release-bank' }))}>Release at the bank</button>
        <button className="p009-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'claim-paid', actor: actor || 'Drikus' }))}>Mark as paid</button>
      </div>
    </section>
  </section>
}
