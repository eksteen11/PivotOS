'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { companies, getCompany, getSystem, systemFitsCompany, systems, type Company } from '@/lib/workspace/catalogue'
import { createAutosave, type AutosaveSnapshot } from '@/lib/meetings/autosave'
import { meetingTimeLabel } from '@/lib/door/meetings'
import { boundedFetch, meetingRequestError } from '@/lib/meetings/request'
import { canTransition, lifecycleLabel, nextQuestion, type MeetingAction, type MeetingCore, type MeetingLifecycle } from '@/lib/meetings/core'
import { noteRecoveryDecision, noteRecoveryKey, parseNoteRecovery, type NoteDraft } from '@/lib/meetings/noteRecovery'
import { workRecordHref, workStatusLabel, workSummary, type WorkSummary } from '@/lib/workspace/workLink'

const tabs = ['overview', 'prepare', 'notes', 'minutes', 'follow-up'] as const
type Tab = (typeof tabs)[number]

export function MeetingWorkspace({ meetingId, founderId, title, updatedAt: initialUpdatedAt, core: initialCore, followUps = [], sourceHref }: { meetingId: string; founderId: string; title: string; updatedAt: string; core: MeetingCore; followUps?: WorkSummary[]; sourceHref: string | null }) {
  const [core, setCore] = useState(initialCore)
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt)
  const [name, setName] = useState(title)
  const [tab, setTab] = useState<Tab>('overview')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notes, setNotes] = useState(initialCore.liveNotes)
  const [transcript, setTranscript] = useState(initialCore.meetingTranscript)
  const [noteStatus, setNoteStatus] = useState<AutosaveSnapshot>({ status: 'idle', error: '', updatedAt: initialUpdatedAt })
  const [recovery, setRecovery] = useState<NoteDraft | null>(null)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [sourceState, setSourceState] = useState({ loading: false, transcript: '', summary: '', label: '', error: '' })
  const [savedWork, setSavedWork] = useState<WorkSummary[]>(followUps)
  const draftRef = useRef({ liveNotes: initialCore.liveNotes, meetingTranscript: initialCore.meetingTranscript })
  const savedDraft = useRef({ liveNotes: initialCore.liveNotes, meetingTranscript: initialCore.meetingTranscript })
  const saverRef = useRef<ReturnType<typeof createAutosave> | null>(null)
  if (!saverRef.current) {
    saverRef.current = createAutosave({
      initialUpdatedAt,
      send: async ({ updatedAt: stamp, patch }) => {
        const response = await fetch('/api/meetings/core', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: meetingId, updatedAt: stamp, patch }) })
        const body = await response.json().catch(() => ({}))
        if (!response.ok) return { ok: false as const, error: String(body.error ?? 'The notes were not saved.') }
        const nextNotes = String(patch.liveNotes ?? savedDraft.current.liveNotes)
        const nextTranscript = String(patch.meetingTranscript ?? savedDraft.current.meetingTranscript)
        savedDraft.current = { liveNotes: nextNotes, meetingTranscript: nextTranscript }
        setCore(body.meeting)
        setUpdatedAt(String(body.updatedAt))
        clearRecovery()
        return { ok: true as const, updatedAt: String(body.updatedAt) }
      },
    })
  }

  function recoveryKey() {
    return founderId ? noteRecoveryKey(founderId, meetingId) : ''
  }

  function clearRecovery() {
    const key = recoveryKey()
    if (key) window.localStorage.removeItem(key)
  }

  function rememberDraft() {
    const key = recoveryKey()
    if (!key) return
    const draft = draftRef.current
    if (draft.liveNotes === savedDraft.current.liveNotes && draft.meetingTranscript === savedDraft.current.meetingTranscript) {
      window.localStorage.removeItem(key)
      return
    }
    const record: NoteDraft = { ...draft, baseUpdatedAt: saverRef.current?.snapshot().updatedAt || initialUpdatedAt }
    window.localStorage.setItem(key, JSON.stringify(record))
  }

  useEffect(() => {
    const unsubscribe = saverRef.current?.subscribe(() => { if (saverRef.current) setNoteStatus(saverRef.current.snapshot()) })
    return () => { unsubscribe?.() }
  }, [])
  const rememberRef = useRef(rememberDraft)
  rememberRef.current = rememberDraft
  useEffect(() => {
    if (!founderId) return
    const stored = parseNoteRecovery(window.localStorage.getItem(noteRecoveryKey(founderId, meetingId)))
    const decision = noteRecoveryDecision({ serverNotes: initialCore.liveNotes, serverTranscript: initialCore.meetingTranscript, serverUpdatedAt: initialUpdatedAt, stored })
    if (decision === 'resume' && stored) {
      draftRef.current = { liveNotes: stored.liveNotes, meetingTranscript: stored.meetingTranscript }
      setNotes(stored.liveNotes)
      setTranscript(stored.meetingTranscript)
      saverRef.current?.schedule(draftRef.current)
    } else if (decision === 'ask') setRecovery(stored)
    const keep = () => rememberRef.current()
    window.addEventListener('pagehide', keep)
    return () => window.removeEventListener('pagehide', keep)
  }, [founderId, meetingId, initialCore.liveNotes, initialCore.meetingTranscript, initialUpdatedAt])
  const question = nextQuestion(core)
  const company = getCompany(core.company)

  async function flushNotes() {
    const saver = saverRef.current
    if (!saver) return updatedAt
    const draft = draftRef.current
    const dirty = saver.hasPending() || saver.snapshot().status === 'error' || draft.liveNotes !== savedDraft.current.liveNotes || draft.meetingTranscript !== savedDraft.current.meetingTranscript
    if (!dirty) return saver.snapshot().updatedAt
    const snap = await saver.flush(draft)
    if (snap.status === 'error') {
      setError(snap.error || 'The notes were not saved.')
      return null
    }
    return snap.updatedAt
  }

  async function save(patch: Record<string, unknown>) {
    const stamp = await flushNotes()
    if (!stamp) return null
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/core', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: meetingId, updatedAt: stamp, patch }) })
      if (!response.ok) {
        setError(String(body.error ?? 'The meeting was not saved.'))
        return null
      }
      setCore(body.meeting)
      const nextStamp = String(body.updatedAt ?? stamp)
      setUpdatedAt(nextStamp)
      saverRef.current?.adopt(nextStamp)
      return { meeting: body.meeting as MeetingCore, updatedAt: nextStamp }
    } catch {
      setError(meetingRequestError())
      return null
    } finally {
      setBusy(false)
    }
  }

  async function clarify(event: FormEvent) {
    event.preventDefault()
    const text = reply.trim()
    if (!text) return
    const stamp = await flushNotes()
    if (!stamp) return
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/core/clarify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: meetingId, updatedAt: stamp, reply: text }) })
      if (!response.ok) {
        setError(String(body.error ?? 'That reply was not saved.'))
        return
      }
      setCore(body.meeting)
      const nextStamp = String(body.updatedAt ?? stamp)
      setUpdatedAt(nextStamp)
      saverRef.current?.adopt(nextStamp)
      setReply('')
    } catch {
      setError(meetingRequestError())
    } finally {
      setBusy(false)
    }
  }

  function queueNotes(next: Partial<{ liveNotes: string; meetingTranscript: string }>) {
    draftRef.current = { ...draftRef.current, ...next }
    if (next.liveNotes !== undefined) setNotes(next.liveNotes)
    if (next.meetingTranscript !== undefined) setTranscript(next.meetingTranscript)
    rememberDraft()
    saverRef.current?.schedule(draftRef.current)
  }

  function restoreRecovery() {
    if (!recovery) return
    draftRef.current = { liveNotes: recovery.liveNotes, meetingTranscript: recovery.meetingTranscript }
    setNotes(recovery.liveNotes)
    setTranscript(recovery.meetingTranscript)
    setRecovery(null)
    rememberDraft()
    saverRef.current?.schedule(draftRef.current)
    setTab('notes')
  }

  async function openSource() {
    if (!sourceHref) return
    setSourceOpen(true)
    if (sourceState.transcript || sourceState.loading) return
    setSourceState({ loading: true, transcript: '', summary: '', label: '', error: '' })
    try {
      const response = await fetch(sourceHref)
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(String(body.error ?? 'The original request could not be opened.'))
      setSourceState({ loading: false, transcript: String(body.transcript ?? ''), summary: String(body.summary ?? ''), label: String(body.sourceLabel ?? 'Manual'), error: '' })
    } catch (sourceError) {
      setSourceState({ loading: false, transcript: '', summary: '', label: '', error: sourceError instanceof Error ? sourceError.message : 'The original request could not be opened.' })
    }
  }

  async function draftMinutes() {
    const stamp = await flushNotes()
    if (!stamp) return
    const draft = draftRef.current
    if (!draft.liveNotes.trim() && !draft.meetingTranscript.trim()) {
      setError('Add what was said in the meeting. The original request is not minutes.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/core/minutes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: meetingId, updatedAt: stamp }) })
      if (!response.ok) {
        setError(String(body.error ?? 'Minutes were not drafted.'))
        return
      }
      setCore((current) => ({ ...current, minutes: body.minutes, minutesStale: false, lifecycle: 'minutes_review' }))
      const nextStamp = String(body.updatedAt ?? stamp)
      setUpdatedAt(nextStamp)
      saverRef.current?.adopt(nextStamp)
      setTab('minutes')
    } catch {
      setError(meetingRequestError())
    } finally {
      setBusy(false)
    }
  }

  async function approve() {
    if (!core.minutes) return
    const stamp = await flushNotes()
    if (!stamp) return
    const revision = core.minutes.revision
    const actions = core.minutes.actions
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/core/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: meetingId, updatedAt: stamp, revision, actions }) })
      if (!response.ok) {
        if (body.meeting) setCore(body.meeting)
        if (body.updatedAt) {
          setUpdatedAt(String(body.updatedAt))
          saverRef.current?.adopt(String(body.updatedAt))
        }
        setError(String(body.error ?? 'Follow-up was not created.'))
        return
      }
      const returned = Array.isArray(body.followUps) ? body.followUps.flatMap((item: unknown) => { const summary = workSummary(item); return summary ? [summary] : [] }) : []
      if (returned.length) setSavedWork(returned)
      setCore((current) => body.meeting ?? { ...current, lifecycle: 'follow_up', approvedRevision: current.minutes?.revision ?? null, followUpItemIds: Array.isArray(body.followUpItemIds) ? body.followUpItemIds : [], minutesStale: false })
      const nextStamp = String(body.updatedAt ?? stamp)
      setUpdatedAt(nextStamp)
      saverRef.current?.adopt(nextStamp)
      setTab('follow-up')
    } catch {
      setError(meetingRequestError())
    } finally {
      setBusy(false)
    }
  }

  const nextStage: MeetingLifecycle | null = core.lifecycle === 'scheduled' ? 'preparing' : core.lifecycle === 'preparing' ? 'ready' : core.lifecycle === 'ready' ? 'in_progress' : core.lifecycle === 'in_progress' ? 'minutes_review' : core.lifecycle === 'follow_up' ? 'closed' : null

  return (
    <section className="pivot-workspace meeting-workspace" data-testid="meeting-workspace">
      <header className="meeting-topbar">
        <div className="pivot-breadcrumb">Workspace <span>/</span> <Link href="/today">Today</Link> <span>/</span> <strong>Meeting</strong></div>
      </header>
      <div className="meeting-body">
      <header className="meeting-top">
        <p className="pivot-eyebrow">001 · MEETINGS</p>
        <h1>{name}</h1>
        <div className="meeting-badges">
          <span className="meeting-badge">{company?.name}</span>
          <span className="meeting-badge">{getSystem(core.systemId)?.name}</span>
          <span className="meeting-badge is-neutral">{lifecycleLabel(core.lifecycle)}</span>
          <span className="meeting-badge is-neutral">{meetingTimeLabel(core) || 'No date saved'}</span>
        </div>
      </header>
      {recovery ? <div className="meeting-recovery" role="status"><p>Unsaved notes from this device were kept. The meeting changed, so they were not put back.</p><button className="pivot-button-secondary" type="button" onClick={restoreRecovery}>Restore unsaved notes</button></div> : null}
      {error ? <p className="pivot-error" role="alert">{error}</p> : null}
      {core.minutesStale ? <p className="pivot-notice">Notes changed after the minutes. Draft them again before follow-up is approved.</p> : null}
      <div className="meeting-tabs" role="tablist" aria-label="Meeting">
        {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item === 'follow-up' ? 'Follow-up' : item === 'notes' ? 'Live notes' : item[0].toUpperCase() + item.slice(1)}</button>)}
      </div>
      {tab === 'overview' ? (
        <div className="meeting-grid">
        <div className="meeting-card meeting-panel">
          <form onSubmit={(event) => void clarify(event)}>
            <label htmlFor="meeting-reply">{question?.prompt ?? 'Add anything still missing, in a sentence.'}</label>
            <input id="meeting-reply" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="28 October 2026, 08:00 to 09:00" />
            <button className="pivot-button" type="submit" disabled={busy}>Save this reply</button>
          </form>
          <p className="meeting-quiet">The original request is not used as minutes.</p>
          {sourceHref ? <button className="pivot-button-secondary" type="button" onClick={() => void openSource()}>Original request</button> : <p>No original request is linked.</p>}
        </div>
        <div className="meeting-card meeting-panel">
          <h2>Details</h2>
          <dl className="meeting-facts">
            <div><dt>Purpose</dt><dd>{core.purpose || 'Not captured yet'}</dd></div>
            <div><dt>Desired outcome</dt><dd>{core.desiredOutcome || 'Not captured yet'}</dd></div>
            <div><dt>Attendees</dt><dd>{core.attendees || 'Not captured yet'}</dd></div>
            <div><dt>Place</dt><dd>{core.place || 'Not captured yet'}</dd></div>
          </dl>
          <details>
            <summary>Adjust details</summary>
            <label>Title<input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => void save({ title: name })} /></label>
            <label>Business<select value={core.company} onChange={(event) => void save({ company: event.target.value })}>{companies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label>Subdivision<select value={core.systemId} onChange={(event) => void save({ systemId: event.target.value })}>{systems.filter((item) => systemFitsCompany(item, core.company)).map((item) => <option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}</select></label>
            <label>Place<input defaultValue={core.place} onBlur={(event) => void save({ place: event.target.value })} /></label>
            <label>Link<input defaultValue={core.link} onBlur={(event) => void save({ link: event.target.value })} /></label>
            <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const startAt = String(data.get('start') ?? ''); const endAt = String(data.get('end') ?? ''); if (startAt && endAt) void save({ startAt, endAt }) }}>
              <label>Start<input name="start" type="datetime-local" defaultValue={core.schedule.startAt} /></label>
              <label>End<input name="end" type="datetime-local" defaultValue={core.schedule.endAt} /></label>
              <button className="pivot-button-secondary" type="submit" disabled={busy}>Save exact time</button>
            </form>
          </details>
          {nextStage && canTransition(core.lifecycle, nextStage, core) ? <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void save({ lifecycle: nextStage })}>Move to {lifecycleLabel(nextStage)}</button> : null}
        </div>
        </div>
      ) : null}
      {tab === 'prepare' ? (
        <div className="meeting-card meeting-panel">
          <p>Draft checklist from the details you entered.</p>
          {core.agenda ? <pre>{core.agenda}</pre> : <p>Add a purpose and the checklist can fill in.</p>}
          <ul>{core.prep.map((item) => <li key={item.id}><label><input type="checkbox" checked={item.done} onChange={(event) => void save({ prep: core.prep.map((entry) => entry.id === item.id ? { ...entry, done: event.target.checked } : entry) })} />{item.text}</label></li>)}</ul>
          <form onSubmit={(event) => { event.preventDefault(); const text = reply.trim(); if (!text) return; void save({ prep: [...core.prep, { id: `custom-${core.prep.length + 1}`, text, done: false, source: 'custom' }] }).then((saved) => { if (saved) setReply('') }) }}>
            <label htmlFor="custom-prep">Add a checklist item<input id="custom-prep" value={reply} onChange={(event) => setReply(event.target.value)} /></label>
            <button className="pivot-button-secondary" type="submit" disabled={busy}>Add</button>
          </form>
        </div>
      ) : null}
      {tab === 'notes' ? (
        <div className="meeting-card meeting-panel">
          <label htmlFor="live-notes">Live notes<textarea id="live-notes" value={notes} onChange={(event) => queueNotes({ liveNotes: event.target.value })} /></label>
          <label htmlFor="meeting-transcript">What was said in the meeting<textarea id="meeting-transcript" value={transcript} onChange={(event) => queueNotes({ meetingTranscript: event.target.value })} /></label>
          <p data-testid="notes-save-state">{noteStatus.status === 'saving' ? 'Saving…' : noteStatus.status === 'saved' ? 'Saved' : noteStatus.status === 'error' ? 'Could not save.' : 'Notes save as you type.'}</p>
          {noteStatus.status === 'error' ? <button className="pivot-button-secondary" type="button" onClick={() => void saverRef.current?.retry()}>Retry</button> : null}
          <p>This is the meeting itself. The original request stays separate and is not turned into minutes.</p>
          <p>Full recordings up to 2 hours are not available yet. These notes stay on the meeting. Audio is not stored here.</p>
        </div>
      ) : null}
      {tab === 'minutes' ? (
        <div className="meeting-card meeting-panel">
          <button className="pivot-button" type="button" disabled={busy} onClick={() => void draftMinutes()}>Draft minutes from the meeting</button>
          {core.minutes && core.minutes.evidence !== 'none' ? (
            <>
              <p>{core.minutes.discussion || 'No discussion was stated in the meeting notes.'}</p>
              <ul>{core.minutes.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
              {core.minutes.actions.map((action) => <ActionCard key={action.id} action={action} onChange={(next) => setCore((current) => current.minutes ? { ...current, minutes: { ...current.minutes, actions: current.minutes.actions.map((item) => item.id === action.id ? next : item) } } : current)} />)}
              <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void save({ minutesActions: core.minutes?.actions ?? [] })}>Save action routing</button>
            </>
          ) : <p>No minutes yet. An empty note does not invent a discussion.</p>}
        </div>
      ) : null}
      {tab === 'follow-up' ? (
        <div className="meeting-card meeting-panel">
          <p>Review the minutes and actions together. Follow-up work is created only after this approval.</p>
          <button className="pivot-button" type="button" disabled={busy || !core.minutes || core.minutesStale || core.minutes.evidence === 'none'} onClick={() => void approve()}>{core.approvedRevision === core.minutes?.revision ? 'Review already saved' : 'Approve reviewed follow-up'}</button>
          {savedWork.length ? <ul className="meeting-follow">{savedWork.map((item) => <li key={item.id}><Link href={workRecordHref(item.id)}>{item.title}</Link><span className="meeting-badge is-neutral">{workStatusLabel(item.status, item.reviewed)}</span></li>)}</ul> : <p>Approved follow-up opens here with its title and status.</p>}
          {core.followUpItemIds.length > savedWork.length ? <p>Some saved work could not be opened.</p> : null}
          <ul className="meeting-pending">
            <li>Google Calendar sync is not connected. Confirmed times stay in Pivot. Invitations are not sent.</li>
            <li>WhatsApp reminders are not connected. Nothing is sent one day before or 30 minutes before.</li>
            <li>Recordings are kept for 30 days only after minutes approval, once private storage exists. It does not exist yet.</li>
          </ul>
        </div>
      ) : null}
      </div>
      {sourceOpen ? <button className="meeting-drawer-backdrop" type="button" aria-label="Close original request" onClick={() => setSourceOpen(false)} /> : null}
      {sourceOpen ? (
        <aside className="meeting-drawer" role="dialog" aria-label="Original request">
          <div className="meeting-drawer-top"><span>Pivot OS <span>/</span> Original request</span><button className="pivot-button-secondary" type="button" onClick={() => setSourceOpen(false)}>Close</button></div>
          <p className="meeting-quiet">This is the request that started the meeting. It is not minutes, and it is not treated as what was said.</p>
          {sourceState.loading ? <p>Opening the request…</p> : null}
          {sourceState.error ? <p className="pivot-error" role="alert">{sourceState.error}</p> : null}
          {sourceState.label ? <p className="meeting-badge is-neutral">{sourceState.label}</p> : null}
          {sourceState.summary ? <p>{sourceState.summary}</p> : null}
          {sourceState.transcript ? <p className="meeting-source-text">{sourceState.transcript}</p> : null}
        </aside>
      ) : null}
    </section>
  )
}

function ActionCard({ action, onChange }: { action: MeetingAction; onChange: (action: MeetingAction) => void }) {
  return (
    <fieldset>
      <legend>{action.title}</legend>
      <label><input type="checkbox" checked={action.include} onChange={(event) => onChange({ ...action, include: event.target.checked })} /> Include</label>
      <label>Business<select value={action.company} onChange={(event) => onChange({ ...action, company: event.target.value as Company | '' })}><option value="">Choose</option>{companies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Subdivision<select value={action.systemId} onChange={(event) => onChange({ ...action, systemId: event.target.value })}><option value="">Choose</option>{systems.filter((item) => action.company && systemFitsCompany(item, action.company)).map((item) => <option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}</select></label>
      <label>Owner<input value={action.owner} onChange={(event) => onChange({ ...action, owner: event.target.value })} /></label>
      <label>Deadline<input type="date" value={action.due} onChange={(event) => onChange({ ...action, due: event.target.value })} /></label>
      {action.company && action.systemId ? null : <p>This action is not routed until the business and subdivision are valid.</p>}
    </fieldset>
  )
}
