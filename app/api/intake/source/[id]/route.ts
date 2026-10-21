import { NextResponse } from 'next/server'

import { requireFounderSession, sameOrigin } from '@/lib/intake/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  }
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const { id } = await params
  const { data: row } = await auth.sb
    .from('items')
    .select('id,content,meta,created_at')
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .eq('type', 'note')
    .maybeSingle()
  if (!row) return NextResponse.json({ error: 'Source transcript not found.' }, { status: 404 })
  const meta = (row.meta as Record<string, unknown> | null) ?? {}
  if (Number(meta.intake_version ?? 0) !== 1) {
    return NextResponse.json({ error: 'Source transcript not found.' }, { status: 404 })
  }
  return NextResponse.json({
    sourceCaptureId: row.id,
    transcript: String(row.content ?? ''),
    summary: String(meta.ai_summary ?? ''),
    clarifications: Array.isArray(meta.clarifications) ? meta.clarifications : [],
    sourceLabel: String(meta.source_label ?? 'Manual'),
    transcriptMetadata: meta.transcript_metadata ?? {},
    retainedAudio: false,
    createdAt: row.created_at,
  })
}
