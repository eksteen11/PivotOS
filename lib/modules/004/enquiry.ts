import { COMMERCIAL_STAGES, FINANCE_STAGES, stageForProcess, type Stage } from '@/lib/engines/stages'
import { canonicalGrade, canonicalPackaging, canonicalProduct } from './catalogue'
import { FARM_FEED_MODULE, type CommercialRole, type Enquiry, type EnquirySide, type QualityLevel, type VatTreatment } from './contract'
import { parseQuantity } from './units'
import { parseRandToCents } from './money'

export type EnquiryDraft = {
  id: string
  side: EnquirySide
  productText: string
  quantityText: string
  unit: '' | 'kg' | 'tonne' | 'bale'
  gradeText: string
  acceptedGradesText: string
  qualityLevel: '' | `${QualityLevel}`
  qualitySource: string
  qualityMinimum: '' | `${QualityLevel}`
  packagingText: string
  placeText: string
  priceText: string
  vatTreatment: VatTreatment
  counterpartyName: string
  commercialRole: '' | CommercialRole
  acceptsSubstitutesText: string
  kgPerBaleText: string
  originalWording: string
}

export function emptyDraft(side: EnquirySide, id = ''): EnquiryDraft {
  return {
    id, side, productText: '', quantityText: '', unit: '', gradeText: '', acceptedGradesText: '', qualityLevel: '', qualitySource: '', qualityMinimum: '',
    packagingText: '', placeText: '', priceText: '', vatTreatment: 'unknown', counterpartyName: '', commercialRole: '', acceptsSubstitutesText: '', kgPerBaleText: '', originalWording: '',
  }
}

function paymentInstrument(text: string): boolean {
  return /(account|rekening|bank|branch|swift|iban)/i.test(text) && /\d{6,}/.test(text)
}

export function captureEnquiry(draft: EnquiryDraft): { enquiry: Enquiry } | { error: string } {
  const combined = `${draft.originalWording}\n${draft.counterpartyName}\n${draft.placeText}`
  if (paymentInstrument(combined)) return { error: 'Banking details stay in the finance ledger. Remove them from this enquiry.' }
  const quantity = parseQuantity(draft.quantityText, draft.unit)
  if (quantity.error) return { error: quantity.error }
  const price = parseRandToCents(draft.priceText)
  if (price.error) return { error: price.error }
  const bale = draft.kgPerBaleText.trim() ? parseQuantity(draft.kgPerBaleText, 'kg') : { quantity: null }
  if ('error' in bale && bale.error) return { error: bale.error }
  const level = draft.qualityLevel === '' ? null : Number(draft.qualityLevel) as QualityLevel
  const minimum = draft.qualityMinimum === '' ? null : Number(draft.qualityMinimum) as QualityLevel
  const productOriginal = draft.productText.trim()
  const enquiry: Enquiry = {
    id: draft.id.trim() || `${draft.side}-draft`,
    side: draft.side,
    company: FARM_FEED_MODULE.company,
    systemId: '004',
    productOriginal,
    productKey: canonicalProduct(productOriginal).key,
    quantity: quantity.quantity,
    gradeOriginal: draft.gradeText.trim(),
    gradeKey: canonicalGrade(draft.gradeText).key,
    acceptedGrades: splitList(draft.acceptedGradesText),
    qualityLevel: level,
    qualitySource: draft.qualitySource.trim(),
    qualityMinimum: draft.side === 'demand' ? minimum : null,
    packagingOriginal: draft.packagingText.trim(),
    packagingKey: canonicalPackaging(draft.packagingText).key,
    placeOriginal: draft.placeText.trim(),
    priceCents: price.cents,
    vatTreatment: draft.vatTreatment,
    counterpartyName: draft.counterpartyName.trim(),
    commercialRole: draft.commercialRole || null,
    acceptsSubstitutes: splitList(draft.acceptsSubstitutesText).map((item) => canonicalProduct(item).key || item),
    kgPerBaleMilli: bale.quantity?.milli ?? null,
    originalWording: draft.originalWording.trim(),
  }
  return { enquiry }
}

function splitList(text: string): string[] {
  return text.split(',').map((item) => item.trim()).filter(Boolean)
}

export function qualifyGaps(enquiry: Enquiry): string[] {
  const gaps: string[] = []
  if (!enquiry.productOriginal) gaps.push('Product is missing.')
  if (!enquiry.productKey) gaps.push('Product is not in the Farm Feed list yet. The original wording is kept.')
  if (!enquiry.quantity) gaps.push('Quantity is missing.')
  if (enquiry.quantity?.unit === 'bale' && !enquiry.kgPerBaleMilli) gaps.push('Bale weight in kilograms is missing.')
  if (!enquiry.gradeOriginal) gaps.push('Grade or quality description is missing.')
  if (enquiry.qualityLevel === null) gaps.push('Quality evidence level is missing.')
  if (enquiry.qualityLevel !== null && enquiry.qualityLevel > 0 && !enquiry.qualitySource) gaps.push('The source of the quality claim is missing.')
  if (!enquiry.placeOriginal) gaps.push(enquiry.side === 'supply' ? 'Collection point is missing.' : 'Delivery point is missing.')
  if (enquiry.priceCents === null) gaps.push('Price is missing.')
  if (enquiry.vatTreatment === 'unknown') gaps.push('VAT treatment is unknown.')
  if (!enquiry.commercialRole) gaps.push('Commercial role is missing. Say whether Farm Feed is agent or principal.')
  if (!enquiry.counterpartyName) gaps.push('Counterparty name is missing on the internal record.')
  return gaps
}

export function enquiryStage(enquiry: Enquiry): Stage {
  const stage = qualifyGaps(enquiry).length ? 'intake' : 'qualify'
  return COMMERCIAL_STAGES.find((item) => item.key === stage) as Stage
}

/** 4.1 queue labels stay on the shared stage engine. Finance items point at Clark and are not paid here. */
export function classifyQueueItem(area: string, title: string): { stage: string; financeStage: boolean; execution: 'not_executed'; ledger: 'clark' | 'not_applicable' } {
  const finance = /betaal|fin\/admin|invoice|payment/i.test(`${area} ${title}`)
  const stages = finance ? FINANCE_STAGES : COMMERCIAL_STAGES
  const key = stageForProcess(`${area} ${title}`, '004', finance ? 'finance' : 'commercial')
  if (!stages.some((stage) => stage.key === key)) throw new Error('Shared stage engine returned an unknown stage.')
  return { stage: key, financeStage: finance, execution: 'not_executed', ledger: finance ? 'clark' : 'not_applicable' }
}

export function maskedCounterparty(): string {
  return 'Name held internally'
}
