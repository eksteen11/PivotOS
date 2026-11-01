import { formatZar, validDate } from './format'

export const evidenceGrades = [
  'signed_legal_document',
  'signed_resolution',
  'verified_statement',
  'actual',
  'contracted_terms',
  'pipeline_proposal',
  'planning_note',
  'whatsapp_message',
  'spreadsheet_row',
  'forecast',
  'approved_case',
  'internal_assumption',
] as const

export type EvidenceGrade = (typeof evidenceGrades)[number]

const labels: Record<EvidenceGrade, string> = {
  signed_legal_document: 'Signed legal document',
  signed_resolution: 'Signed resolution',
  verified_statement: 'Verified statement',
  actual: 'Actual',
  contracted_terms: 'Contracted, not received',
  pipeline_proposal: 'Pipeline proposal',
  planning_note: 'Planning note',
  whatsapp_message: 'WhatsApp message',
  spreadsheet_row: 'Spreadsheet row',
  forecast: 'Forecast',
  approved_case: 'Approved case',
  internal_assumption: 'Internal assumption',
}

const cautions: Record<EvidenceGrade, string> = {
  signed_legal_document: 'Signed legal document. It can evidence a legal condition. It is not a board vote and it is not cash.',
  signed_resolution: 'Signed resolution. It can evidence a legal condition. Release still needs all three shareholder groups on this proposal.',
  verified_statement: 'Verified statement. It can evidence cash, a count or a reconciliation. It is not a transfer.',
  actual: 'Actual figure, kept apart from forecast and pipeline. It is not a transfer.',
  contracted_terms: 'Contracted terms are not cash until the money is received.',
  pipeline_proposal: 'Pipeline funding is not cash.',
  planning_note: 'A planning note does not override a signed document.',
  whatsapp_message: 'A WhatsApp message is evidence of a conversation, not a decision or a satisfied condition.',
  spreadsheet_row: 'A spreadsheet row is historic evidence, not an approved commitment.',
  forecast: 'A forecast is not an actual.',
  approved_case: 'An approved case stays separate from forecast and actual.',
  internal_assumption: 'An internal assumption cannot satisfy a condition or release capital.',
}

export type MoneyFigures = {
  pipelineCents: number | null
  contractedCents: number | null
  approvedCaseCents: number | null
  forecastCents: number | null
  actualCents: number | null
}

export function evidenceLabel(grade: EvidenceGrade): string {
  return labels[grade]
}

export function evidenceCaution(grade: EvidenceGrade): string {
  return cautions[grade]
}

export function provesPerformance(grade: EvidenceGrade): boolean {
  return grade === 'verified_statement' || grade === 'actual'
}

export function provesLegalCondition(grade: EvidenceGrade): boolean {
  return grade === 'signed_legal_document' || grade === 'signed_resolution'
}

export function countsAsCash(grade: EvidenceGrade): boolean {
  return provesPerformance(grade)
}

/** A grade can support a condition. It never becomes the approval. */
export function approvalFromEvidence(grade: EvidenceGrade | null): [] {
  void grade
  return []
}

export function availableCashCents(figures: MoneyFigures, grade: EvidenceGrade | null): number | null {
  if (!grade || !countsAsCash(grade) || figures.actualCents === null) return null
  if (!Number.isSafeInteger(figures.actualCents) || figures.actualCents < 0) return null
  return figures.actualCents
}

export function presentFigures(figures: MoneyFigures): { label: string; amount: string; caution: string }[] {
  return [
    { label: 'Pipeline', amount: formatZar(figures.pipelineCents), caution: evidenceCaution('pipeline_proposal') },
    { label: 'Contracted, not received', amount: formatZar(figures.contractedCents), caution: evidenceCaution('contracted_terms') },
    { label: 'Approved case', amount: formatZar(figures.approvedCaseCents), caution: evidenceCaution('approved_case') },
    { label: 'Forecast', amount: formatZar(figures.forecastCents), caution: evidenceCaution('forecast') },
    { label: 'Actual', amount: formatZar(figures.actualCents), caution: evidenceCaution('actual') },
  ]
}

export function evidenceSourceError(source: string, sourceDate: string): string | null {
  const text = source.trim()
  if (!text || text.length > 200) return 'Evidence needs a source.'
  if (!validDate(sourceDate)) return 'Evidence needs a valid source date.'
  return null
}
