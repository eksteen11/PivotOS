import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await readJsonBody(request)
  const title = String(body.title ?? '').trim()
  const content = String(body.content ?? '').trim()
  const entityId = String(body.entity_id ?? '')
  if (!title || !content || !entityId) {
    return NextResponse.json({ error: 'Title, notes and business are required' }, { status: 400 })
  }

  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: meeting, error } = await sb.from('items').insert({
    user_id: user.id,
    entity_id: entityId,
    type: 'meeting',
    status: 'planned',
    title,
    content,
    source: 'manual',
    due_at: typeof body.due_at === 'string' && body.due_at ? body.due_at : null,
    meta: { prep: [] },
  }).select('id,entity_id').single()

  if (error || !meeting) return NextResponse.json({ error: error?.message ?? 'Could not save meeting' }, { status: 400 })

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: meeting.entity_id,
    action: 'meeting.created',
    payload: { meeting_id: meeting.id },
  })
  if (auditError) {
    await sb.from('items').update({ deleted_at: new Date().toISOString(), status: 'cancelled' }).eq('id', meeting.id)
    return NextResponse.json({ error: 'Meeting was not kept because the audit trail could not be written' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
