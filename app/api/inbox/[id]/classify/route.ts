import { NextResponse } from 'next/server'

import { getAiService } from '@/lib/ai/service'
import { createClient } from '@/lib/supabase/server'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: item } = await sb
    .from('items')
    .select('id,title,content,source,meta,entity_id,entities(slug)')
    .eq('id', id)
    .single()
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ai = await getAiService()
  const recommendation = await ai.classifyInboxItem({
    title: item.title ?? '',
    content: item.content ?? '',
    source: item.source,
    entitySlug: (item.entities as { slug?: string } | null)?.slug,
  })

  const meta = {
    ...(item.meta as Record<string, unknown> | null),
    ...recommendation.payload,
    ai_classification: {
      summary: recommendation.summary,
      reason: recommendation.reason,
      confidence: recommendation.confidence,
      risk: recommendation.risk,
      nextAction: recommendation.nextAction,
    },
  }

  await sb.from('items').update({ meta }).eq('id', id)
  await sb.from('activity_logs').insert({
    user_id: user.id,
    entity_id: item.entity_id,
    action: 'ai.classified_inbox',
    payload: recommendation,
  })

  return NextResponse.json({ ok: true, recommendation })
}
