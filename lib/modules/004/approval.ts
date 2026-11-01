import type { MatchProposal } from './match'

export type MarginDecision = {
  action: 'margin_decision'
  outcome: 'approved' | 'rejected'
  approver: string
  at: string
  payloadHash: string
  reasons: string[]
  acknowledgedUnknowns: string[]
  execution: 'not_executed'
  sends: false
  ledgerPosted: false
  identityReleased: false
}

const BLOCKED_APPROVERS = new Set(['ai', 'pivot', 'system', 'agent', 'farm feed'])

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).filter((key) => record[key] !== undefined).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(',')}}`
}

export async function sha256(text: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function decisionPayload(proposal: MatchProposal) {
  return {
    moduleId: proposal.moduleId,
    matchTypes: proposal.matchTypes,
    hardMismatches: proposal.hardMismatches,
    missing: proposal.missing,
    allocatedMilli: proposal.allocatedMilli,
    margin: {
      unknown: proposal.margin.unknown,
      scenarios: proposal.margin.scenarios,
      components: proposal.margin.components,
    },
    parties: proposal.internalParties,
  }
}

export async function decideMargin(input: {
  proposal: MatchProposal
  outcome: 'approved' | 'rejected'
  approver: string
  at: string
  acknowledgeUnknowns?: boolean
}): Promise<MarginDecision | { error: string }> {
  const approver = input.approver.trim()
  if (!approver || BLOCKED_APPROVERS.has(approver.toLowerCase())) return { error: 'A named person must decide. Pivot cannot approve this.' }
  if (Number.isNaN(Date.parse(input.at))) return { error: 'The decision needs a real time.' }
  if (input.outcome === 'approved' && input.proposal.hardMismatches.length) return { error: 'Resolve the product, grade, unit or quality mismatch before a decision.' }
  const unknowns = input.proposal.margin.unknown
  if (input.outcome === 'approved' && unknowns.length && !input.acknowledgeUnknowns) {
    return { error: 'Unknown costs are still visible. Acknowledge them to record an explicit decision.' }
  }
  if (input.proposal.margin.reasons.some((reason) => reason.startsWith('No minimum margin')) && input.outcome === 'approved' && !input.acknowledgeUnknowns) {
    return { error: 'Set a minimum margin, or acknowledge that the decision is being made without one.' }
  }
  const payloadHash = await sha256(canonicalJson(decisionPayload(input.proposal)))
  return {
    action: 'margin_decision',
    outcome: input.outcome,
    approver,
    at: input.at,
    payloadHash,
    reasons: input.proposal.margin.reasons,
    acknowledgedUnknowns: input.acknowledgeUnknowns ? unknowns : [],
    execution: 'not_executed',
    sends: false,
    ledgerPosted: false,
    identityReleased: false,
  }
}

export async function approvalStillCovers(decision: MarginDecision, proposal: MatchProposal): Promise<boolean> {
  const hash = await sha256(canonicalJson(decisionPayload(proposal)))
  return hash === decision.payloadHash
}
