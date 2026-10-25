import { openaiApiKey, openaiTranscribeModel } from '@/lib/env'
import { withTimeout } from '@/lib/intake/server'
import { RECORDING_BUCKET } from '@/lib/meetings/recordings'
import type { recordingAdmin } from '@/lib/meetings/recordingServer'

type Admin = NonNullable<ReturnType<typeof recordingAdmin>>

export async function transcribeRecordingSegment(admin: Admin) {
  if (!openaiApiKey) return { state: 'unavailable' }
  const now = new Date().toISOString()
  const { data: candidates, error } = await admin.from('meeting_recording_segments')
    .select('*,recording:meeting_recordings!inner(state,expires_at)')
    .eq('uploaded', true).lt('attempts', 3).neq('transcription_state', 'complete')
    .or(`lease_until.is.null,lease_until.lt.${now}`).limit(10)
  if (error) throw new Error('Recording jobs could not be read.')
  for (const candidate of candidates ?? []) {
    if (['deleting', 'deleted'].includes(candidate.recording.state) || (candidate.recording.expires_at && candidate.recording.expires_at <= now)) continue
    const lease = new Date(Date.now() + 120_000).toISOString()
    const { data: claimed } = await admin.from('meeting_recording_segments').update({ transcription_state: 'running', attempts: candidate.attempts + 1, lease_until: lease })
      .eq('recording_id', candidate.recording_id).eq('sequence', candidate.sequence).eq('attempts', candidate.attempts).select('sequence').maybeSingle()
    if (!claimed) continue
    const timeout = withTimeout(20_000)
    try {
      const { data: audio, error: downloadError } = await admin.storage.from(RECORDING_BUCKET).download(candidate.storage_path)
      if (downloadError || !audio) throw new Error('Recording audio could not be opened.')
      const form = new FormData()
      const ext = candidate.mime === 'audio/mp4' ? 'mp4' : candidate.mime === 'audio/ogg' ? 'ogg' : 'webm'
      form.append('file', audio, `segment.${ext}`)
      form.append('model', openaiTranscribeModel)
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${openaiApiKey}` }, body: form, signal: timeout.signal })
      if (!response.ok) throw new Error('Transcription provider did not accept this segment.')
      const body = await response.json()
      if (typeof body.text !== 'string' || body.text.length > 20_000) throw new Error('Transcription was not valid.')
      const { error: saveError } = await admin.from('meeting_recording_segments').update({ transcript: body.text.trim(), transcription_state: 'complete', lease_until: null, last_error: null })
        .eq('recording_id', candidate.recording_id).eq('sequence', candidate.sequence).eq('lease_until', lease)
      if (saveError) throw new Error('Transcription could not be saved.')
      return { state: 'complete' }
    } catch {
      await admin.from('meeting_recording_segments').update({ transcription_state: 'failed', last_error: 'Transcription failed. The private audio is kept for retry.', lease_until: new Date(Date.now() + 5 * 60_000).toISOString() })
        .eq('recording_id', candidate.recording_id).eq('sequence', candidate.sequence).eq('lease_until', lease)
      return { state: 'failed' }
    } finally {
      timeout.clear()
    }
  }
  return { state: 'idle' }
}

export async function deleteExpiredRecordingAudio(admin: Admin) {
  const now = new Date().toISOString()
  const { data: recordings, error } = await admin.from('meeting_recordings').select('id,owner_id').lte('expires_at', now).is('deleted_at', null).or(`upload_lease_until.is.null,upload_lease_until.lt.${now}`).limit(5)
  if (error) throw new Error('Recording retention jobs could not be read.')
  let deleted = 0
  for (const recording of recordings ?? []) {
    const { data: claim } = await admin.from('meeting_recordings').update({ state: 'deleting' }).eq('id', recording.id).lte('expires_at', now).is('deleted_at', null).or(`upload_lease_until.is.null,upload_lease_until.lt.${now}`).select('id').maybeSingle()
    if (!claim) continue
    const { data: segments, error: readError } = await admin.from('meeting_recording_segments').select('storage_path').eq('recording_id', recording.id)
    if (readError) continue
    let removed = true
    const paths = (segments ?? []).map((segment) => String(segment.storage_path))
    // Storage API deletion, never deletion of storage metadata alone.
    for (let index = 0; index < paths.length; index += 100) {
      const { error: removeError } = await admin.storage.from(RECORDING_BUCKET).remove(paths.slice(index, index + 100))
      if (removeError) { removed = false; break }
    }
    if (!removed) continue
    const { error: auditError } = await admin.from('meeting_recording_deletions').upsert({ recording_id: recording.id, owner_id: recording.owner_id, reason: 'approved_minutes_retention', object_count: paths.length }, { onConflict: 'recording_id', ignoreDuplicates: true })
    if (auditError) continue
    const { error: markError } = await admin.from('meeting_recordings').update({ state: 'deleted', deleted_at: now }).eq('id', recording.id).is('deleted_at', null)
    if (!markError) deleted += 1
  }
  return { deleted }
}
