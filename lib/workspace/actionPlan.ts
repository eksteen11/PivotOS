export type ActionPlan = {
  version: 1
  actions: string[]
  forWhom: string
  outcome: string
  owner: string
  ownerType: 'person' | 'agent'
  method: string
  tools: string
  inputs: string
  timing: string
  approvedAt?: string
}

export const planFields = [
  { key: 'forWhom', label: 'Who is this for?', question: 'Who is this action for? Name the person, customer or project, or say “internal”.' },
  { key: 'outcome', label: 'Desired outcome', question: 'What result will make this work complete?' },
  { key: 'owner', label: 'Responsible person or agent', question: 'Who is responsible for getting this done?' },
  { key: 'method', label: 'How will it be done?', question: 'How should the owner carry out these actions?' },
  { key: 'tools', label: 'Tools or channels', question: 'Which tools or channels are needed? Say “none” if no tool is needed.' },
  { key: 'inputs', label: 'Information or documents needed', question: 'What information or documents are needed? Say “none” if everything is available.' },
  { key: 'timing', label: 'Timing and dependencies', question: 'When should this happen, and what must happen first?' },
] as const

export type PlanField = typeof planFields[number]['key']

export function emptyActionPlan(actions: string[] = []): ActionPlan {
  return { version: 1, actions, forWhom: '', outcome: '', owner: '', ownerType: 'person', method: '', tools: '', inputs: '', timing: '' }
}

/** Old records have no plan. Never manufacture an owner or change their checklist. */
export function readActionPlan(value: unknown): ActionPlan | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const row = value as Record<string, unknown>
  if (row.version !== 1 || !Array.isArray(row.actions) || !row.actions.length || row.actions.length > 8) return undefined
  if (!row.actions.every((action) => typeof action === 'string' && action.trim() && action.length <= 180)) return undefined
  const plan = emptyActionPlan(row.actions.map((action) => String(action).trim()))
  for (const { key } of planFields) {
    if (row[key] !== undefined && (typeof row[key] !== 'string' || String(row[key]).length > 2000)) return undefined
    plan[key] = typeof row[key] === 'string' ? row[key].trim() : ''
  }
  if (row.ownerType !== undefined && row.ownerType !== 'person' && row.ownerType !== 'agent') return undefined
  plan.ownerType = row.ownerType === 'agent' ? 'agent' : 'person'
  if (typeof row.approvedAt === 'string' && Number.isFinite(Date.parse(row.approvedAt))) plan.approvedAt = row.approvedAt
  return plan
}

/** Approval can only be written by the server's approve transition. */
export function validateActionPlan(value: unknown): ActionPlan {
  const plan = readActionPlan(value)
  if (!plan) throw new Error('Add between 1 and 8 actions, each up to 180 characters. Plan details must be text up to 2,000 characters.')
  delete plan.approvedAt
  return plan
}

export function missingPlanFields(plan: ActionPlan) {
  return planFields.filter(({ key }) => !plan[key].trim())
}

export function actionPlanNextMove(item: { plan?: ActionPlan; status: string; checked: number[] }) {
  const plan = item.plan
  if (!plan) return null
  const missing = missingPlanFields(plan)
  if (item.status === 'done') return { label: 'Done', detail: 'The owner’s completion has been recorded.', action: 'tasks' as const, button: 'Review completed actions' }
  if (item.status === 'waiting') return { label: 'Waiting', detail: `Follow up with ${plan.owner || 'the owner'} and record what is blocking progress.`, action: 'tasks' as const, button: 'Review progress' }
  if (item.status === 'in_progress') return { label: 'In progress', detail: `Owner: ${plan.owner}. Next: ${plan.actions.find((_, index) => !item.checked.includes(index)) ?? 'Record the outcome and complete the work.'}`, action: 'tasks' as const, button: 'Record progress' }
  if (missing.length) return { label: 'Needs your answer', detail: missing[0].question, action: 'plan' as const, button: 'Answer this question' }
  if (!plan.approvedAt) return { label: 'Ready for approval', detail: 'Review the actions and owner. Approval saves your decision; it does not start work or send anything.', action: 'approve' as const, button: 'Approve this plan' }
  if (plan.ownerType === 'agent') return { label: 'Waiting for an available owner', detail: `${plan.owner} is a proposed agent assignment. Agent execution is not connected. Assign a person to track this work manually.`, action: 'plan' as const, button: 'Change the owner' }
  return { label: 'Ready to start', detail: `${plan.owner} owns this plan. Record the start when they begin. Messages, bookings and linked apps still need their own approval.`, action: 'start' as const, button: 'Record work as started' }
}
