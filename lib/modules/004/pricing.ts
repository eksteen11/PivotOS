import { WORKBOOK_BROKEN_CELLS, WORKBOOK_MASTER_FORMULAS, type CostComponent, type VatTreatment } from './contract'
import { lineCents, marginBps, vatOnExclusive } from './money'

export type WorkbookLineInput = {
  qtyMilli: number | null
  /** Thousandths of the sheet factor. A factor of 1 is 1000. Blank is null, never assumed to be 1. */
  factorMilli: number | null
  rateCents: number | null
  vatTreatment: VatTreatment
  /** Null unless a person selected a rate version. The sheet's 0.15 is not applied by default. */
  vatRateBps: number | null
  vatRateVersion: string | null
}

export type WorkbookLine = {
  formulaVersion: '004-workbook-4.2-masters-2026-10-20'
  massMilli: number | null
  exVatCents: number | null
  vatCents: number | null
  inclusiveCents: number | null
  pricePerOriginalQtyCents: number | null
  status: 'ready' | 'blank' | 'div0' | 'vat_unknown'
  notes: string[]
  isDeliveredMargin: false
}

/**
 * Recomputes B*C, F*E, G*rate, H+G and G/B.
 * A blank quantity stays blank. It is not Excel's blank-as-zero, which then divides by zero.
 * The header "R/Kg" is not applied here. The caller states the rate unit outside this arithmetic.
 */
export function recomputeWorkbookLine(input: WorkbookLineInput): WorkbookLine {
  const notes = ['Workbook arithmetic only. This is not a delivered margin.']
  const base = {
    formulaVersion: '004-workbook-4.2-masters-2026-10-20' as const,
    massMilli: null,
    exVatCents: null,
    vatCents: null,
    inclusiveCents: null,
    pricePerOriginalQtyCents: null,
    isDeliveredMargin: false as const,
  }
  if (input.qtyMilli === null || input.factorMilli === null || input.rateCents === null) {
    return { ...base, status: 'blank', notes: [...notes, 'A blank quantity, factor or rate stays blank.'] }
  }
  if (input.qtyMilli === 0) {
    return { ...base, massMilli: 0, exVatCents: 0, status: 'div0', notes: [...notes, 'Price per original quantity divides by quantity and is undefined at zero.'] }
  }
  if (input.qtyMilli * input.factorMilli % 1000 !== 0) {
    return { ...base, status: 'blank', notes: [...notes, 'Quantity and factor do not multiply exactly.'] }
  }
  const massMilli = input.qtyMilli * input.factorMilli / 1000
  const exVat = lineCents(input.rateCents, massMilli)
  notes.push(exVat.rounding === 'exact' ? 'Ex-VAT total is exact.' : 'Ex-VAT total uses half-up rounding.')
  const perQtyProduct = exVat.cents * 1000
  const pricePerOriginalQtyCents = perQtyProduct % input.qtyMilli === 0 ? perQtyProduct / input.qtyMilli : Math.round(perQtyProduct / input.qtyMilli)
  if (perQtyProduct % input.qtyMilli !== 0) notes.push('Price per original quantity uses half-up rounding. It divides by the original quantity, not by the converted mass.')
  if (input.vatTreatment === 'unknown' || input.vatRateBps === null || !input.vatRateVersion) {
    return {
      ...base,
      massMilli,
      exVatCents: exVat.cents,
      pricePerOriginalQtyCents,
      status: 'vat_unknown',
      notes: [...notes, 'VAT stays unknown until a rate and a rate version are both stated. The sheet value 15% is not assumed.'],
    }
  }
  if (input.vatTreatment === 'not_applicable') {
    return { ...base, massMilli, exVatCents: exVat.cents, vatCents: 0, inclusiveCents: exVat.cents, pricePerOriginalQtyCents, status: 'ready', notes: [...notes, 'VAT marked not applicable.'] }
  }
  const vat = vatOnExclusive(exVat.cents, input.vatRateBps)
  if (vat.rounding !== 'exact') notes.push('VAT uses half-up rounding.')
  notes.push(`VAT rate version ${input.vatRateVersion}.`)
  return {
    ...base,
    massMilli,
    exVatCents: exVat.cents,
    vatCents: vat.cents,
    inclusiveCents: exVat.cents + vat.cents,
    pricePerOriginalQtyCents,
    status: 'ready',
    notes,
  }
}

/** The sheet header says R/Kg. The worked factor is 1, so the cached ex-VAT total is not a kilogram conversion. */
export function workbookCacheMatchesKilogramHeader(qtyTonnes: number, rateRandPerKg: number, cachedExVatRand: number): boolean {
  return qtyTonnes * 1000 * rateRandPerKg === cachedExVatRand
}

export function workbookBrokenSummary(): { usable: false; cell: 'J26'; formula: 'G26/#REF!' } {
  const broken = WORKBOOK_BROKEN_CELLS.find((cell) => cell.cell === 'J26')
  if (!broken || WORKBOOK_MASTER_FORMULAS.find((row) => row.cell === 'J26')?.formula !== 'G26/#REF!') {
    throw new Error('Workbook summary formula changed and must be reviewed before use.')
  }
  return { usable: false, cell: 'J26', formula: 'G26/#REF!' }
}

/** G15-G26. Labelled Wins on the sheet. It is an ex-VAT block difference, not delivered margin. */
export function workbookExVatDifference(sellingExVatCents: number | null, costExVatCents: number | null): { cents: number | null; kind: 'workbook_ex_vat_difference'; isDeliveredMargin: false } {
  if (sellingExVatCents === null || costExVatCents === null) return { cents: null, kind: 'workbook_ex_vat_difference', isDeliveredMargin: false }
  return { cents: sellingExVatCents - costExVatCents, kind: 'workbook_ex_vat_difference', isDeliveredMargin: false }
}

