import { clampText } from '@/lib/intake/shared'
import { rejectUnknownIntakeSender } from './allowlist'
import { isWhatsappContext, type WhatsappContext } from './contexts'

export type IntakeProvenance = {
  claimedForward: boolean
  originalGroupName: string | null
  originalSenderName: string | null
  originalSenderE164: string | null
  invented: false
  notes: string
}

export type IntakeSuggestionKind = 'task' | 'livestock-listing' | 'lead' | 'deal' | 'context'

export type IntakeSuggestion = {
  id: string
  kind: IntakeSuggestionKind
  title: string
  summary: string
  context: WhatsappContext | null
  status: 'suggested' | 'approved' | 'rejected'
  executes: false
  workItemId: string | null
}

export type IntakeItem = {
  id: string
  ownerId: string
  connectionRole: 'dedicated-intake'
  providerMessageId: string
  fromE164: string
  toPhoneNumberId: string
  body: string
  mediaPresent: boolean
  provenance: IntakeProvenance
  context: WhatsappContext | null
  contextStatus: 'missing' | 'suggested' | 'approved'
  suggestedContext: WhatsappContext | null
  missingDetails: string[]
  needsAction: boolean
  needsActionCompletedAt: string | null
  readAt: string | null
  clarificationId: string | null
  linkedItemIds: string[]
  suggestions: IntakeSuggestion[]
  status: 'arrived' | 'awaiting-clarification' | 'ready-for-review' | 'completed' | 'rejected-unknown-sender'
  receivedAt: string
  createdAt: string
}

export type IntakeCaptureInput = {
  id: string
  ownerId: string
  providerMessageId: string
  fromE164: string
  toPhoneNumberId: string
  body?: string
  mediaPresent?: boolean
  receivedAt: string
  /** Never invent; only store what founder/system explicitly knows. */
  provenance?: Partial<IntakeProvenance>
}

export function emptyProvenance(partial: Partial<IntakeProvenance> = {}): IntakeProvenance {
  return {
    claimedForward: Boolean(partial.claimedForward),
    originalGroupName: partial.originalGroupName?.trim() || null,
    originalSenderName: partial.originalSenderName?.trim() || null,
    originalSenderE164: partial.originalSenderE164 ? (partial.originalSenderE164.startsWith('+') ? partial.originalSenderE164 : `+${partial.originalSenderE164.replace(/\D/g, '')}`) : null,
    invented: false,
    notes: clampText(partial.notes ?? '', 2_000),
  }
}

export function captureIntakeItem(input: IntakeCaptureInput): { ok: true; item: IntakeItem } | { ok: false; error: string; item?: IntakeItem } {
  const allow = rejectUnknownIntakeSender(input.fromE164)
  if (!allow.ok) {
    return {
      ok: false,
      error: allow.error,
      item: {
        id: input.id,
        ownerId: input.ownerId,
        connectionRole: 'dedicated-intake',
        providerMessageId: input.providerMessageId,
        fromE164: input.fromE164.startsWith('+') ? input.fromE164 : `+${input.fromE164.replace(/\D/g, '')}`,
        toPhoneNumberId: input.toPhoneNumberId,
        body: clampText(input.body ?? '', 12_000),
        mediaPresent: Boolean(input.mediaPresent),
        provenance: emptyProvenance(input.provenance),
        context: null,
        contextStatus: 'missing',
        suggestedContext: null,
        missingDetails: [],
        needsAction: false,
        needsActionCompletedAt: null,
        readAt: null,
        clarificationId: null,
        linkedItemIds: [],
        suggestions: [],
        status: 'rejected-unknown-sender',
        receivedAt: input.receivedAt,
        createdAt: input.receivedAt,
      },
    }
  }
  if (!input.providerMessageId.trim()) return { ok: false, error: 'A provider message id is required for idempotent intake.' }
  if (!/^\d+$/.test(input.toPhoneNumberId)) return { ok: false, error: 'Intake phone number id binding is required.' }
  if (!Number.isFinite(Date.parse(input.receivedAt))) return { ok: false, error: 'A real received time is required.' }
  const provenance = emptyProvenance(input.provenance)
  const missingDetails: string[] = []
  if (provenance.claimedForward) {
    if (!provenance.originalGroupName) missingDetails.push('original-group')
    if (!provenance.originalSenderName && !provenance.originalSenderE164) missingDetails.push('original-sender')
    missingDetails.push('business-context')
  } else {
    missingDetails.push('business-context')
  }
  return {
    ok: true,
    item: {
      id: input.id,
      ownerId: input.ownerId,
      connectionRole: 'dedicated-intake',
      providerMessageId: input.providerMessageId.trim(),
      fromE164: input.fromE164.startsWith('+') ? input.fromE164 : `+${input.fromE164.replace(/\D/g, '')}`,
      toPhoneNumberId: input.toPhoneNumberId,
      body: clampText(input.body ?? '', 12_000),
      mediaPresent: Boolean(input.mediaPresent),
      provenance,
      context: null,
      contextStatus: 'missing',
      suggestedContext: null,
      missingDetails: Array.from(new Set(missingDetails)),
      needsAction: true,
      needsActionCompletedAt: null,
      readAt: null,
      clarificationId: null,
      linkedItemIds: [],
      suggestions: [],
      status: missingDetails.length ? 'awaiting-clarification' : 'ready-for-review',
      receivedAt: input.receivedAt,
      createdAt: input.receivedAt,
    },
  }
}

