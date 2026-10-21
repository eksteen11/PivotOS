import { NextResponse } from 'next/server'

import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { entitySlugFrom, founderCanAccess, readMeetingCore } from '@/lib/meetings/core'
import { evidenceText } from '@/lib/meetings/minutes'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const { id } = await params
  const { data: row } = await auth.sb.from('items').select('id,user_id,meta,due_at,entities(slug)').eq('id', id).eq('user_id', auth.user.id).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
  if (!row || !founderCanAccess({ role: 'founder', ownerId: String(row.user_id), requesterId: auth.user.id })) {
    return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 })
  }
  const core = readMeetingCore((row.meta as Record<string, unknown> | null) ?? {}, row.due_at ? String(row.due_at) : null, entitySlugFrom(row.entities))
  if (!core) return NextResponse.json({ error: 'This meeting’s business could not be read, so nothing was changed.' }, { status: 409 })
  const evidence = evidenceText({ notes: core.liveNotes })
  if (evidence.kind === 'none') {
    return NextResponse.json({ error: 'No transcript or notes were available, so no minutes were drafted.' }, { status: 400 })
  }
  return NextResponse.json({ error: 'Draft minutes from the meeting workspace. Simulated analysis is no longer available.' }, { status: 410 })
}
