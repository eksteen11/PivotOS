'use client'

import { useState } from 'react'
import { actionPlanNextMove, missingPlanFields, planFields, type ActionPlan, type PlanField } from '@/lib/workspace/actionPlan'
import type { WorkCase } from '@/lib/workspace/model'
import './action-plan.css'

export function PlanFields({ plan, onChange, disabled = false }: { plan: ActionPlan; onChange: (plan: ActionPlan) => void; disabled?: boolean }) {
  return <fieldset disabled={disabled} className="pivot-new-work-fields">
    {planFields.map(({ key, label }) => <label key={key}>{label}<textarea rows={2} maxLength={2000} value={plan[key]} onChange={(event) => onChange({ ...plan, [key]: event.target.value })} /></label>)}
    <label>Owner type<select aria-label="Owner type" value={plan.ownerType} onChange={(event) => onChange({ ...plan, ownerType: event.target.value as ActionPlan['ownerType'] })}><option value="person">Person — track their work manually</option><option value="agent">Agent — proposed assignment only</option></select></label>
    {plan.ownerType === 'agent' ? <p className="pivot-notice">Agent execution is not connected. This records an intended assignment only.</p> : null}
  </fieldset>
}

export function NextPlanQuestion({ plan, onChange, disabled = false }: { plan: ActionPlan; onChange: (plan: ActionPlan) => void; disabled?: boolean }) {
  const [activeKey, setActiveKey] = useState<PlanField | undefined>(() => missingPlanFields(plan)[0]?.key)
  const next = planFields.find(({ key }) => key === activeKey)
  if (!next) return <p className="pivot-notice" role="status">The plan is ready for your review. Saving does not approve or start it.</p>
  return <div className="pivot-intake-chat-round" key={next.key}><p>{next.question}</p><label>{next.label}<textarea rows={2} maxLength={2000} value={plan[next.key]} disabled={disabled} onChange={(event) => onChange({ ...plan, [next.key]: event.target.value })} /></label><button type="button" className="pivot-button-secondary" disabled={disabled || !plan[next.key].trim()} onClick={() => setActiveKey(missingPlanFields(plan)[0]?.key)}>Use this answer</button></div>
}

export function PlanSummary({ plan }: { plan: ActionPlan }) {
  return <dl className="pivot-plan-summary">{planFields.map(({ key, label }) => <div key={key}><dt>{label}</dt><dd>{plan[key] || 'Needs your answer'}</dd></div>)}<div><dt>Owner type</dt><dd>{plan.ownerType === 'agent' ? 'Proposed agent assignment · not connected' : 'Person · progress recorded manually'}</dd></div></dl>
}

export function ActionPlanReview({ item, busy, onAction, onPlan, onTasks }: { item: WorkCase; busy: boolean; onAction: (action: Record<string, unknown>) => Promise<void>; onPlan: () => void; onTasks: () => void }) {
  const next = actionPlanNextMove(item)
  if (!item.plan || !next) return null
  return <>
    <section aria-label="Actions to complete"><h3>Actions to complete</h3><ol>{item.plan.actions.map((action, index) => <li key={index}>{action}{item.checked.includes(index) ? ' · Complete' : ''}</li>)}</ol></section>
    <div className="pivot-next-action"><p className="pivot-eyebrow">Your next move</p><h3>{next.label}</h3><p>{next.detail}</p><button type="button" className="pivot-button" disabled={busy} onClick={() => {
      if (next.action === 'plan') onPlan()
      else if (next.action === 'tasks') onTasks()
      else void onAction({ kind: next.action })
    }}>{next.button}</button></div>
    <PlanSummary plan={item.plan} />
    <p className="pivot-notice">Saving records the plan. Approval records your decision. Starting and completing work are recorded separately. Pivot has not sent messages or run tools.</p>
    {item.status === 'planned' ? <button type="button" className="pivot-text-button" disabled={busy} onClick={onPlan}>Edit action plan</button> : null}
    {item.notes ? <details><summary>Context & notes</summary><p>{item.notes}</p></details> : null}
  </>
}

export function SavedActionPlanEditor({ item, busy, onSave }: { item: WorkCase; busy: boolean; onSave: (plan: ActionPlan) => Promise<void> }) {
  const [plan, setPlan] = useState(item.plan!)
  const [actionsText, setActionsText] = useState(item.plan!.actions.join('\n'))
  const [showAll, setShowAll] = useState(false)
  const [error, setError] = useState('')
  const actions = actionsText.split('\n').map((action) => action.trim()).filter(Boolean)
  const actionsValid = actions.length > 0 && actions.length <= 8 && actions.every((action) => action.length <= 180)
  if (item.status !== 'planned') return <><h3>Saved action plan</h3><PlanSummary plan={item.plan!} /><p className="pivot-notice">This work has started. Its original action plan stays attached to its progress and history.</p></>
  return <form className="pivot-form pivot-facts-form" onSubmit={async (event) => {
    event.preventDefault()
    setError('')
    try { await onSave({ ...plan, actions }) } catch (cause) { setError(cause instanceof Error ? cause.message : 'The plan was not saved. Your answers are still here.') }
  }}><h3>Complete the plan</h3><p>Answer the next missing detail. You can save now and finish later. Changes require a fresh approval.</p>
    {showAll ? null : <NextPlanQuestion plan={plan} onChange={setPlan} disabled={busy} />}
    <button type="button" className="pivot-text-button" aria-expanded={showAll} onClick={() => setShowAll((open) => !open)}>Edit all actions and plan details</button>
    {showAll ? <div><label htmlFor={`${item.id}-actions`}>Actions to complete · one per line</label><textarea id={`${item.id}-actions`} rows={4} maxLength={1500} value={actionsText} disabled={busy} onChange={(event) => setActionsText(event.target.value)} /><PlanFields plan={plan} onChange={setPlan} disabled={busy} /></div> : null}
    {error ? <p className="pivot-error" role="alert">{error}</p> : null}
    <button type="submit" className="pivot-button" disabled={busy || !actionsValid}>{busy ? 'Saving…' : 'Save plan details'}</button>
  </form>
}
