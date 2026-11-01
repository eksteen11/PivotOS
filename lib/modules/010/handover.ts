import type { Evidence, Experiment, Handover, ReceivingCapability, RouteSuggestion } from './contract'
import { acceptHandover, declineHandover, draftHandover } from './decisions'
import { filled, sameName } from './format'

export const handoverAssumptions = 'Figures are estimates unless evidence says otherwise.'
export const handoverQuestions = 'Who will run the work after acceptance, and what is still unknown?'
export const handoverRisks = 'The main risk is treating this idea as an order, a signature or a spend.'

export type BudgetStatus = Handover['budgetStatus']

export function budgetStatusFor(experiment: Experiment | null): BudgetStatus {
  if (!experiment || experiment.costCents === null || experiment.explicitZero) return 'none'
  return experiment.status === 'completed' || experiment.status === 'approved' || experiment.status === 'running' ? 'test-limit' : 'none'
}

export function assertHandoverRoute(route: RouteSuggestion, capabilities: readonly ReceivingCapability[]): { ok: true } | { ok: false; error: string } {
  for (const required of route.capabilities) {
    if (!capabilities.includes(required)) return { ok: false, error: 'The handover cannot drop a required capability.' }
  }
  if (route.approved !== false) return { ok: false, error: 'A suggested route is not an approval.' }
  return { ok: true }
}

export function proposeHandoverRecord(input: {
  id: string
  route: RouteSuggestion
  capabilities: readonly ReceivingCapability[]
  receivingOwner: string
  scope: string
  evidence: readonly Evidence[]
  experiment: Experiment | null
  proposedBy: string
  explorationOwner: string
  proposedAt: string
  handoverOn: string
  nextMilestone: string
}): { ok: true; handover: Handover } | { ok: false; error: string } {
  if (!input.experiment || input.experiment.status !== 'completed') return { ok: false, error: 'Record the test result before proposing a handover. A result is not scale approval.' }
  if (!input.evidence.some((item) => item.level >= 1)) return { ok: false, error: 'Add evidence beyond a conversation before handover.' }
  const route = assertHandoverRoute(input.route, input.capabilities)
  if (!route.ok) return route
  return draftHandover({
    id: input.id,
    capabilities: [...input.capabilities],
    needs008: input.route.requires008 || input.capabilities.includes('008'),
    receivingOwner: input.receivingOwner,
    scope: input.scope,
    evidenceIds: input.evidence.map((item) => item.id),
    assumptions: handoverAssumptions,
    openQuestions: handoverQuestions,
    budgetStatus: budgetStatusFor(input.experiment),
    risks: handoverRisks,
    nextMilestone: input.nextMilestone,
    proposedBy: input.proposedBy,
    explorationOwner: input.explorationOwner,
    proposedAt: input.proposedAt,
    handoverOn: input.handoverOn,
  })
}

export function acceptHandoverRecord(handover: Handover, input: { acceptedBy: string; acceptedOn: string }) {
  if (!filled(input.acceptedBy) || !sameName(input.acceptedBy, handover.receivingOwner)) {
    return { ok: false as const, error: 'Only the named receiving owner can accept this handover.' }
  }
  return acceptHandover(handover, { by: input.acceptedBy, at: input.acceptedOn })
}

export function declineHandoverRecord(handover: Handover, input: { declinedBy: string }) {
  if (!filled(input.declinedBy) || !sameName(input.declinedBy, handover.receivingOwner)) {
    return { ok: false as const, error: 'Only the named receiving owner can decline this handover.' }
  }
  return declineHandover(handover, { by: input.declinedBy })
}
