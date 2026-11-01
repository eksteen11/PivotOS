import type { Handover, Parking, ReceivingCapability, Rejection } from './contract'
import { filled, sameName, validDate, validTimestamp } from './format'

export function budgetStatement(status: Handover['budgetStatus']): string {
  return status === 'test-limit' ? 'A test limit is recorded. No payment is released.' : 'No budget is approved.'
}

export type HandoverDraft = {
  id: string
  capabilities: ReceivingCapability[]
  needs008: boolean
  receivingOwner: string
  scope: string
  evidenceIds: string[]
  assumptions: string
  openQuestions: string
  budgetStatus: Handover['budgetStatus']
  risks: string
  nextMilestone: string
  proposedBy: string
  explorationOwner: string
  proposedAt: string
  handoverOn: string
}

export function draftHandover(input: HandoverDraft): { ok: true; handover: Handover } | { ok: false; error: string } {
  if (input.capabilities.length === 0) return { ok: false, error: 'This idea has no capability route yet.' }
  if (input.needs008 && !input.capabilities.includes('008')) return { ok: false, error: 'A capital-intensive idea cannot bypass Capability 008.' }
  if (!filled(input.proposedBy) || !filled(input.receivingOwner) || !filled(input.scope) || !filled(input.assumptions) || !filled(input.openQuestions) || !filled(input.risks) || !filled(input.nextMilestone)) {
    return { ok: false, error: 'Name the receiving owner, scope, assumptions, open questions, risks and the next milestone.' }
  }
  if (!validDate(input.handoverOn) || !validTimestamp(input.proposedAt)) return { ok: false, error: 'Use a real handover date.' }
  if (sameName(input.proposedBy, input.explorationOwner)) return { ok: false, error: 'The exploration owner cannot approve their own handover.' }
  if (sameName(input.receivingOwner, input.proposedBy)) return { ok: false, error: 'The receiving owner has to be a different person from the one proposing the handover.' }
  return {
    ok: true,
    handover: {
      id: input.id,
      capabilities: [...input.capabilities],
      receivingOwner: input.receivingOwner.trim(),
      scope: input.scope.trim(),
      evidenceIds: [...input.evidenceIds],
      assumptions: input.assumptions.trim(),
      openQuestions: input.openQuestions.trim(),
      budgetStatus: input.budgetStatus,
      risks: input.risks.trim(),
      nextMilestone: input.nextMilestone.trim(),
      proposedBy: input.proposedBy.trim(),
      proposedAt: input.proposedAt,
      handoverOn: input.handoverOn,
      status: 'proposed',
      acceptedBy: null,
      acceptedOn: null,
      declinedBy: null,
    },
  }
}

export function acceptHandover(handover: Handover, input: { by: string; at: string }): { ok: true; handover: Handover } | { ok: false; error: string } {
  if (handover.status === 'accepted') return { ok: false, error: 'Already accepted.' }
  if (handover.status !== 'proposed') return { ok: false, error: 'There is no handover waiting for acceptance.' }
  if (!sameName(input.by, handover.receivingOwner)) return { ok: false, error: 'The receiving owner has to accept this handover.' }
  if (sameName(input.by, handover.proposedBy)) return { ok: false, error: 'The person who proposed the handover cannot accept it.' }
  if (!filled(handover.nextMilestone)) return { ok: false, error: 'Name the next milestone before acceptance.' }
  if (!validTimestamp(input.at)) return { ok: false, error: 'Use a real acceptance time.' }
  return { ok: true, handover: { ...handover, status: 'accepted', acceptedBy: input.by.trim(), acceptedOn: input.at, capabilities: [...handover.capabilities], evidenceIds: [...handover.evidenceIds] } }
}

export function declineHandover(handover: Handover, input: { by: string }): { ok: true; handover: Handover } | { ok: false; error: string } {
  if (handover.status !== 'proposed') return { ok: false, error: 'There is no handover waiting for acceptance.' }
  if (!sameName(input.by, handover.receivingOwner)) return { ok: false, error: 'The receiving owner has to decline this handover.' }
  return { ok: true, handover: { ...handover, status: 'declined', declinedBy: input.by.trim(), capabilities: [...handover.capabilities], evidenceIds: [...handover.evidenceIds] } }
}

export function draftParking(input: Parking): { ok: true; parking: Parking } | { ok: false; error: string } {
  if (!filled(input.reason) || !filled(input.missingCondition) || !filled(input.trigger) || !filled(input.owner) || !validDate(input.reviewOn)) {
    return { ok: false, error: 'Parked ideas need a review date, a reason and an owner.' }
  }
  return { ok: true, parking: { ...input, reason: input.reason.trim(), missingCondition: input.missingCondition.trim(), trigger: input.trigger.trim(), owner: input.owner.trim() } }
}

export function draftRejection(input: Rejection & { explorationOwner: string }): { ok: true; rejection: Rejection } | { ok: false; error: string } {
  if (!filled(input.by) || !filled(input.reasons) || !filled(input.lesson) || !filled(input.reopenWhen)) return { ok: false, error: 'Name the decision-maker, the reasons and the lesson.' }
  if (sameName(input.by, input.explorationOwner)) return { ok: false, error: 'The exploration owner cannot reject their own idea.' }
  return { ok: true, rejection: { by: input.by.trim(), at: input.at, reasons: input.reasons.trim(), lesson: input.lesson.trim(), reopenWhen: input.reopenWhen.trim(), evidenceIds: [...input.evidenceIds] } }
}
