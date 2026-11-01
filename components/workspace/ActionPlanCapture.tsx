'use client'

import { useState } from 'react'
import { companies, getSystem, systems, systemFitsCompany, type Company } from '@/lib/workspace/catalogue'
import { emptyActionPlan, missingPlanFields, type ActionPlan } from '@/lib/workspace/actionPlan'
import type { WorkInput } from '@/lib/workspace/model'
import { Dialog } from './Dialog'
import { NextPlanQuestion, PlanFields, PlanSummary } from './ActionPlanReview'
import './action-plan.css'

export function NewWork({ preferred, systemId, onClose, onSave, busy, error }: { preferred?: Company; systemId?: string; onClose: () => void; onSave: (input: WorkInput, id: string) => Promise<void>; busy: boolean; error?: string }) {
  const [step, setStep] = useState(1)
  const [actionsText, setActionsText] = useState('')
  const [company, setCompany] = useState<Company | ''>(preferred ?? '')
  const [division, setDivision] = useState(systemId ?? '')
  const [plan, setPlan] = useState<ActionPlan>(() => emptyActionPlan())
  const [notes, setNotes] = useState('')
  const [due, setDue] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [id] = useState(() => crypto.randomUUID())
  const actions = actionsText.split('\n').map((action) => action.trim()).filter(Boolean)
  const validActions = actions.length > 0 && actions.length <= 8 && actions.every((action) => action.length <= 180)
  const selectedDivision = getSystem(division)
  const validContext = Boolean(company && selectedDivision && systemFitsCompany(selectedDivision, company))
  const next = () => setStep((current) => Math.min(current + 1, 3))
  return <Dialog onClose={onClose} label="New work">
    <form className="pivot-form pivot-new-work-form" onSubmit={(event) => {
      event.preventDefault()
      if (busy) return
      if (step < 3) { if (validActions && (step === 1 || validContext)) next(); return }
      if (!company || !validActions || !validContext) return
      void onSave({ title: actions[0], company, systemId: division, notes, due, plan: { ...plan, actions } }, id)
    }}>
      <div className="pivot-form-scroll">
        <div className="pivot-new-work-heading"><p className="pivot-eyebrow">{step} OF 3 · {step === 1 ? 'ACTIONS FIRST' : step === 2 ? 'WHO & WHERE' : 'THE PLAN'}</p>
        <h2>{step === 1 ? 'What needs to get done?' : step === 2 ? 'Who is this for?' : 'How will it happen?'}</h2>
        <p>{step === 1 ? 'List the main actions, one per line. Add the people and business next.' : step === 2 ? 'Keep these actions together for one person or project, in one business and division.' : 'Name the outcome and owner, then the method, tools, inputs and timing. Unknown details can wait.'}</p></div>
        <fieldset disabled={busy} className="pivot-new-work-fields">
          {step === 1 ? <><label>Actions to complete · one per line<textarea required autoFocus rows={5} maxLength={1500} value={actionsText} onChange={(event) => setActionsText(event.target.value)} placeholder={'Confirm the seller’s availability\nPrepare the visit brief\nFollow up on missing certificates'} /></label><small>Up to 8 actions, 180 characters each. Use a separate plan when the owner or business differs.</small>{actions.length > 8 || actions.some((action) => action.length > 180) ? <p className="pivot-error" role="alert">Use up to 8 actions, each no longer than 180 characters.</p> : null}</> : <section aria-label="Your action list"><h3>Actions to complete</h3><ol>{actions.map((action, index) => <li key={index}>{action}</li>)}</ol></section>}
          {step === 2 ? <><label>Person, customer or project<input autoFocus maxLength={2000} value={plan.forWhom} onChange={(event) => setPlan({ ...plan, forWhom: event.target.value })} placeholder="e.g. CP van der Merwe · Ceres visit" /></label><div className="pivot-form-columns"><label>Business<select aria-label="Business" required value={company} onChange={(event) => { setCompany(event.target.value as Company | ''); setDivision('') }}><option value="">Choose a business</option>{companies.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label><label>Division<select aria-label="Division" required disabled={!company} value={division} onChange={(event) => setDivision(event.target.value)}><option value="">Choose a division</option>{company ? systems.filter((system) => systemFitsCompany(system, company)).map((system) => <option key={system.id} value={system.id}>{system.name}</option>) : null}</select></label></div><details className="pivot-optional-details"><summary>Add source context or notes</summary><div><label htmlFor={`${id}-notes`}>Context & notes</label><textarea id={`${id}-notes`} rows={3} maxLength={12000} value={notes} onChange={(event) => setNotes(event.target.value)} /></div></details></> : null}
          {step === 3 ? <><p>{companies.find((entry) => entry.id === company)?.name} · {getSystem(division)?.name}</p>{showAll ? null : <NextPlanQuestion plan={plan} onChange={setPlan} disabled={busy} />}<button type="button" className="pivot-text-button" aria-expanded={showAll} onClick={() => setShowAll((open) => !open)}>Review or edit all plan details</button>{showAll ? <div><PlanFields plan={plan} onChange={setPlan} disabled={busy} /><label>Follow-up date <span className="pivot-optional">Optional · not a meeting booking</span><input type="date" value={due} onChange={(event) => setDue(event.target.value)} /></label><PlanSummary plan={plan} /></div> : null}<p className="pivot-notice">{missingPlanFields(plan).length ? 'Save now if you need to return later. The plan will show the next unanswered question.' : 'Next after saving: review and approve the plan. Work starts only when you record its start.'}</p></> : null}
        </fieldset>
      </div>
      <div className="pivot-new-work-bottom">
        {error ? <p className="pivot-error" role="alert">{error}</p> : null}
        <div className="pivot-form-footer"><button type="button" className="pivot-button-secondary" disabled={busy} onClick={step === 1 ? onClose : () => { setShowAll(false); setStep(step - 1) }}>{step === 1 ? 'Cancel' : 'Back'}</button>{step < 3 ? <button key="continue" type="button" className="pivot-button" disabled={busy || !validActions || (step === 2 && !validContext)} onClick={next}>{step === 1 ? 'Who is this for?' : 'Build the plan'}</button> : <button key="save" type="submit" className="pivot-button" disabled={busy || !validActions || !validContext}>{busy ? 'Saving…' : 'Save action plan'}</button>}</div>
        <p className="pivot-new-work-note">Saves the actions and answers. Nothing is approved, sent or started.</p>
      </div>
    </form>
  </Dialog>
}
