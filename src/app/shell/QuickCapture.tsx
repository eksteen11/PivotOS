import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import type { ActivitySource, ItemType } from '../../lib/db/db'
import { createInboxItem, createPlannedTask } from '../../lib/items/itemsRepo'
import { ALL_ENTITIES_SLUG, isAllEntitiesScope, useAppState } from '../state/AppState'

type CaptureType = 'note' | 'task' | 'follow_up' | 'deal' | 'opportunity' | 'idea'

const CAPTURE_TYPES: { id: CaptureType; label: string }[] = [
  { id: 'note', label: 'Inbox note' },
  { id: 'task', label: 'Task' },
  { id: 'follow_up', label: 'Follow-up' },
  { id: 'deal', label: 'Deal' },
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'idea', label: 'Idea' },
]

const SOURCES: { id: ActivitySource; label: string }[] = [
  { id: 'manual', label: 'Manual' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'gmail', label: 'Gmail' },
  { id: 'email', label: 'Email' },
  { id: 'call', label: 'Call' },
  { id: 'voice_note', label: 'Voice note' },
]

const REVENUE_CAPTURE: CaptureType[] = ['deal', 'opportunity']

function todayLocalDate() {
  return new Date().toISOString().slice(0, 10)
}

function dateToDueAt(value: string) {
  if (!value) return null
  const d = new Date(`${value}T17:00:00`)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export function QuickCapture() {
  const { entities, entityId, divisionsForCurrentEntity, divisionId, workstreamsForCurrentScope, workstreamId } =
    useAppState()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<CaptureType>('note')
  const [text, setText] = useState('')
  const [priority, setPriority] = useState(2)
  const [dueDate, setDueDate] = useState('')
  const [source, setSource] = useState<ActivitySource>('manual')
  const [value, setValue] = useState('')
  const [localWorkstream, setLocalWorkstream] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const captureEntitySlug = isAllEntitiesScope(entityId) ? (entities[0]?.id ?? 'dj') : entityId
  const captureDivisionSlug = isAllEntitiesScope(entityId) ? null : divisionId ?? null
  const effectiveWorkstream = isAllEntitiesScope(entityId) ? null : localWorkstream ?? workstreamId ?? null
  const showValue = REVENUE_CAPTURE.includes(type)

  const scopeLabel = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) {
      return `Saving to ${entities[0]?.label ?? 'first entity'}`
    }

    const entity = entities.find((e) => e.id === entityId)?.label ?? entityId
    const division = divisionId ? divisionsForCurrentEntity.find((d) => d.id === divisionId)?.label : null
    return division ? `${entity} / ${division}` : entity
  }, [divisionId, divisionsForCurrentEntity, entities, entityId])

  async function saveCapture() {
    const trimmed = text.trim()
    if (!trimmed || saving) return

    setSaving(true)
    setMessage(null)

    try {
      if (type === 'note') {
        await createInboxItem({
          entitySlug: captureEntitySlug,
          divisionSlug: captureDivisionSlug,
          workstreamSlug: effectiveWorkstream,
          source,
          content: trimmed,
        })
      } else {
        const parsedValue = value.trim() ? Number(value.replace(/[^\d.]/g, '')) : null
        await createPlannedTask({
          entitySlug: captureEntitySlug,
          divisionSlug: captureDivisionSlug,
          workstreamSlug: effectiveWorkstream,
          title: trimmed,
          dueAt: dateToDueAt(dueDate),
          priority,
          type: type as ItemType,
          source,
          value: parsedValue && !Number.isNaN(parsedValue) ? parsedValue : null,
        })
      }

      setText('')
      setDueDate('')
      setValue('')
      setPriority(2)
      const label = CAPTURE_TYPES.find((t) => t.id === type)?.label ?? 'Item'
      setMessage(type === 'note' ? 'Note added to Universal Inbox.' : `${label} added.`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="quickCapture">
      {open ? (
        <div className="quickCapturePanel" role="dialog" aria-label="Quick Capture">
          <div className="quickCaptureHeader">
            <div>
              <h2 className="quickCaptureTitle">Quick Capture</h2>
              <p className="quickCaptureScope">{scopeLabel}</p>
            </div>
            <button className="quickCaptureIconBtn" type="button" onClick={() => setOpen(false)} aria-label="Close Quick Capture">
              ×
            </button>
          </div>

          <div className="quickCaptureSegments" aria-label="Capture type">
            {CAPTURE_TYPES.map((t) => (
              <button
                key={t.id}
                className={type === t.id ? 'quickCaptureSegment quickCaptureSegmentActive' : 'quickCaptureSegment'}
                type="button"
                onClick={() => setType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label className="quickCaptureField">
            <span>{type === 'note' ? 'Messy note' : 'Title'}</span>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setMessage(null)
              }}
              placeholder={type === 'note' ? 'Paste a WhatsApp, idea, reminder, or rough thought' : 'Call supplier about feed quote'}
              rows={3}
            />
          </label>

          <div className="quickCaptureGrid">
            <label className="quickCaptureField">
              <span>Source</span>
              <select value={source} onChange={(e) => setSource(e.target.value as ActivitySource)}>
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {workstreamsForCurrentScope.length > 0 ? (
              <label className="quickCaptureField">
                <span>Workstream</span>
                <select
                  value={effectiveWorkstream ?? ''}
                  onChange={(e) => setLocalWorkstream(e.target.value || null)}
                >
                  <option value="">—</option>
                  {workstreamsForCurrentScope.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {type !== 'note' ? (
            <div className="quickCaptureGrid">
              <label className="quickCaptureField">
                <span>Due</span>
                <input min={todayLocalDate()} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </label>
              <label className="quickCaptureField">
                <span>Priority</span>
                <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                  <option value={1}>Low</option>
                  <option value={2}>Normal</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical</option>
                </select>
              </label>
            </div>
          ) : null}

          {showValue ? (
            <label className="quickCaptureField">
              <span>Value (R)</span>
              <input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 250000" />
            </label>
          ) : null}

          <div className="quickCaptureActions">
            <button className="btn accent btnInline" type="button" disabled={!text.trim() || saving} onClick={saveCapture}>
              {saving ? 'Saving...' : `Add ${CAPTURE_TYPES.find((t) => t.id === type)?.label.toLowerCase()}`}
            </button>
            <Link className="btn secondary btnInline" to="/inbox" onClick={() => setOpen(false)}>
              Inbox
            </Link>
          </div>

          {message ? <p className="quickCaptureMessage">{message}</p> : null}
        </div>
      ) : null}

      <button className="quickCaptureFab" type="button" onClick={() => setOpen((value) => !value)} aria-label="Open Quick Capture">
        +
      </button>
    </div>
  )
}
