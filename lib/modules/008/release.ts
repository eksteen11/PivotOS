import { evidenceCaution, provesLegalCondition, provesPerformance, type EvidenceGrade } from './evidence'
import { formalApprovals, unanimous, verifierBlock, type Vote } from './governance'
import { payloadKey } from './payload'
import { policyBlock, stageAllowsCapital, ubuntuProductBlock, type PolicyRecord, type UbuntuProduct, type UbuntuType, type VentureStage } from './venture'

export const stopKinds = ['reporting', 'stock_count', 'reconciliation', 'control'] as const
export type StopKind = (typeof stopKinds)[number]
export const legalKinds = ['agreements_signed', 'spv_registered', 'bank_account', 'land_rights', 'insurance', 'approved_budget'] as const
export type ConditionKind = StopKind | (typeof legalKinds)[number]
export type ConditionState = 'open' | 'satisfied' | 'overdue'

export type Condition = {
  id: string
  kind: ConditionKind
  label: string
  state: ConditionState
  evidenceGrade: EvidenceGrade | null
}

export type FundingOverride = {
  reason: string
  kinds: StopKind[]
  votes: Vote[]
}

export type ReleaseInput = {
  company: string
  stage: VentureStage
  ventureId: string
  amountCents: number | null
  requester: string
  verifier: string | null
  votes: Vote[]
  conditions: Condition[]
  policy: PolicyRecord | null
  ubuntu: { participantType: UbuntuType; product: UbuntuProduct } | null
  cashGrade: EvidenceGrade | null
  actualCents: number | null
  override: FundingOverride | null
}

export type ReleaseDecision = {
  status: 'blocked' | 'authorised'
  blockers: string[]
  executed: false
  mode: 'UNANIMOUS_BOARD'
  receipt: 'unconfirmed'
  statement: string
}

export function isStopKind(kind: ConditionKind): kind is StopKind {
  return (stopKinds as readonly string[]).includes(kind)
}

export function conditionMet(condition: Condition): boolean {
  if (condition.state !== 'satisfied' || condition.evidenceGrade === null) return false
  return isStopKind(condition.kind) ? provesPerformance(condition.evidenceGrade) : provesLegalCondition(condition.evidenceGrade)
}

export function proposalKey(input: Pick<ReleaseInput, 'ventureId' | 'amountCents' | 'conditions' | 'policy' | 'cashGrade' | 'actualCents'>): string {
  return payloadKey({
    actualCents: input.actualCents,
    amountCents: input.amountCents,
    cashGrade: input.cashGrade,
    conditions: input.conditions.map((item) => ({ evidenceGrade: item.evidenceGrade, id: item.id, state: item.state })),
    moduleId: '008',
    policy: input.policy ? { draftAssignsLoss: input.policy.draftAssignsLoss, evidenceGrade: input.policy.evidenceGrade, product: input.policy.product, status: input.policy.status } : null,
    ventureId: input.ventureId,
  })
}

export function overrideKey(override: Pick<FundingOverride, 'reason' | 'kinds'>): string {
  return payloadKey({ action: 'funding_stop_override', kinds: [...override.kinds].sort(), moduleId: '008', reason: override.reason.trim() })
}

export function assessOverride(override: FundingOverride | null): { ok: true; payloadKey: string } | { ok: false; error: string } {
  if (!override) return { ok: false, error: 'No override is recorded.' }
  const reason = override.reason.trim()
  if (reason.length < 20) return { ok: false, error: 'An override needs a recorded reason.' }
  if (!override.kinds.length || override.kinds.some((kind) => !isStopKind(kind))) return { ok: false, error: 'An override can only lift an overdue reporting, stock, reconciliation or control stop.' }
  const key = overrideKey({ ...override, reason })
  if (!unanimous(override.votes, key)) return { ok: false, error: 'An override needs a formal approval from ITS, CJ du Plessis and DJ Eksteen.' }
  return { ok: true, payloadKey: key }
}

function amountBlock(amountCents: number | null): string | null {
  if (amountCents === null) return 'The tranche amount is missing and was not treated as zero.'
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) return 'The tranche amount must be greater than zero.'
  return null
}

