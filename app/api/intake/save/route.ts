import { NextResponse } from 'next/server'

import { companies, getSystem } from '@/lib/workspace/catalogue'
import { caseFromRow } from '@/lib/workspace/data'
import { readJsonBody } from '@/lib/http/readJson'
import { proposalBelongsToIntake, sourceIdMatchesIntake } from '@/lib/intake/idempotency'
import { formatSastLabel } from '@/lib/door/meetings'
import { asSourceLabel, clampText, toSastIso, type IntakeProposal } from '@/lib/intake/shared'
import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { normalizeProposal, validateSessionIds } from '@/lib/intake/validators'
import { createMeetingCore, itemStatusForLifecycle, readMeetingCore } from '@/lib/meetings/core'
import { mergeIntakeMeeting, saveExistingIntakeMeeting } from '@/lib/meetings/intakeMeeting'

function sourceField(label: string) {
  return `manual-import:${label.toLowerCase()}`
}

function toEntitySlug(company: IntakeProposal['company']) {
  return companies.find((entry) => entry.id === company)?.slug ?? ''
}

function savedMeeting(row: { id: unknown; title: unknown; due_at: unknown; meta: unknown }, company: string, fallbackTitle: string) {
  const meta = (row.meta as Record<string, unknown> | null) ?? {}
  const startsAt = String(row.due_at ?? '')
  return {
    id: String(row.id),
    title: String(row.title ?? fallbackTitle),
    company,
    timeLabel: formatSastLabel(startsAt),
    startsAt,
    people: String(meta.people ?? ''),
    place: String(meta.place ?? ''),
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  }
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })

  const body = await readJsonBody(request)
  if (JSON.stringify(body).length > 70000) {
    return NextResponse.json({ error: 'Intake payload is too large.' }, { status: 413 })
  }

  const sourceCaptureId = String(body.sourceCaptureId ?? '')
  const idempotencyKey = String(body.idempotencyKey ?? '')
  if (!validateSessionIds(sourceCaptureId, idempotencyKey)) {
    return NextResponse.json({ error: 'Valid sourceCaptureId and idempotencyKey are required.' }, { status: 400 })
  }
  const transcript = clampText(body.transcript, 12000)
  if (!transcript) return NextResponse.json({ error: 'Transcript is required.' }, { status: 400 })

  if (!Array.isArray(body.proposals)) return NextResponse.json({ error: 'Proposals array is required.' }, { status: 400 })
  if (!body.proposals.length || body.proposals.length > 8) {
    return NextResponse.json({ error: 'Provide between 1 and 8 proposals.' }, { status: 400 })
  }

  const proposals: IntakeProposal[] = []
  for (let index = 0; index < body.proposals.length; index += 1) {
    const proposal = normalizeProposal(body.proposals[index])
    if (!proposal) return NextResponse.json({ error: `Proposal ${index + 1} is invalid.` }, { status: 400 })
    proposals.push(proposal)
  }

  const sourceLabel = asSourceLabel(body.sourceLabel)
  const sourceFieldValue = sourceField(sourceLabel)
  const clarifications = Array.isArray(body.clarifications)
    ? body.clarifications
        .flatMap((entry) => {
          if (!entry || typeof entry !== 'object') return []
          const row = entry as Record<string, unknown>
          const field = clampText(row.field, 80)
          const answer = clampText(row.answer, 400)
          return field && answer ? [{ field, answer }] : []
        })
        .slice(0, 8)
    : []
  const transcriptMetadata = body.transcriptMetadata && typeof body.transcriptMetadata === 'object' ? body.transcriptMetadata : {}
  const summary = clampText(body.summary, 400)
  const language = clampText(body.language, 32)
  const transcriptExcerpt = transcript.slice(0, 500)
  const createdCases = []
  const createdMeetings = []
  const now = new Date().toISOString()

  const slugs = [...new Set(proposals.map((proposal) => toEntitySlug(proposal.company)))]
  const entityBySlug = new Map<string, string>()
  for (const slug of slugs) {
    const { data: entity } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', slug).maybeSingle()
    if (!entity) return NextResponse.json({ error: `Business "${slug}" is unavailable for your account.` }, { status: 403 })
    entityBySlug.set(slug, entity.id)
  }

  const { data: existingSource } = await auth.sb.from('items').select('id,meta').eq('id', sourceCaptureId).eq('user_id', auth.user.id).maybeSingle()
  if (existingSource) {
    const existingMeta = (existingSource.meta as Record<string, unknown> | null) ?? {}
    if (!sourceIdMatchesIntake(existingMeta, idempotencyKey)) {
      return NextResponse.json({ error: 'sourceCaptureId is already linked to another intake session.' }, { status: 409 })
    }
  }

  const existingRows = new Map<string, Record<string, unknown>>()
  for (const proposal of proposals) {
    const { data: existing } = await auth.sb.from('items').select('*').eq('id', proposal.proposalId).eq('user_id', auth.user.id).maybeSingle()
    if (!existing) continue
    const existingMeta = (existing.meta as Record<string, unknown> | null) ?? {}
    if (!proposalBelongsToIntake(existingMeta, sourceCaptureId)) {
      return NextResponse.json({ error: `Proposal ID conflict for "${proposal.title}".` }, { status: 409 })
    }
    existingRows.set(proposal.proposalId, existing)
  }

  if (!existingSource) {
    const sourceEntityId = entityBySlug.get(toEntitySlug(proposals[0].company))
    if (!sourceEntityId) return NextResponse.json({ error: 'Your selected business is unavailable.' }, { status: 403 })
    const { error: sourceError } = await auth.sb.from('items').insert({
      id: sourceCaptureId,
      user_id: auth.user.id,
      entity_id: sourceEntityId,
      type: 'note',
      status: 'inbox',
      source: sourceFieldValue,
      title: 'Conversational intake capture',
      content: transcript,
      meta: {
        intake_version: 1,
        idempotency_key: idempotencyKey,
        source_label: sourceLabel,
        manual_import: true,
        transcript_language: language,
        transcript_metadata: transcriptMetadata,
        retained_audio: false,
        clarifications,
        ai_summary: summary,
      },
      updated_at: now,
    })
    if (sourceError && sourceError.code !== '23505') {
      return NextResponse.json({ error: 'Could not save the source transcript.' }, { status: 500 })
    }
  }

  for (const proposal of proposals) {
    const existing = existingRows.get(proposal.proposalId)
    if (existing && String(existing.type ?? '') !== 'meeting') {
      const existingCase = caseFromRow(existing)
      if (existingCase) createdCases.push(existingCase)
      continue
    }
    if (existing && String(existing.type ?? '') === 'meeting') {
      const existingMeta = (existing.meta as Record<string, unknown> | null) ?? {}
      const existingDueAt = existing.due_at ? String(existing.due_at) : null
      const current = readMeetingCore(existingMeta, existingDueAt)
      if (!current) return NextResponse.json({ error: `Meeting "${proposal.title}" could not be updated without changing its business.` }, { status: 409 })
      const preview = mergeIntakeMeeting({ existing: current, existingDueAt, proposal, clarifications, sourceCaptureId })
      if (!preview.ok) return NextResponse.json({ error: preview.error }, { status: 409 })
      let entityId = existing.entity_id ? String(existing.entity_id) : ''
      if (preview.core.company !== current.company) {
        entityId = entityBySlug.get(toEntitySlug(preview.core.company)) ?? ''
        if (!entityId) return NextResponse.json({ error: `Business unavailable for proposal "${proposal.title}".` }, { status: 403 })
      }
      let written: Record<string, unknown> | null = null
      const saved = await saveExistingIntakeMeeting({
        expectedUpdatedAt: String(existing.updated_at ?? ''),
        existing: current,
        existingDueAt,
        proposal,
        clarifications,
        sourceCaptureId,
        write: async (expectedUpdatedAt, next) => {
          const { data, error } = await auth.sb.from('items').update({
            entity_id: entityId,
            status: itemStatusForLifecycle(next.core.lifecycle),
            title: proposal.title,
            content: proposal.notes || String(existing.content ?? ''),
            due_at: next.dueAt,
            meta: {
              ...existingMeta,
              meeting_core: next.core,
              people: next.core.attendees,
              place: next.core.place,
              end_at: next.core.schedule.confirmed ? toSastIso(next.core.schedule.endAt) : existingMeta.end_at ?? null,
              intake: {
                ...((existingMeta.intake as Record<string, unknown> | undefined) ?? {}),
                source_capture_id: sourceCaptureId,
                clarifications: next.core.clarifications,
                ai_summary: summary || (existingMeta.intake as { ai_summary?: string } | undefined)?.ai_summary,
              },
            },
            updated_at: now,
          }).eq('id', proposal.proposalId).eq('user_id', auth.user.id).eq('updated_at', expectedUpdatedAt).select('*').maybeSingle()
          if (error || !data?.updated_at) return { ok: false }
          written = data
          return { ok: true, updatedAt: String(data.updated_at) }
        },
      })
      if (!saved.ok) return NextResponse.json({ error: saved.error }, { status: saved.status })
      if (!written) return NextResponse.json({ error: `Could not save meeting proposal "${proposal.title}".` }, { status: 500 })
      createdMeetings.push(savedMeeting(written, proposal.company, proposal.title))
      continue
    }

    const entityId = entityBySlug.get(toEntitySlug(proposal.company))
    if (!entityId) return NextResponse.json({ error: `Business unavailable for proposal "${proposal.title}".` }, { status: 403 })

    if (proposal.kind === 'meeting') {
      const confirmed = proposal.meeting.confirmedSchedule
      const core = createMeetingCore({
        company: proposal.company,
        systemId: proposal.systemId,
        purpose: proposal.notes || proposal.title,
        attendees: proposal.meeting.people,
        place: proposal.meeting.place,
        sourceCaptureId,
        clarifications: clarifications.map((item) => ({ field: item.field, question: '', answer: item.answer })),
        schedule: confirmed ? { startAt: proposal.meeting.startAt, endAt: proposal.meeting.endAt, confirmed: true } : undefined,
      })
      const { data, error } = await auth.sb
        .from('items')
        .insert({
          id: proposal.proposalId,
          user_id: auth.user.id,
          entity_id: entityId,
          type: 'meeting',
          status: itemStatusForLifecycle(core.lifecycle),
          source: sourceFieldValue,
          title: proposal.title,
          content: proposal.notes || 'Meeting captured from conversational intake.',
          due_at: confirmed ? toSastIso(proposal.meeting.startAt) : null,
          meta: {
            meeting_core: core,
            people: proposal.meeting.people,
            place: proposal.meeting.place,
            end_at: confirmed ? toSastIso(proposal.meeting.endAt) : null,
            intake: {
              source_capture_id: sourceCaptureId,
              proposal_kind: proposal.kind,
              requires_external_approval: proposal.requiresExternalApproval,
              external_execution_blocked: true,
              uncertainties: proposal.uncertainties,
              source_transcript_excerpt: transcriptExcerpt,
              clarifications,
              ai_summary: summary,
              idempotency_key: idempotencyKey,
            },
          },
          updated_at: now,
        })
        .select('*')
        .maybeSingle()
      if (error || !data) return NextResponse.json({ error: `Could not save meeting proposal "${proposal.title}".` }, { status: 500 })
      createdMeetings.push(savedMeeting(data, proposal.company, proposal.title))
      continue
    }

    const system = getSystem(proposal.systemId)
    if (!system) return NextResponse.json({ error: `Workflow unavailable for proposal "${proposal.title}".` }, { status: 400 })

    const at = new Date().toISOString()
    const history = [{ at, text: 'Captured from conversational intake. Work plan awaits explicit approval.' }]
    if (proposal.requiresExternalApproval) {
      history.push({ at, text: 'External action remains blocked until separate approval and integration.' })
    }
    proposal.uncertainties.forEach((item) => {
      history.push({ at, text: `Uncertainty: ${item}` })
    })
    const pivotCase = {
      id: proposal.proposalId,
      entityId,
      company: proposal.company,
      systemId: proposal.systemId,
      kind: proposal.kind,
      title: proposal.title,
      notes: `${proposal.notes}\n\nSource transcript linked (capture: ${sourceCaptureId}). Saving does not execute any external action.`,
      due: '',
      status: 'planned',
      source: `${sourceLabel} · manual import`,
      updatedAt: at,
      facts: {},
      checked: [],
      lessons: [],
      history,
      sourceCaptureId,
      proposalKind: proposal.kind,
      externalBlocked: true,
    }
    const { data, error } = await auth.sb
      .from('items')
      .insert({
        id: proposal.proposalId,
        user_id: auth.user.id,
        entity_id: entityId,
        type: 'process',
        status: 'planned',
        source: sourceFieldValue,
        title: proposal.title,
        content: pivotCase.notes,
        meta: {
          workspace_version: 1,
          pivot_case: pivotCase,
          intake: {
            source_capture_id: sourceCaptureId,
            proposal_kind: proposal.kind,
            proposal_relationship: { kind: proposal.kind, system_name: system.name },
            requires_external_approval: proposal.requiresExternalApproval,
            external_execution_blocked: true,
            uncertainties: proposal.uncertainties,
            source_transcript_excerpt: transcriptExcerpt,
            clarifications,
            ai_summary: summary,
            idempotency_key: idempotencyKey,
          },
        },
        updated_at: at,
      })
      .select('*')
      .maybeSingle()
    if (error || !data) return NextResponse.json({ error: `Could not save proposal "${proposal.title}".` }, { status: 500 })
    const workCase = caseFromRow(data)
    if (workCase) createdCases.push(workCase)
  }

  return NextResponse.json({
    ok: true,
    sourceCaptureId,
    saved: { workCases: createdCases, meetings: createdMeetings },
  })
}
