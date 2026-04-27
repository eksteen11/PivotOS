import { useMemo, useState } from 'react'

import { convertInboxNoteToTask, createInboxItem, softDeleteItem, useRecentInboxItems } from '../../lib/items/itemsRepo'
import { ALL_ENTITIES_SLUG, isAllEntitiesScope, useAppState } from '../state/AppState'

export function InboxPage() {
  const { entities, entityId, divisionsForCurrentEntity, divisionId } = useAppState()
  const [text, setText] = useState('')
  const items = useRecentInboxItems(12, entityId) ?? []
  const captureEntitySlug = isAllEntitiesScope(entityId) ? (entities[0]?.id ?? 'dj') : entityId
  const longItems = items.filter((x) => (x.content ?? '').length > 180).length

  const focusLabel = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) return 'All entities (new notes go to your first entity until you pick one)'
    const entity = entities.find((e) => e.id === entityId)?.label ?? '—'
    const division = divisionId ? divisionsForCurrentEntity.find((d) => d.id === divisionId)?.label ?? '—' : null
    return division ? `${entity} / ${division}` : entity
  }, [divisionId, divisionsForCurrentEntity, entities, entityId])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Capture</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Anything in your head, WhatsApp, email, or notes. Keep it messy — we’ll structure it with AI soon.
        </p>
        <textarea
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a message, deal note, or task…"
        />
        <div style={{ height: 10 }} />
        <button
          className="btn accent"
          type="button"
          onClick={async () => {
            const trimmed = text.trim()
            if (!trimmed) return
            await createInboxItem({
              entitySlug: captureEntitySlug,
              divisionSlug: isAllEntitiesScope(entityId) ? null : divisionId ?? null,
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
        <h2 className="cardTitle">Recent</h2>
        {items.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            Inbox is empty.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {items.slice(0, 12).map((it) => (
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
                  <span className="statusPill">{it.entitySlug}</span>
                  {it.divisionSlug ? <span className="statusPill">{it.divisionSlug}</span> : null}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button className="btn secondary" type="button" onClick={async () => convertInboxNoteToTask(it.id)}>
                    Make task
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

