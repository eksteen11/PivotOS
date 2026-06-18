import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await sb.from('agents').insert({
    user_id: user.id,
    entity_id: body.entity_id,
    slug: body.slug,
    name: body.name,
    role: body.role,
    job_description: body.job_description ?? '',
    status: body.status ?? 'active',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await sb.from('activity_logs').insert({
    user_id: user.id,
    entity_id: body.entity_id,
    action: 'agent.created',
    payload: { name: body.name, slug: body.slug },
  })

  return NextResponse.json({ ok: true })
}
