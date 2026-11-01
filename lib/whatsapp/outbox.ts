import { clampText } from '@/lib/intake/shared'
import { isVerifiedFounderSender } from './allowlist'

export type OutboxEligibility = {
  ok: boolean
  reasons: string[]
  windowOpen: boolean | 'unknown'
  templateRequired: boolean | 'unknown'
  costConfigured: boolean
  configPresent: boolean
  recipientAllowed: boolean
  kindAllowed: boolean
}

export type OutboxDraft = {
  id: string
  ownerId: string
  kind: 'founder-clarification'
  toE164: string
  body: string
  clarificationId: string
  intakeItemId: string
  status: 'queued' | 'unavailable' | 'blocked'
  executes: false
  eligibility: OutboxEligibility
  createdAt: string
  providerMessageId: string | null
  delivery: 'not-attempted'
}

/**
 * Automatic clarification sends are allowed ONLY to verified founder.
 * Customer/group sends remain approval-gated elsewhere and are rejected here.
 */
export function planFounderClarificationOutbox(input: {
  id: string
  ownerId: string
  toE164: string
  body: string
  clarificationId: string
  intakeItemId: string
  at: string
  accessTokenPresent?: boolean
  phoneNumberIdPresent?: boolean
  messagingWindowOpen?: boolean | 'unknown'
  templateAvailable?: boolean | 'unknown'
  costAcknowledged?: boolean
}): { ok: true; draft: OutboxDraft } | { ok: false; error: string } {
  const body = clampText(input.body, 4_000)
  if (!body) return { ok: false, error: 'Clarification body is required.' }
  const recipientAllowed = isVerifiedFounderSender(input.toE164)
  const configPresent = Boolean(input.accessTokenPresent && input.phoneNumberIdPresent)
  const windowOpen = input.messagingWindowOpen ?? 'unknown'
  const templateRequired = windowOpen === false ? true : windowOpen === 'unknown' ? 'unknown' : false
  const reasons: string[] = []
  if (!recipientAllowed) reasons.push('Recipient is not on the verified founder allowlist.')
  if (!configPresent) reasons.push('WhatsApp provider credentials are unavailable. Clarification was not sent.')
  if (windowOpen === false && input.templateAvailable !== true) reasons.push('Customer service window closed and no template is configured.')
  if (input.costAcknowledged !== true) reasons.push('Messaging cost configuration is not acknowledged for automatic founder clarifications.')
  const eligibility: OutboxEligibility = {
    ok: reasons.length === 0 && recipientAllowed,
    reasons,
    windowOpen,
    templateRequired,
    costConfigured: input.costAcknowledged === true,
    configPresent,
    recipientAllowed,
    kindAllowed: true,
  }
  const status: OutboxDraft['status'] = !recipientAllowed
    ? 'blocked'
    : !configPresent || input.costAcknowledged !== true || (windowOpen === false && input.templateAvailable !== true)
      ? 'unavailable'
      : 'queued'
  return {
    ok: true,
    draft: {
      id: input.id,
      ownerId: input.ownerId,
      kind: 'founder-clarification',
      toE164: input.toE164.startsWith('+') ? input.toE164 : `+${input.toE164.replace(/\D/g, '')}`,
      body,
      clarificationId: input.clarificationId,
      intakeItemId: input.intakeItemId,
      status,
      executes: false,
      eligibility,
      createdAt: input.at,
      providerMessageId: null,
      delivery: 'not-attempted',
    },
  }
}

/** Persist/retry helper — never marks delivery success while provider is unavailable. */
export function advanceFounderClarificationOutbox(draft: OutboxDraft, at: string): OutboxDraft {
  void at
  if (!draft.eligibility.recipientAllowed) {
    return { ...draft, status: 'blocked', executes: false, delivery: 'not-attempted', providerMessageId: null }
  }
  if (!draft.eligibility.configPresent || !draft.eligibility.costConfigured || draft.eligibility.ok === false) {
    return {
      ...draft,
      status: 'unavailable',
      executes: false,
      delivery: 'not-attempted',
      providerMessageId: null,
    }
  }
  return { ...draft, status: 'queued', executes: false, delivery: 'not-attempted' }
}

/** @deprecated use advanceFounderClarificationOutbox — kept name-safe for call sites */
export function simulateFounderClarificationSend(draft: OutboxDraft, at: string): OutboxDraft {
  return advanceFounderClarificationOutbox(draft, at)
}

export function rejectCustomerOrGroupOutbox(): { ok: false; executes: false; error: string } {
  return {
    ok: false,
    executes: false,
    error: 'Customer and group WhatsApp sends remain approval-gated. Only verified-founder clarification automation is authorized.',
  }
}
