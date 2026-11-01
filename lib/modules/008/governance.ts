import type { EvidenceGrade } from './evidence'
import { payloadKey } from './payload'

export const shareholderGroups = ['its', 'cj_du_plessis', 'dj_eksteen'] as const
export type ShareholderGroup = (typeof shareholderGroups)[number]

export const groupLabels: Record<ShareholderGroup, string> = {
  its: 'ITS',
  cj_du_plessis: 'CJ du Plessis',
  dj_eksteen: 'DJ Eksteen',
}

export const reservedMatters = [
  { id: 'shares', label: 'Issuing, transferring or repurchasing shares' },
  { id: 'share_rights', label: 'Changing share classes or rights' },
  { id: 'constitution', label: 'Amending constitutional documents' },
  { id: 'new_shareholder', label: 'Admitting a new strategic shareholder' },
  { id: 'sale_of_business', label: 'Selling Digikraal or a material part of it' },
  { id: 'merger_or_rescue', label: 'Merger or business rescue' },
  { id: 'borrowing', label: 'Borrowing above an approved threshold' },
  { id: 'security', label: 'Granting security or guarantees' },
  { id: 'material_property', label: 'Buying or selling material property' },
  { id: 'spv', label: 'Establishing or closing a material SPV' },
  { id: 'related_party', label: 'Approving a material related-party transaction' },
  { id: 'dividend_policy', label: 'Changing dividend or reserve policy' },
  { id: 'capital_commitment', label: 'Committing capital above a threshold' },
  { id: 'project_split', label: 'Materially changing an approved project split' },
  { id: 'regulated_finance', label: 'Starting a regulated finance business' },
  { id: 'key_executives', label: 'Appointing or removing key executives' },
  { id: 'litigation', label: 'Settling material litigation' },
] as const

export type ReservedMatterId = (typeof reservedMatters)[number]['id']
export type VoteChannel = 'formal_record' | 'whatsapp' | 'meeting_note'
export type VoteCapacity = 'shareholder' | 'board_representative'
export type VoteOutcome = 'approve' | 'reject' | 'abstain'

export type Vote = {
  person: string
  group: ShareholderGroup
  capacity: VoteCapacity
  outcome: VoteOutcome
  channel: VoteChannel
  payloadKey: string
}

export type Holding = {
  holder: string
  group: ShareholderGroup
  bps: number
  evidenceGrade: EvidenceGrade
  representative: string | null
}

const blockedApprovers = new Set(['ai', 'pivot', 'pivot os', 'system', 'agent'])

export function personKey(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')
}

export function samePerson(left: string, right: string): boolean {
  return personKey(left) === personKey(right)
}

export function representsIts(person: string): boolean {
  const key = personKey(person)
  return key === 'tiaan' || key === 'tiaan oosthuizen'
}

export function isBlockedApprover(person: string): boolean {
  return blockedApprovers.has(personKey(person))
}

export function explainVote(vote: Vote, expectedPayload: string): { ok: true } | { ok: false; error: string } {
  const person = personKey(vote.person)
  if (!person || person.length > 80) return { ok: false, error: 'A vote needs a named person.' }
  if (isBlockedApprover(vote.person)) return { ok: false, error: 'An automated actor cannot verify or approve capital.' }
  if (representsIts(vote.person) && (vote.group !== 'its' || vote.capacity !== 'board_representative')) {
    return { ok: false, error: 'Tiaan Oosthuizen represents ITS. He is not the direct Digikraal shareholder.' }
  }
  if (vote.group === 'its' && vote.capacity !== 'board_representative') {
    return { ok: false, error: 'ITS votes through its board representative, not as a personal shareholder.' }
  }
  if (vote.channel === 'whatsapp') return { ok: false, error: 'A WhatsApp message is evidence of a conversation, not the board decision.' }
  if (vote.channel === 'meeting_note') return { ok: false, error: 'A meeting note is not the resolution.' }
  if (vote.outcome !== 'approve') return { ok: false, error: 'An abstention or rejection does not count as approval.' }
  if (vote.payloadKey !== expectedPayload) return { ok: false, error: 'This vote is for a different proposal.' }
  return { ok: true }
}

