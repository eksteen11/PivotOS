import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const status = body.status as 'approved' | 'rejected'
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: approval } = await sb.from('approvals').select('*').eq('id', id).single()
  if (!approval) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await sb
    .from('approvals')
    .update({
      status,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)

  await sb.from('activity_logs').insert({
    user_id: user.id,
    entity_id: approval.entity_id,
    agent_id: approval.agent_id,
    approval_id: id,
    action: status === 'approved' ? 'approval.approved' : 'approval.rejected',
    payload: { action_type: approval.action_type },
  })

  return NextResponse.json({ ok: true })
}
