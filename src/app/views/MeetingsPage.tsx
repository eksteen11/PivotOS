import { useMemo, useState } from 'react'

import { createPlannedTask } from '../../lib/items/itemsRepo'
import { useAppState } from '../state/AppState'

type DivisionOption = { id: string; label: string }
type Meeting = {
  id: string
  title: string
  date: string
  time: string
  division: string
  agenda: string
  notes: string
}

export function MeetingsPage() {
  const { entities, entityId, divisionsForCurrentEntity, divisionId, setDivisionId } = useAppState()

  const divisions: DivisionOption[] = useMemo(() => {
    const entity = entities.find((e) => e.id === entityId)
    if (!entity) return []
    const base = divisionsForCurrentEntity.map((d) => ({ id: d.id, label: d.label }))
    return base.length ? base : [{ id: 'personal', label: `General (${entity.label})` }]
  }, [divisionsForCurrentEntity, entities, entityId])

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('09:00')
  const [agenda, setAgenda] = useState('')

  const [scheduled, setScheduled] = useState<Meeting[]>([])
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [followUp, setFollowUp] = useState('')
  const [note, setNote] = useState<string | null>(null)

  const activeDivision = useMemo(() => {
    return divisionId && divisions.some((d) => d.id === divisionId) ? divisionId : divisions[0]?.id ?? 'personal'
  }, [divisionId, divisions])
  const selectedMeeting = useMemo(() => {
    return scheduled.find((m) => m.id === selectedMeetingId) ?? scheduled[0] ?? null
  }, [scheduled, selectedMeetingId])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Quick entry</h2>

        <div className="field" style={{ marginBottom: 10 }}>
          <label>Meeting title</label>
          <input
            style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
            placeholder="e.g. Listing review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div className="field">
            <label>Date</label>
            <input
              style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Time</label>
            <input
              style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="field" style={{ marginBottom: 10 }}>
          <label>Agenda</label>
          <input
            style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
            placeholder="What must be discussed?"
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
          />
        </div>

        <div className="field" style={{ marginBottom: 10 }}>
          <label>Division</label>
          <select
            value={activeDivision}
            onChange={(e) => setDivisionId(e.target.value)}
            style={{ width: '100%' }}
          >
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn accent"
          type="button"
          disabled={!title.trim()}
          onClick={() => {
            const trimmed = title.trim()
            if (!trimmed) return
            const entry: Meeting = {
              id: crypto.randomUUID(),
              title: trimmed,
              date,
              time,
              division: divisions.find((d) => d.id === activeDivision)?.label ?? 'Personal',
              agenda: agenda.trim(),
              notes: '',
            }
            setScheduled((prev) => [entry, ...prev])
            setSelectedMeetingId(entry.id)
            setAgenda('')
            setTitle('')
          }}
        >
          Schedule meeting
        </button>
      </div>

      <div className="card">
        <h2 className="cardTitle">Weekly timeline</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Day · Week · Month
        </p>

        {scheduled.length ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {scheduled.slice(0, 8).map((m) => (
              <li
                key={m.id}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setSelectedMeetingId(m.id)}
              >
                <div style={{ fontWeight: 800, fontSize: 16 }}>{m.title}</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 13, fontWeight: 600 }}>
                  {m.division} · {m.date} · {m.time}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            No meetings scheduled yet.
          </p>
        )}
      </div>

      <div className="card">
        <h2 className="cardTitle">Meeting detail & follow-ups</h2>
        {!selectedMeeting ? (
          <p className="muted" style={{ margin: 0 }}>
            Select a meeting from timeline to capture notes and create follow-up tasks.
          </p>
        ) : (
          <>
            <div style={{ fontWeight: 760 }}>{selectedMeeting.title}</div>
            <p className="muted" style={{ marginTop: 4 }}>
              {selectedMeeting.division} · {selectedMeeting.date} · {selectedMeeting.time}
            </p>
            <div className="field" style={{ marginBottom: 10 }}>
              <label>Agenda</label>
              <input
                style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                value={selectedMeeting.agenda}
                onChange={(e) => {
                  const v = e.target.value
                  setScheduled((prev) => prev.map((x) => (x.id === selectedMeeting.id ? { ...x, agenda: v } : x)))
                }}
              />
            </div>
            <div className="field" style={{ marginBottom: 10 }}>
              <label>Notes</label>
              <textarea
                style={{ width: '100%', minHeight: 88, background: 'transparent', border: 0, outline: 'none', padding: 0, resize: 'vertical' }}
                value={selectedMeeting.notes}
                onChange={(e) => {
                  const v = e.target.value
                  setScheduled((prev) => prev.map((x) => (x.id === selectedMeeting.id ? { ...x, notes: v } : x)))
                }}
              />
            </div>
            <div className="field" style={{ marginBottom: 10 }}>
              <label>Create follow-up task</label>
              <input
                style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                placeholder="e.g. Send buyer summary before 16:00"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
              />
            </div>
            <button
              className="btn accent"
              type="button"
              disabled={!followUp.trim()}
              onClick={async () => {
                try {
                  await createPlannedTask({
                    entitySlug: entityId,
                    divisionSlug: activeDivision === 'personal' ? null : activeDivision,
                    title: followUp.trim(),
                    sourceItemId: selectedMeeting.id,
                  })
                  setFollowUp('')
                  setNote('Follow-up task created in Today View.')
                } catch (e: any) {
                  setNote(e?.message ?? 'Could not create follow-up task.')
                }
              }}
            >
              Add follow-up task
            </button>
            {note ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                {note}
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="card">
        <h2 className="cardTitle">Active links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div
            style={{
              border: '1px solid rgba(26, 28, 28, 0.12)',
              background: 'rgba(255, 255, 255, 0.72)',
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 760 }}>Meetings</div>
            <div className="muted" style={{ marginTop: 4 }}>
              {Math.min(scheduled.length, 99)} ready
            </div>
          </div>
          <div
            style={{
              border: '1px solid rgba(26, 28, 28, 0.12)',
              background: 'rgba(255, 255, 255, 0.72)',
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 760 }}>Attendees</div>
            <div className="muted" style={{ marginTop: 4 }}>
              {scheduled.length ? 'Invites later' : '0 invites'}
            </div>
          </div>
          <div
            style={{
              border: '1px solid rgba(26, 28, 28, 0.12)',
              background: 'rgba(255, 255, 255, 0.72)',
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 760 }}>Past</div>
            <div className="muted" style={{ marginTop: 4 }}>
              Archives
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

