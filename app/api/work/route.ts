import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readJsonBody } from '@/lib/http/readJson'
import { sameOrigin } from '@/lib/http/sameOrigin'
import { companies } from '@/lib/workspace/catalogue'
import { applyWorkAction, validateWorkInput, type WorkCase } from '@/lib/workspace/model'
import { isUuid } from '@/lib/intake/shared'
import { caseFromRow, validateCaseEntity } from '@/lib/workspace/data'
import { workSummary } from '@/lib/workspace/workLink'

async function founderClient() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data: profile } = await sb.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  return profile?.role === 'founder' ? { sb, user } : null
}
export async function GET(request: Request) {
  const auth = await founderClient()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id') ?? ''
  if (!isUuid(id)) return NextResponse.json({ error: 'Work not found.' }, { status: 404 })
  const { data } = await auth.sb.from('items').select('*').eq('id', id).eq('user_id', auth.user.id).is('deleted_at', null).maybeSingle()
  const item = data ? workSummary(caseFromRow(data)) : null
  if (!item) return NextResponse.json({ error: 'Work not found.' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await founderClient()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const body = await readJsonBody(request)
  try {
    const input = validateWorkInput(body)
    const company = companies.find((c) => c.id === input.company)
    const { data: entity } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', company?.slug ?? '').maybeSingle()
    if (!entity) return NextResponse.json({ error: 'This business is not available for your account.' }, { status: 403 })
    // Stable client-generated id makes retrying a timed-out create safe.
    const id = String(body.id ?? '')
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error('A valid capture reference is required.')
    const now = new Date().toISOString()
    const item: WorkCase = { ...input, id, entityId: entity.id, status: 'planned', source: 'Manual capture', updatedAt: now, kind: 'work', facts: {}, checked: [], lessons: [], history: [{ at: now, text: 'Captured by Drikus. Work plan awaits approval.' }] }
    const { data, error } = await auth.sb.from('items').insert({ id, user_id: auth.user.id, entity_id: entity.id, type: 'process', status: 'planned', source: 'manual', title: input.title, content: input.notes, due_at: input.due ? `${input.due}T12:00:00+02:00` : null, meta: { workspace_version: 1, pivot_case: item }, updated_at: now }).select('*').single()
    if (error?.code === '23505') {
      const { data: existing } = await auth.sb.from('items').select('*').eq('id', id).eq('user_id', auth.user.id).is('deleted_at', null).maybeSingle()
      const found = existing ? caseFromRow(existing) : null
      if (found) return NextResponse.json({ item: found })
    }
    if (error || !data) return NextResponse.json({ error: 'The work was not saved. Retry with the same form to avoid duplicates.' }, { status: 500 })
    return NextResponse.json({ item: caseFromRow(data) }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid work details.' }, { status: 400 })
  }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await founderClient()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const body = await readJsonBody(request)
  const { data: row } = await auth.sb.from('items').select('*').eq('id', String(body.id ?? '')).eq('user_id', auth.user.id).is('deleted_at', null).maybeSingle()
  const current = row ? caseFromRow(row) : null
  if (!current) return NextResponse.json({ error: 'Work not found.' }, { status: 404 })
  if (body.updatedAt !== current.updatedAt) return NextResponse.json({ error: 'This work changed in another window. Reload before making changes.' }, { status: 409 })
  const { data: entity } = await auth.sb.from('entities').select('slug').eq('id', current.entityId).eq('user_id', auth.user.id).maybeSingle()
  if (!entity || !validateCaseEntity(current, entity.slug)) return NextResponse.json({ error: 'The business scope does not match.' }, { status: 403 })
  try {
    const next = applyWorkAction(current, body, new Date().toISOString())
    // Record change and its history in the same row, with optimistic concurrency.
    const { data, error } = await auth.sb.from('items').update({ status: next.status, meta: { ...row!.meta, pivot_case: next }, updated_at: next.updatedAt }).eq('id', current.id).eq('user_id', auth.user.id).eq('updated_at', current.updatedAt).select('*').maybeSingle()
    if (error) return NextResponse.json({ error: 'The change was not saved. Please retry.' }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'This work changed in another window. Reload before making changes.' }, { status: 409 })
    return NextResponse.json({ item: caseFromRow(data) })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid work action.' }, { status: 400 })
  }
}
