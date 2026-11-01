'use client'

import { useMemo, useState } from 'react'
import { whatsappOfficialCapabilities } from '@/lib/whatsapp/capabilities'
import {
  activeTeachMemory,
  editTeachMemory,
  rememberFromDraftCorrection,
  rememberTeachEntry,
  startTeachPivotSession,
  teachPivotLabel,
  undoTeachMemory,
  type TeachMemoryEntry,
  type TeachSession,
} from '@/lib/whatsapp/teach'
import {
  appendThreadMessage,
  buildConversation,
  openConversation,
  type WhatsappConversation,
} from '@/lib/whatsapp/conversations'
import { canProceedAfterRace, detectReplyRace } from '@/lib/whatsapp/replyRace'
import { buildVoiceTranscriptInterfaces, transcriptPanels } from '@/lib/whatsapp/transcripts'
import {
  approveDriveCopy,
  approveMediaDerivedDraft,
  createMediaRecord,
  rejectDriveCopy,
  rejectMediaDerivedDraft,
  suggestDriveCopy,
  suggestMediaDerivedDraft,
  type MediaDerivedDraft,
  type WhatsappMediaRecord,
} from '@/lib/whatsapp/media'
import { observeWhatsappSync } from '@/lib/whatsapp/sync'
import { whatsappContextLabels, type WhatsappContext } from '@/lib/whatsapp/contexts'
import './whatsapp-inbox.css'

type Props = {
  preview?: boolean
  scope: string
  credentialsPresent?: boolean
  tableReady?: boolean
}

function sampleConversation(): WhatsappConversation {
  const base = buildConversation({
    ownerId: 'preview',
    kind: 'direct',
    contactKey: '27821112222',
    displayName: 'CP van der Merwe',
    context: 'digikraal',
    messages: [{
      id: 'm1',
      providerMessageId: 'wamid.sample.1',
      direction: 'inbound',
      fromE164: '+27821112222',
      body: 'I have 50 Angus cows and 30 calves in Ceres that I want to sell. Can we arrange a visit?',
      mediaKind: 'none',
      receivedAt: '2026-10-27T10:00:00.000Z',
      context: 'digikraal',
      source: 'local',
    }],
  })
  return base
}

function unsupportedGroupSample(): WhatsappConversation {
  return buildConversation({
    ownerId: 'preview',
    kind: 'group',
    contactKey: 'group-essential',
    groupId: 'group-essential',
    displayName: 'Essential farm group (unsupported sync)',
    context: null,
  })
}

