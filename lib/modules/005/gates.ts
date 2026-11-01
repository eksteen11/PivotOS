import type { Approval, GateId, MovementPermit, PermitAssessment } from './types'

const AGENT = /^(ai|agent|system|pivot)$/i

export function canonicalPayload(value: unknown): string {
  return JSON.stringify(sortValue(value))
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue)
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    return Object.keys(source).sort().reduce<Record<string, unknown>>((result, key) => {
      if (source[key] !== undefined) result[key] = sortValue(source[key])
      return result
    }, {})
  }
  return value
}

export function approve(gate: GateId, payload: unknown, approver: string, approvedAt: string): Approval {
  if (!approver.trim() || AGENT.test(approver.trim())) throw new Error('A person must approve this. An agent cannot approve it.')
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(approvedAt)) throw new Error('An approval time is required.')
  return { gate, payload: canonicalPayload(payload), approver: approver.trim(), approvedAt }
}

export function approvalHolds(approval: Approval, gate: GateId, payload: unknown) {
  return approval.gate === gate && approval.payload === canonicalPayload(payload)
}

export function assessPermit(permit: MovementPermit | undefined, onDate: string): PermitAssessment {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(onDate)) {
    return { state: 'unverified', blocksLoading: true, detail: 'The check date could not be read. Loading stays blocked.' }
  }
  if (!permit?.exactWording.trim()) {
    return { state: 'missing', blocksLoading: true, detail: 'Movement permit not supplied. Loading stays blocked.' }
  }
  const wording = permit.exactWording.trim()
  if (permit.expiresOn && !/^\d{4}-\d{2}-\d{2}$/.test(permit.expiresOn)) {
    return { state: 'unverified', blocksLoading: true, detail: `Permit date could not be read. Wording kept: ${wording}` }
  }
  if (permit.expiresOn && permit.expiresOn < onDate) {
    return { state: 'expired', blocksLoading: true, detail: `Permit expired on ${permit.expiresOn}. Wording kept: ${wording}` }
  }
  if (!permit.documentConfirmed || !permit.issuer?.trim() || !permit.expiresOn) {
    return { state: 'unverified', blocksLoading: true, detail: `Permit is on file and not confirmed. Wording kept: ${wording}` }
  }
  return { state: 'usable', blocksLoading: false, detail: `Permit from ${permit.issuer.trim()} expires ${permit.expiresOn}. Wording kept: ${wording}` }
}

export function canReleaseLoading(input: {
  permit: MovementPermit | undefined
  onDate: string
  quantityVerified: boolean
  approval?: Approval
  payload?: unknown
}) {
  const permit = assessPermit(input.permit, input.onDate)
  const reasons: string[] = []
  if (permit.blocksLoading) reasons.push(permit.detail)
  if (!input.quantityVerified) reasons.push('Quantity is still only the seller statement.')
  if (!input.approval || input.payload === undefined || !approvalHolds(input.approval, 'loading_release', input.payload)) {
    reasons.push('Loading release needs a matching approval.')
  }
  return { ok: reasons.length === 0, reasons, permit }
}
