import { NextResponse } from 'next/server'
import { requireFounderSession } from '@/lib/intake/server'
import { isUuid } from '@/lib/intake/shared'
import { WHATSAPP_FOUNDER_E164 } from '@/lib/whatsapp/config'
import {
  addIntakeSuggestion,
  approveIntakeContext,
  applyProvenanceAnswer,
  captureIntakeItem,
  completeIntakeNeedsAction,
  decideIntakeSuggestion,
  linkIntakeItems,
  markIntakeRead,
  suggestIntakeContext,
} from '@/lib/whatsapp/intake'
import {
  answerClarification,
  buildClarificationState,
  openClarificationQuestion,
} from '@/lib/whatsapp/clarification'
import { advanceFounderClarificationOutbox, planFounderClarificationOutbox } from '@/lib/whatsapp/outbox'
import { promoteApprovedSuggestion, workCaseFromPromotion } from '@/lib/whatsapp/promote'
import { companies } from '@/lib/workspace/catalogue'
import {
  confirmGroupReplySent,
  draftGroupReply,
  markGroupReplyCopied,
} from '@/lib/whatsapp/groupReply'
import { whatsappAdmin } from '@/lib/whatsapp/server'
import {
  listIntakeItems,
  upsertClarification,
  upsertGroupReplyDraft,
  upsertIntakeItem,
  upsertOutboxDraft,
} from '@/lib/whatsapp/intakeStore'
import { readWhatsappDualConnections } from '@/lib/whatsapp/connections'
import { readWhatsappChannelConfig } from '@/lib/whatsapp/config'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const listed = await listIntakeItems(admin, auth.user.id)
  if (!listed.ok) {
    if (/does not exist|Could not find the table/i.test(listed.error)) {
      return NextResponse.json({
        connected: false,
        tableReady: false,
        items: [],
        notice: 'Migration 0026 is prepared but not applied. Intake dashboard stays empty until reviewed apply.',
      })
    }
    return NextResponse.json({ error: listed.error }, { status: 503 })
  }
  const dual = readWhatsappDualConnections()
  return NextResponse.json({
    connected: true,
    tableReady: true,
    items: listed.items,
    connections: dual,
    limitations: {
      groupSync: 'not-supported-under-coexistence',
      phoneUnreadParity: 'unverified',
      blocksLimitedRollout: false,
    },
  })
}

