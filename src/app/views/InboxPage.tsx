import { useMemo, useState } from 'react'

import type { ActivitySource } from '../../lib/db/db'
import {
  convertInboxItem,
  convertInboxNoteToTask,
  createInboxItem,
  softDeleteItem,
  useRecentInboxItems,
} from '../../lib/items/itemsRepo'
import { typeLabel } from '../../lib/items/activityView'
import { ALL_ENTITIES_SLUG, isAllEntitiesScope, useAppState } from '../state/AppState'

const SOURCES: { id: ActivitySource; label: string }[] = [
  { id: 'manual', label: 'Manual' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'gmail', label: 'Gmail' },
  { id: 'email', label: 'Email' },
  { id: 'call', label: 'Call' },
  { id: 'voice_note', label: 'Voice note' },
  { id: 'website', label: 'Website' },
  { id: 'airtable', label: 'Airtable' },
  { id: 'calendar', label: 'Calendar' },
]

export function InboxPage() {
  const { entities, entityId, divisionsForCurrentEntity, divisionId, workstreamsForCurrentScope, workstreamId } =
    useAppState()
  const [text, setText] = useState('')
  const [source, setSource] = useState<ActivitySource>('manual')
  const items = useRecentInboxItems(20, entityId) ?? []
  const captureEntitySlug = isAllEntitiesScope(entityId) ? (entities[0]?.id ?? 'dj') : entityId
  const longItems = items.filter((x) => (x.content ?? '').length > 180).length

  const focusLabel = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) return 'All entities (new notes go to your first entity until you pick one)'
    const entity = entities.find((e) => e.id === entityId)?.label ?? '—'
    const division = divisionId ? divisionsForCurrentEntity.find((d) => d.id === divisionId)?.label ?? '—' : null
    const workstream = workstreamId ? workstreamsForCurrentScope.find((w) => w.id === workstreamId)?.label : null
    const base = division ? `${entity} / ${division}` : entity
    return workstream ? `${base} / ${workstream}` : base
  }, [divisionId, divisionsForCurrentEntity, entities, entityId, workstreamId, workstreamsForCurrentScope])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Universal Inbox</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Everything enters here first — WhatsApp, email, meetings, ideas. Capture now, classify into an Activity next.
        </p>
        <textarea
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a message, deal note, lead, idea, or task…"
        />
        <div style={{ height: 10 }} />
        <div className="field" style={{ marginBottom: 10 }}>
          <label>Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value as ActivitySource)}>
            {SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn accent"
          type="button"
          onClick={async () => {
            const trimmed = text.trim()
            if (!trimmed) return
            await createInboxItem({
              entitySlug: captureEntitySlug,
              divisionSlug: isAllEntitiesScope(entityId) ? null : divisionId ?? null,
              workstreamSlug: isAllEntitiesScope(entityId) ? null : workstreamId ?? null,
              source,
              content: trimmed,
            })
            setText('')
          }}
        >
          Add to inbox
        </button>
        <p className="muted" style={{ marginBottom: 0 }}>
          Offline-first. Focus: {focusLabel}
        </p>
        <div style={{ height: 10 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="statusPill">Unprocessed {items.length}</span>
          <span className="statusPill">Needs structuring {longItems}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">To process</h2>
        {items.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            Inbox is empty.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {items.slice(0, 20).map((it) => (
              <li
                key={it.id}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div className="muted" style={{ fontSize: 13, marginBottom: 8, fontWeight: 700 }}>
                  {new Date(it.clientUpdatedAt).toLocaleString()}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 15, fontWeight: 500 }}>{it.content}</div>
                <div style={{ height: 16 }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="statusPill accent">Inbox</span>
                  <span className="statusPill">{it.source}</span>
                  <span className="statusPill">{it.entitySlug}</span>
                  {it.divisionSlug ? <span className="statusPill">{it.divisionSlug}</span> : null}
                  {it.workstreamSlug ? <span className="statusPill">{it.workstreamSlug}</span> : null}
                </div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  Classify as
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 8 }}>
                  <button className="btn secondary" type="button" onClick={async () => convertInboxNoteToTask(it.id)}>
                    {typeLabel('task')}
                  </button>
                  <button className="btn secondary" type="button" onClick={async () => convertInboxItem(it.id, 'follow_up', { priority: 3 })}>
                    {typeLabel('follow_up')}
                  </button>
                  <button className="btn secondary" type="button" onClick={async () => convertInboxItem(it.id, 'deal')}>
                    {typeLabel('deal')}
                  </button>
                  <button className="btn secondary" type="button" onClick={async () => convertInboxItem(it.id, 'opportunity', { priority: 3 })}>
                    {typeLabel('opportunity')}
                  </button>
                  <button className="btn secondary" type="button" onClick={async () => convertInboxItem(it.id, 'idea')}>
                    {typeLabel('idea')}
                  </button>
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={async () => softDeleteItem(it.id)}
                    style={{ color: 'var(--danger)' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
