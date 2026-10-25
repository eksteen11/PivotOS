import { NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/http/readJson'
import { sameOrigin } from '@/lib/intake/server'
import { isUuid } from '@/lib/intake/shared'
import { recordingContext } from '@/lib/meetings/recordingServer'

export async function GET(request: Request) {
  const meetingId = new URL(request.url).searchParams.get('meetingId') ?? ''
  const context = await recordingContext(meetingId)
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  const { data, error } = await context.admin.from('meeting_recordings')
    .select('id,state,created_at,expires_at,duration_ms,segments:meeting_recording_segments(sequence,transcript,transcription_state)')
    .eq('owner_id', context.ownerId).eq('meeting_id', meetingId).order('created_at')
  if (error) return NextResponse.json({ error: 'Private recording storage needs its database setup.' }, { status: 503 })
  return NextResponse.json({ recordings: data }, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const body = await readJsonBody(request)
  const meetingId = String(body.meetingId ?? '')
  const id = String(body.id ?? '')
  const context = await recordingContext(meetingId)
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  if (!isUuid(id) || body.consent !== true) return NextResponse.json({ error: 'Confirm everyone has agreed to recording.' }, { status: 400 })
  const { data: existing } = await context.admin.from('meeting_recordings').select('id').eq('id', id).eq('meeting_id', meetingId).eq('owner_id', context.ownerId).maybeSingle()
  if (existing) return NextResponse.json({ id })
  const { error } = await context.admin.from('meeting_recordings').insert({ id, owner_id: context.ownerId, meeting_id: meetingId })
  if (error) return NextResponse.json({ error: 'Recording could not start. Storage must be configured and minutes must be awaiting review.' }, { status: 409 })
  return NextResponse.json({ id }, { status: 201 })
}
