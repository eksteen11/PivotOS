import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await readJsonBody(request)
  const stepId = body.stepId as string | undefined
  const action = body.action as 'advance' | 'skip' | undefined
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!stepId || !action) return NextResponse.json({ error: 'stepId and action required' }, { status: 400 })

  const { data: process } = await sb.from('processes').select('id,entity_id').eq('id', id).single()
  if (!process) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const nextStatus = action === 'skip' ? 'done' : 'done'
  await sb
    .from('process_steps')
    .update({ status: nextStatus, completed_at: new Date().toISOString() })
    .eq('id', stepId)
    .eq('process_id', id)

  const { data: steps } = await sb
    .from('process_steps')
    .select('id,sort_order,status')
    .eq('process_id', id)
    .order('sort_order')

  const ordered = steps ?? []
  const nextPending = ordered.find((s) => s.status === 'pending' || s.status === 'in_progress')
  if (nextPending && nextPending.status === 'pending') {
    await sb.from('process_steps').update({ status: 'in_progress' }).eq('id', nextPending.id)
  }

  const allDone = ordered.length > 0 && ordered.every((s) => s.id === stepId || s.status === 'done')
  if (allDone) {
    await sb.from('processes').update({ status: 'done' }).eq('id', id)
  }

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: process.entity_id,
    process_id: id,
    action: action === 'skip' ? 'process.step_skipped' : 'process.step_advanced',
    payload: { step_id: stepId },
  })
  if (auditError) {
    return NextResponse.json({ error: 'Step change was not kept because the audit trail could not be written' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