export function assessRelease(input: ReleaseInput): ReleaseDecision {
  const blockers: string[] = []
  if (input.company !== 'digikraal') blockers.push('Strategic growth and capital stays inside DigiKraal.')
  if (!stageAllowsCapital(input.stage)) blockers.push('This venture stage cannot receive capital.')
  const amount = amountBlock(input.amountCents)
  if (amount) blockers.push(amount)
  const product = ubuntuProductBlock(input.ubuntu)
  if (product) blockers.push(product)
  if (input.ubuntu) {
    const policy = policyBlock(input.policy, input.ubuntu.product)
    if (policy) blockers.push(policy)
  }
  const override = assessOverride(input.override)
  let overrideNoted = false
  let usedOverride = false
  for (const condition of input.conditions) {
    if (isStopKind(condition.kind) && condition.state === 'overdue') {
      if (override.ok && input.override?.kinds.includes(condition.kind)) {
        usedOverride = true
        continue
      }
      blockers.push(`${condition.label} is overdue. Funding stopped.`)
      if (input.override && !override.ok && !overrideNoted) {
        blockers.push(override.error)
        overrideNoted = true
      }
      continue
    }
    if (conditionMet(condition)) continue
    blockers.push(condition.evidenceGrade ? `${condition.label} is not satisfied. ${evidenceCaution(condition.evidenceGrade)}` : `${condition.label} is still open.`)
  }
  if (input.cashGrade === null || (input.cashGrade !== 'verified_statement' && input.cashGrade !== 'actual') || input.actualCents === null) {
    blockers.push('Pipeline, contracted and forecast amounts are not cash available.')
  } else if (input.amountCents !== null && input.actualCents < input.amountCents) {
    blockers.push('Verified cash does not cover this tranche.')
  }
  const key = proposalKey(input)
  const approvals = formalApprovals(input.votes, key)
  if (!unanimous(input.votes, key)) {
    blockers.push('Capital release needs a formal approval from ITS, CJ du Plessis and DJ Eksteen.')
    if (approvals.errors[0]) blockers.push(approvals.errors[0])
  }
  const verifier = verifierBlock(input.verifier, input.requester)
  if (verifier) blockers.push(verifier)
  const status = blockers.length ? 'blocked' : 'authorised'
  return {
    status,
    blockers,
    executed: false,
    mode: 'UNANIMOUS_BOARD',
    receipt: 'unconfirmed',
    statement: status === 'blocked'
      ? blockers[0]
      : usedOverride
        ? 'Funding stop overridden for the recorded conditions. No money moved.'
        : 'The board decision is recorded. No money moved.',
  }
}

export const executionRefusals = {
  transfer: 'Pivot does not transfer or release capital. A board record is not a payment.',
  invest: 'Pivot does not invest or execute a commitment.',
  distribute: 'Pivot does not pay a distribution.',
  whatsapp: 'A WhatsApp message is evidence of a conversation, not the board decision.',
} as const

export type ExecutionKind = keyof typeof executionRefusals

export function refuseExecution(kind: ExecutionKind): string {
  return executionRefusals[kind]
}

export function assessDistribution(input: {
  reserveCents: number | null
  minimumReserveCents: number | null
  payoutCents: number | null
  solvencyEvidenced: boolean
  liquidityEvidenced: boolean
  taxEvidenced: boolean
  covenantClear: boolean
}): { status: 'blocked'; executed: false; blockers: string[] } {
  const blockers: string[] = []
  if (input.payoutCents === null || input.reserveCents === null || input.minimumReserveCents === null || !Number.isSafeInteger(input.payoutCents) || !Number.isSafeInteger(input.reserveCents) || !Number.isSafeInteger(input.minimumReserveCents) || input.payoutCents < 0 || input.reserveCents < 0 || input.minimumReserveCents < 0) {
    blockers.push('Reserve cover is unknown and was not treated as zero.')
  } else if (input.reserveCents - input.payoutCents < input.minimumReserveCents) {
    blockers.push('The payout would breach the minimum reserve.')
  }
  if (!input.solvencyEvidenced) blockers.push('Solvency is not evidenced.')
  if (!input.liquidityEvidenced) blockers.push('Liquidity is not evidenced.')
  if (!input.taxEvidenced) blockers.push('Tax cover is not evidenced.')
  if (!input.covenantClear) blockers.push('A debt covenant is not clear.')
  if (!blockers.length) blockers.push('Pivot does not pay a distribution.')
  return { status: 'blocked', executed: false, blockers }
}
