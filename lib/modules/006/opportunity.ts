import type { Company } from '../../workspace/catalogue'

export const module006Company = 'digikraal' as const satisfies Company
export const wrongLaneMessage = 'Module 006 records DigiKraal principal property only. Northpoint agency work belongs to module 003.'

export type OpportunityChannel = 'auction' | 'direct_distressed' | 'referral'
export type OpportunityStrategy = 'auction_flip' | 'direct_distressed' | 'buy_and_hold' | 'renovate_and_refinance'

export type Opportunity = {
  id: string
  moduleId: '006'
  company: typeof module006Company
  role: 'principal'
  name: string
  address: string
  legalDescription: string
  propertyType: string
  source: string
  channel: OpportunityChannel
  strategy: OpportunityStrategy
  deadline: string | null
  nextAction: string
  preparedBy: string
}

export type CaptureInput = {
  id: string
  company: string
  role: string
  name: string
  address: string
  legalDescription?: string
  propertyType: string
  source: string
  channel: OpportunityChannel
  strategy: OpportunityStrategy
  deadline?: string | null
  nextAction: string
  preparedBy: string
}

function clean(value: string, max: number): string | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max || /[\r\n]/.test(trimmed)) return null
  return trimmed
}

export function normaliseAddress(address: string): string {
  return address.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function captureOpportunity(input: CaptureInput, existing: Opportunity[] = []): { ok: true; opportunity: Opportunity; duplicateOf: string | null } | { ok: false; error: string } {
  if (input.company !== module006Company || input.role !== 'principal') return { ok: false, error: wrongLaneMessage }
  const name = clean(input.name, 160)
  const address = clean(input.address, 240)
  const propertyType = clean(input.propertyType, 80)
  const source = clean(input.source, 200)
  const nextAction = clean(input.nextAction, 200)
  const preparedBy = clean(input.preparedBy, 80)
  const legalDescription = (input.legalDescription ?? '').trim()
  if (!clean(input.id, 80) || !name || !address || !propertyType || !source || !nextAction || !preparedBy) return { ok: false, error: 'Add the opportunity name, address, source, type, next action and preparer.' }
  if (legalDescription.length > 240) return { ok: false, error: 'Shorten the legal description.' }
  if (input.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(input.deadline)) return { ok: false, error: 'The deadline must be a date.' }
  const duplicate = existing.find((item) => item.id !== input.id.trim() && normaliseAddress(item.address) === normaliseAddress(address))
  return {
    ok: true,
    duplicateOf: duplicate?.id ?? null,
    opportunity: {
      id: input.id.trim(),
      moduleId: '006',
      company: module006Company,
      role: 'principal',
      name,
      address,
      legalDescription,
      propertyType,
      source,
      channel: input.channel,
      strategy: input.strategy,
      deadline: input.deadline ?? null,
      nextAction,
      preparedBy,
    },
  }
}
