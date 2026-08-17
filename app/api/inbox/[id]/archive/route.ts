import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { createClient } from '@/lib/supabase/server'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: item } = await sb.from('items').select('id,entity_id,status').eq('id', id).single()
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (item.status !== 'inbox') return NextResponse.json({ error: 'Item is no longer in inbox' }, { status: 409 })

  const { error } = await sb.from('items').update({ status: 'cancelled' }).eq('id', id).eq('status', 'inbox')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: item.entity_id,
    action: 'inbox.archived',
    payload: { item_id: id },
  })
  if (auditError) {
    await sb.from('items').update({ status: 'inbox' }).eq('id', id)
    return NextResponse.json({ error: 'Archive blocked because the audit trail could not be written' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
