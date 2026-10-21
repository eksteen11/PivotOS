'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { WorkCase } from '@/lib/workspace/model'
import type { Company } from '@/lib/workspace/catalogue'
import { companies, getCompany, systems, systemFitsCompany } from '@/lib/workspace/catalogue'
import { AUDIO_FILE_ACCEPT, assessAudioUpload, normalizeMime, UNSUPPORTED_AUDIO_ERROR } from '@/lib/intake/audio'
import { intakeSourceLabels, toSastIso, type IntakeProposal, type IntakeQuestion, type IntakeSourceLabel } from '@/lib/intake/shared'
import { Dialog } from './WorkDialog'
import { PivotIcon } from './PivotIcon'

type Meeting = { id: string; title: string; company: string; timeLabel: string; people: string; place: string; startsAt?: string }

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024
const MAX_DURATION_SECONDS = 120
const UNAVAILABLE_TEXT = 'Sign-in is temporarily unavailable. Please try again shortly.'

export function AudioUploadStatus({ fileName, phase, progress }: { fileName: string; phase: 'idle' | 'processing' | 'ready'; progress: number }) {
  if (!fileName || phase === 'idle') return null
  const detail = phase === 'ready' ? 'Transcript ready' : `Processing · ${Math.max(0, Math.min(100, Math.round(progress)))}%`
  return <p role="status" className="pivot-notice">{fileName} · {detail}</p>
}
const DRAFT_KEY = 'pivotos:intake-draft:v1'

type Clarification = { field: string; answer: string }

async function getDurationSeconds(file: File) {
  return new Promise<number | null>((resolve) => {
    const audio = document.createElement('audio')
    const url = URL.createObjectURL(file)
    const done = (value: number | null) => {
      URL.revokeObjectURL(url)
      resolve(value)
    }
    const timeout = window.setTimeout(() => done(null), 4000)
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      window.clearTimeout(timeout)
      done(Number.isFinite(audio.duration) ? audio.duration : null)
    }
    audio.onerror = () => {
      window.clearTimeout(timeout)
      done(null)
    }
    audio.src = url
  })
}

function postTranscription(file: File, hints: string, onProgress: (progress: number) => void) {
  return new Promise<{ ok: true; transcript: string; metadata?: unknown } | { ok: false; error: string }>((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/intake/transcribe')
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onerror = () => resolve({ ok: false, error: 'Transcription request failed.' })
    xhr.onload = () => {
      let body: { transcript?: string; metadata?: unknown; error?: string } = {}
      try {
        body = JSON.parse(xhr.responseText || '{}') as { transcript?: string; metadata?: unknown; error?: string }
      } catch {
        body = {}
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        resolve({ ok: false, error: String(body.error ?? 'Transcription failed.') })
        return
      }
      resolve({ ok: true, transcript: String(body.transcript ?? ''), metadata: body.metadata })
    }
    const form = new FormData()
    form.set('audio', file, file.name)
    if (hints) form.set('vocabularyHints', hints)
    xhr.send(form)
  })
}

function localTimeLabel(startAt: string) {
  const date = new Date(startAt)
  if (Number.isNaN(date.valueOf())) return 'Unscheduled'
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Johannesburg',
  }).format(date)
}

