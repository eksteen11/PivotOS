import { NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/http/readJson'
import { sameOrigin } from '@/lib/intake/server'
import { recordingContext } from '@/lib/meetings/recordingServer'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const body = await readJsonBody(request)
  const context = await recordingContext(String(body.meetingId ?? ''))
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  const { data } = await context.admin.from('meeting_recordings').select('id,state,expires_at').eq('id', String(body.id ?? '')).eq('owner_id', context.ownerId).eq('meeting_id', context.meeting.id).maybeSingle()
  if (!data || data.state === 'deleted' || (data.expires_at && Date.parse(data.expires_at) <= Date.now())) return NextResponse.json({ error: 'Recording not found.' }, { status: 404 })
  const { error } = await context.admin.from('meeting_recording_segments').update({ attempts: 0, lease_until: null, transcription_state: 'pending', last_error: null }).eq('recording_id', data.id).eq('transcription_state', 'failed')
  if (error) return NextResponse.json({ error: 'The retry was not saved.' }, { status: 502 })
  return NextResponse.json({ queued: true })
}
