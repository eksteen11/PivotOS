import { emptyActionPlan, type ActionPlan } from '../../../lib/workspace/actionPlan'
import type { FounderSignal } from '../../../lib/modules/002/contract'

export const today = '2026-10-25'

export function founderPlan(overrides: Partial<ActionPlan> = {}): ActionPlan {
  return {
    ...emptyActionPlan(['Confirm the next step']),
    forWhom: 'Internal',
    outcome: 'A recorded result',
    owner: 'Drikus',
    ownerType: 'person',
    method: 'Record the step in Pivot',
    tools: 'none',
    inputs: 'none',
    timing: 'Today',
    ...overrides,
  }
}

const at = (hour: string) => `2026-10-25T${hour}:00:00.000Z`

export const deskSignals: FounderSignal[] = [
  { id: 'leslie-payment', title: 'Leslie payment', domain: 'family', privacy: 'founder-private', company: 'personal', updatedAt: at('06'), due: today, urgency: 'now', moneyRisk: true, relationshipRisk: false, proposal: { kind: 'payment', consequential: true, approved: false, evidence: '' } },
  { id: 'buyer-reply', title: 'Buyer reply for Digikraal', domain: 'communications', privacy: 'company-visible', company: 'digikraal', updatedAt: at('07'), due: '2026-10-26', urgency: 'today', moneyRisk: false, relationshipRisk: true, proposal: { kind: 'reply', consequential: true, approved: false, evidence: 'Saved thread' } },
  { id: 'plan-owner', title: 'Visit brief', domain: 'planning', privacy: 'company-visible', company: 'digikraal', updatedAt: at('08'), due: today, urgency: 'today', moneyRisk: false, relationshipRisk: false, work: { status: 'planned', checked: [], plan: founderPlan({ owner: '' }) } },
  { id: 'church-roster', title: 'Church roster', domain: 'church', privacy: 'founder-private', company: 'personal', updatedAt: '2026-10-24T08:00:00.000Z', urgency: 'later', moneyRisk: false, relationshipRisk: false },
  { id: 'personal-debt', title: 'Personal debt note', domain: 'personal-money', privacy: 'founder-private', company: 'personal', updatedAt: '2026-10-24T09:00:00.000Z', urgency: 'later', moneyRisk: false, relationshipRisk: false },
  { id: 'goal-overdue', title: 'Close the week plan', domain: 'goals', privacy: 'company-visible', company: 'digikraal', updatedAt: at('09'), due: '2026-10-24', urgency: 'today', moneyRisk: false, relationshipRisk: false, work: { status: 'in_progress', checked: [], plan: founderPlan() } },
  { id: 'goal-today', title: 'Prepare the founder brief', domain: 'goals', privacy: 'company-visible', company: 'digikraal', updatedAt: at('10'), due: today, urgency: 'today', moneyRisk: false, relationshipRisk: false, work: { status: 'in_progress', checked: [], plan: founderPlan() } },
  { id: 'goal-later', title: 'Review the month goals', domain: 'goals', privacy: 'company-visible', company: 'digikraal', updatedAt: at('11'), due: '2026-10-27', urgency: 'later', moneyRisk: false, relationshipRisk: false, work: { status: 'in_progress', checked: [], plan: founderPlan() } },
  { id: 'goal-open', title: 'Park the idea review', domain: 'ideas', privacy: 'company-visible', company: 'digikraal', updatedAt: '2026-10-20T08:00:00.000Z', urgency: 'later', moneyRisk: false, relationshipRisk: false, work: { status: 'in_progress', checked: [], plan: founderPlan() } },
  { id: 'northpoint-mandate', title: 'Northpoint mandate review', domain: 'planning', privacy: 'company-visible', company: 'northpoint', updatedAt: at('12'), due: '2026-10-28', urgency: 'later', moneyRisk: false, relationshipRisk: false, work: { status: 'in_progress', checked: [], plan: founderPlan() } },
  { id: 'newsletter', title: 'Newsletter copy', domain: 'communications', privacy: 'company-visible', company: 'digikraal', updatedAt: at('04'), urgency: 'later', moneyRisk: false, relationshipRisk: false, proposal: { kind: 'archive', consequential: false, approved: false, evidence: '' } },
  { id: 'visit-done', title: 'Completed visit note', domain: 'planning', privacy: 'founder-private', company: 'personal', updatedAt: at('03'), urgency: 'later', moneyRisk: false, relationshipRisk: false, work: { status: 'done', checked: [0], plan: founderPlan() } },
]
