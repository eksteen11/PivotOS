import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await readJsonBody(request)
  const transcript = String(body.transcript ?? '').trim()
  if (!transcript) {
    return NextResponse.json(
      { error: 'Paste a real transcript. Pivot does not invent meeting notes.' },
      { status: 400 },
    )
  }

  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: meeting } = await sb.from('items').select('*').eq('id', id).eq('type', 'meeting').single()
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const previousMeta = (meeting.meta as Record<string, unknown> | null) ?? {}
  const meta: Record<string, unknown> = {
    ...previousMeta,
    transcript,
    transcript_source: 'manual_import',
    imported_at: new Date().toISOString(),
  }
  delete meta.decisions

  const { error: updateError } = await sb.from('items').update({ meta }).eq('id', id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: meeting.entity_id,
    action: 'meeting.transcript_imported',
    payload: { meeting_id: id, source: 'manual_import' },
  })
  if (auditError) {
    await sb.from('items').update({ meta: previousMeta }).eq('id', id)
    return NextResponse.json(
      { error: 'Transcript was not kept because the audit trail could not be written' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