export type MarginScenario = {
  label: 'best' | 'expected' | 'worst'
  revenueCents: number | null
  deliveredCostCents: number | null
  profitCents: number | null
  profitPerUnitCents: number | null
  marginBps: number | null
  breakEvenPriceCents: number | null
}

export type DeliveredMargin = {
  formula: 'selling_revenue - (acquisition + loading + transport + storage_handling + agent_commission + insurance + finance_cost + export_shipping + other)'
  components: CostComponent[]
  unknown: string[]
  scenarios: MarginScenario[]
  sensitivity: string
  isDeliveredMargin: boolean
  readyForDecision: boolean
  reasons: string[]
}

function sumKnown(components: CostComponent[]): { cents: number | null; unknown: string[] } {
  const unknown = components.filter((component) => component.state === 'unknown').map((component) => component.key)
  if (unknown.length) return { cents: null, unknown }
  return { cents: components.reduce((total, component) => total + (component.cents ?? 0), 0), unknown: [] }
}

export function deliveredMargin(input: {
  quantityMilli: number | null
  revenueCents: number | null
  components: CostComponent[]
  transportLowCents: number | null
  transportExpectedCents: number | null
  transportHighCents: number | null
  minimumMarginBps: number | null
}): DeliveredMargin {
  const reasons: string[] = []
  const expectedTransport = input.transportExpectedCents
  const low = input.transportLowCents
  const high = input.transportHighCents
  const hasBand = low !== null && high !== null && expectedTransport !== null
  if (hasBand && (low > expectedTransport || high < expectedTransport)) reasons.push('Transport band is inconsistent.')
  const sensitivity = hasBand ? 'Best and worst use the stated transport band.' : 'No transport band was supplied, so best, expected and worst stay the same.'
  const scenarios = (['best', 'expected', 'worst'] as const).map((label) => {
    const transport = label === 'best' ? low ?? expectedTransport : label === 'worst' ? high ?? expectedTransport : expectedTransport
    const components = input.components.map((component) => {
      if (component.key !== 'transport' || transport === null || component.state === 'not_applicable') return component
      return { ...component, state: transport === 0 ? 'explicit_zero' as const : 'known' as const, cents: transport }
    })
    const cost = sumKnown(components)
    const deliveredCostCents = cost.cents
    const profitCents = input.revenueCents === null || deliveredCostCents === null ? null : input.revenueCents - deliveredCostCents
    const profitPerUnitCents = profitCents === null || !input.quantityMilli ? null : Math.round(profitCents * 1000 / input.quantityMilli)
    const breakEvenPriceCents = deliveredCostCents === null || !input.quantityMilli ? null : Math.round(deliveredCostCents * 1000 / input.quantityMilli)
    return {
      label,
      revenueCents: input.revenueCents,
      deliveredCostCents,
      profitCents,
      profitPerUnitCents,
      marginBps: profitCents === null || input.revenueCents === null ? null : marginBps(profitCents, input.revenueCents),
      breakEvenPriceCents,
    }
  })
  const unknown = scenarios[1].deliveredCostCents === null
    ? input.components.filter((component) => component.state === 'unknown' && !(component.key === 'transport' && expectedTransport !== null)).map((component) => component.key)
    : []
  if (input.revenueCents === null) reasons.push('Selling revenue is unknown.')
  if (!input.quantityMilli) reasons.push('Quantity is unknown, so the per-unit margin cannot be shown.')
  if (unknown.length) reasons.push(`Unknown costs stay unknown: ${unknown.join(', ')}.`)
  if (input.minimumMarginBps === null) reasons.push('No minimum margin has been set.')
  const expected = scenarios[1]
  if (expected.marginBps !== null && input.minimumMarginBps !== null && expected.marginBps < input.minimumMarginBps) {
    reasons.push('Expected margin is below the stated minimum and needs an explicit decision.')
  }
  const readyForDecision = input.revenueCents !== null && unknown.length === 0 && Boolean(input.quantityMilli) && !reasons.some((reason) => reason.startsWith('Transport band'))
  return {
    formula: 'selling_revenue - (acquisition + loading + transport + storage_handling + agent_commission + insurance + finance_cost + export_shipping + other)',
    components: input.components,
    unknown,
    scenarios,
    sensitivity,
    isDeliveredMargin: unknown.length === 0 && input.revenueCents !== null,
    readyForDecision,
    reasons,
  }
}

export function emptyCostStack(acquisitionCents: number | null): CostComponent[] {
  return [
    { key: 'acquisition', state: acquisitionCents === null ? 'unknown' : acquisitionCents === 0 ? 'explicit_zero' : 'known', cents: acquisitionCents, note: acquisitionCents === null ? 'Acquisition price missing.' : 'Taken from the supply price and the allocated quantity.' },
    { key: 'loading', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'transport', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'storage_handling', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'agent_commission', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'insurance', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'finance_cost', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'export_shipping', state: 'unknown', cents: null, note: 'Not entered.' },
    { key: 'other', state: 'unknown', cents: null, note: 'Not entered.' },
  ]
}

export function withCost(components: CostComponent[], key: CostComponent['key'], state: CostComponent['state'], cents: number | null, note: string): CostComponent[] {
  return components.map((component) => component.key === key ? { ...component, state, cents, note } : component)
}
