// Provider-independent recording contract. Pivot supplies identity and storage adapters.
export const RECORDING_BUCKET = 'meeting-recordings'
export const RECORDING_LIMIT_MS = 2 * 60 * 60 * 1000
export const RECORDING_SEGMENT_MS = 30_000
export const RECORDING_SEGMENT_BYTES = 3 * 1024 * 1024
export const RECORDING_RETENTION_DAYS = 30
export const recordingMimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg'] as const

export type RecordingSummary = {
  id: string
  state: 'capturing' | 'complete' | 'interrupted' | 'deleting' | 'deleted'
  created_at: string
  expires_at: string | null
  duration_ms: number
  segments?: { sequence: number; transcript: string | null; transcription_state: string }[]
}

export function recordingMime(value: string) {
  const mime = value.split(';')[0].trim().toLowerCase()
  return recordingMimeTypes.find((item) => item === mime) ?? null
}

export function validateSegment(input: { sequence: number; durationMs: number; bytes: number; mime: string }) {
  if (!Number.isInteger(input.sequence) || input.sequence < 0 || input.sequence >= 720) return 'Invalid recording segment.'
  if (!Number.isInteger(input.durationMs) || input.durationMs < 1 || input.durationMs > 120_000) return 'Invalid recording duration.'
  if (!Number.isInteger(input.bytes) || input.bytes < 1 || input.bytes > RECORDING_SEGMENT_BYTES) return 'This recording segment is too large. Keep this device open and retry.'
  if (!recordingMime(input.mime)) return 'This audio format is not supported.'
  return null
}

export function recordingPath(ownerId: string, meetingId: string, recordingId: string, sequence: number) {
  return `${ownerId}/${meetingId}/${recordingId}/${sequence}`
}

export function recordingTranscript(recording: RecordingSummary) {
  const segments = [...(recording.segments ?? [])].sort((a, b) => a.sequence - b.sequence)
  if (recording.state === 'capturing' || !segments.length || segments.some((segment, index) => segment.sequence !== index || segment.transcription_state !== 'complete')) return null
  return segments.map((segment) => `[Recording ${recording.id}, segment ${segment.sequence + 1}]\n${segment.transcript?.trim() ?? ''}`).join('\n\n')
}
