'use client'

import { useEffect, useState } from 'react'
import { whatsappContextLabels, type WhatsappContext } from '@/lib/whatsapp/contexts'
import type { IntakeItem } from '@/lib/whatsapp/intake'
import type { ClarificationState } from '@/lib/whatsapp/clarification'
import './whatsapp-inbox.css'

type Props = { preview?: boolean }

export function WhatsappIntakeDesk({ preview = false }: Props) {
  const [items, setItems] = useState<IntakeItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [tableReady, setTableReady] = useState(true)
  const [answer, setAnswer] = useState('')
  const [groupReply, setGroupReply] = useState('')
  const [limitations, setLimitations] = useState<{ groupSync?: string; phoneUnreadParity?: string } | null>(null)
  const [clarification, setClarification] = useState<ClarificationState | null>(null)
  const [lastDraftId, setLastDraftId] = useState<string | null>(null)

  const selected = items.find((row) => row.id === selectedId) ?? null

  async function refresh() {
    if (preview) {
      setItems([])
      setNotice('Sample mode: intake API requires founder session + migration 0026.')
      return
    }
    const response = await fetch('/api/whatsapp/intake')
    const body = await response.json().catch(() => null)
    if (!response.ok) {
      setNotice(typeof body?.error === 'string' ? body.error : 'Intake could not load.')
      return
    }
    setTableReady(body.tableReady !== false)
    setItems(body.items || [])
    setLimitations(body.limitations || null)
    if (body.notice) setNotice(body.notice)
  }

  useEffect(() => { void refresh() }, [preview])

  async function post(action: string, payload: Record<string, unknown> = {}) {
    const response = await fetch('/api/whatsapp/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok) {
      setNotice(typeof body?.error === 'string' ? body.error : 'Action failed.')
      return body
    }
    if (body?.item) {
      setItems((current) => {
        const others = current.filter((row) => row.id !== body.item.id)
        return [body.item, ...others]
      })
      setSelectedId(body.item.id)
    }
    if (body?.clarification) setClarification(body.clarification)
    if (body?.notice) setNotice(body.notice)
    if (body?.draft) {
      setLastDraftId(body.draft.id)
      setNotice(body.draft.note || 'Group reply draft updated.')
    }
    if (body?.outbox) setNotice(`Clarification outbox: ${body.outbox.status} (executes=false). ${body.outbox.eligibility?.reasons?.join(' ') || ''}`)
    return body
  }

  return (
    <div className="wa-inbox">
      <div className="wa-inbox-toolbar">
        <div>
          <p className="pivot-eyebrow">DEDICATED INTAKE · FOUNDER ONLY</p>
          <strong>Forwarded group items</strong>
          <p>Each forward stays separate. Needs action stays open until you complete it — reading does not clear it.</p>
        </div>
        <span className={`pivot-status ${tableReady ? 'is-waiting' : 'is-planned'}`}>
          {tableReady ? 'Owner-scoped API' : 'Migration 0026 pending apply'}
        </span>
      </div>

      <p className="pivot-notice" role="status">
        Limited rollout: existing groups stay in WhatsApp Business; phone unread parity unverified.
        {limitations ? ` (${limitations.groupSync}; ${limitations.phoneUnreadParity})` : ''} Does not claim unsupported sync works.
      </p>

      <div className="wa-compose-actions" style={{ marginBottom: '0.75rem' }}>
        <button
          type="button"
          className="pivot-button-secondary"
          disabled={preview}
          onClick={() => void post('capture-forward', {
            providerMessageId: `local-forward-${Date.now()}`,
            fromE164: '+27827721220',
            text: 'Forwarded sample: seller asked about 20 weaners.',
            claimedForward: true,
            mediaPresent: false,
          })}
        >
          Capture founder forward (no live WhatsApp)
        </button>
        <button type="button" className="pivot-text-button" onClick={() => void refresh()}>Refresh</button>
      </div>

      <div className="wa-inbox-split">
        <aside className="wa-thread-list" aria-label="Intake arrivals">
          {items.length === 0 ? <p className="wa-empty">No intake arrivals yet.</p> : items.map((item) => (
            <button key={item.id} type="button" className={item.id === selectedId ? 'is-active' : ''} onClick={() => {
              setSelectedId(item.id)
              void post('mark-read', { itemId: item.id })
            }}>
              <span>
                <strong>{item.provenance.claimedForward ? 'Forwarded item' : 'Intake item'}</strong>
                <small>{item.status} · {item.context ? whatsappContextLabels[item.context] : 'Context needed'}</small>
              </span>
              {item.needsAction ? <b className="wa-unread">!</b> : null}
            </button>
          ))}
        </aside>

        <section className="wa-thread" aria-label="Intake detail">
          {!selected ? <p className="wa-empty">Open an arrival to review. Needs action is independent from read.</p> : (
            <>
              <header className="wa-thread-head">
                <div>
                  <h3>Intake item</h3>
                  <p>{selected.body || '(media/no text)'}</p>
                  <p className="wa-warn" role="status">
                    Provenance invented={String(selected.provenance.invented)}. Group: {selected.provenance.originalGroupName || 'unknown'}. Sender: {selected.provenance.originalSenderName || selected.provenance.originalSenderE164 || 'unknown'}.
                  </p>
                </div>
                {selected.needsAction ? (
                  <button type="button" className="pivot-button" onClick={() => void post('complete-needs-action', { itemId: selected.id })}>Complete needs action</button>
                ) : <span className="pivot-status is-done">Needs action done</span>}
              </header>

              <div className="wa-memory">
                <strong>Missing details</strong>
                {selected.missingDetails.length ? selected.missingDetails.map((detail) => <p key={detail}>{detail}</p>) : <p>None</p>}
              </div>

              <div className="wa-compose">
                <label>
                  Answer shared clarification (Pivot + WhatsApp one state)
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={2} placeholder="e.g. Farm Feed sellers group / Johan / farm-feed" />
                </label>
                <div className="wa-compose-actions">
                  {(clarification?.intakeItemId === selected.id ? clarification.questions.filter((q) => q.status === 'open') : []).map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      className="pivot-button-secondary"
                      onClick={() => void post('answer-clarification', {
                        itemId: selected.id,
                        questionId: question.id,
                        answer,
                        via: 'pivot',
                      }).then(() => setAnswer(''))}
                    >
                      Answer: {question.prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wa-compose-actions">
                {(Object.keys(whatsappContextLabels) as WhatsappContext[]).map((context) => (
                  <button key={context} type="button" onClick={() => void post('approve-context', { itemId: selected.id, context })}>
                    Approve {whatsappContextLabels[context]}
                  </button>
                ))}
                <button type="button" onClick={() => void post('add-suggestion', { itemId: selected.id, kind: 'task', title: 'Follow up seller', summary: 'Confirm visit window.' })}>Suggest task</button>
                <button type="button" onClick={() => void post('add-suggestion', { itemId: selected.id, kind: 'livestock-listing', title: 'Draft listing', summary: 'From forwarded media/text.' })}>Suggest listing</button>
              </div>

              {selected.suggestions.length ? (
                <div className="wa-media-panel">
                  {selected.suggestions.map((suggestion) => (
                    <div key={suggestion.id}>
                      <strong>{suggestion.kind} · {suggestion.title}</strong>
                      <p>{suggestion.summary}</p>
                      <small>{suggestion.status} · executes=false{suggestion.workItemId ? ` · work ${suggestion.workItemId}` : ''}</small>
                      {suggestion.workItemId ? (
                        <p><a href={`/today?view=work&work=${suggestion.workItemId}`}>Open shared work draft</a> · source evidence retained · not published externally</p>
                      ) : null}
                      {suggestion.status === 'suggested' ? (
                        <div className="wa-memory-actions">
                          <button type="button" onClick={() => void post('decide-suggestion', { itemId: selected.id, suggestionId: suggestion.id, decision: 'approved' })}>Approve to shared work</button>
                          <button type="button" onClick={() => void post('decide-suggestion', { itemId: selected.id, suggestionId: suggestion.id, decision: 'rejected' })}>Reject</button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="wa-compose">
                <label>
                  Draft reply for original group (manual copy in WhatsApp)
                  <textarea value={groupReply} onChange={(e) => setGroupReply(e.target.value)} rows={3} placeholder="Write what you will paste into the group…" />
                </label>
                <div className="wa-compose-actions">
                  <button
                    type="button"
                    className="pivot-button-secondary"
                    onClick={() => void post('draft-group-reply', {
                      itemId: selected.id,
                      targetGroupLabel: selected.provenance.originalGroupName || 'Named group in WhatsApp',
                      text: groupReply,
                    }).then((body) => {
                      if (body?.draft?.id) return post('mark-group-reply-copied', { itemId: selected.id, draftId: body.draft.id })
                    })}
                  >
                    Draft + mark copied
                  </button>
                  <button
                    type="button"
                    className="pivot-button"
                    disabled={!lastDraftId}
                    onClick={() => lastDraftId && void post('confirm-group-reply-sent', { itemId: selected.id, draftId: lastDraftId })}
                  >
                    Confirm sent in WhatsApp
                  </button>
                  <p className="pivot-notice">Copied does not mean sent. Confirm only after you actually send in WhatsApp.</p>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      {notice ? <p className="pivot-notice" role="status">{notice}</p> : null}
    </div>
  )
}
