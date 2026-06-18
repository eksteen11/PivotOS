import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await sb.from('items').insert({
    user_id: user.id,
    entity_id: body.entity_id,
    type: 'note',
    status: 'inbox',
    title: body.title,
    content: body.content,
    source: body.source ?? 'manual',
    meta: body.meta ?? {},
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
