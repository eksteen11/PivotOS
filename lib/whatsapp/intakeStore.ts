import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClarificationState } from './clarification'
import type { IntakeItem } from './intake'
import type { OutboxDraft } from './outbox'
import type { GroupReplyDraft } from './groupReply'

export function intakeItemToRow(item: IntakeItem) {
  return {
    id: item.id,
    owner_id: item.ownerId,
    connection_role: item.connectionRole,
    provider_message_id: item.providerMessageId,
    from_e164: item.fromE164,
    to_phone_number_id: item.toPhoneNumberId,
    body: item.body,
    media_present: item.mediaPresent,
    provenance: item.provenance,
    context: item.context,
    context_status: item.contextStatus,
    suggested_context: item.suggestedContext,
    missing_details: item.missingDetails,
    needs_action: item.needsAction,
    needs_action_completed_at: item.needsActionCompletedAt,
    read_at: item.readAt,
    clarification_id: item.clarificationId,
    linked_item_ids: item.linkedItemIds,
    suggestions: item.suggestions,
    status: item.status,
    received_at: item.receivedAt,
    created_at: item.createdAt,
  }
}

export function rowToIntakeItem(row: Record<string, unknown>): IntakeItem {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    connectionRole: 'dedicated-intake',
    providerMessageId: String(row.provider_message_id),
    fromE164: String(row.from_e164),
    toPhoneNumberId: String(row.to_phone_number_id),
    body: String(row.body ?? ''),
    mediaPresent: Boolean(row.media_present),
    provenance: (row.provenance as IntakeItem['provenance']) || {
      claimedForward: false,
      originalGroupName: null,
      originalSenderName: null,
      originalSenderE164: null,
      invented: false,
      notes: '',
    },
    context: (row.context as IntakeItem['context']) ?? null,
    contextStatus: (row.context_status as IntakeItem['contextStatus']) || 'missing',
    suggestedContext: (row.suggested_context as IntakeItem['suggestedContext']) ?? null,
    missingDetails: Array.isArray(row.missing_details) ? row.missing_details.map(String) : [],
    needsAction: Boolean(row.needs_action),
    needsActionCompletedAt: row.needs_action_completed_at ? String(row.needs_action_completed_at) : null,
    readAt: row.read_at ? String(row.read_at) : null,
    clarificationId: row.clarification_id ? String(row.clarification_id) : null,
    linkedItemIds: Array.isArray(row.linked_item_ids) ? row.linked_item_ids.map(String) : [],
    suggestions: Array.isArray(row.suggestions)
      ? (row.suggestions as IntakeItem['suggestions']).map((rowSuggestion) => ({
        ...rowSuggestion,
        executes: false as const,
        workItemId: rowSuggestion.workItemId ?? null,
        status: rowSuggestion.status === 'approved' || rowSuggestion.status === 'rejected' ? rowSuggestion.status : 'suggested',
      }))
      : [],
    status: row.status as IntakeItem['status'],
    receivedAt: String(row.received_at),
    createdAt: String(row.created_at),
  }
}

export async function upsertIntakeItem(admin: SupabaseClient, item: IntakeItem) {
  const { error } = await admin.from('whatsapp_intake_items').upsert(intakeItemToRow(item), {
    onConflict: 'owner_id,provider_message_id',
    ignoreDuplicates: false,
  })
  if (error) {
    if (/duplicate|unique/i.test(error.message)) return { ok: true as const, duplicate: true as const, item }
    return { ok: false as const, error: error.message }
  }
  return { ok: true as const, duplicate: false as const, item }
}

export async function listIntakeItems(admin: SupabaseClient, ownerId: string) {
  const { data, error } = await admin
    .from('whatsapp_intake_items')
    .select('*')
    .eq('owner_id', ownerId)
    .order('received_at', { ascending: false })
  if (error) return { ok: false as const, error: error.message, items: [] as IntakeItem[] }
  return { ok: true as const, items: (data ?? []).map((row) => rowToIntakeItem(row as Record<string, unknown>)) }
}

export async function upsertClarification(admin: SupabaseClient, state: ClarificationState) {
  const { error } = await admin.from('whatsapp_clarifications').upsert({
    id: state.id,
    owner_id: state.ownerId,
    intake_item_id: state.intakeItemId,
    to_e164: state.toE164,
    questions: state.questions,
    status: state.status,
    outbound_provider_message_ids: state.outboundProviderMessageIds,
    created_at: state.createdAt,
    updated_at: state.updatedAt,
  }, { onConflict: 'id' })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, state }
}

export async function upsertOutboxDraft(admin: SupabaseClient, draft: OutboxDraft) {
  const { error } = await admin.from('whatsapp_outbox').upsert({
    id: draft.id,
    owner_id: draft.ownerId,
    kind: draft.kind,
    to_e164: draft.toE164,
    body: draft.body,
    clarification_id: draft.clarificationId,
    intake_item_id: draft.intakeItemId,
    status: draft.status,
    executes: false,
    eligibility: draft.eligibility,
    provider_message_id: draft.providerMessageId,
    created_at: draft.createdAt,
  }, { onConflict: 'id' })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, draft }
}

export async function upsertGroupReplyDraft(admin: SupabaseClient, draft: GroupReplyDraft) {
  const { error } = await admin.from('whatsapp_group_reply_drafts').upsert({
    id: draft.id,
    owner_id: draft.ownerId,
    intake_item_id: draft.intakeItemId,
    target_group_label: draft.targetGroupLabel,
    body: draft.body,
    status: draft.status,
    copied_at: draft.copiedAt,
    confirmed_sent_at: draft.confirmedSentAt,
    executes: false,
    note: draft.note,
  }, { onConflict: 'id' })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, draft }
}
