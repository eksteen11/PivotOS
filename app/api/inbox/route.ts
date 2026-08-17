import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await readJsonBody(request)
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: item, error } = await sb.from('items').insert({
    user_id: user.id,
    entity_id: body.entity_id,
    type: 'note',
    status: 'inbox',
    title: body.title,
    content: body.content,
    source: body.source ?? 'manual',
    meta: body.meta ?? {},
  }).select('id,entity_id').single()

  if (error || !item) return NextResponse.json({ error: error?.message ?? 'Capture failed' }, { status: 400 })

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: item.entity_id,
    action: 'inbox.captured',
    payload: { item_id: item.id, source: body.source ?? 'manual' },
  })
  if (auditError) {
    await sb.from('items').update({ deleted_at: new Date().toISOString(), status: 'cancelled' }).eq('id', item.id)
    return NextResponse.json({ error: 'Capture blocked because the audit trail could not be written' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