export function IntakeComposerDialog({
  preview,
  busy,
  draftNamespace,
  onClose,
  onSaved,
}: {
  preview: boolean
  busy: boolean
  draftNamespace: string
  onClose: () => void
  onSaved: (saved: { workCases: WorkCase[]; meetings: Meeting[] }) => void
}) {
  const [sourceLabel, setSourceLabel] = useState<IntakeSourceLabel>('Manual')
  const [transcript, setTranscript] = useState('')
  const [language, setLanguage] = useState('')
  const [summary, setSummary] = useState('')
  const [questions, setQuestions] = useState<IntakeQuestion[]>([])
  const [clarifications, setClarifications] = useState<Clarification[]>([])
  const [replyDraft, setReplyDraft] = useState('')
  const [proposals, setProposals] = useState<IntakeProposal[]>([])
  const [removedProposalIds, setRemovedProposalIds] = useState<string[]>([])
  const [expandedProposalIds, setExpandedProposalIds] = useState<string[]>([])
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [analysisStale, setAnalysisStale] = useState(false)
  const [status, setStatus] = useState<'idle' | 'transcribing' | 'analysing' | 'saving' | 'recording'>('idle')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [captureId, setCaptureId] = useState(() => crypto.randomUUID())
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID())
  const [audioMeta, setAudioMeta] = useState<Record<string, unknown>>({ retainedAudio: false })
  const [uploadName, setUploadName] = useState('')
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'processing' | 'ready'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [vocabularyHints, setVocabularyHints] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const stopTimerRef = useRef<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const disposedRef = useRef(false)
  const draftKey = `${DRAFT_KEY}:${draftNamespace}`

  const visibleProposals = useMemo(
    () => proposals.filter((proposal) => !removedProposalIds.includes(proposal.proposalId)),
    [proposals, removedProposalIds],
  )
  const nextQuestion = questions[0]

  useEffect(
    () => {
      disposedRef.current = false
      return () => {
      disposedRef.current = true
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current)
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      }
    },
    [],
  )

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as Record<string, unknown>
      setSourceLabel((parsed.sourceLabel as IntakeSourceLabel) ?? 'Manual')
      setTranscript(String(parsed.transcript ?? ''))
      setLanguage(String(parsed.language ?? ''))
      setSummary(String(parsed.summary ?? ''))
      setQuestions(Array.isArray(parsed.questions) ? (parsed.questions as IntakeQuestion[]) : [])
      setClarifications(Array.isArray(parsed.clarifications) ? (parsed.clarifications as Clarification[]) : [])
      setProposals(Array.isArray(parsed.proposals) ? (parsed.proposals as IntakeProposal[]) : [])
      setRemovedProposalIds(Array.isArray(parsed.removedProposalIds) ? (parsed.removedProposalIds as string[]) : [])
      setCaptureId(typeof parsed.captureId === 'string' ? parsed.captureId : crypto.randomUUID())
      setIdempotencyKey(typeof parsed.idempotencyKey === 'string' ? parsed.idempotencyKey : crypto.randomUUID())
      setAnalysisStale(Boolean(parsed.analysisStale))
      setNotice(raw ? 'Draft restored.' : '')
    } catch {
      // ignore invalid local drafts
    }
  }, [draftKey])

  useEffect(() => {
    const payload = {
      sourceLabel,
      transcript,
      language,
      summary,
      questions,
      clarifications,
      proposals,
      removedProposalIds,
      captureId,
      idempotencyKey,
      analysisStale,
    }
    try {
      localStorage.setItem(draftKey, JSON.stringify(payload))
    } catch {
      // storage may be unavailable
    }
  }, [sourceLabel, transcript, language, summary, questions, clarifications, proposals, removedProposalIds, captureId, idempotencyKey, analysisStale, draftKey])

  async function validateAudioFile(file: File) {
    const assessment = assessAudioUpload(file.name, file.type)
    if (!assessment.ok) throw new Error(assessment.error || UNSUPPORTED_AUDIO_ERROR)
    if (!file.size || file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Audio must be greater than 0 bytes and below 3MB.')
    }
    const duration = await getDurationSeconds(file)
    if (duration && duration > MAX_DURATION_SECONDS) {
      throw new Error('Audio is too long. Keep recordings at 120 seconds or less.')
    }
    return duration
  }

  async function transcribeFile(file: File) {
    const duration = await validateAudioFile(file)
    setUploadName(file.name)
    setUploadPhase('processing')
    setUploadProgress(0)
    setStatus('transcribing')
    setError('')
    setNotice('')
    const body = await postTranscription(file, vocabularyHints.trim().slice(0, 400), setUploadProgress)
    if (!body.ok) throw new Error(body.error)
    setTranscript(String(body.transcript ?? ''))
    setAnalysisStale(true)
    setAudioMeta({
      ...((body.metadata && typeof body.metadata === 'object') ? body.metadata : {}),
      durationSeconds: duration ?? null,
      retainedAudio: false,
    })
    setUploadPhase('ready')
    setUploadProgress(100)
    setNotice('Transcript loaded. Review and edit before analysis.')
  }

  async function onUpload(file?: File | null) {
    if (!file) return
    try {
      await transcribeFile(file)
    } catch (uploadError) {
      setUploadPhase('idle')
      setError(uploadError instanceof Error ? uploadError.message : 'Audio upload failed.')
    } finally {
      setStatus('idle')
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Microphone recording is not supported on this device/browser.')
      return
    }
    try {
      setError('')
      setNotice('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const preferredTypes = ['audio/webm;codecs=opus', 'audio/mp4;codecs=mp4a.40.2', 'audio/webm', 'audio/mp4']
      const mimeType = preferredTypes.find((entry) => MediaRecorder.isTypeSupported(entry)) ?? ''
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = async () => {
        if (disposedRef.current) return
        streamRef.current?.getTracks().forEach((track) => track.stop())
        const baseType = normalizeMime(recorder.mimeType || 'audio/webm')
        const extension = baseType.includes('mp4') ? 'mp4' : 'webm'
        const blob = new Blob(chunksRef.current, { type: baseType })
        const file = new File([blob], `pivot-recording-${Date.now()}.${extension}`, { type: baseType })
        try {
          await transcribeFile(file)
        } catch (recordError) {
          setUploadPhase('idle')
          setError(recordError instanceof Error ? recordError.message : 'Recording transcription failed.')
        } finally {
          setStatus('idle')
        }
      }
      recorder.start()
      setStatus('recording')
      stopTimerRef.current = window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, MAX_DURATION_SECONDS * 1000)
    } catch {
      setError('Microphone permission denied or unavailable.')
    }
  }

  function stopRecording() {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    }
  }

  async function analyse(clarificationOverride?: Clarification[]) {
    if (!transcript.trim()) {
      setError('Add or transcribe text before analysis.')
      return
    }
    setStatus('analysing')
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/intake/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          sourceLabel,
          clarifications: clarificationOverride ?? clarifications,
        }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(String(body.error ?? 'Analysis failed.'))
      setLanguage(String(body.language ?? ''))
      setSummary(String(body.summary ?? ''))
      setQuestions(Array.isArray(body.questions) ? body.questions : [])
      setProposals(Array.isArray(body.proposals) ? body.proposals : [])
      setRemovedProposalIds([])
      setExpandedProposalIds([])
      setReplyDraft('')
      setAnalysisStale(false)
      setNotice('Review the plan below. Nothing has started yet.')
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Analysis failed.')
    } finally {
      setStatus('idle')
    }
  }

  async function submitReplyRound() {
    if (!nextQuestion || !replyDraft.trim()) return
    const nextClarifications = [...clarifications, { field: nextQuestion.field, answer: replyDraft.trim().slice(0, 400) }]
    setClarifications(nextClarifications)
    setQuestions((current) => current.slice(1))
    setReplyDraft('')
    setAnalysisStale(true)
    await analyse(nextClarifications)
  }

  function updateProposal(index: number, patch: Partial<IntakeProposal>) {
    setProposals((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function updateMeeting(index: number, patch: Partial<IntakeProposal['meeting']>) {
    setProposals((current) =>
      current.map((item, i) => (i === index ? { ...item, meeting: { ...item.meeting, ...patch } } : item)),
    )
  }

  async function save() {
    if (!visibleProposals.length) {
      setError('Create at least one proposal before saving.')
      return
    }
    if (preview) {
      setNotice('Preview mode: sign in to persist intake records.')
      return
    }
    if (analysisStale) {
      setError('Transcript or clarification changed. Re-analyse before saving.')
      return
    }
    setStatus('saving')
    setError('')
    try {
      const response = await fetch('/api/intake/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCaptureId: captureId,
          idempotencyKey,
          sourceLabel,
          transcript,
          language,
          summary,
          clarifications,
          transcriptMetadata: audioMeta,
          proposals: visibleProposals,
        }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(String(body.error ?? UNAVAILABLE_TEXT))
      onSaved({
        workCases: Array.isArray(body.saved?.workCases) ? body.saved.workCases : [],
        meetings: Array.isArray(body.saved?.meetings) ? body.saved.meetings : [],
      })
      setCaptureId(crypto.randomUUID())
      setIdempotencyKey(crypto.randomUUID())
      setClarifications([])
      setQuestions([])
      setProposals([])
      setRemovedProposalIds([])
      setExpandedProposalIds([])
      setReplyDraft('')
      setAnalysisStale(false)
      try { localStorage.removeItem(draftKey) } catch { /* ignore localStorage removal failures */ }
      setNotice('Saved. Linked work is pending approval and no external actions were executed.')
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Save failed.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <Dialog onClose={onClose} label="Conversational intake" wide>
      <div className="pivot-form pivot-intake-form">
        <span className="pivot-eyebrow">One conversation. A clear next step.</span>
        <h2>Tell Pivot what happened</h2>
        <p>
          Type, record a voice note or upload a recording. Let’s work out what happens next.
        </p>
        <div className="pivot-form-columns">
          <button type="button" className="pivot-text-button" onClick={() => setShowMoreOptions((current) => !current)}>
            {showMoreOptions ? 'Hide options' : 'More options'} <PivotIcon name="arrow" size={14} />
          </button>
          {showMoreOptions ? (
            <>
              <label>
                Source label
                <select value={sourceLabel} onChange={(e) => setSourceLabel(e.target.value as IntakeSourceLabel)}>
                  {intakeSourceLabels.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Vocabulary hints (optional)
                <input
                  value={vocabularyHints}
                  onChange={(e) => setVocabularyHints(e.target.value)}
                  maxLength={400}
                  placeholder="People, places, livestock terms..."
                />
              </label>
            </>
          ) : null}
        </div>
        <div className="pivot-intake-actions">
          <button
            type="button"
            className="pivot-button-secondary"
            onClick={() => {
              void startRecording()
            }}
            disabled={status !== 'idle' && status !== 'recording'}
          >
            <PivotIcon name="workforce" size={16} />
            {status === 'recording' ? 'Recording…' : 'Record a voice note'}
          </button>
          {status === 'recording' ? (
            <button type="button" className="pivot-button-secondary" onClick={stopRecording}>
              Stop recording
            </button>
          ) : null}
          <label className="pivot-button-secondary">
            <input
              ref={fileRef}
              type="file"
              accept={AUDIO_FILE_ACCEPT}
              disabled={status !== 'idle'}
              onChange={(e) => {
                const file = e.target.files?.[0]
                void onUpload(file)
              }}
            />
            Upload a recording
          </label>
          <small>Up to 2 minutes · 3MB. WhatsApp .opus voice notes are accepted. The audio file isn’t retained.</small>
        </div>
        <AudioUploadStatus fileName={uploadName} phase={uploadPhase} progress={uploadProgress} />
        <label className="pivot-intake-main-composer">
          Tell Pivot what happened
          <textarea
            rows={6}
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value)
              setAnalysisStale(true)
            }}
            maxLength={12000}
            placeholder="e.g. Ek het 50 Angus koeie en 30 kalwers in Ceres..."
          />
        </label>
        {language ? <p className="pivot-notice">Detected language: {language}</p> : null}
        <div className="pivot-intake-flow-buttons">
          <button type="button" className="pivot-button" onClick={() => void analyse()} disabled={status !== 'idle'}>
            {status === 'analysing' ? 'Thinking it through…' : questions.length || proposals.length ? 'Update my plan' : 'Help me plan this'}
          </button>
        </div>
        {summary ? <p className="pivot-notice">{summary}</p> : null}
        {analysisStale && proposals.length ? <p className="pivot-notice">Transcript or clarification changed. Re-analyse before saving.</p> : null}
        {error ? <p className="pivot-error">{error}</p> : null}
        {notice ? <p className="pivot-notice">{notice}</p> : null}
        {nextQuestion ? (
          <div className="pivot-intake-chat-round">
            <p className="pivot-intake-chat-question">{nextQuestion.question}</p>
            <label>
              Your reply
              <textarea
                rows={2}
                value={replyDraft}
                onChange={(e) => {
                  setReplyDraft(e.target.value)
                  setAnalysisStale(true)
                }}
                maxLength={400}
              />
            </label>
            <button type="button" className="pivot-button-secondary" onClick={() => void submitReplyRound()} disabled={!replyDraft.trim() || status !== 'idle'}>
              Use this answer
            </button>
          </div>
        ) : null}
        {visibleProposals.length ? (
          <div className="pivot-intake-proposals">
            <h3>Here’s the plan</h3>
            {visibleProposals.map((proposal) => {
              const index = proposals.findIndex((item) => item.proposalId === proposal.proposalId)
              const expanded = expandedProposalIds.includes(proposal.proposalId)
              const meetingStatus =
                proposal.kind === 'meeting' && proposal.meeting.confirmedSchedule && proposal.meeting.startAt && proposal.meeting.endAt
                  ? `Scheduled ${localTimeLabel(toSastIso(proposal.meeting.startAt))}`
                  : proposal.kind === 'meeting'
                    ? 'Unscheduled'
                    : 'Needs approval'
              return (
              <article key={proposal.proposalId} className="pivot-intake-proposal-card">
                <div className="pivot-intake-proposal-head">
                  <strong>{proposal.title}</strong>
                  <span>{proposal.kind.toUpperCase()}</span>
                </div>
                <div className="pivot-intake-proposal-meta">
                  <span>{getCompany(proposal.company)?.name ?? proposal.company}</span>
                  <span>{proposal.systemId}</span>
                  <span>{meetingStatus}</span>
                </div>
                <p>{proposal.notes.slice(0, 180) || 'No summary yet.'}</p>
                <div className="pivot-intake-proposal-actions">
                  <button
                    type="button"
                    className="pivot-text-button"
                    onClick={() =>
                      setExpandedProposalIds((current) =>
                        current.includes(proposal.proposalId)
                          ? current.filter((id) => id !== proposal.proposalId)
                          : [...current, proposal.proposalId],
                      )
                    }
                  >
                    {expanded ? 'Hide adjust' : 'Adjust'}
                  </button>
                  <button
                    type="button"
                    className="pivot-text-button"
                    onClick={() => {
                      setRemovedProposalIds((current) => [...current, proposal.proposalId])
                      setAnalysisStale(true)
                    }}
                  >
                    Remove
                  </button>
                </div>
                {expanded ? (
                  <div className="pivot-intake-proposal-adjust">
                    <label>
                      Title
                      <input value={proposal.title} onChange={(e) => updateProposal(index, { title: e.target.value.slice(0, 180) })} maxLength={180} />
                    </label>
                    <div className="pivot-form-columns">
                      <label>
                        Business
                        <select
                          value={proposal.company}
                          onChange={(e) => {
                            const company = e.target.value as Company
                            const fallbackSystem = systems.find((system) => systemFitsCompany(system, company))?.id ?? proposal.systemId
                            updateProposal(index, { company, systemId: fallbackSystem })
                          }}
                        >
                          {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Workflow
                        <select value={proposal.systemId} onChange={(e) => updateProposal(index, { systemId: e.target.value })}>
                          {systems
                            .filter((system) => systemFitsCompany(system, proposal.company))
                            .map((system) => (
                              <option key={system.id} value={system.id}>
                                {system.id} · {system.name}
                              </option>
                            ))}
                        </select>
                      </label>
                    </div>
                    <label>
                      Notes
                      <textarea rows={3} value={proposal.notes} onChange={(e) => updateProposal(index, { notes: e.target.value.slice(0, 12000) })} maxLength={12000} />
                    </label>
                    {proposal.kind === 'meeting' ? (
                      <div className="pivot-intake-meeting-grid">
                        <label>
                          Confirmed schedule
                          <input type="checkbox" checked={proposal.meeting.confirmedSchedule} onChange={(e) => updateMeeting(index, { confirmedSchedule: e.target.checked })} />
                        </label>
                        <label>
                          Start (SAST)
                          <input type="datetime-local" value={proposal.meeting.startAt ? proposal.meeting.startAt.slice(0, 16) : ''} onChange={(e) => updateMeeting(index, { startAt: e.target.value })} />
                        </label>
                        <label>
                          End (SAST)
                          <input type="datetime-local" value={proposal.meeting.endAt ? proposal.meeting.endAt.slice(0, 16) : ''} onChange={(e) => updateMeeting(index, { endAt: e.target.value })} />
                        </label>
                        <label>
                          People
                          <input value={proposal.meeting.people} onChange={(e) => updateMeeting(index, { people: e.target.value.slice(0, 220) })} maxLength={220} />
                        </label>
                        <label>
                          Place / link
                          <input value={proposal.meeting.place} onChange={(e) => updateMeeting(index, { place: e.target.value.slice(0, 220) })} maxLength={220} />
                        </label>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {proposal.uncertainties.length ? (
                  <div className="pivot-intake-uncertainties">
                    <strong>Uncertainties to confirm:</strong>
                    <ul>
                      {proposal.uncertainties.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            )})}
            <p className="pivot-notice">
              Saved work waits for your approval. Sending messages and changing linked apps need separate approval and a connected tool.
            </p>
            <button type="button" className="pivot-button" onClick={() => void save()} disabled={status !== 'idle' || busy || !visibleProposals.length || analysisStale}>
              {status === 'saving' ? 'Saving…' : `Save ${visibleProposals.length} item${visibleProposals.length === 1 ? '' : 's'}`}
            </button>
          </div>
        ) : null}
      </div>
    </Dialog>
  )
}
