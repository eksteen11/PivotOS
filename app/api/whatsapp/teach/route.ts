import { NextResponse } from 'next/server'
import { requireFounderSession } from '@/lib/intake/server'
import { isUuid } from '@/lib/intake/shared'
import {
  rememberFromDraftCorrection,
  rememberTeachEntry,
  type TeachMemoryKind,
} from '@/lib/whatsapp/teach'
import { whatsappAdmin } from '@/lib/whatsapp/server'
import { listTeachMemory, persistTeachEdit, persistTeachUndo, upsertTeachMemory } from '@/lib/whatsapp/store'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const contactKey = new URL(request.url).searchParams.get('contactKey') || undefined
  const result = await listTeachMemory(admin, auth.user.id, contactKey || undefined)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 503 })
  return NextResponse.json({ connected: true, entries: result.entries })
}

export async function POST(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const body = await request.json().catch(() => null) as null | {
    mode?: 'teach' | 'draft-correction'
    id?: string
    contactKey?: string
    context?: string | null
    kind?: TeachMemoryKind
    text?: string
    at?: string
  }
  if (!body?.contactKey || !body.text) return NextResponse.json({ error: 'contactKey and text are required.' }, { status: 400 })
  const at = body.at && Number.isFinite(Date.parse(body.at)) ? body.at : new Date().toISOString()
  const id = body.id && isUuid(body.id) ? body.id : crypto.randomUUID()
  const saved = body.mode === 'draft-correction'
    ? rememberFromDraftCorrection({ id, contactKey: body.contactKey, context: body.context, preference: body.text, at })
    : rememberTeachEntry({
      id,
      contactKey: body.contactKey,
      context: body.context,
      kind: body.kind ?? 'handling-instruction',
      body: body.text,
      source: 'explicit-teaching',
      at,
    })
  if (!saved.ok) return NextResponse.json({ error: saved.error }, { status: 400 })
  const persisted = await upsertTeachMemory(admin, auth.user.id, saved.entry)
  if (!persisted.ok) return NextResponse.json({ error: persisted.error }, { status: 503 })
  return NextResponse.json({ connected: true, entry: persisted.entry })
}

export async function PATCH(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const body = await request.json().catch(() => null) as null | {
    action?: 'undo' | 'edit'
    id?: string
    text?: string
    at?: string
  }
  if (!body?.id || !isUuid(body.id)) return NextResponse.json({ error: 'A valid memory id is required.' }, { status: 400 })
  const at = body.at && Number.isFinite(Date.parse(body.at)) ? body.at : new Date().toISOString()
  if (body.action === 'undo') {
    const result = await persistTeachUndo(admin, auth.user.id, body.id, at)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 })
    return NextResponse.json({ connected: true, entry: result.entry })
  }
  if (body.action === 'edit') {
    if (!body.text?.trim()) return NextResponse.json({ error: 'Edited text is required.' }, { status: 400 })
    const result = await persistTeachEdit(admin, auth.user.id, body.id, body.text.trim().slice(0, 4_000), at)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 })
    return NextResponse.json({ connected: true, entry: result.entry })
  }
  return NextResponse.json({ error: 'action must be undo or edit.' }, { status: 400 })
}
