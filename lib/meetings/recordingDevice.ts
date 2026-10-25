'use client'

import Dexie, { type Table } from 'dexie'
import { RECORDING_LIMIT_MS, RECORDING_SEGMENT_MS, recordingMime, type RecordingSummary } from '@/lib/meetings/recordings'

export type DeviceRecording = { id: string; ownerId: string; meetingId: string; segmentCount: number; durationMs: number; ended: boolean; createdAt: string }
type DeviceSegment = { recordingId: string; sequence: number; durationMs: number; blob: Blob | null; mime: string; uploaded: number }
class AudioDeviceStore extends Dexie {
  recordings!: Table<DeviceRecording, string>
  segments!: Table<DeviceSegment, [string, number]>
  constructor() {
    super('pivot-meeting-audio-v1')
    this.version(1).stores({ recordings: 'id,[ownerId+meetingId]', segments: '[recordingId+sequence],recordingId' })
  }
}
const store = new AudioDeviceStore()

async function recordingLock(ownerId: string, meetingId: string) {
  if (!navigator.locks) throw new Error('This browser cannot safely coordinate recording recovery. Use another browser or typed notes.')
  let release!: () => void
  const held = new Promise<void>((resolve) => { release = resolve })
  await new Promise<void>((resolve, reject) => {
    void navigator.locks.request(`pivot-meeting-recording:${ownerId}:${meetingId}`, { ifAvailable: true }, async (lock) => {
      if (!lock) { reject(new Error('This meeting is recording or recovering in another tab. Finish it there first.')); return }
      resolve()
      await held
    }).catch(reject)
  })
  return release
}

export async function recoverDeviceRecording(ownerId: string, meetingId: string, id: string) {
  const release = await recordingLock(ownerId, meetingId)
  try { await uploadDeviceRecording(ownerId, meetingId, id, true) }
  finally { release() }
}

export async function deviceRecordings(ownerId: string, meetingId: string) {
  return store.recordings.where('[ownerId+meetingId]').equals([ownerId, meetingId]).toArray()
}

async function checkedFetch(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(35_000) })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(String(body.error ?? 'The recording was not saved. Your device copy is kept.'))
  return body
}

