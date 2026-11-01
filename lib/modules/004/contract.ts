/** Farm Feed is module 004 inside Pivot OS. It is not a separate app. */
export const FARM_FEED_MODULE = {
  id: '004',
  company: 'farm-feed',
  name: 'Farm Feed',
  surface: 'internal',
  formulaVersion: '004-workbook-4.2-masters-2026-10-20',
  execution: 'not_executed',
  ledger: 'clark',
} as const

export const WORKBOOK_CALC_SHEET = ' 4.2 FF - Deal Calculations'

/**
 * Sixteen master formulas on the calculation sheet.
 * Shared copies are the same formula. Cached cell values are not listed and are not trusted.
 * J13, J14 and J25 divide by a blank quantity. J26 references a deleted cell.
 */
export const WORKBOOK_MASTER_FORMULAS = [
  { cell: 'F12', formula: 'B12*C12', ref: 'F12:F14' },
  { cell: 'G12', formula: 'F12*E12', ref: 'G12:G14' },
  { cell: 'H12', formula: 'G12*0.15', ref: 'H12:H14' },
  { cell: 'I12', formula: 'H12+G12', ref: 'I12:I14' },
  { cell: 'J12', formula: 'G12/B12', ref: 'J12:J15' },
  { cell: 'B15', formula: 'SUM(B12:B14)', ref: 'B15' },
  { cell: 'E15', formula: 'G15/B15', ref: 'E15' },
  { cell: 'F15', formula: 'SUM(F12:F14)', ref: 'F15:I15' },
  { cell: 'F23', formula: 'B23*C23', ref: 'F23:F25' },
  { cell: 'G23', formula: 'F23*E23', ref: 'G23:G25' },
  { cell: 'H23', formula: 'G23*0.15', ref: 'H23:H25' },
  { cell: 'I23', formula: 'H23+G23', ref: 'I23:I25' },
  { cell: 'J23', formula: 'G23/B23', ref: 'J23:J25' },
  { cell: 'F26', formula: 'SUM(F23:F25)', ref: 'F26:I26' },
  { cell: 'J26', formula: 'G26/#REF!', ref: 'J26' },
  { cell: 'G28', formula: 'G15-G26', ref: 'G28' },
] as const

export const WORKBOOK_BROKEN_CELLS = [
  { cell: 'J13', error: '#DIV/0!', reason: 'Shared price formula divides by a blank quantity.' },
  { cell: 'J14', error: '#DIV/0!', reason: 'Shared price formula divides by a blank quantity.' },
  { cell: 'J25', error: '#DIV/0!', reason: 'Shared price formula divides by a blank quantity.' },
  { cell: 'J26', error: '#REF!', reason: 'Summary unit price points at a deleted cell and cannot be used.' },
] as const

export type Unit = 'kg' | 'tonne' | 'bale'
export type EnquirySide = 'supply' | 'demand'
export type CommercialRole = 'agent' | 'principal' | 'facilitator' | 'exporter' | 'introducer' | 'profit_share'
export type VatTreatment = 'exclusive' | 'inclusive' | 'unknown' | 'not_applicable'
export type QualityLevel = 0 | 1 | 2 | 3 | 4 | 5

export type Quantity = { milli: number; unit: Unit }

export type Enquiry = {
  id: string
  side: EnquirySide
  company: 'farm-feed'
  systemId: '004'
  productOriginal: string
  productKey: string | null
  quantity: Quantity | null
  gradeOriginal: string
  gradeKey: string | null
  acceptedGrades: string[]
  qualityLevel: QualityLevel | null
  qualitySource: string
  qualityMinimum: QualityLevel | null
  packagingOriginal: string
  packagingKey: string | null
  placeOriginal: string
  priceCents: number | null
  vatTreatment: VatTreatment
  counterpartyName: string
  commercialRole: CommercialRole | null
  acceptsSubstitutes: string[]
  kgPerBaleMilli: number | null
  originalWording: string
}

export type CostState = 'known' | 'unknown' | 'not_applicable' | 'explicit_zero'

export type CostComponent = {
  key: 'acquisition' | 'loading' | 'transport' | 'storage_handling' | 'agent_commission' | 'insurance' | 'finance_cost' | 'export_shipping' | 'other'
  state: CostState
  cents: number | null
  note: string
}

export const COST_COMPONENT_KEYS: CostComponent['key'][] = [
  'acquisition', 'loading', 'transport', 'storage_handling', 'agent_commission', 'insurance', 'finance_cost', 'export_shipping', 'other',
]
