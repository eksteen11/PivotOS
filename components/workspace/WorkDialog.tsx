'use client'
import { useState } from 'react'
import { getCompany, getSystem } from '@/lib/workspace/catalogue'
import { caseSteps, type WorkCase } from '@/lib/workspace/model'
import { isFounderReviewedWork, isReviewedIntakeWork, reviewedWorkStart, workStatusLabel } from '@/lib/workspace/workLink'
import { PivotIcon } from './PivotIcon'
import { Dialog } from './Dialog'
import { ActionPlanReview, SavedActionPlanEditor } from './ActionPlanReview'
import { actionPlanNextMove } from '@/lib/workspace/actionPlan'

export { Dialog } from './Dialog'
export { NewWork } from './ActionPlanCapture'

export function CaseDetail({ item, busy, onClose, onAction, error, onClearError }: { item: WorkCase; busy: boolean; onClose: () => void; onAction: (action: Record<string, unknown>) => Promise<void>; error?: string; onClearError: () => void }) {
  const [tab, setTab] = useState('Overview'); const [facts, setFacts] = useState(item.facts); const [lesson, setLesson] = useState('')
  const [sourceState, setSourceState] = useState<{ loading: boolean; transcript: string; summary: string; error: string }>({ loading: false, transcript: '', summary: '', error: '' })
  const system = getSystem(item.systemId)!
  const steps = caseSteps(item)
  const referenceOnly = steps.length === 0
  const reviewedStart = reviewedWorkStart(item.status, item.source)
  const planNext = actionPlanNextMove(item)
  const runAction = async (action: Record<string, unknown>) => { try { await onAction(action) } catch { /* Dialog error text is controlled by parent state. */ } }
  const tabs = ['Overview', ...(item.plan ? ['Plan'] : []), 'Tasks', 'Details', 'Learning', 'History', ...(item.intake?.sourceCaptureId ? ['Source'] : [])]
  async function loadSource() {
    if (!item.intake?.sourceCaptureId || sourceState.loading || sourceState.transcript) return
    if (isReviewedIntakeWork(item.source)) {
      const evidence = [
        item.facts['Provider message'] ? `Provider message: ${item.facts['Provider message']}` : '',
        item.facts['Intake item'] ? `Intake item: ${item.facts['Intake item']}` : '',
        item.facts['Original group'] ? `Original group: ${item.facts['Original group']}` : '',
        item.facts['Original sender'] ? `Original sender: ${item.facts['Original sender']}` : '',
        item.notes,
      ].filter(Boolean).join('\n\n')
      setSourceState({
        loading: false,
        transcript: evidence || 'Source evidence was retained on this work draft.',
        summary: 'WhatsApp intake approval · evidence retained · nothing sent or published externally',
        error: '',
      })
      return
    }
    setSourceState({ loading: true, transcript: '', summary: '', error: '' })
    try {
      const response = await fetch(`/api/intake/source/${item.intake.sourceCaptureId}`)
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(String(body.error ?? 'Could not load source transcript.'))
      setSourceState({
        loading: false,
        transcript: String(body.transcript ?? ''),
        summary: String(body.summary ?? ''),
        error: '',
      })
    } catch (sourceError) {
      setSourceState({
        loading: false,
        transcript: '',
        summary: '',
        error: sourceError instanceof Error ? sourceError.message : 'Could not load source transcript.',
      })
    }
  }
  return <Dialog onClose={onClose} label="Work detail" wide><article className="pivot-case"><div className="pivot-case-heading"><p className="pivot-eyebrow">{getCompany(item.company)?.name} <span className="pivot-dot-divider">/</span> {system.id} · {system.name}</p><h2>{item.title}</h2><div className="pivot-case-meta"><span className={`pivot-status is-${item.status}`}>{planNext?.label ?? workStatusLabel(item.status, isFounderReviewedWork(item.source))}</span><span>{item.source}</span>{item.due ? <span>Follow up {item.due}</span> : null}</div></div><div className="pivot-tabs" role="tablist" aria-label="Case views">{tabs.map((name) => <button key={name} role="tab" aria-selected={tab === name} className={tab === name ? 'is-active' : ''} onClick={() => { setTab(name); onClearError(); if (name === 'Source') void loadSource() }}>{name}</button>)}</div><div className="pivot-case-content" role="tabpanel" aria-label={tab}>{error ? <p className="pivot-error" role="alert">{error}</p> : null}
    {tab === 'Overview' && item.plan ? <ActionPlanReview item={item} busy={busy} onAction={runAction} onPlan={() => setTab('Plan')} onTasks={() => setTab('Tasks')} /> : null}
    {tab === 'Plan' && item.plan ? <SavedActionPlanEditor key={item.updatedAt} item={item} busy={busy} onSave={async (plan) => { await onAction({ kind: 'plan', plan }); setTab('Overview') }} /> : null}
    {tab === 'Overview' && !item.plan ? <><div className="pivot-context-note"><PivotIcon name="workforce" /><div><strong>Context, without the catch-up call.</strong><p>{item.notes || 'No notes yet. Add the known facts in Details; keep unknown values blank.'}</p></div></div><div className="pivot-next-action"><p className="pivot-eyebrow">Your next move</p><h3>{reviewedStart ? reviewedStart.heading : item.status === 'planned' ? 'Review this work plan' : item.status === 'done' ? 'Review what worked' : steps.find((_, i) => !item.checked.includes(i)) ?? 'Record the outcome and close the work'}</h3><p>{referenceOnly ? 'This record is saved as reference context and has no operational checklist.' : reviewedStart ? reviewedStart.detail : item.status === 'planned' ? 'Approval starts this internal checklist. Replies, bookings, posts and transactions need their own review and a connected tool.' : 'Your checklist records the work you complete. No agent or connected app has executed these steps.'}</p>{item.status === 'planned' ? <button className="pivot-button" disabled={busy} onClick={() => void runAction({ kind: 'approve' })}>{reviewedStart ? reviewedStart.action : 'Approve work plan'} <PivotIcon name="check" size={17} /></button> : referenceOnly ? <span className="pivot-notice">Saved reference only. No task execution checklist.</span> : <button className="pivot-button-secondary" onClick={() => setTab('Tasks')}>Open checklist <PivotIcon name="arrow" size={17} /></button>}</div><div className="pivot-ownership"><PivotIcon name="lock" size={17} /><div><strong>Record ownership</strong><p>{system.owner}. Linked-app handoff is not connected.</p></div></div></> : null}
    {tab === 'Tasks' ? <>{referenceOnly ? <p className="pivot-notice">This is a reference record (for notes, ideas, or outcomes). No operational checklist is applied.</p> : <><div className="pivot-section-title"><div><h3>The path to done</h3><p>{item.checked.length} of {steps.length} steps complete</p></div><span className="pivot-small-avatar">DJ</span></div><div className="pivot-progress"><span style={{ width: `${steps.length ? item.checked.length / steps.length * 100 : 0}%` }} /></div><div className="pivot-checklist">{steps.map((step, index) => <label key={step} className={item.checked.includes(index) ? 'is-done' : ''}><input type="checkbox" checked={item.checked.includes(index)} disabled={busy || item.status === 'planned' || item.status === 'done'} onChange={(e) => void runAction({ kind: 'task', index, checked: e.target.checked })} /><span><strong>{step}</strong><small>{item.plan?.owner || 'Drikus'} · progress recorded manually</small></span><span className="pivot-task-number">{String(index + 1).padStart(2, '0')}</span></label>)}</div>{item.status === 'planned' ? <p className="pivot-notice">{item.plan ? 'Complete and approve the plan, then record its start from Overview before tracking progress.' : reviewedStart ? reviewedStart.checklistNote : 'Approve the work plan in Overview to start the checklist.'}</p> : <div className="pivot-status-actions"><button disabled={busy} className="pivot-button-secondary" onClick={() => void runAction({ kind: 'status', status: item.status === 'waiting' || item.status === 'done' ? 'in_progress' : 'waiting' })}>{item.status === 'done' ? 'Reopen work' : item.status === 'waiting' ? 'Resume work' : 'Mark waiting'}</button>{item.status !== 'done' ? <button className="pivot-button" disabled={busy || item.checked.length !== steps.length} onClick={() => void runAction({ kind: 'status', status: 'done' })}>Complete work</button> : null}</div>}</>}</> : null}
    {tab === 'Details' ? <form onSubmit={(e) => { e.preventDefault(); void runAction({ kind: 'facts', facts }) }} className="pivot-form pivot-facts-form"><h3>Known facts. Visible gaps.</h3><p>Blank means unknown. Entered values are your notes, not verified facts from an external source.</p>{system.fields.map((field) => <label key={field}>{field}<input maxLength={2000} value={facts[field] ?? ''} placeholder="Not confirmed" onChange={(e) => setFacts((f) => ({ ...f, [field]: e.target.value }))} /></label>)}<button className="pivot-button" disabled={busy} type="submit">Save details</button></form> : null}
    {tab === 'Learning' ? <><h3>Make the next job better.</h3><p className="pivot-body-muted">Record what worked or what needs changing. Lessons stay proposed until reviewed; saving one does not change an agent’s instructions.</p><form className="pivot-form" onSubmit={async (e) => { e.preventDefault(); try { await onAction({ kind: 'lesson', text: lesson }); setLesson('') } catch { /* Error is rendered in-dialog from parent state. */ } }}><label>Observation<textarea required maxLength={2000} value={lesson} onChange={(e) => setLesson(e.target.value)} rows={3} placeholder="What should we remember for a similar job?" /></label><button className="pivot-button" disabled={busy || !lesson.trim()}>Save proposed lesson</button></form><div className="pivot-history">{item.lessons.map((l, i) => <div key={i}><span className="pivot-status is-planned">Proposed</span><p>{l.text}</p></div>)}</div></> : null}
    {tab === 'History' ? <><h3>Every change has a trail.</h3><div className="pivot-history">{[...item.history].reverse().map((entry, index) => <div key={index}><small>{new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Johannesburg' }).format(new Date(entry.at))} · SAST</small><p>{entry.text}</p></div>)}</div></> : null}
    {tab === 'Source' ? <><h3>{isReviewedIntakeWork(item.source) ? 'Source evidence' : 'Source transcript'}</h3><p className="pivot-body-muted">{isReviewedIntakeWork(item.source) ? 'WhatsApp intake provenance and body retained on this work draft. Nothing was sent or published externally.' : 'Original transcript linked to this saved work record.'}</p>{sourceState.loading ? <p className="pivot-notice">Loading transcript…</p> : null}{sourceState.error ? <p className="pivot-error">{sourceState.error}</p> : null}{sourceState.summary ? <p className="pivot-notice">{sourceState.summary}</p> : null}{sourceState.transcript ? <div className="pivot-context-note"><PivotIcon name="inbox" /><div><strong>{isReviewedIntakeWork(item.source) ? 'Evidence' : 'Transcript'}</strong><p style={{ whiteSpace: 'pre-wrap' }}>{sourceState.transcript}</p></div></div> : null}</> : null}
    </div></article></Dialog>
}
