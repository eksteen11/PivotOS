import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await readJsonBody(request)
  const status = body.status as 'approved' | 'rejected'
  if (status !== 'approved' && status !== 'rejected') {
    return NextResponse.json({ error: 'Invalid approval decision' }, { status: 400 })
  }
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: rpcResult, error: rpcError } = await sb.rpc('resolve_my_approval', {
    p_approval_id: id,
    p_decision: status,
  })
  if (!rpcError) {
    return NextResponse.json({ ok: true, execution: 'not_configured', result: rpcResult })
  }

  const { data: approval } = await sb.from('approvals').select('*').eq('id', id).single()
  if (!approval) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: resolved, error: resolveError } = await sb
    .from('approvals')
    .update({
      status,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (resolveError) return NextResponse.json({ error: resolveError.message }, { status: 500 })
  if (!resolved) return NextResponse.json({ error: 'Approval already resolved' }, { status: 409 })

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: approval.entity_id,
    agent_id: approval.agent_id,
    approval_id: id,
    action: status === 'approved' ? 'approval.approved' : 'approval.rejected',
    payload: { action_type: approval.action_type },
  })

  if (auditError) {
    await sb.from('approvals').update({
      status: 'pending',
      resolved_by: null,
      resolved_at: null,
    }).eq('id', id)
    return NextResponse.json({ error: 'Decision was not kept because the audit trail could not be written' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, execution: 'not_configured' })
}
