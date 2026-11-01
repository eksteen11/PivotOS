export const entityIds = ['digikraal', 'dk-agri', 'farm-feed'] as const

export type EntityId = (typeof entityIds)[number]

export type StatutoryLedger = 'xero' | 'sage'

export type LegalEntity = {
  id: EntityId
  legalName: string
  ledger: StatutoryLedger
  vat: 'registered' | 'non-vat'
  yearEndMonthDay: '02-28'
}

export const legalEntities: Record<EntityId, LegalEntity> = {
  digikraal: { id: 'digikraal', legalName: 'Digikraal (Pty) Ltd', ledger: 'xero', vat: 'registered', yearEndMonthDay: '02-28' },
  'dk-agri': { id: 'dk-agri', legalName: 'DK Agri (Pty) Ltd', ledger: 'xero', vat: 'non-vat', yearEndMonthDay: '02-28' },
  'farm-feed': { id: 'farm-feed', legalName: 'Farm Feed (Pty) Ltd', ledger: 'sage', vat: 'registered', yearEndMonthDay: '02-28' },
}

export function entityById(id: string): LegalEntity | null {
  return entityIds.includes(id as EntityId) ? legalEntities[id as EntityId] : null
}

/** The statutory ledger stays the owner. This only names the system that would receive a future approved post. */
export function postingTarget(entityId: EntityId, requestedLedger: StatutoryLedger): { ok: true; ledger: StatutoryLedger; ledgerWrite: false } | { ok: false; ledgerWrite: false; error: string } {
  const entity = legalEntities[entityId]
  if (requestedLedger !== entity.ledger) {
    return { ok: false, ledgerWrite: false, error: `${entity.legalName} posts to ${entity.ledger === 'xero' ? 'Xero' : 'Sage'}, not ${requestedLedger === 'xero' ? 'Xero' : 'Sage'}.` }
  }
  return { ok: true, ledger: entity.ledger, ledgerWrite: false }
}

export function vatOnExclusive(exclusiveCents: number, rateBps: number): { cents: number } | { error: string } {
  if (!Number.isInteger(exclusiveCents) || exclusiveCents < 0) return { error: 'VAT needs an exclusive amount in cents.' }
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 10000) return { error: 'VAT rate must be between 0 and 100 percent.' }
  const product = exclusiveCents * rateBps
  if (!Number.isSafeInteger(product)) return { error: 'VAT amount is too large to calculate exactly.' }
  return { cents: Math.round(product / 10000) }
}

export function assessVat(input: {
  entityId: EntityId
  exclusiveCents: number
  rateBps: number
  inheritedFrom?: EntityId | null
}): { ok: true; entityId: EntityId; exclusiveCents: number; vatCents: number; inclusiveCents: number; ledger: StatutoryLedger; posted: false; humanSubmission: true } | { ok: false; error: string } {
  const entity = legalEntities[input.entityId]
  if (input.inheritedFrom && input.inheritedFrom !== input.entityId) {
    return { ok: false, error: `${entity.legalName} cannot inherit a VAT code from ${legalEntities[input.inheritedFrom].legalName}.` }
  }
  if (entity.vat === 'non-vat' && input.rateBps !== 0) {
    return { ok: false, error: 'DK Agri is non-VAT. A Digikraal VAT code cannot be applied here.' }
  }
  const vat = vatOnExclusive(input.exclusiveCents, input.rateBps)
  if ('error' in vat) return { ok: false, error: vat.error }
  const inclusive = input.exclusiveCents + vat.cents
  if (!Number.isSafeInteger(inclusive)) return { ok: false, error: 'The VAT inclusive total is too large.' }
  return {
    ok: true,
    entityId: input.entityId,
    exclusiveCents: input.exclusiveCents,
    vatCents: vat.cents,
    inclusiveCents: inclusive,
    ledger: entity.ledger,
    posted: false,
    humanSubmission: true,
  }
}

export type VatTransaction = { id: string; entityId: EntityId; evidenceKind: string; verified: boolean }

/** A VAT pack is a review list. It does not submit a return. */
export function vatPack(transactions: VatTransaction[]): { entityIds: EntityId[]; includedIds: string[]; excludedIds: string[]; submitted: false; humanSubmission: true } {
  const included = transactions.filter((item) => item.entityId !== 'dk-agri' && item.verified && (item.evidenceKind === 'tax_invoice' || item.evidenceKind === 'supplier_document'))
  const excluded = transactions.filter((item) => !included.includes(item))
  return {
    entityIds: ['digikraal', 'farm-feed'],
    includedIds: included.map((item) => item.id),
    excludedIds: excluded.map((item) => item.id),
    submitted: false,
    humanSubmission: true,
  }
}

export function submitVatReturn(): { ok: false; submitted: false; error: string } {
  return { ok: false, submitted: false, error: 'A person reviews and submits the VAT return. This module does not.' }
}