export async function uploadDeviceRecording(ownerId: string, meetingId: string, id: string, finish = false) {
  const recording = await store.recordings.get(id)
  if (!recording || recording.ownerId !== ownerId || recording.meetingId !== meetingId) throw new Error('This device recording belongs to a different account or meeting.')
  await checkedFetch('/api/meetings/recordings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meetingId, id, consent: true }) })
  const segments = await store.segments.where('recordingId').equals(id).sortBy('sequence')
  for (const segment of segments) {
    if (segment.uploaded) continue
    if (!segment.blob) throw new Error('A device audio segment is missing.')
    const query = new URLSearchParams({ meetingId, id, sequence: String(segment.sequence), durationMs: String(segment.durationMs) })
    await checkedFetch(`/api/meetings/recordings/segment?${query}`, { method: 'PUT', headers: { 'Content-Type': segment.mime }, body: segment.blob })
    // Keep only a receipt once the server confirms durable storage.
    await store.segments.update([id, segment.sequence], { uploaded: 1, blob: null })
  }
  if (finish && recording.segmentCount > 0) {
    await checkedFetch('/api/meetings/recordings/finish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meetingId, id, segmentCount: recording.segmentCount }) })
    await store.transaction('rw', store.recordings, store.segments, async () => {
      await store.segments.where('recordingId').equals(id).delete()
      await store.recordings.delete(id)
    })
  }
}

export type RecordingDevice = { pause: () => Promise<void>; resume: () => void; stop: () => Promise<void>; id: string }

// Each stop produces an independently playable file. MediaRecorder timeslices
// alone can yield fragments that cannot be transcribed after an interruption.
export async function startDeviceRecording(input: {
  ownerId: string; meetingId: string
  onState: (state: 'recording' | 'paused' | 'stopped', durationMs: number) => void
  onError: (error: string) => void
}): Promise<RecordingDevice> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Recording is not supported on this device. You can still use typed notes.')
  const releaseLock = await recordingLock(input.ownerId, input.meetingId)
  let stream: MediaStream
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }) }
  catch (error) { releaseLock(); throw error }
  const mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find((type) => MediaRecorder.isTypeSupported(type))
  if (!mime) { releaseLock(); stream.getTracks().forEach((track) => track.stop()); throw new Error('This device does not support a suitable recording format.') }
  const id = crypto.randomUUID()
  let session: DeviceRecording = { id, ownerId: input.ownerId, meetingId: input.meetingId, segmentCount: 0, durationMs: 0, ended: false, createdAt: new Date().toISOString() }
  try {
    await checkedFetch('/api/meetings/recordings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meetingId: input.meetingId, id, consent: true }) })
    await store.recordings.add(session)
  } catch (error) { releaseLock(); stream.getTracks().forEach((track) => track.stop()); throw error }
  let recorder: MediaRecorder | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  let paused = false
  let stopped = false
  let segmentDone = Promise.resolve()
  let upload = Promise.resolve()
  const report = (error: unknown) => input.onError(error instanceof Error ? error.message : 'Recording interrupted. Saved segments remain on this device.')
  function queueUpload(finish: boolean) {
    upload = upload.catch(() => {}).then(() => uploadDeviceRecording(input.ownerId, input.meetingId, id, finish))
    void upload.catch(report)
    return upload
  }
  function nextSegment() {
    if (paused || stopped) return
    if (session.durationMs >= RECORDING_LIMIT_MS) { void stop().catch(report); return }
    const startedAt = performance.now()
    const chunks: Blob[] = []
    const current = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 64_000 })
    recorder = current
    segmentDone = new Promise<void>((resolve, reject) => {
      current.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data) }
      current.onerror = () => { stopped = true; releaseLock(); input.onState('stopped', session.durationMs); stream.getTracks().forEach((track) => track.stop()); reject(new Error('Microphone recording stopped unexpectedly. Recover the saved segments below.')) }
      current.onstop = () => {
        void (async () => {
          const durationMs = Math.max(1, Math.min(RECORDING_LIMIT_MS - session.durationMs, Math.round(performance.now() - startedAt)))
          const blob = new Blob(chunks, { type: recordingMime(mime!)! })
          if (!blob.size) return
          const sequence = session.segmentCount
          session = { ...session, segmentCount: sequence + 1, durationMs: session.durationMs + durationMs }
          await store.transaction('rw', store.recordings, store.segments, async () => {
            await store.segments.add({ recordingId: id, sequence, durationMs, blob, mime: recordingMime(mime!)!, uploaded: 0 })
            await store.recordings.put(session)
          })
          input.onState(stopped ? 'stopped' : paused ? 'paused' : 'recording', session.durationMs)
          void queueUpload(false)
        })().then(() => { resolve(); if (!stopped && !paused) nextSegment() }).catch((error) => {
          stopped = true
          releaseLock()
          stream.getTracks().forEach((track) => track.stop())
          input.onState('stopped', session.durationMs)
          report(error)
          reject(error)
        })
      }
    })
    void segmentDone.catch(report)
    current.start()
    timer = setTimeout(() => { if (current.state !== 'inactive') current.stop() }, Math.min(RECORDING_SEGMENT_MS, RECORDING_LIMIT_MS - session.durationMs))
    input.onState('recording', session.durationMs)
  }
  async function endSegment() {
    if (timer) clearTimeout(timer)
    if (recorder && recorder.state !== 'inactive') recorder.stop()
    await segmentDone
  }
  async function stop() {
    if (stopped) return
    stopped = true
    try {
      await endSegment()
      session = { ...session, ended: true }
      await store.recordings.put(session)
      await queueUpload(true)
    } finally {
      releaseLock()
      stream.getTracks().forEach((track) => track.stop())
      input.onState('stopped', session.durationMs)
    }
  }
  stream.getAudioTracks().forEach((track) => track.addEventListener('ended', () => { void stop().catch(report) }))
  try { nextSegment() } catch (error) { releaseLock(); stream.getTracks().forEach((track) => track.stop()); throw error }
  return {
    id,
    async pause() { if (stopped) return; paused = true; await endSegment(); input.onState('paused', session.durationMs) },
    resume() { if (!stopped && paused) { paused = false; nextSegment() } },
    stop,
  }
}

export function summariesFrom(value: unknown): RecordingSummary[] {
  return Array.isArray(value) ? value as RecordingSummary[] : []
}
