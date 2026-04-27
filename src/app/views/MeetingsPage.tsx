import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  createMeeting,
  formatMeetingLocal,
  meetingStartsAt,
  updateMeetingPatch,
  useMeetings,
} from '../../lib/items/meetingsRepo'
import { createPlannedTask } from '../../lib/items/itemsRepo'
import { hasSupabaseEnv } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { runSyncOnce } from '../../lib/sync/runSyncOnce'
import { ALL_ENTITIES_SLUG, isAllEntitiesScope, useAppState } from '../state/AppState'
import type { DbItem } from '../../lib/db/db'

type Tab = 'week' | 'day' | 'list' | 'new'

const ENTITY_TONE: Record<string, string> = {
  digikraal: 'meetingToneDigikraal',
  dj: 'meetingToneDj',
  northpoint: 'meetingToneNorthpoint',
  farm_feed: 'meetingToneFarm',
}

function startOfWeekSunday(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function combineLocalDateTime(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString()
}

function toDateInputValue(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toTimeInputValue(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function MeetingsPage() {
  const { session } = useSupabaseSession()
  const { entities, entityId, divisionsForCurrentEntity, divisionId } = useAppState()
  const allMeetings = useMeetings(400) ?? []

  const [tab, setTab] = useState<Tab>('week')
  const [weekAnchor, setWeekAnchor] = useState(() => new Date())
  const [dayAnchor, setDayAnchor] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [followUp, setFollowUp] = useState('')
  const [note, setNote] = useState<string | null>(null)

  const divisions = useMemo(() => {
    const base = divisionsForCurrentEntity.map((d) => ({ id: d.id, label: d.label }))
    return base.length ? base : [{ id: 'personal', label: `General (${entities.find((e) => e.id === entityId)?.label ?? 'Entity'})` }]
  }, [divisionsForCurrentEntity, entities, entityId])

  const activeDivision = useMemo(() => {
    return divisionId && divisions.some((d) => d.id === divisionId) ? divisionId : divisions[0]?.id ?? 'personal'
  }, [divisionId, divisions])

  const filteredMeetings = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) return allMeetings
    return allMeetings.filter((m) => m.entitySlug === entityId)
  }, [allMeetings, entityId])

  const selected = useMemo(
    () => filteredMeetings.find((m) => m.id === selectedId) ?? null,
    [filteredMeetings, selectedId],
  )

  const weekStart = useMemo(() => startOfWeekSunday(weekAnchor), [weekAnchor])
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const hours = useMemo(() => Array.from({ length: 16 }, (_, i) => i + 6), [])

  const meetingsForDay = useMemo(() => {
    const d = new Date(dayAnchor + 'T12:00:00')
    return filteredMeetings.filter((m) => {
      const t = meetingStartsAt(m)
      return t && sameCalendarDay(t, d)
    })
  }, [filteredMeetings, dayAnchor])

  const [newTitle, setNewTitle] = useState('')
  const [newWho, setNewWho] = useState('')
  const [newWhere, setNewWhere] = useState('')
  const [newAgenda, setNewAgenda] = useState('')
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [newTime, setNewTime] = useState('09:00')
  const [newEntity, setNewEntity] = useState(
    () => (entityId === ALL_ENTITIES_SLUG ? entities[0]?.id ?? 'dj' : entityId),
  )

  useEffect(() => {
    if (isAllEntitiesScope(entityId)) {
      setNewEntity((p) => (entities.some((e) => e.id === p) ? p : entities[0]?.id ?? 'dj'))
      return
    }
    setNewEntity(entityId)
  }, [entityId, entities])

  const submitNew = async () => {
    const title = newTitle.trim()
    if (!title) return
    await createMeeting({
      entitySlug: newEntity,
      divisionSlug:
        !isAllEntitiesScope(entityId) && newEntity === entityId
          ? activeDivision === 'personal'
            ? null
            : activeDivision
          : null,
      title,
      who: newWho.trim() || '—',
      where: newWhere.trim() || '—',
      agenda: newAgenda.trim(),
      startsAtIso: combineLocalDateTime(newDate, newTime),
    })
    setNewTitle('')
    setNewWho('')
    setNewWhere('')
    setNewAgenda('')
    setTab('list')
  }

  return (
    <section>
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="cardTitle" style={{ marginBottom: 4 }}>
              Meetings
            </h2>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              Same flow as your sheet: new entry, day list, week grid, and full list by entity.
            </p>
          </div>
          <Link className="btn btnInline secondary btnSm" to="/home">
            Meeting journey (info)
          </Link>
        </div>
        <div className="meetingTabBar">
          {(['week', 'day', 'list', 'new'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? 'meetingTab meetingTabActive' : 'meetingTab'}
              onClick={() => setTab(t)}
            >
              {t === 'new' ? 'New meeting' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <p className="muted" style={{ margin: '12px 0 0', fontSize: 13 }}>
          Use the <strong>Entity</strong> selector above: choose <strong>All entities</strong> for a combined calendar, or one entity to focus.
        </p>
      </div>

      {tab === 'week' ? (
        <div className="card">
          <div className="meetingWeekToolbar">
            <button type="button" className="btn secondary btnInline btnSm" onClick={() => setWeekAnchor(addDays(weekStart, -7))}>
              ← Prev week
            </button>
            <span className="muted" style={{ fontWeight: 700 }}>
              Week of {weekStart.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })} (Sun–Sat)
            </span>
            <button type="button" className="btn secondary btnInline btnSm" onClick={() => setWeekAnchor(addDays(weekStart, 7))}>
              Next week →
            </button>
          </div>
          <div className="meetingWeekScroll">
            <div className="meetingWeekGrid">
              <div className="meetingWeekCorner" />
              {weekDays.map((d) => (
                <div key={d.toISOString()} className="meetingWeekDayHead">
                  {d.toLocaleDateString('en-ZA', { weekday: 'short' })}
                  <span className="meetingWeekDate">{d.getDate()}</span>
                </div>
              ))}
              {hours.map((h) => (
                <Fragment key={h}>
                  <div className="meetingWeekTime">
                    {h}h00
                  </div>
                  {weekDays.map((d) => {
                    const cellMeetings = filteredMeetings.filter((m) => {
                      const t = meetingStartsAt(m)
                      if (!t || !sameCalendarDay(t, d)) return false
                      return t.getHours() === h
                    })
                    return (
                      <div key={`${d.toISOString()}-${h}`} className="meetingWeekCell">
                        {cellMeetings.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            className={`meetingChip ${ENTITY_TONE[m.entitySlug] ?? ''}`}
                            onClick={() => {
                              setSelectedId(m.id)
                              setTab('list')
                            }}
                          >
                            {m.title ?? 'Meeting'}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'day' ? (
        <div className="card">
          <div className="field" style={{ maxWidth: 220 }}>
            <label>Day</label>
            <input type="date" value={dayAnchor} onChange={(e) => setDayAnchor(e.target.value)} />
          </div>
          {meetingsForDay.length === 0 ? (
            <p className="muted">No meetings on this day for this scope.</p>
          ) : (
            <ul className="meetingDayList">
              {meetingsForDay
                .slice()
                .sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''))
                .map((m) => {
                  const t = meetingStartsAt(m)
                  const who = typeof m.meta?.who === 'string' ? m.meta.who : ''
                  const where = typeof m.meta?.where === 'string' ? m.meta.where : ''
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        className={`meetingDayRow ${ENTITY_TONE[m.entitySlug] ?? ''}`}
                        onClick={() => setSelectedId(m.id)}
                      >
                        <span className="meetingDayTime">{t ? t.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                        <span className="meetingDayEntity">{m.entitySlug}</span>
                        <span className="meetingDayTitle">{m.title}</span>
                        <span className="meetingDayMeta">
                          {who} · {where}
                        </span>
                      </button>
                    </li>
                  )
                })}
            </ul>
          )}
        </div>
      ) : null}

      {tab === 'list' ? (
        <div className="card">
          <h3 className="cardTitle">All meetings (list)</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Sorted by start time. Colours match entity groups from your workbook.
          </p>
          {filteredMeetings.length === 0 ? (
            <div className="muted" style={{ display: 'grid', gap: 10 }}>
              <p style={{ margin: 0 }}>
                {!hasSupabaseEnv
                  ? 'Add Supabase env vars in `.env` to load cloud meetings, or create one with New meeting.'
                  : !session
                    ? 'Sign in to load meetings from your account. If you opened the app without signing in, only meetings you add on this device appear here.'
                    : 'No meetings match this scope yet. Sync runs every ~15s when you are online, or use Sync now. You can also add one under New meeting.'}
              </p>
              {hasSupabaseEnv && session ? (
                <button
                  type="button"
                  className="btn secondary btnSm"
                  style={{ width: 'fit-content' }}
                  onClick={() => void runSyncOnce(session)}
                >
                  Sync now
                </button>
              ) : hasSupabaseEnv && !session ? (
                <Link className="btn secondary btnSm" to="/home/join?m=signin" style={{ width: 'fit-content' }}>
                  Sign in
                </Link>
              ) : null}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
              {filteredMeetings.map((m) => {
                const t = meetingStartsAt(m)
                const who = typeof m.meta?.who === 'string' ? m.meta.who : ''
                const where = typeof m.meta?.where === 'string' ? m.meta.where : ''
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      className={`meetingListRow ${selectedId === m.id ? 'meetingListRowActive' : ''} ${ENTITY_TONE[m.entitySlug] ?? ''}`}
                      onClick={() => setSelectedId(m.id)}
                    >
                      <div style={{ fontWeight: 800 }}>{m.title}</div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                        {m.entitySlug} · {t ? formatMeetingLocal(t) : 'No time'}
                      </div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                        <strong>Who:</strong> {who} · <strong>Where:</strong> {where}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}

      {tab === 'new' ? (
        <div className="card">
          <h3 className="cardTitle">New meeting</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Entity, date, time, who, description, where — matches your &quot;New Meeting&quot; block.
          </p>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Entity</label>
            <select value={newEntity} onChange={(e) => setNewEntity(e.target.value)}>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="field">
              <label>Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Who</label>
            <input value={newWho} onChange={(e) => setNewWho(e.target.value)} placeholder="e.g. Sonnica / Conrad" />
          </div>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Description</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. DK Finansies" />
          </div>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Where</label>
            <input value={newWhere} onChange={(e) => setNewWhere(e.target.value)} placeholder="e.g. KWV Kantoor" />
          </div>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Agenda / notes (optional)</label>
            <textarea className="input" style={{ minHeight: 72 }} value={newAgenda} onChange={(e) => setNewAgenda(e.target.value)} />
          </div>
          <button className="btn accent" type="button" disabled={!newTitle.trim()} onClick={() => void submitNew()}>
            Save meeting
          </button>
        </div>
      ) : null}

      <div className="card">
        <h3 className="cardTitle">Detail &amp; follow-ups</h3>
        {!selected ? (
          <p className="muted" style={{ margin: 0 }}>
            Select a meeting from the list or week grid.
          </p>
        ) : (
          <MeetingDetail
            meeting={selected}
            onUpdateMeta={async (patch) => {
              await updateMeetingPatch(selected.id, patch)
            }}
            followUp={followUp}
            setFollowUp={setFollowUp}
            note={note}
            setNote={setNote}
          />
        )}
      </div>
    </section>
  )
}

function MeetingDetail({
  meeting,
  onUpdateMeta,
  followUp,
  setFollowUp,
  note,
  setNote,
}: {
  meeting: DbItem
  onUpdateMeta: (patch: Partial<Pick<DbItem, 'title' | 'content' | 'dueAt' | 'meta'>>) => Promise<void>
  followUp: string
  setFollowUp: (v: string) => void
  note: string | null
  setNote: (v: string | null) => void
}) {
  const t = meetingStartsAt(meeting)
  const who = typeof meeting.meta?.who === 'string' ? meeting.meta.who : ''
  const where = typeof meeting.meta?.where === 'string' ? meeting.meta.where : ''

  return (
    <>
      <div className={`meetingDetailCard ${ENTITY_TONE[meeting.entitySlug] ?? ''}`}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{meeting.title}</div>
        <p className="muted" style={{ marginTop: 6 }}>
          {meeting.entitySlug} · {t ? formatMeetingLocal(t) : 'No start time'}
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <div className="field">
            <label>Who</label>
            <input
              value={who}
              onChange={(e) =>
                void onUpdateMeta({ meta: { ...meeting.meta, who: e.target.value } })
              }
            />
          </div>
          <div className="field">
            <label>Where</label>
            <input
              value={where}
              onChange={(e) =>
                void onUpdateMeta({ meta: { ...meeting.meta, where: e.target.value } })
              }
            />
          </div>
          <div className="field">
            <label>Description (title)</label>
            <input
              value={meeting.title ?? ''}
              onChange={(e) => void onUpdateMeta({ title: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Agenda / notes</label>
            <textarea
              className="input"
              style={{ minHeight: 88 }}
              value={meeting.content}
              onChange={(e) => void onUpdateMeta({ content: e.target.value })}
            />
          </div>
          {t ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  defaultValue={toDateInputValue(t)}
                  key={meeting.id + meeting.clientUpdatedAt}
                  onChange={(e) => {
                    const next = combineLocalDateTime(e.target.value, toTimeInputValue(t))
                    void onUpdateMeta({ dueAt: next })
                  }}
                />
              </div>
              <div className="field">
                <label>Time</label>
                <input
                  type="time"
                  defaultValue={toTimeInputValue(t)}
                  key={meeting.id + meeting.clientUpdatedAt + 't'}
                  onChange={(e) => {
                    const next = combineLocalDateTime(toDateInputValue(t), e.target.value)
                    void onUpdateMeta({ dueAt: next })
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <label>Create follow-up task</label>
        <input
          placeholder="e.g. Send notes to Conrad"
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
              entitySlug: meeting.entitySlug,
              divisionSlug: meeting.divisionSlug,
              title: followUp.trim(),
              sourceItemId: meeting.id,
            })
            setFollowUp('')
            setNote('Follow-up task created.')
          } catch (e: any) {
            setNote(e?.message ?? 'Could not create task.')
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
  )
}
