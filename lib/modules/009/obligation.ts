import type { EntityId } from './entities'
import { validDate } from './format'

export const obligationViews = [
  'corporate_register',
  'payment_queue',
  'cash_forecast',
  'document_checklist',
  'accounting_posting',
  'renewal_calendar',
  'founder_decision',
] as const

export type ObligationView = (typeof obligationViews)[number]

export const viewLabels: Record<ObligationView, string> = {
  corporate_register: 'Corporate register',
  payment_queue: 'Payment queue',
  cash_forecast: 'Cash forecast',
  document_checklist: 'Document checklist',
  accounting_posting: 'Accounting posting',
  renewal_calendar: 'Renewal calendar',
  founder_decision: 'Founder decision',
}

export const obligationKinds = [
  'insurance_renewal',
  'supplier_bill',
  'customer_invoice',
  'tax',
  'payroll',
  'loan',
  'intercompany',
  'corporate_filing',
  'partner_cash',
  'other',
] as const

export type ObligationKind = (typeof obligationKinds)[number]

export type Obligation = {
  id: string
  entityId: EntityId
  kind: ObligationKind
  title: string
  counterparty: string
  dueDate: string
  views: ObligationView[]
  evidenceIds: string[]
  sourceEventId: string | null
}

export function obligationKey(input: Pick<Obligation, 'entityId' | 'kind' | 'counterparty' | 'dueDate' | 'title'>): string {
  return [input.entityId, input.kind, normalise(input.counterparty), input.dueDate, normalise(input.title)].join('|')
}

export function captureObligation(existing: Obligation[], input: {
  id: string
  entityId: EntityId
  kind: ObligationKind
  title: string
  counterparty: string
  dueDate: string
  views: ObligationView[]
  evidenceIds: string[]
  sourceEventId?: string | null
}): { ok: true; obligations: Obligation[]; obligation: Obligation; created: boolean } | { ok: false; error: string } {
  const title = input.title.trim()
  const counterparty = input.counterparty.trim()
  if (!input.id.trim() || !title || !counterparty) return { ok: false, error: 'An obligation needs an id, title and counterparty.' }
  if (!validDate(input.dueDate)) return { ok: false, error: 'An obligation needs a valid due date.' }
  if (!input.views.length) return { ok: false, error: 'An obligation needs at least one linked view.' }
  const views = unique(input.views)
  const key = obligationKey({ ...input, title, counterparty })
  const current = existing.find((item) => obligationKey(item) === key)
  if (!current) {
    const obligation: Obligation = {
      id: input.id.trim(),
      entityId: input.entityId,
      kind: input.kind,
      title,
      counterparty,
      dueDate: input.dueDate,
      views,
      evidenceIds: unique(input.evidenceIds),
      sourceEventId: input.sourceEventId ?? null,
    }
    return { ok: true, obligations: [...existing, obligation], obligation, created: true }
  }
  const obligation: Obligation = {
    ...current,
    views: unique([...current.views, ...views]),
    evidenceIds: unique([...current.evidenceIds, ...input.evidenceIds]),
    sourceEventId: current.sourceEventId ?? input.sourceEventId ?? null,
  }
  return { ok: true, obligations: existing.map((item) => item.id === current.id ? obligation : item), obligation, created: false }
}

export function invoiceNeedsOperationalSource(operationalEventId: string | null): { ok: true } | { ok: false; error: string } {
  if (!operationalEventId?.trim()) return { ok: false, error: 'An invoice needs an operational source before it can be proposed.' }
  return { ok: true }
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}