export function WhatsappInbox({ preview = false, scope, credentialsPresent = false, tableReady = false }: Props) {
  const sync = observeWhatsappSync({ credentialsPresent, tableReady })
  const capabilities = whatsappOfficialCapabilities()
  const [conversations, setConversations] = useState<WhatsappConversation[]>(() => (
    preview ? [sampleConversation(), unsupportedGroupSample()] : []
  ))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [teach, setTeach] = useState<TeachSession | null>(null)
  const [memory, setMemory] = useState<TeachMemoryEntry[]>([])
  const [teachNote, setTeachNote] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftStartedAt, setDraftStartedAt] = useState<string | null>(null)
  const [reviewedLatest, setReviewedLatest] = useState(false)
  const [media, setMedia] = useState<WhatsappMediaRecord[]>([])
  const [drafts, setDrafts] = useState<MediaDerivedDraft[]>([])
  const [notice, setNotice] = useState('')

  const selected = conversations.find((row) => row.id === selectedId) ?? null
  const race = detectReplyRace({
    draftStartedAt: draftStartedAt ?? '1970-01-01T00:00:00.000Z',
    latestInboundAt: selected?.messages.filter((m) => m.direction === 'inbound').at(-1)?.receivedAt ?? null,
    latestInboundPreview: selected?.messages.filter((m) => m.direction === 'inbound').at(-1)?.body,
  })
  const activeMemory = selected ? activeTeachMemory(memory, selected.contactKey, selected.context) : []
  const voice = useMemo(() => {
    if (!selected) return null
    const audio = selected.messages.find((m) => m.mediaKind === 'audio')
    if (!audio) return null
    return transcriptPanels(buildVoiceTranscriptInterfaces({
      id: `tr-${audio.id}`,
      messageId: audio.id,
      originalLanguage: 'af',
      originalText: '',
      summary: '',
      processingAvailable: false,
      at: audio.receivedAt,
    }))
  }, [selected])

  const visible = conversations.filter((row) => {
    if (scope === 'all') return true
    if (!row.context) return scope === 'all'
    if (row.context === 'digikraal') return scope === 'digikraal'
    if (row.context === 'farm-feed') return scope === 'farm-feed'
    if (row.context === 'northpoint') return scope === 'northpoint'
    return false
  })

  async function openThread(id: string) {
    const at = new Date().toISOString()
    const current = conversations.find((row) => row.id === id)
    setConversations((rows) => rows.map((row) => row.id === id ? openConversation(row, at) : row))
    setSelectedId(id)
    setReviewedLatest(false)
    setDraftStartedAt(null)
    setDraftBody('')
    setTeach(null)
    setNotice('')
    if (!preview && current) {
      const latestInbound = [...current.messages].reverse().find((message) => message.direction === 'inbound')
      void fetch('/api/whatsapp/conversations/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: current.kind,
          contactKey: current.contactKey,
          displayName: current.displayName,
          groupId: current.groupId,
          context: current.context,
          latestInboundProviderMessageId: latestInbound?.providerMessageId,
          openedAt: at,
        }),
      }).then(async (response) => {
        const body = await response.json().catch(() => null)
        if (!response.ok) setNotice(typeof body?.error === 'string' ? body.error : 'Conversation open was not saved.')
        else setNotice(body?.notice || 'Conversation marked read in Pivot storage. Phone unread clear not executed.')
      }).catch(() => setNotice('Conversation open could not reach private storage.'))
      void fetch(`/api/whatsapp/teach?contactKey=${encodeURIComponent(current.contactKey)}`)
        .then(async (response) => response.ok ? response.json() : null)
        .then((body) => { if (body?.entries) setMemory(body.entries) })
        .catch(() => {})
    }
  }

  function beginTeach() {
    if (!selected) return
    setTeach(startTeachPivotSession({
      id: `teach-${selected.contactKey}-${Date.now()}`,
      contactKey: selected.contactKey,
      startedAt: new Date().toISOString(),
      mode: 'text',
    }))
  }

  async function saveTeach() {
    if (!selected || !teachNote.trim()) return
    if (preview) {
      const saved = rememberTeachEntry({
        id: crypto.randomUUID(),
        contactKey: selected.contactKey,
        context: selected.context,
        kind: 'handling-instruction',
        body: teachNote,
        source: 'explicit-teaching',
        at: new Date().toISOString(),
      })
      if (!saved.ok) { setNotice(saved.error); return }
      setMemory((current) => [saved.entry, ...current])
      setTeachNote('')
      setNotice('Saved locally in sample mode.')
      return
    }
    const response = await fetch('/api/whatsapp/teach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'teach',
        contactKey: selected.contactKey,
        context: selected.context,
        kind: 'handling-instruction',
        text: teachNote,
      }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.entry) {
      setNotice(typeof body?.error === 'string' ? body.error : 'Teach Pivot memory was not saved.')
      return
    }
    setMemory((current) => [body.entry, ...current.filter((entry: TeachMemoryEntry) => entry.id !== body.entry.id)])
    setTeachNote('')
    setNotice('Saved to owner-scoped Teach Pivot memory. Editable with undo.')
  }

  async function applyDraftCorrectionMemory() {
    if (!selected || !draftBody.trim()) return
    if (preview) {
      const saved = rememberFromDraftCorrection({
        id: crypto.randomUUID(),
        contactKey: selected.contactKey,
        context: selected.context,
        preference: `Prefer replies shaped like: ${draftBody.slice(0, 240)}`,
        at: new Date().toISOString(),
      })
      if (!saved.ok) return
      setMemory((current) => [saved.entry, ...current])
      setNotice('Remembered locally in sample mode.')
      return
    }
    const response = await fetch('/api/whatsapp/teach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'draft-correction',
        contactKey: selected.contactKey,
        context: selected.context,
        text: `Prefer replies shaped like: ${draftBody.slice(0, 240)}`,
      }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.entry) return
    setMemory((current) => [body.entry, ...current.filter((entry: TeachMemoryEntry) => entry.id !== body.entry.id)])
    setNotice('Remembered communication preference in private storage. Undo available.')
  }

  async function persistMemoryAction(action: 'undo' | 'edit', entryId: string, text?: string) {
    if (preview) {
      if (action === 'undo') setMemory((current) => undoTeachMemory(current, entryId, new Date().toISOString()))
      else if (text) {
        const edited = editTeachMemory(memory, entryId, text, new Date().toISOString())
        if (edited.ok) setMemory(edited.entries)
      }
      return
    }
    const response = await fetch('/api/whatsapp/teach', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id: entryId, text }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.entry) {
      setNotice(typeof body?.error === 'string' ? body.error : 'Memory update failed.')
      return
    }
    setMemory((current) => {
      const next = current.map((entry) => entry.id === body.entry.id ? body.entry : entry)
      return action === 'undo' ? next : next
    })
  }

  async function seedMediaSuggestion() {
    if (!selected) return
    const at = new Date().toISOString()
    if (preview) {
      const record = suggestDriveCopy(createMediaRecord({
        id: crypto.randomUUID(),
        ownerId: selected.ownerId,
        messageId: selected.messages[0]?.id ?? crypto.randomUUID(),
        contactKey: selected.contactKey,
        mimeType: 'image/jpeg',
        kind: 'image',
        at,
      }))
      const listing = suggestMediaDerivedDraft({
        id: crypto.randomUUID(),
        mediaId: record.id,
        kind: 'livestock-listing',
        title: 'Draft livestock listing',
        summary: 'Prepared from incoming media for founder approval. Not published.',
        context: 'digikraal',
        at,
      })
      setMedia((current) => [record, ...current])
      if (listing.ok) setDrafts((current) => [listing.draft, ...current])
      setNotice('Sample media path only.')
      return
    }
    const response = await fetch('/api/whatsapp/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: selected.messages[0]?.id ?? crypto.randomUUID(),
        contactKey: selected.contactKey,
        mimeType: 'image/jpeg',
        kind: 'image',
        suggestDrive: true,
      }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.record) {
      setNotice(typeof body?.error === 'string' ? body.error : 'Media record was not saved.')
      return
    }
    setMedia((current) => [body.record, ...current])
    const listing = suggestMediaDerivedDraft({
      id: crypto.randomUUID(),
      mediaId: body.record.id,
      kind: 'livestock-listing',
      title: 'Draft livestock listing',
      summary: 'Prepared from incoming media for founder approval. Not published.',
      context: 'digikraal',
      at,
    })
    if (listing.ok) setDrafts((current) => [listing.draft, ...current])
    setNotice(body.notice || 'Media row saved. Bytes not downloaded. Drive copy suggestion only.')
  }

  function simulateEcho() {
    if (!selected) return
    const at = new Date().toISOString()
    setConversations((current) => current.map((row) => {
      if (row.id !== selected.id) return row
      return appendThreadMessage(row, {
        id: `echo-${Date.now()}`,
        providerMessageId: `wamid.echo.${Date.now()}`,
        direction: 'echo',
        fromE164: '+27827721220',
        body: 'Business app reply echoed into Pivot (sample).',
        mediaKind: 'none',
        receivedAt: at,
        context: row.context,
        source: 'smb_message_echoes',
      })
    }))
    setNotice('Coexistence echo handled with provider-id dedupe. Sync is sample-local until live credentials exist.')
  }

  function simulateRaceInbound() {
    if (!selected) return
    if (!draftStartedAt) setDraftStartedAt(new Date(Date.now() - 60_000).toISOString())
    const at = new Date().toISOString()
    setConversations((current) => current.map((row) => {
      if (row.id !== selected.id) return row
      return appendThreadMessage(row, {
        id: `in-${Date.now()}`,
        providerMessageId: `wamid.in.${Date.now()}`,
        direction: 'inbound',
        fromE164: `+${row.contactKey}`,
        body: 'Also — can we do Saturday morning?',
        mediaKind: 'none',
        receivedAt: at,
        context: row.context,
        source: 'local',
      })
    }))
    setReviewedLatest(false)
  }

  return (
    <div className="wa-inbox">
      <div className="wa-inbox-toolbar">
        <div>
          <p className="pivot-eyebrow">WHATSAPP · FOUNDER ONLY</p>
          <strong>{sync.state.replace(/-/g, ' ')}</strong>
          <p>{sync.detail}</p>
        </div>
        <span className={`pivot-status ${credentialsPresent ? 'is-waiting' : 'is-planned'}`}>
          {credentialsPresent ? 'Credentials present · not live-proven' : 'Not connected'}
        </span>
      </div>

      <details className="wa-capability">
        <summary>Provider capabilities (official)</summary>
        <ul>
          {capabilities.map((cap) => (
            <li key={cap.id}>
              <strong>{cap.label}</strong>
              <span className={`wa-cap-status is-${cap.status}`}>{cap.status}</span>
              <p>{cap.productStance}</p>
            </li>
          ))}
        </ul>
      </details>

      <div className="wa-inbox-split">
        <aside className="wa-thread-list" aria-label="Conversations">
          {visible.length === 0 ? (
            <p className="wa-empty">No conversations yet. Connection stays honest until the Pivot OS Meta app and webhook are live.</p>
          ) : visible.map((row) => (
            <button
              key={row.id}
              type="button"
              className={row.id === selectedId ? 'is-active' : ''}
              onClick={() => openThread(row.id)}
            >
              <span>
                <strong>{row.displayName}</strong>
                <small>{row.kind === 'group' ? 'Group' : 'Direct'} · {row.context ? whatsappContextLabels[row.context as WhatsappContext] : 'Context needed'}</small>
              </span>
              {row.unreadCount > 0 ? <b className="wa-unread">{row.unreadCount}</b> : null}
            </button>
          ))}
        </aside>

        <section className="wa-thread" aria-label="Conversation">
          {!selected ? (
            <p className="wa-empty">Open a conversation to mark it read. Preview lists do not clear unread.</p>
          ) : (
            <>
              <header className="wa-thread-head">
                <div>
                  <h3>{selected.displayName}</h3>
                  <p>{selected.syncNote}</p>
                  {selected.kind === 'group' && selected.groupSupport === 'not-supported' ? (
                    <p className="wa-warn" role="status">Groups are essential to desired scope, but Meta coexistence does not synchronise Business-app groups. Not silently dropped.</p>
                  ) : null}
                </div>
                <button type="button" className="pivot-button-secondary" onClick={beginTeach}>{teachPivotLabel()}</button>
              </header>

              <div className="wa-messages">
                {selected.messages.map((message) => (
                  <article key={message.id} className={`wa-bubble is-${message.direction}`}>
                    <small>{message.direction === 'echo' ? 'Business app echo' : message.direction} · {new Date(message.receivedAt).toLocaleString('en-GB')}</small>
                    <p>{message.body}</p>
                  </article>
                ))}
              </div>

              {voice ? (
                <div className="wa-transcripts">
                  <div><strong>{voice.original.label}</strong><p>{voice.original.text}</p><small>{voice.original.language}</small></div>
                  <div><strong>{voice.summary.label}</strong><p>{voice.summary.text}</p></div>
                </div>
              ) : null}

              {activeMemory.length ? (
                <div className="wa-memory">
                  <strong>Remembered for this contact</strong>
                  {activeMemory.map((entry) => (
                    <div key={entry.id}>
                      <p>{entry.body}</p>
                      <small>{entry.kind} · {entry.source}{entry.confirmed ? ' · confirmed' : ' · suggestion'}</small>
                      <div className="wa-memory-actions">
                        <button type="button" onClick={() => void persistMemoryAction('undo', entry.id)}>Undo</button>
                        <button type="button" onClick={() => void persistMemoryAction('edit', entry.id, `${entry.body} (corrected)`)}>Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {teach ? (
                <div className="wa-teach">
                  <strong>{teachPivotLabel()}</strong>
                  <p>Founder-initiated. Voice, text and draft corrections are accepted. Agents may ask short follow-ups.</p>
                  <ul>{teach.followUps.map((q) => <li key={q}>{q}</li>)}</ul>
                  <textarea value={teachNote} onChange={(e) => setTeachNote(e.target.value)} placeholder="Teach Pivot what matters about this contact…" rows={3} />
                  <button type="button" className="pivot-button" onClick={saveTeach}>Save memory</button>
                </div>
              ) : null}

              <div className="wa-compose">
                <label>
                  Reply draft (approval only — send disabled)
                  <textarea
                    value={draftBody}
                    onChange={(e) => {
                      if (!draftStartedAt) setDraftStartedAt(new Date().toISOString())
                      setDraftBody(e.target.value)
                    }}
                    rows={3}
                    placeholder="Write a reply for review…"
                  />
                </label>
                {race.active ? (
                  <p className="wa-warn" role="status">
                    {race.message}
                    {race.preview ? ` Latest: “${race.preview}”` : ''}
                    <button type="button" onClick={() => setReviewedLatest(true)}>I reviewed the latest</button>
                  </p>
                ) : null}
                <div className="wa-compose-actions">
                  <button type="button" className="pivot-button-secondary" onClick={applyDraftCorrectionMemory}>Remember preference from edit</button>
                  <button
                    type="button"
                    className="pivot-button"
                    disabled={Boolean(race.active && !canProceedAfterRace(race, reviewedLatest))}
                    onClick={() => setNotice('Reply stays approved-not-sent. Outbound Cloud API send remains disabled.')}
                  >
                    Record approval (no send)
                  </button>
                </div>
              </div>

              <div className="wa-tools">
                {preview ? (
                  <>
                    <button type="button" onClick={simulateEcho}>Simulate Business-app echo</button>
                    <button type="button" onClick={simulateRaceInbound}>Simulate newer inbound</button>
                    <button type="button" onClick={seedMediaSuggestion}>Sample media → drafts + Drive suggest</button>
                  </>
                ) : (
                  <button type="button" onClick={seedMediaSuggestion}>Prepare media draft suggestions</button>
                )}
              </div>

              {media.length || drafts.length ? (
                <div className="wa-media-panel">
                  {media.map((item) => (
                    <div key={item.id}>
                      <strong>Private media</strong>
                      <p>{item.storagePath}</p>
                      <small>Drive: {item.driveCopyStatus} · retention undecided · no auto-delete</small>
                      <div className="wa-memory-actions">
                        {item.driveCopyStatus === 'suggested' ? (
                          <>
                            <button type="button" onClick={() => setMedia((current) => current.map((row) => row.id === item.id ? approveDriveCopy(row) : row))}>Approve Drive copy</button>
                            <button type="button" onClick={() => setMedia((current) => current.map((row) => row.id === item.id ? rejectDriveCopy(row) : row))}>Reject</button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {drafts.map((draft) => (
                    <div key={draft.id}>
                      <strong>{draft.kind} · {draft.title}</strong>
                      <p>{draft.summary}</p>
                      <small>Module hint {draft.moduleHint} · {draft.status} · executes={String(draft.executes)}</small>
                      {draft.status === 'suggested' ? (
                        <div className="wa-memory-actions">
                          <button type="button" onClick={() => setDrafts((current) => current.map((row) => row.id === draft.id ? approveMediaDerivedDraft(row) : row))}>Approve draft record</button>
                          <button type="button" onClick={() => setDrafts((current) => current.map((row) => row.id === draft.id ? rejectMediaDerivedDraft(row) : row))}>Reject</button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {notice ? <p className="pivot-notice" role="status">{notice}</p> : null}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
