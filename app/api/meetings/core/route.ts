import { NextResponse } from 'next/server'

import { readJsonBody } from '@/lib/http/readJson'
import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { applyMeetingPatch, entitySlugFrom, founderCanAccess, incompleteMeeting, itemStatusForLifecycle, readMeetingCore, type MeetingCore, type MeetingPatch } from '@/lib/meetings/core'
import { companies } from '@/lib/workspace/catalogue'

function companySlug(company: MeetingCore['company']) {
  return companies.find((entry) => entry.id === company)?.slug ?? ''
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth || !founderCanAccess({ role: 'founder', ownerId: auth.user.id, requesterId: auth.user.id })) {
    return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  }
  const body = await readJsonBody(request)
  const draft = incompleteMeeting({
    title: String(body.title ?? ''),
    note: String(body.note ?? ''),
    company: body.company,
    systemId: String(body.systemId ?? '001'),
    sourceCaptureId: String(body.sourceCaptureId ?? ''),
  })
  if (!draft.ok) return NextResponse.json({ error: draft.error }, { status: 400 })
  const { data: createdEntity } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', companySlug(draft.core.company)).maybeSingle()
  const entityId = createdEntity?.id ? String(createdEntity.id) : ''
  if (!entityId) return NextResponse.json({ error: 'This business is not available for your account.' }, { status: 403 })
  const now = new Date().toISOString()
  const { data, error } = await auth.sb.from('items').insert({
    user_id: auth.user.id,
    entity_id: entityId,
    type: 'meeting',
    status: itemStatusForLifecycle(draft.core.lifecycle),
    title: draft.title,
    content: draft.core.purpose,
    source: 'manual',
    due_at: draft.dueAt,
    meta: { meeting_core: draft.core, people: draft.core.attendees, place: draft.core.place },
    updated_at: now,
  }).select('id,updated_at').single()
  if (error || !data) return NextResponse.json({ error: 'The meeting was not saved.' }, { status: 500 })
  return NextResponse.json({ id: data.id, updatedAt: data.updated_at, meeting: draft.core, dueAt: null }, { status: 201 })
}

export async function PATCH(request: Request) {
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
  const dueAt = row.due_at ? String(row.due_at) : null
  const current = readMeetingCore((row.meta as Record<string, unknown> | null) ?? {}, dueAt, entitySlugFrom(row.entities))
  if (!current) return NextResponse.json({ error: 'This meeting’s business could not be read, so nothing was changed.' }, { status: 409 })
  const rawPatch = body.patch && typeof body.patch === 'object' ? body.patch as Record<string, unknown> : {}
  const patch = rawPatch as MeetingPatch
  const applied = applyMeetingPatch(current, patch, dueAt)
  if (!applied.ok) return NextResponse.json({ error: applied.error }, { status: 400 })
  let entityId = row.entity_id ? String(row.entity_id) : ''
  if (applied.core.company !== current.company) {
    const { data: nextEntity } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', companySlug(applied.core.company)).maybeSingle()
    entityId = nextEntity?.id ? String(nextEntity.id) : ''
    if (!entityId) return NextResponse.json({ error: 'This business is not available for your account.' }, { status: 403 })
  }
  const now = new Date().toISOString()
  const title = typeof rawPatch.title === 'string' && rawPatch.title.trim() ? rawPatch.title.trim().slice(0, 180) : String(row.title ?? 'Meeting')
  const { data, error } = await auth.sb.from('items').update({
    entity_id: entityId,
    status: itemStatusForLifecycle(applied.core.lifecycle),
    title,
    content: applied.core.liveNotes || applied.core.purpose || String(row.content ?? ''),
    due_at: applied.dueAt,
    meta: { ...(row.meta as Record<string, unknown> | null), meeting_core: applied.core, people: applied.core.attendees, place: applied.core.place, link: applied.core.link },
    updated_at: now,
  }).eq('id', id).eq('user_id', auth.user.id).eq('updated_at', row.updated_at).select('updated_at').maybeSingle()
  if (error) return NextResponse.json({ error: 'The meeting was not saved.' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'This meeting changed in another window. Reload before saving.' }, { status: 409 })
  return NextResponse.json({ id, updatedAt: data.updated_at, meeting: applied.core, dueAt: applied.dueAt })
}