export async function POST(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const body = await request.json().catch(() => null) as null | Record<string, unknown>
  if (!body || typeof body.action !== 'string') return NextResponse.json({ error: 'action is required.' }, { status: 400 })
  const at = typeof body.at === 'string' && Number.isFinite(Date.parse(body.at)) ? body.at : new Date().toISOString()
  const dual = readWhatsappDualConnections()
  const { config } = readWhatsappChannelConfig()

  if (body.action === 'capture-forward') {
    const id = typeof body.id === 'string' && isUuid(body.id) ? body.id : crypto.randomUUID()
    const captured = captureIntakeItem({
      id,
      ownerId: auth.user.id,
      providerMessageId: String(body.providerMessageId || ''),
      fromE164: String(body.fromE164 || ''),
      toPhoneNumberId: String(body.toPhoneNumberId || dual.intake.phoneNumberId || '0'),
      body: typeof body.text === 'string' ? body.text : '',
      mediaPresent: Boolean(body.mediaPresent),
      receivedAt: at,
      provenance: {
        claimedForward: body.claimedForward !== false,
        notes: typeof body.notes === 'string' ? body.notes : '',
      },
    })
    if (!captured.ok) {
      if (captured.item?.status === 'rejected-unknown-sender') {
        return NextResponse.json({ ok: false, rejected: true, error: captured.error, item: captured.item }, { status: 403 })
      }
      return NextResponse.json({ error: captured.error }, { status: 400 })
    }
    const persisted = await upsertIntakeItem(admin, captured.item)
    if (!persisted.ok) {
      if (/does not exist|Could not find the table/i.test(persisted.error)) {
        return NextResponse.json({ error: 'Migration 0026 not applied.', tableReady: false }, { status: 503 })
      }
      return NextResponse.json({ error: persisted.error }, { status: 503 })
    }
    let clarification = buildClarificationState({
      id: crypto.randomUUID(),
      ownerId: auth.user.id,
      item: captured.item,
      toE164: WHATSAPP_FOUNDER_E164,
      at,
    })
    const clarPersist = await upsertClarification(admin, clarification)
    if (!clarPersist.ok) return NextResponse.json({ error: clarPersist.error }, { status: 503 })
    clarification = clarPersist.state
    const itemWithClarification = { ...captured.item, clarificationId: clarification.id }
    await upsertIntakeItem(admin, itemWithClarification)

    const question = openClarificationQuestion(clarification)
    const outboxPlan = question
      ? planFounderClarificationOutbox({
        id: crypto.randomUUID(),
        ownerId: auth.user.id,
        toE164: WHATSAPP_FOUNDER_E164,
        body: question.prompt,
        clarificationId: clarification.id,
        intakeItemId: itemWithClarification.id,
        at,
        accessTokenPresent: Boolean(config?.accessToken),
        phoneNumberIdPresent: Boolean(dual.intake.phoneNumberId || config?.phoneNumberId),
        messagingWindowOpen: 'unknown',
        costAcknowledged: false,
      })
      : null
    let outbox = outboxPlan && outboxPlan.ok ? outboxPlan.draft : null
    if (outbox) {
      outbox = advanceFounderClarificationOutbox(outbox, at)
      await upsertOutboxDraft(admin, outbox)
    }
    return NextResponse.json({
      ok: true,
      duplicate: persisted.duplicate,
      item: itemWithClarification,
      clarification,
      outbox,
      sending: false,
    })
  }

  const itemId = typeof body.itemId === 'string' ? body.itemId : ''
  if (!itemId || !isUuid(itemId)) return NextResponse.json({ error: 'itemId uuid is required.' }, { status: 400 })
  const listed = await listIntakeItems(admin, auth.user.id)
  if (!listed.ok) return NextResponse.json({ error: listed.error }, { status: 503 })
  let item = listed.items.find((row) => row.id === itemId)
  if (!item) return NextResponse.json({ error: 'Intake item not found.' }, { status: 404 })

  if (body.action === 'mark-read') {
    item = markIntakeRead(item, at)
    await upsertIntakeItem(admin, item)
    return NextResponse.json({ item, notice: 'Read state updated. Needs action unchanged.' })
  }
  if (body.action === 'complete-needs-action') {
    item = completeIntakeNeedsAction(item, at)
    await upsertIntakeItem(admin, item)
    return NextResponse.json({ item })
  }
  if (body.action === 'suggest-context') {
    const result = suggestIntakeContext(item, String(body.context || ''))
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    await upsertIntakeItem(admin, result.item)
    return NextResponse.json({ item: result.item })
  }
  if (body.action === 'approve-context') {
    const result = approveIntakeContext(item, String(body.context || ''))
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    await upsertIntakeItem(admin, result.item)
    return NextResponse.json({ item: result.item })
  }
  if (body.action === 'answer-clarification') {
    if (!item.clarificationId) return NextResponse.json({ error: 'No clarification on this item.' }, { status: 400 })
    const { data: clarRow, error } = await admin.from('whatsapp_clarifications').select('*').eq('owner_id', auth.user.id).eq('id', item.clarificationId).maybeSingle()
    if (error || !clarRow) return NextResponse.json({ error: error?.message || 'Clarification not found.' }, { status: 404 })
    const state = {
      id: String(clarRow.id),
      ownerId: String(clarRow.owner_id),
      intakeItemId: String(clarRow.intake_item_id),
      toE164: String(clarRow.to_e164),
      questions: clarRow.questions as import('@/lib/whatsapp/clarification').ClarificationState['questions'],
      status: clarRow.status as 'open' | 'resolved',
      createdAt: String(clarRow.created_at),
      updatedAt: String(clarRow.updated_at),
      outboundProviderMessageIds: Array.isArray(clarRow.outbound_provider_message_ids) ? clarRow.outbound_provider_message_ids.map(String) : [],
    }
    const answered = answerClarification(state, {
      questionId: String(body.questionId || ''),
      answer: String(body.answer || ''),
      via: body.via === 'whatsapp' ? 'whatsapp' : 'pivot',
      at,
    })
    if (!answered.ok) return NextResponse.json({ error: answered.error }, { status: 400 })
    await upsertClarification(admin, answered.state)
    const question = answered.state.questions.find((row) => row.id === String(body.questionId || ''))
    if (question?.key === 'original-group') item = applyProvenanceAnswer(item, { originalGroupName: question.answer || undefined })
    if (question?.key === 'original-sender') item = applyProvenanceAnswer(item, { originalSenderName: question.answer || undefined })
    if (question?.key === 'business-context' && question.answer) {
      const normalized = question.answer.trim().toLowerCase()
      const exact = (['digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen'] as const).find((value) => normalized === value || normalized.replace(/\s+/g, '-') === value)
      if (exact) {
        const suggested = suggestIntakeContext(item, exact)
        if (suggested.ok) item = suggested.item
      } else {
        item = applyProvenanceAnswer(item, { notes: `Founder context note: ${question.answer}` })
      }
    }
    await upsertIntakeItem(admin, item)
    return NextResponse.json({ item, clarification: answered.state, notice: 'Answer stored once for Pivot and WhatsApp clarification state.' })
  }
  if (body.action === 'add-suggestion') {
    item = addIntakeSuggestion(item, {
      id: crypto.randomUUID(),
      kind: (body.kind as 'task' | 'livestock-listing' | 'lead' | 'deal' | 'context') || 'task',
      title: String(body.title || 'Suggested next step'),
      summary: String(body.summary || ''),
      context: item.context,
    })
    await upsertIntakeItem(admin, item)
    return NextResponse.json({ item })
  }
  if (body.action === 'decide-suggestion') {
    const suggestionId = String(body.suggestionId || '')
    const decision = body.decision === 'approved' ? 'approved' : 'rejected'
    const suggestion = item.suggestions.find((row) => row.id === suggestionId)
    if (!suggestion) return NextResponse.json({ error: 'Suggestion not found.' }, { status: 404 })
    if (decision === 'rejected') {
      item = decideIntakeSuggestion(item, suggestionId, 'rejected')
      await upsertIntakeItem(admin, item)
      return NextResponse.json({ item, work: null })
    }
    if (suggestion.status === 'approved' && suggestion.workItemId) {
      const { data: existing } = await auth.sb.from('items').select('id,title,status').eq('id', suggestion.workItemId).eq('user_id', auth.user.id).is('deleted_at', null).maybeSingle()
      return NextResponse.json({
        item,
        work: existing ? { id: String(existing.id), title: String(existing.title || ''), status: String(existing.status || ''), duplicate: true } : null,
        notice: 'Approved suggestion already linked to shared work. Duplicate create skipped.',
      })
    }
    const approvedPreview = { ...suggestion, status: 'approved' as const, executes: false as const }
    const promoted = promoteApprovedSuggestion(item, approvedPreview, at)
    if (!promoted.ok) return NextResponse.json({ error: promoted.error }, { status: 400 })
    const slug = companies.find((entry) => entry.id === promoted.draft.company)?.slug ?? ''
    const { data: entity } = await auth.sb.from('entities').select('id').eq('user_id', auth.user.id).eq('slug', slug).maybeSingle()
    if (!entity?.id) {
      return NextResponse.json({ error: `Business entity for ${promoted.draft.company} is not available on this account.` }, { status: 403 })
    }
    const work = workCaseFromPromotion(promoted.draft, String(entity.id), at)
    const { error: insertError } = await auth.sb.from('items').insert({
      id: work.id,
      user_id: auth.user.id,
      entity_id: work.entityId,
      type: 'process',
      status: 'planned',
      source: 'whatsapp-intake',
      title: work.title,
      content: work.notes,
      due_at: null,
      meta: {
        workspace_version: 1,
        whatsapp_intake_item_id: item.id,
        whatsapp_suggestion_id: suggestion.id,
        provider_message_id: item.providerMessageId,
        pivot_case: work,
      },
      updated_at: at,
    })
    if (insertError && insertError.code !== '23505') {
      return NextResponse.json({ error: insertError.message || 'Shared work draft was not saved.' }, { status: 503 })
    }
    item = decideIntakeSuggestion(item, suggestionId, 'approved', work.id)
    const persisted = await upsertIntakeItem(admin, item)
    if (!persisted.ok) return NextResponse.json({ error: persisted.error }, { status: 503 })
    return NextResponse.json({
      item,
      work: { id: work.id, title: work.title, status: work.status, kind: work.kind, duplicate: insertError?.code === '23505' },
      notice: insertError?.code === '23505'
        ? 'Shared work draft already existed for this suggestion. Intake link refreshed.'
        : 'Approved suggestion created a shared work draft with source evidence. Nothing was sent or published externally.',
    })
  }
  if (body.action === 'link-item') {
    item = linkIntakeItems(item, String(body.otherId || ''))
    await upsertIntakeItem(admin, item)
    return NextResponse.json({ item })
  }
  if (body.action === 'draft-group-reply') {
    const drafted = draftGroupReply({
      id: crypto.randomUUID(),
      ownerId: auth.user.id,
      intakeItemId: item.id,
      targetGroupLabel: String(body.targetGroupLabel || item.provenance.originalGroupName || ''),
      body: String(body.text || ''),
    })
    if (!drafted.ok) return NextResponse.json({ error: drafted.error }, { status: 400 })
    await upsertGroupReplyDraft(admin, drafted.draft)
    return NextResponse.json({ draft: drafted.draft })
  }
  if (body.action === 'mark-group-reply-copied' || body.action === 'confirm-group-reply-sent') {
    const draftId = String(body.draftId || '')
    if (!isUuid(draftId)) return NextResponse.json({ error: 'draftId uuid required.' }, { status: 400 })
    const { data, error } = await admin.from('whatsapp_group_reply_drafts').select('*').eq('owner_id', auth.user.id).eq('id', draftId).maybeSingle()
    if (error || !data) return NextResponse.json({ error: error?.message || 'Draft not found.' }, { status: 404 })
    let draft = {
      id: String(data.id),
      ownerId: String(data.owner_id),
      intakeItemId: String(data.intake_item_id),
      targetGroupLabel: String(data.target_group_label),
      body: String(data.body),
      status: data.status as 'draft' | 'copied' | 'confirmed-sent',
      copiedAt: data.copied_at ? String(data.copied_at) : null,
      confirmedSentAt: data.confirmed_sent_at ? String(data.confirmed_sent_at) : null,
      executes: false as const,
      note: String(data.note || ''),
    }
    if (body.action === 'mark-group-reply-copied') draft = markGroupReplyCopied(draft, at)
    else {
      const confirmed = confirmGroupReplySent(draft, at)
      if (!confirmed.ok) return NextResponse.json({ error: confirmed.error }, { status: 400 })
      draft = confirmed.draft
    }
    await upsertGroupReplyDraft(admin, draft)
    return NextResponse.json({ draft })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
