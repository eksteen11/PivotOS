import { NextResponse } from 'next/server'

import { writeActivityLog } from '@/lib/data/audit'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await readJsonBody(request)
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: agent, error } = await sb.from('agents').insert({
    user_id: user.id,
    entity_id: body.entity_id,
    slug: body.slug,
    name: body.name,
    role: body.role,
    job_description: body.job_description ?? '',
    status: body.status ?? 'active',
  }).select('id,entity_id').single()

  if (error || !agent) return NextResponse.json({ error: error?.message ?? 'Could not create agent' }, { status: 400 })

  const auditError = await writeActivityLog(sb, {
    user_id: user.id,
    entity_id: agent.entity_id,
    agent_id: agent.id,
    action: 'agent.created',
    payload: { name: body.name, slug: body.slug },
  })
  if (auditError) {
    await sb.from('agents').update({ status: 'archived' }).eq('id', agent.id)
    return NextResponse.json({ error: 'Agent was not kept because the audit trail could not be written' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
