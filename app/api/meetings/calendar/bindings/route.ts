import { NextResponse } from 'next/server'
import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { readJsonBody } from '@/lib/http/readJson'
import { GoogleCalendar } from '@/lib/meetings/calendar'
import { googleAccessToken } from '@/lib/meetings/googleConnection'
import { recordingAdmin } from '@/lib/meetings/recordingServer'
import { knownCompany } from '@/lib/meetings/core'

export async function GET() {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = recordingAdmin()
  if (!admin) return NextResponse.json({ error: 'Calendar connection setup is incomplete.' }, { status: 503 })
  try {
    const account = await googleAccessToken(admin, auth.user.id)
    const calendars = await new GoogleCalendar(account.token).calendars()
    const { data: bindings } = await admin.from('meeting_calendar_bindings').select('company,calendar_id,approved_readers').eq('owner_id', auth.user.id)
    return NextResponse.json({ calendars: calendars.map(({ id, summary }) => ({ id, summary })), bindings: bindings ?? [], account: account.email }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch { return NextResponse.json({ error: 'Google Calendar is not connected or needs reconnection.' }, { status: 503 }) }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = recordingAdmin()
  if (!admin) return NextResponse.json({ error: 'Calendar connection setup is incomplete.' }, { status: 503 })
  const body = await readJsonBody(request)
  const company = knownCompany(body.company)
  const calendarId = String(body.calendarId ?? '').trim()
  const readers = Array.isArray(body.readers) ? [...new Set(body.readers.map((value) => String(value).trim().toLowerCase()))] : []
  if (!company || !calendarId || body.confirmVisibility !== true || readers.length > 100 || readers.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return NextResponse.json({ error: 'Review the company calendar and its exact authorised readers.' }, { status: 400 })
  try {
    const account = await googleAccessToken(admin, auth.user.id)
    const google = new GoogleCalendar(account.token)
    const calendars = await google.calendars()
    if (!calendars.some((calendar) => calendar.id === calendarId)) throw new Error('Choose a calendar owned by the connected account.')
    await google.privacy({ company, calendarId, readers, ownerEmail: account.email })
    const { data: existing } = await admin.from('meeting_calendar_bindings').select('calendar_id,approved_readers').eq('owner_id', auth.user.id).eq('company', company).maybeSingle()
    if (existing && existing.calendar_id !== calendarId) throw new Error('Disconnect and reconcile the old company calendar before replacing it.')
    const { error } = await admin.from('meeting_calendar_bindings').upsert({ owner_id: auth.user.id, company, calendar_id: calendarId, approved_readers: readers, reviewed_at: new Date().toISOString() }, { onConflict: 'owner_id,company' })
    if (error) throw new Error('This calendar is already assigned to another company, or could not be saved.')
    return NextResponse.json({ saved: true })
  } catch (failure) { return NextResponse.json({ error: failure instanceof Error ? failure.message : 'Calendar binding was not saved.' }, { status: 409 }) }
}
