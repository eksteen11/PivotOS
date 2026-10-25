import { NextResponse } from 'next/server'
import { recordingContext } from '@/lib/meetings/recordingServer'

export async function GET(request: Request) {
  const meetingId = new URL(request.url).searchParams.get('meetingId') ?? ''
  const context = await recordingContext(meetingId)
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status })
  const [connections, calendar, reminders] = await Promise.all([
    context.admin.from('meeting_connections').select('provider,account_email,configuration').eq('owner_id', context.ownerId),
    context.admin.from('meeting_calendar_jobs').select('state,error,synced_at').eq('owner_id', context.ownerId).eq('meeting_id', meetingId).maybeSingle(),
    context.admin.from('meeting_reminder_jobs').select('id,kind,due_at,state,error,delivered_at').eq('owner_id', context.ownerId).eq('meeting_id', meetingId).order('due_at', { ascending: false }).limit(10),
  ])
  if (connections.error || calendar.error || reminders.error) return NextResponse.json({ error: 'Meeting connections need database setup.' }, { status: 503 })
  return NextResponse.json({ connections: connections.data?.map((connection) => ({ provider: connection.provider, account_email: connection.account_email, verified: Boolean(connection.configuration?.recipientVerifiedAt) })), calendar: calendar.data, reminders: reminders.data }, { headers: { 'Cache-Control': 'private, no-store' } })
}
