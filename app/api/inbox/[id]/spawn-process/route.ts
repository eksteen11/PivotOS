import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { templateBySlug } from '@/lib/processes/templates'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: item } = await sb.from('items').select('*').eq('id', id).single()
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const templateSlug = (item.meta?.suggested_process as string) || 'lead'
  const template = templateBySlug(templateSlug) ?? templateBySlug('lead')!

  const { data: agent } = await sb
    .from('agents')
    .select('id')
    .eq('user_id', user.id)
    .eq('entity_id', item.entity_id)
    .eq('slug', (item.meta?.suggested_agent as string) || 'sales')
    .maybeSingle()

  const { data: process, error } = await sb
    .from('processes')
    .insert({
      user_id: user.id,
      entity_id: item.entity_id,
      template_slug: template.slug,
      title: item.title ?? item.content.slice(0, 80),
      status: 'active',
      assigned_agent_id: agent?.id ?? null,
      human_owner: 'Owner',
      inbox_item_id: item.id,
    })
    .select('id')
    .single()

  if (error || !process) return NextResponse.json({ error: error?.message ?? 'Failed' }, { status: 400 })

  await sb.from('process_steps').insert(
    template.steps.map((title, sort_order) => ({
      user_id: user.id,
      process_id: process.id,
      sort_order,
      title,
      status: sort_order === 0 ? 'in_progress' : 'pending',
      assigned_agent_id: agent?.id ?? null,
    })),
  )

  await sb.from('items').update({ status: 'planned', process_id: process.id }).eq('id', id)

  await sb.from('activity_logs').insert({
    user_id: user.id,
    entity_id: item.entity_id,
    process_id: process.id,
    action: 'process.spawned_from_inbox',
    payload: { inbox_item_id: id, template: template.slug },
  })

  return NextResponse.json({ ok: true, process_id: process.id })
}
