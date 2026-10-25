import { NextResponse } from 'next/server'
import { recordingContext } from '@/lib/meetings/recordingServer'
import { RECORDING_BUCKET } from '@/lib/meetings/recordings'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams
  const context = await recordingContext(query.get('meetingId') ?? '')
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  const { data: recording } = await context.admin.from('meeting_recordings').select('id,state,expires_at').eq('id', query.get('id') ?? '').eq('meeting_id', context.meeting.id).eq('owner_id', context.ownerId).maybeSingle()
  if (!recording || recording.state === 'deleted' || (recording.expires_at && Date.parse(recording.expires_at) <= Date.now())) return NextResponse.json({ error: 'Audio is no longer available.' }, { status: 404 })
  const { data: segment } = await context.admin.from('meeting_recording_segments').select('storage_path').eq('recording_id', recording.id).eq('sequence', Number(query.get('sequence'))).eq('uploaded', true).maybeSingle()
  if (!segment) return NextResponse.json({ error: 'Audio segment not found.' }, { status: 404 })
  const secondsLeft = recording.expires_at ? Math.floor((Date.parse(recording.expires_at) - Date.now()) / 1000) : 60
  const { data, error } = await context.admin.storage.from(RECORDING_BUCKET).createSignedUrl(segment.storage_path, Math.max(1, Math.min(60, secondsLeft)))
  if (error || !data) return NextResponse.json({ error: 'Audio could not be opened.' }, { status: 502 })
  return NextResponse.json({ url: data.signedUrl }, { headers: { 'Cache-Control': 'private, no-store' } })
}
