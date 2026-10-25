'use client'
import { useState } from 'react'
import { boundedFetch } from '@/lib/meetings/request'
import type { Company } from '@/lib/workspace/catalogue'

type Status = { connections: { provider: string; account_email: string | null; verified: boolean }[]; calendar: { state: string; error: string | null; synced_at: string | null } | null; reminders: { id: string; kind: string; due_at: string; state: string; error: string | null }[] }
export function MeetingConnections({ meetingId, company }: { meetingId: string; company: Company }) {
  const [status, setStatus] = useState<Status | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [calendars, setCalendars] = useState<{ id: string; summary: string }[]>([])
  const [calendarId, setCalendarId] = useState('')
  const [readers, setReaders] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('')
  const [conflict, setConflict] = useState<{ updatedAt: string; generation: number; remoteEtag: string; startAt: string | null; endAt: string | null; cancelled: boolean } | null>(null)
  async function load() {
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch(`/api/meetings/connections?meetingId=${meetingId}`, { method: 'GET' })
      if (!response.ok) throw new Error(String(body.error ?? 'Connection status could not be read.'))
      setStatus(body)
      if (body.connections?.some((item: { provider: string }) => item.provider === 'google_calendar')) {
        const result = await boundedFetch('/api/meetings/calendar/bindings', { method: 'GET' })
        if (!result.response.ok) throw new Error(String(result.body.error))
        setCalendars(result.body.calendars ?? [])
        const binding = result.body.bindings?.find((item: { company: string }) => item.company === company)
        setCalendarId(binding?.calendar_id ?? '')
        setReaders(binding?.approved_readers?.join(', ') ?? '')
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Connection status is unavailable.') }
    finally { setBusy(false) }
  }
  async function connect() {
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/calendar/connect', { method: 'POST' })
      if (!response.ok) throw new Error(String(body.error))
      window.location.assign(String(body.url))
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Google connection could not start.') }
    finally { setBusy(false) }
  }
  async function bind() {
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/calendar/bindings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ company, calendarId, readers: company === 'personal' ? [] : readers.split(',').map((item) => item.trim()).filter(Boolean), confirmVisibility: confirmed }) })
      if (!response.ok) throw new Error(String(body.error))
      setMessage('Calendar reviewed. Sync status below confirms when the worker saves the event.')
      setConfirmed(false)
      await load()
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Calendar could not be saved.') }
    finally { setBusy(false) }
  }
  async function reviewConflict(choice?: 'pivot' | 'google') {
    setBusy(true)
    setError('')
    try {
      const result = choice && conflict
        ? await boundedFetch('/api/meetings/calendar/conflict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...conflict, meetingId, choice }) })
        : await boundedFetch(`/api/meetings/calendar/conflict?meetingId=${meetingId}`, { method: 'GET' })
      if (!result.response.ok) throw new Error(String(result.body.error))
      if (!choice) setConflict(result.body)
      else if (result.body.reload) window.location.reload()
      else { setConflict(null); setMessage('Your schedule choice is saved. Sync will confirm the Google event.'); await load() }
    } catch (failure) { setConflict(null); setError(failure instanceof Error ? failure.message : 'Conflict review failed.') }
    finally { setBusy(false) }
  }
  async function connectWhatsapp() {
    setBusy(true)
    setError('')
    try {
      const { response, body } = await boundedFetch('/api/meetings/reminders/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipient }) })
      if (!response.ok) throw new Error(String(body.error))
      setMessage(`${body.message} Send ${body.code} to ${body.sender}.`)
      await load()
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'WhatsApp connection could not start.') }
    finally { setBusy(false) }
  }
  return <details onToggle={(event) => { if (event.currentTarget.open && !status && !busy) void load() }}>
    <summary>Calendar &amp; reminders</summary>
    <p>One calendar per company. Personal stays private. Cross-company busy blocks, notes, minutes, recordings and attendee invitations are never published by automatic sync.</p>
    {error ? <p role="alert" className="pivot-error">{error}</p> : null}
    {message ? <p role="status">{message}</p> : null}
    <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void connect()}>Connect Google Calendar</button>
    {calendars.length ? <>
      <label>This company’s calendar<select value={calendarId} onChange={(event) => { setCalendarId(event.target.value); setConfirmed(false) }}><option value="">Choose a separate calendar</option>{calendars.map((calendar) => <option key={calendar.id} value={calendar.id}>{calendar.summary}</option>)}</select></label>
      {company !== 'personal' ? <label>Authorised readers’ email addresses, separated by commas<input value={readers} onChange={(event) => { setReaders(event.target.value); setConfirmed(false) }} /></label> : null}
      <label style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}><input style={{ width: 18, minHeight: 18, padding: 0, flexShrink: 0 }} type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />I reviewed this company’s readers. Saved event titles, times and places will be visible to them.</label>
      <button className="pivot-button-secondary" type="button" disabled={busy || !confirmed || !calendarId} onClick={() => void bind()}>Use this company calendar</button>
      <p>Sharing is checked before every sync. This does not add anyone or change Google sharing permissions.</p>
    </> : null}
    {status ? <>
      <p>Calendar: {status.calendar?.state ?? 'Not scheduled for sync'}. {status.calendar?.error ?? ''}</p>
      {status.calendar?.state === 'conflict' ? <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void reviewConflict()}>Review schedule conflict</button> : null}
      {conflict ? <div><p>Google: {conflict.cancelled ? 'Event cancelled or deleted' : `${conflict.startAt ?? 'No exact start'} to ${conflict.endAt ?? 'No exact end'}`}. Keep the current Pivot time, or use this Google schedule. Notes and minutes stay in Pivot.</p><button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void reviewConflict('pivot')}>Keep Pivot time</button><button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void reviewConflict('google')}>Use Google time</button></div> : null}
      <p>WhatsApp: {status.connections.some((item) => item.provider === 'whatsapp' && item.verified) ? 'Recipient verified; delivery receipts below confirm delivery.' : 'Not connected to a verified recipient. No reminders can be sent.'}</p>
      <label>Your WhatsApp number, including country code<input type="tel" value={recipient} onChange={(event) => setRecipient(event.target.value)} /></label>
      <button className="pivot-button-secondary" type="button" disabled={busy || !recipient.trim()} onClick={() => void connectWhatsapp()}>Verify my reminder number</button>
      <ul>{status.reminders.map((reminder) => <li key={reminder.id}>{reminder.kind === 'preparation' ? 'Preparation' : 'Meeting start'} · {new Date(reminder.due_at).toLocaleString()} · {reminder.state}{reminder.error ? ` — ${reminder.error}` : ''}</li>)}</ul>
      <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void load()}>Refresh connection status</button>
    </> : null}
  </details>
}
