import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: meeting } = await sb.from('items').select('*').eq('id', id).eq('type', 'meeting').single()
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const transcript = [
    'Founder: Confirm next actions and owners.',
    'Team: Pipeline updates shared.',
    'Decision: AI will draft follow-ups for approval.',
    'Decision: Blocked items escalate to Command Centre.',
  ].join('\n')

  const decisions = [
    'Create follow-up tasks from this meeting',
    'Queue outbound drafts for approval',
    'Update process deadlines this week',
  ]

  const meta = {
    ...(meeting.meta as Record<string, unknown> | null),
    transcript,
    decisions,
    analysed_at: new Date().toISOString(),
  }

  await sb.from('items').update({ meta, content: `${meeting.content}\n\nTranscript ready.` }).eq('id', id)

  for (const decision of decisions) {
    await sb.from('items').insert({
      user_id: user.id,
      entity_id: meeting.entity_id,
      type: 'task',
      status: 'planned',
      title: decision,
      content: `From meeting: ${meeting.title}`,
      meta: { from_meeting_id: id, seed_batch: 'meeting_decisions' },
    })
  }

  await sb.from('activity_logs').insert({
    user_id: user.id,
    entity_id: meeting.entity_id,
    action: 'meeting.simulated_transcript',
    payload: { meeting_id: id, decisions },
  })

  return NextResponse.json({ ok: true, transcript, decisions })
}
