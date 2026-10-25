import { expect, test } from '@playwright/test'
import { applyMeetingPatch, createMeetingCore, readMeetingCore } from '@/lib/meetings/core'
import { MAX_MEETING_EVIDENCE, minutesEvidence } from '@/lib/meetings/minutes'
import { RECORDING_LIMIT_MS, recordingMime, recordingTranscript, validateSegment } from '@/lib/meetings/recordings'
import { companies } from '@/lib/workspace/catalogue'

test('meeting evidence includes typed corrections beside a long transcript without silent truncation', () => {
  const transcript = `${'Meeting evidence. '.repeat(1400)}Final decision: do not send the contract.`
  const evidence = minutesEvidence({ meetingTranscript: transcript, liveNotes: 'Correction: no financing was approved.' })
  expect(evidence.text).toContain('Final decision: do not send the contract.')
  expect(evidence.text).toContain('Correction: no financing was approved.')
  expect(evidence.kind).toBe('transcript')
  for (const company of companies) {
    const core = createMeetingCore({ company: company.id })
    core.meetingTranscript = transcript
    expect(readMeetingCore({ meeting_core: core }, null, company.slug)?.meetingTranscript).toBe(transcript)
  }
  expect(() => minutesEvidence({ meetingTranscript: 'x'.repeat(MAX_MEETING_EVIDENCE + 1) })).toThrow(/too long/)
})

test('recording limits reject bad durations, unsupported audio and oversized recovery uploads', () => {
  const segment = { sequence: 0, durationMs: 30_000, bytes: 240_000, mime: 'audio/webm;codecs=opus' }
  expect(validateSegment(segment)).toBeNull()
  expect(validateSegment({ ...segment, durationMs: 0 })).toMatch(/duration/)
  expect(validateSegment({ ...segment, sequence: -1 })).toMatch(/segment/)
  expect(validateSegment({ ...segment, bytes: 3 * 1024 * 1024 + 1 })).toMatch(/large/)
  expect(validateSegment({ ...segment, mime: 'text/html' })).toMatch(/format/)
  expect(recordingMime('audio/mp4;codecs=mp4a.40.2')).toBe('audio/mp4')
  expect(RECORDING_LIMIT_MS).toBe(7_200_000)
})

test('recording evidence is ordered, source-linked and unavailable until every segment is transcribed', () => {
  const recording = { id: 'recording-1', state: 'complete' as const, created_at: '2026-10-25', expires_at: null, duration_ms: 60_000,
    segments: [{ sequence: 1, transcript: 'Second decision.', transcription_state: 'complete' }, { sequence: 0, transcript: 'First decision.', transcription_state: 'complete' }] }
  expect(recordingTranscript(recording)).toMatch(/segment 1\]\nFirst decision\.[\s\S]*segment 2\]\nSecond decision/)
  expect(recordingTranscript({ ...recording, state: 'capturing' })).toBeNull()
  expect(recordingTranscript({ ...recording, segments: [recording.segments[0]] })).toBeNull()
  expect(recordingTranscript({ ...recording, segments: [{ ...recording.segments[1], transcription_state: 'failed' }] })).toBeNull()
})


test('long notes are refused explicitly so autosave can retain the unsaved device copy', () => {
  const core = createMeetingCore({ company: 'digikraal' })
  expect(applyMeetingPatch(core, { liveNotes: 'x'.repeat(20_001) }).ok).toBe(false)
  expect(applyMeetingPatch(core, { meetingTranscript: 'x'.repeat(100_001) }).ok).toBe(false)
})
