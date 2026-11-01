import { CUSTODY_LOCATIONS, MODULE_007_ASSUMPTIONS, type CustodyLocation, type PartnerBooks, type PartnerDeskView, type WaterfallInput } from './contract'
import { formatCents, formatMilli } from './format'
import { reconcilePartnerBooks } from './ledger'
import { assessWaterfall } from './waterfall'

const labels: Record<CustodyLocation, string> = {
  'operating-partner-safe': 'Partner safe',
  'digikraal-office-safe': 'Office safe',
  'authorised-person-in-transit': 'Person in transit',
  'bank-deposit-in-transit': 'Bank deposit in transit',
  'bank-account': 'Bank account',
}

function isLocation(value: string): value is CustodyLocation {
  return (CUSTODY_LOCATIONS as readonly string[]).includes(value)
}

function amount(kind: 'cash-variance' | 'stock-variance' | 'negative-stock-override', variance: number) {
  return kind === 'stock-variance' ? formatMilli(variance) : formatCents(variance)
}

export function composePartnerDesk(books: PartnerBooks, waterfall: WaterfallInput): PartnerDeskView {
  const reconciliation = reconcilePartnerBooks(books)
  const withheld = waterfall.partnershipId !== books.partnershipId
  const settlement = withheld ? null : assessWaterfall(waterfall)
  const open = reconciliation.exceptions.find((item) => item.status === 'open')
  const payable = Boolean(settlement?.payable) && !open && !withheld
  const split = withheld ? 'withheld' as const : settlement?.split ?? 'unsigned'
  const partner = settlement?.partnerShareCents
  const digikraal = settlement?.digikraalNetCents
  const splitLabel = withheld
    ? 'Withheld. This desk shows one partnership at a time.'
    : split === 'signed' && partner !== null && partner !== undefined && digikraal !== null && digikraal !== undefined
      ? `Partner ${formatCents(partner)} · Digikraal ${formatCents(digikraal)}. Not a payment.`
      : split === 'blocked'
        ? 'Blocked. No split was applied.'
        : 'Not signed. No split was applied.'

  const action = open
    ? {
      id: open.id,
      title: open.kind === 'negative-stock-override' ? `${open.subject} went below zero` : `${open.kind === 'cash-variance' && isLocation(open.subject) ? labels[open.subject] : open.subject} differs by ${amount(open.kind, open.variance)}`,
      button: open.kind === 'negative-stock-override' ? 'Review the stock exception' : 'Explain the variance',
      detail: open.custodianId
        ? 'The difference stays with the last acknowledged custodian until evidence explains it. Nothing is deleted or paid.'
        : 'No acknowledged custodian is on record. Nothing is deleted or paid.',
      executes: false as const,
      pays: false as const,
    }
    : withheld
      ? { id: books.partnershipId, title: 'Hold this partnership', button: 'Hold this partnership', detail: 'This desk shows one partnership at a time. Nothing was allocated or paid.', executes: false as const, pays: false as const }
      : split !== 'signed'
        ? { id: `split:${waterfall.dealId}`, title: split === 'unsigned' ? 'Hold the unsigned split' : 'Hold the split', button: split === 'unsigned' ? 'Hold the unsigned split' : 'Hold the split', detail: 'No signed split was applied. The knowledge-base default was not used. Nothing is paid.', executes: false as const, pays: false as const }
        : payable
          ? { id: `payout:${waterfall.dealId}`, title: 'Record the external payout', button: 'Record the external payout', detail: 'Approval does not pay anyone. Record the payment only after it happens outside Pivot OS.', executes: false as const, pays: false as const }
          : { id: `evidence:${waterfall.dealId}`, title: 'Add the missing evidence', button: 'Add the missing evidence', detail: settlement?.reasons.find((reason) => reason !== 'Payout is not executed by this module.') ?? 'Cash-backed profit still needs evidence.', executes: false as const, pays: false as const }

  return {
    moduleId: '007',
    partnershipId: books.partnershipId,
    moneyMoved: false,
    executes: false,
    paid: false,
    providerStatus: 'not-connected',
    profitState: withheld ? 'withheld' : settlement?.state ?? 'forecast',
    payable,
    split,
    splitLabel,
    action,
    cash: reconciliation.cash.map((row) => ({
      location: row.location,
      label: labels[row.location],
      expected: formatCents(row.expectedCents),
      counted: row.physicalCountCents === null ? 'Not counted' : formatCents(row.physicalCountCents),
      variance: row.varianceCents === null ? 'Not counted' : row.varianceCents === 0 ? 'Ties' : formatCents(row.varianceCents),
    })),
    stock: reconciliation.stock.map((row) => ({
      id: `${row.batchId}:${row.location}:${row.unit}`,
      label: `${row.batchId} · ${row.location}`,
      expected: `${formatMilli(row.expectedMilli)} ${row.unit}`,
      counted: row.physicalMilli === null ? 'Not counted' : `${formatMilli(row.physicalMilli)} ${row.unit}`,
      variance: row.varianceMilli === null ? 'Not counted' : row.varianceMilli === 0 ? 'Ties' : formatMilli(row.varianceMilli),
    })),
    hiddenOtherPartnerships: reconciliation.hiddenOtherPartnerships,
    assumptions: MODULE_007_ASSUMPTIONS,
  }
}
