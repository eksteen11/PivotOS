import { NextResponse } from 'next/server'

import { openaiApiKey, openaiModel } from '@/lib/env'
import { readJsonBody } from '@/lib/http/readJson'
import { requireFounderSession, sameOrigin, withTimeout } from '@/lib/intake/server'
import { entitySlugFrom, founderCanAccess, itemStatusForLifecycle, readMeetingCore } from '@/lib/meetings/core'
import { emptyMinutes, minutesEvidence, minutesFromModel, minutesPrompt, minutesResponseFormat } from '@/lib/meetings/minutes'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const body = await readJsonBody(request)
  const id = String(body.id ?? '')
  const { data: row } = await auth.sb.from('items').select('*, entities(slug)').eq('id', id).eq('user_id', auth.user.id).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
  if (!row || !founderCanAccess({ role: 'founder', ownerId: String(row.user_id), requesterId: auth.user.id })) {
    return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 })
  }
  if (String(body.updatedAt ?? '') !== String(row.updated_at)) {
    return NextResponse.json({ error: 'This meeting changed in another window. Reload before saving.' }, { status: 409 })
  }
  const current = readMeetingCore((row.meta as Record<string, unknown> | null) ?? {}, row.due_at ? String(row.due_at) : null, entitySlugFrom(row.entities))
  if (!current) return NextResponse.json({ error: 'This meeting’s business could not be read, so nothing was changed.' }, { status: 409 })
  if (current.reviewClaim?.phase === 'pending') return NextResponse.json({ error: 'A review is being saved. Retry it before editing.' }, { status: 409 })
  const evidence = minutesEvidence({ liveNotes: current.liveNotes, meetingTranscript: current.meetingTranscript })
  if (evidence.kind === 'none') {
    return NextResponse.json({ minutes: emptyMinutes(), calledModel: false, error: 'No transcript or notes were available, so no minutes were drafted.' }, { status: 400 })
  }
  if (!openaiApiKey) return NextResponse.json({ error: 'Minutes drafting is unavailable until OpenAI is configured.' }, { status: 503 })
  const timeout = withTimeout(20000)
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.1,
        response_format: minutesResponseFormat(),
        messages: [
          { role: 'system', content: minutesPrompt() },
          { role: 'user', content: evidence.text },
        ],
      }),
      signal: timeout.signal,
    })
    if (!response.ok) return NextResponse.json({ error: `Minutes drafting failed (${response.status}).` }, { status: 502 })
    const payload = await response.json()
    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string') return NextResponse.json({ error: 'Minutes drafting returned an empty response.' }, { status: 502 })
    const minutes = minutesFromModel(content, evidence.kind)
    minutes.revision = (current.minutes?.revision ?? 0) + 1
    const next = { ...current, lifecycle: 'minutes_review' as const, minutes, minutesStale: false }
    const now = new Date().toISOString()
    const { data, error } = await auth.sb.from('items').update({
      status: itemStatusForLifecycle(next.lifecycle),
      meta: { ...(row.meta as Record<string, unknown> | null), meeting_core: next },
      updated_at: now,
    }).eq('id', id).eq('user_id', auth.user.id).eq('updated_at', row.updated_at).select('updated_at').maybeSingle()
    if (error || !data) return NextResponse.json({ error: 'The minutes were not saved.' }, { status: 500 })
    return NextResponse.json({ minutes, updatedAt: data.updated_at, calledModel: true })
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'Minutes drafting timed out.' : 'Minutes drafting failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  } finally {
    timeout.clear()
  }
}