export function formalApprovals(votes: Vote[], expectedPayload: string): { accepted: Vote[]; errors: string[] } {
  const accepted: Vote[] = []
  const errors: string[] = []
  const seen = new Set<string>()
  const groups = new Set<ShareholderGroup>()
  for (const vote of votes) {
    const check = explainVote(vote, expectedPayload)
    if (!check.ok) {
      errors.push(check.error)
      continue
    }
    const person = personKey(vote.person)
    if (seen.has(person)) {
      errors.push('One person cannot vote for two shareholder groups.')
      continue
    }
    if (groups.has(vote.group)) {
      errors.push(`${groupLabels[vote.group]} already has a formal approval.`)
      continue
    }
    seen.add(person)
    groups.add(vote.group)
    accepted.push(vote)
  }
  return { accepted, errors }
}

export function unanimous(votes: Vote[], expectedPayload: string): boolean {
  const { accepted } = formalApprovals(votes, expectedPayload)
  return shareholderGroups.every((group) => accepted.some((vote) => vote.group === group))
}

export function verifierBlock(verifier: string | null, requester: string): string | null {
  if (!verifier || !verifier.trim() || personKey(verifier).length > 80) return 'A different person must verify the request.'
  if (isBlockedApprover(verifier)) return 'An automated actor cannot verify or approve capital.'
  if (samePerson(verifier, requester)) return 'The requester cannot be the sole verifier.'
  return null
}

export function assessOrdinary(votes: Vote[], expectedPayload: string): { passed: boolean; executed: false; blockers: string[]; statement: string } {
  const { accepted } = formalApprovals(votes, expectedPayload)
  const passed = (['cj_du_plessis', 'dj_eksteen'] as const).every((group) => accepted.some((vote) => vote.group === group))
  return {
    passed,
    executed: false,
    blockers: passed ? [] : ['An ordinary matter needs a formal approval from CJ du Plessis and DJ Eksteen.'],
    statement: "Configured founders' majority only. The signed shareholder agreement remains authoritative. Nothing was executed.",
  }
}

export function assessReserved(matter: ReservedMatterId, votes: Vote[], expectedPayload: string): { passed: boolean; executed: false; blockers: string[] } {
  if (!reservedMatters.some((item) => item.id === matter)) return { passed: false, executed: false, blockers: ['Unknown reserved matter.'] }
  const passed = unanimous(votes, expectedPayload)
  return {
    passed,
    executed: false,
    blockers: passed ? [] : ['A reserved matter needs a formal approval from ITS, CJ du Plessis and DJ Eksteen.'],
  }
}

export function matterPayload(matter: ReservedMatterId): string {
  return payloadKey({ action: 'reserved_matter', matter, moduleId: '008' })
}

export function readShareRegister(holdings: Holding[]): { ok: true; groups: Record<ShareholderGroup, number> } | { ok: false; error: string } {
  const groups = {} as Record<ShareholderGroup, number>
  let total = 0
  for (const holding of holdings) {
    if (!holding.holder.trim()) return { ok: false, error: 'A holding needs a legal holder.' }
    if (representsIts(holding.holder)) return { ok: false, error: 'Tiaan Oosthuizen represents ITS. He is not the direct Digikraal shareholder.' }
    if (holding.representative && representsIts(holding.representative) && holding.group !== 'its') {
      return { ok: false, error: 'Tiaan Oosthuizen represents ITS. He is not the direct Digikraal shareholder.' }
    }
    if (holding.evidenceGrade !== 'signed_legal_document') return { ok: false, error: 'Shareholding needs signed legal evidence.' }
    if (!Number.isInteger(holding.bps) || holding.bps < 0 || holding.bps > 10_000) return { ok: false, error: 'A holding percentage is not valid.' }
    if (groups[holding.group] !== undefined) return { ok: false, error: 'A shareholder group is listed twice.' }
    groups[holding.group] = holding.bps
    total += holding.bps
  }
  if (shareholderGroups.some((group) => groups[group] === undefined)) return { ok: false, error: 'The register does not cover every shareholder group.' }
  if (total !== 10_000) return { ok: false, error: 'Holdings do not sum to 100%.' }
  return { ok: true, groups }
}
