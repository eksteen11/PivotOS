import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { sameOrigin } from '@/lib/intake/server'
import { isUuid } from '@/lib/intake/shared'
import { RECORDING_BUCKET, RECORDING_SEGMENT_BYTES, recordingMime, validateSegment } from '@/lib/meetings/recordings'
import { recordingContext } from '@/lib/meetings/recordingServer'

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const params = new URL(request.url).searchParams
  const context = await recordingContext(params.get('meetingId') ?? '')
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  const id = params.get('id') ?? ''
  if (!isUuid(id)) return NextResponse.json({ error: 'Recording not found.' }, { status: 404 })
  const { data: recording } = await context.admin.from('meeting_recordings').select('id').eq('id', id).eq('meeting_id', context.meeting.id).eq('owner_id', context.ownerId).maybeSingle()
  if (!recording) return NextResponse.json({ error: 'Recording not found.' }, { status: 404 })
  // Bound the stream itself; Content-Length may be absent or untrusted.
  const reader = request.body?.getReader()
  if (!reader) return NextResponse.json({ error: 'Audio is missing.' }, { status: 400 })
  const pieces: Uint8Array[] = []
  let bytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.byteLength
    if (bytes > RECORDING_SEGMENT_BYTES) {
      await reader.cancel()
      return NextResponse.json({ error: 'This recording segment is too large.' }, { status: 413 })
    }
    pieces.push(value)
  }
  const sequence = Number(params.get('sequence'))
  const durationMs = Number(params.get('durationMs'))
  const mime = request.headers.get('Content-Type') ?? ''
  const invalid = validateSegment({ sequence, durationMs, bytes, mime })
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })
  const audio = Buffer.concat(pieces)
  const digest = createHash('sha256').update(audio).digest('hex')
  const { data: segment, error: reserveError } = await context.admin.rpc('reserve_meeting_recording_segment', {
    recording: id, owner: context.ownerId, seq: sequence, duration: durationMs, size_bytes: bytes, content_mime: recordingMime(mime), digest,
  })
  if (reserveError || !segment) return NextResponse.json({ error: 'The recording changed or reached its limit. Your device copy is kept.' }, { status: 409 })
  if (!segment.uploaded) {
    const { error } = await context.admin.storage.from(RECORDING_BUCKET).upload(segment.storage_path, audio, { contentType: recordingMime(mime)!, upsert: false })
    // A lost response can leave an immutable object uploaded but not acknowledged.
    if (error) {
      const { data: stored } = await context.admin.storage.from(RECORDING_BUCKET).download(segment.storage_path)
      if (!stored || createHash('sha256').update(Buffer.from(await stored.arrayBuffer())).digest('hex') !== digest) {
        return NextResponse.json({ error: 'Audio upload was not confirmed. Retry from this device.' }, { status: 502 })
      }
    }
    const { error: markError } = await context.admin.from('meeting_recording_segments').update({ uploaded: true }).eq('recording_id', id).eq('sequence', sequence).eq('sha256', digest)
    if (markError) return NextResponse.json({ error: 'Audio receipt was not saved. Retry this upload.' }, { status: 502 })
  }
  return NextResponse.json({ saved: true, sequence })
}
