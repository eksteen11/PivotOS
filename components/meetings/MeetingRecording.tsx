'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { boundedFetch } from '@/lib/meetings/request'
import { recordingTranscript, type RecordingSummary } from '@/lib/meetings/recordings'
import type { DeviceRecording, RecordingDevice } from '@/lib/meetings/recordingDevice'

export function MeetingRecording({ meetingId, ownerId, visible, onTranscript }: { meetingId: string; ownerId: string; visible: boolean; onTranscript: (text: string) => void }) {
  const [recordings, setRecordings] = useState<RecordingSummary[]>([])
  const [recovery, setRecovery] = useState<DeviceRecording[]>([])
  const [consent, setConsent] = useState(false)
  const [available, setAvailable] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [state, setState] = useState<'idle' | 'recording' | 'paused' | 'stopped'>('idle')
  const [duration, setDuration] = useState(0)
  const [playback, setPlayback] = useState<{ url: string; label: string } | null>(null)
  const device = useRef<RecordingDevice | null>(null)
  const mounted = useRef(true)
  const refresh = useCallback(async () => {
    try {
      const { response, body } = await boundedFetch(`/api/meetings/recordings?meetingId=${meetingId}`, { method: 'GET' })
      if (!mounted.current) return
      setAvailable(response.ok)
      if (!response.ok) { setError(String(body.error ?? 'Private recording storage is unavailable.')); return }
      setRecordings(Array.isArray(body.recordings) ? body.recordings : [])
    } catch { if (mounted.current) { setAvailable(false); setError('Recording storage could not be reached. Saved device audio is kept.') } }
    try {
      const { deviceRecordings } = await import('@/lib/meetings/recordingDevice')
      const pending = await deviceRecordings(ownerId, meetingId)
      if (mounted.current) setRecovery(pending)
    } catch { if (mounted.current) setError('This browser cannot keep recovery audio. Use another browser or typed notes.') }
  }, [meetingId, ownerId])

  useEffect(() => {
    if (!visible) return
    void refresh()
    const timer = setInterval(() => { void refresh() }, 15_000)
    return () => clearInterval(timer)
  }, [visible, refresh])
  useEffect(() => {
    mounted.current = true
    const warn = (event: BeforeUnloadEvent) => {
      if (!device.current) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => {
      mounted.current = false
      window.removeEventListener('beforeunload', warn)
      void device.current?.stop().catch(() => {})
    }
  }, [])

  async function start() {
    if (busy || device.current || !consent || !available) return
    setBusy(true)
    setError('')
    try {
      const { startDeviceRecording } = await import('@/lib/meetings/recordingDevice')
      device.current = await startDeviceRecording({ ownerId, meetingId,
        onState: (next, milliseconds) => { if (mounted.current) { setState(next); setDuration(milliseconds); if (next === 'stopped') device.current = null } },
        onError: (message) => { if (mounted.current) setError(message) },
      })
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Recording could not start.') }
    finally { setBusy(false) }
  }
  async function control(action: 'pause' | 'resume' | 'stop') {
    setBusy(true)
    setError('')
    try {
      await device.current?.[action]()
      if (action === 'stop') { device.current = null; await refresh() }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Audio is kept on this device for retry.') }
    finally { if (action === 'stop') device.current = null; setBusy(false) }
  }
  async function recover(id: string) {
    setBusy(true)
    setError('')
    try {
      const { recoverDeviceRecording } = await import('@/lib/meetings/recordingDevice')
      await recoverDeviceRecording(ownerId, meetingId, id)
      await refresh()
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Recovery could not finish. Audio remains on this device.') }
    finally { setBusy(false) }
  }

  async function play(id: string, sequence: number) {
    try {
      const query = new URLSearchParams({ meetingId, id, sequence: String(sequence) })
      const { response, body } = await boundedFetch(`/api/meetings/recordings/audio?${query}`, { method: 'GET' })
      if (!response.ok) throw new Error(String(body.error ?? 'Audio could not be opened.'))
      setPlayback({ url: String(body.url), label: `Recording segment ${sequence + 1}` })
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Audio could not be opened.') }
  }
  async function retry(id: string) {
    setBusy(true)
    try {
      const { response, body } = await boundedFetch('/api/meetings/recordings/retry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meetingId, id }) })
      if (!response.ok) throw new Error(String(body.error ?? 'The retry was not saved.'))
      await refresh()
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'The retry was not saved.') }
    finally { setBusy(false) }
  }

  return <div hidden={!visible} style={visible ? undefined : { display: 'none' }} className="meeting-card meeting-panel" aria-label="Meeting recording">
    <h2>Meeting recording</h2>
    <p>Private audio, up to two hours. Keep this page open while recording. Saved segments can be recovered if the connection drops; a browser or device interruption can lose the current segment.</p>
    <p>Original audio is deleted 30 days after minutes approval. Approved minutes remain. Notes and audio are never copied into a shared calendar.</p>
    {error ? <p role="alert" className="pivot-error">{error}</p> : null}
    {state === 'idle' || state === 'stopped' ? <>
      <label style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}><input style={{ width: 18, minHeight: 18, padding: 0, flexShrink: 0 }} type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />Everyone present has agreed to recording</label>
      <button className="pivot-button-secondary" type="button" disabled={busy || !consent || !available || Boolean(device.current)} onClick={() => void start()}>Start recording</button>
    </> : <>
      <p role="status">{state === 'paused' ? 'Paused' : 'Recording'} · {Math.floor(duration / 60_000)} minutes saved on this device</p>
      <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void control(state === 'paused' ? 'resume' : 'pause')}>{state === 'paused' ? 'Resume recording' : 'Pause recording'}</button>
      <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void control('stop')}>Stop and save recording</button>
    </>}
    {recovery.filter((item) => item.id !== device.current?.id).map((item) => <div key={item.id}>
      <p>A recording from {new Date(item.createdAt).toLocaleString()} has saved segments on this device.</p>
      <button className="pivot-button-secondary" type="button" disabled={busy || !available} onClick={() => void recover(item.id)}>Recover saved recording</button>
    </div>)}
    {playback ? <div><p>{playback.label}</p><audio controls src={playback.url} aria-label={playback.label} onError={() => setError('The audio link expired. Open this segment again.')} /></div> : null}
    {recordings.map((recording) => {
      const text = recordingTranscript(recording)
      return <div key={recording.id}>
        <p>{new Date(recording.created_at).toLocaleString()} · {Math.ceil(recording.duration_ms / 60_000)} minutes · {recording.state === 'deleted' ? 'Original audio deleted' : recording.state === 'complete' ? 'Audio saved' : 'Recording not finished'}</p>
        {recording.expires_at ? <p>Audio deletion due {new Date(recording.expires_at).toLocaleDateString()}.</p> : <p>Audio retention begins when minutes are approved.</p>}
        {recording.state !== 'deleted' && (!recording.expires_at || Date.parse(recording.expires_at) > Date.now()) ? <details><summary>Listen to saved audio</summary>{recording.segments?.map((segment) => <button key={segment.sequence} className="pivot-button-secondary" type="button" onClick={() => void play(recording.id, segment.sequence)}>Play segment {segment.sequence + 1}</button>)}</details> : null}
        {recording.segments?.some((segment) => segment.transcription_state === 'failed') && recording.state !== 'deleted' ? <button className="pivot-button-secondary" type="button" disabled={busy} onClick={() => void retry(recording.id)}>Retry transcription</button> : null}
        {text !== null ? <button className="pivot-button-secondary" type="button" onClick={() => onTranscript(text)}>Add recording transcript to notes for review</button> : recording.state !== 'capturing' ? <p>{recording.segments?.some((segment) => segment.transcription_state === 'failed') ? 'Transcription needs a retry. Audio remains private.' : 'Transcription is waiting for the recording worker.'}</p> : null}
      </div>
    })}
  </div>
}
