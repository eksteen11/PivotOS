import { NextResponse } from 'next/server'

import { openaiApiKey, openaiModel } from '@/lib/env'
import { readJsonBody } from '@/lib/http/readJson'
import { requireFounderSession, sameOrigin, withTimeout } from '@/lib/intake/server'
import { clarificationPatch, clarificationPrompt, clarificationResponseFormat, clarificationUserPayload } from '@/lib/meetings/clarify'
import { applyMeetingPatch, entitySlugFrom, founderCanAccess, itemStatusForLifecycle, nextQuestion, readMeetingCore } from '@/lib/meetings/core'
import { companies } from '@/lib/workspace/catalogue'

function todaySast() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const body = await readJsonBody(request)
  const id = String(body.id ?? '')
  const reply = String(body.reply ?? '').trim().slice(0, 2000)
  if (!reply) return NextResponse.json({ error: 'Say the detail in a sentence.' }, { status: 400 })
  const { data: row } = await auth.sb.from('items').select('*, entities(slug)').eq('id', id).eq('user_id', auth.user.id).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
  if (!row || !founderCanAccess({ role: 'founder', ownerId: String(row.user_id), requesterId: auth.user.id })) {
    return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 })
  }
  if (String(body.updatedAt ?? '') !== String(row.updated_at)) {
    return NextResponse.json({ error: 'This meeting changed in another window. Reload before saving.' }, { status: 409 })
  }
  const dueAt = row.due_at ? String(row.due_at) : null
  const current = readMeetingCore((row.meta as Record<string, unknown> | null) ?? {}, dueAt, entitySlugFrom(row.entities))
  if (!current) return NextResponse.json({ error: 'This meeting’s business could not be read, so nothing was changed.' }, { status: 409 })
  if (current.reviewClaim?.phase === 'pending') return NextResponse.json({ error: 'A review is being saved. Retry it before editing.' }, { status: 409 })
  if (!openaiApiKey) return NextResponse.json({ error: 'Clarification is unavailable until OpenAI is configured.' }, { status: 503 })
  const timeout = withTimeout(20000)
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0,
        response_format: clarificationResponseFormat(),
        messages: [
          { role: 'system', content: clarificationPrompt(todaySast()) },
          { role: 'user', content: clarificationUserPayload(current, reply) },
        ],
      }),
      signal: timeout.signal,
    })
    if (!response.ok) return NextResponse.json({ error: `Clarification failed (${response.status}).` }, { status: 502 })
    const payload = await response.json()
    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string') return NextResponse.json({ error: 'Clarification returned an empty response.' }, { status: 502 })
    const applied = applyMeetingPatch(current, clarificationPatch(content), dueAt)
    if (!applied.ok) return NextResponse.json({ error: applied.error }, { status: 400 })
    applied.core.clarifications = [...applied.core.clarifications, { field: 'reply', question: nextQuestion(current)?.prompt ?? 'Reply', answer: reply.slice(0, 500) }].slice(-8)
    let entityId = row.entity_id ? String(row.entity_id) : ''
    if (applied.core.company !== current.company) {
      const slug = companies.find((entry) => entry.id === applied.core.company)?.slug ?? ''
      const { data: entity } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', slug).maybeSingle()
      if (!entity?.id) return NextResponse.json({ error: 'This business is not available for your account.' }, { status: 403 })
      entityId = String(entity.id)
    }
    const now = new Date().toISOString()
    const { data, error } = await auth.sb.from('items').update({
      entity_id: entityId,
      status: itemStatusForLifecycle(applied.core.lifecycle),
      content: applied.core.purpose || String(row.content ?? ''),
      due_at: applied.dueAt,
      meta: { ...(row.meta as Record<string, unknown> | null), meeting_core: applied.core, people: applied.core.attendees, place: applied.core.place, link: applied.core.link },
      updated_at: now,
    }).eq('id', id).eq('user_id', auth.user.id).eq('updated_at', row.updated_at).select('updated_at').maybeSingle()
    if (error || !data) return NextResponse.json({ error: 'This meeting changed in another window. Reload before saving.' }, { status: 409 })
    return NextResponse.json({ id, updatedAt: data.updated_at, meeting: applied.core, dueAt: applied.dueAt, calledModel: true })
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'Clarification timed out.' : 'Clarification failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  } finally {
    timeout.clear()
  }
}
