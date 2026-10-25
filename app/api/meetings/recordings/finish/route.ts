import { NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/http/readJson'
import { sameOrigin } from '@/lib/intake/server'
import { recordingContext } from '@/lib/meetings/recordingServer'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const body = await readJsonBody(request)
  const context = await recordingContext(String(body.meetingId ?? ''))
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  const { data } = await context.admin.from('meeting_recordings').select('id').eq('id', String(body.id ?? '')).eq('meeting_id', context.meeting.id).eq('owner_id', context.ownerId).maybeSingle()
  if (!data) return NextResponse.json({ error: 'Recording not found.' }, { status: 404 })
  const { error } = await context.admin.rpc('finish_meeting_recording', { recording: data.id, owner: context.ownerId, segment_count: Number(body.segmentCount) })
  if (error) return NextResponse.json({ error: 'Some audio is still missing. Retry the saved device copy.' }, { status: 409 })
  return NextResponse.json({ saved: true })
}