/** Each forwarded item stays separate; idempotent on provider message id. */
export function mergeIntakeIdempotent(existing: IntakeItem[], incoming: IntakeItem) {
  if (existing.some((row) => row.providerMessageId === incoming.providerMessageId)) {
    return { items: existing, duplicate: true as const }
  }
  return { items: [...existing, incoming], duplicate: false as const }
}

export function markIntakeRead(item: IntakeItem, readAt: string): IntakeItem {
  if (!Number.isFinite(Date.parse(readAt))) return item
  return { ...item, readAt }
}

/** Needs action is independent from read state. */
export function completeIntakeNeedsAction(item: IntakeItem, at: string): IntakeItem {
  if (!Number.isFinite(Date.parse(at))) return item
  return {
    ...item,
    needsAction: false,
    needsActionCompletedAt: at,
    status: item.status === 'rejected-unknown-sender' ? item.status : 'completed',
  }
}

export function suggestIntakeContext(item: IntakeItem, context: string): { ok: true; item: IntakeItem } | { ok: false; error: string } {
  if (!isWhatsappContext(context)) return { ok: false, error: 'Choose a known WhatsApp context.' }
  return {
    ok: true,
    item: {
      ...item,
      suggestedContext: context,
      contextStatus: 'suggested',
      needsAction: true,
    },
  }
}

export function approveIntakeContext(item: IntakeItem, context: string): { ok: true; item: IntakeItem } | { ok: false; error: string } {
  if (!isWhatsappContext(context)) return { ok: false, error: 'Choose a known WhatsApp context.' }
  const missing = item.missingDetails.filter((detail) => detail !== 'business-context')
  return {
    ok: true,
    item: {
      ...item,
      context,
      suggestedContext: context,
      contextStatus: 'approved',
      missingDetails: missing,
      needsAction: true,
      status: missing.length ? 'awaiting-clarification' : 'ready-for-review',
    },
  }
}

export function addIntakeSuggestion(item: IntakeItem, suggestion: Omit<IntakeSuggestion, 'status' | 'executes' | 'workItemId'> & { workItemId?: string | null }): IntakeItem {
  return {
    ...item,
    suggestions: [...item.suggestions, {
      ...suggestion,
      status: 'suggested',
      executes: false,
      workItemId: suggestion.workItemId ?? null,
    }],
    needsAction: true,
  }
}

export function decideIntakeSuggestion(
  item: IntakeItem,
  suggestionId: string,
  decision: 'approved' | 'rejected',
  workItemId?: string | null,
): IntakeItem {
  return {
    ...item,
    suggestions: item.suggestions.map((row) => {
      if (row.id !== suggestionId) return row
      if (row.status === 'approved' && row.workItemId && decision === 'approved') return row
      return {
        ...row,
        status: decision,
        executes: false,
        workItemId: decision === 'approved' ? (workItemId ?? row.workItemId) : row.workItemId,
      }
    }),
    needsAction: true,
  }
}

export function linkIntakeItems(item: IntakeItem, otherId: string): IntakeItem {
  if (item.id === otherId || item.linkedItemIds.includes(otherId)) return item
  return { ...item, linkedItemIds: [...item.linkedItemIds, otherId] }
}

export function applyProvenanceAnswer(item: IntakeItem, answer: Partial<IntakeProvenance>): IntakeItem {
  const provenance = emptyProvenance({ ...item.provenance, ...answer, invented: false, claimedForward: item.provenance.claimedForward || Boolean(answer.claimedForward) })
  const missing = item.missingDetails.filter((detail) => {
    if (detail === 'original-group') return !provenance.originalGroupName
    if (detail === 'original-sender') return !provenance.originalSenderName && !provenance.originalSenderE164
    return true
  })
  return {
    ...item,
    provenance,
    missingDetails: missing,
    status: missing.length || item.contextStatus !== 'approved' ? (missing.length ? 'awaiting-clarification' : item.status) : 'ready-for-review',
    needsAction: true,
  }
}
