/** Rands are stored as integer cents. Unknown money stays null and is never written as zero. */
export function parseRandToCents(text: string): { cents: number | null; state: 'blank' | 'known' | 'explicit_zero' | 'not_applicable'; error?: string } {
  const trimmed = text.trim()
  if (!trimmed) return { cents: null, state: 'blank' }
  if (/^(n\/a|na|not applicable)$/i.test(trimmed)) return { cents: null, state: 'not_applicable' }
  const cleaned = trimmed.replace(/\s/g, '').replace(/^r/i, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { cents: null, state: 'blank', error: 'Enter rands with at most 2 decimal places, or n/a.' }
  const cents = Math.round(Number(cleaned) * 100)
  if (!Number.isSafeInteger(cents)) return { cents: null, state: 'blank', error: 'That amount is too large.' }
  return { cents, state: cents === 0 ? 'explicit_zero' : 'known' }
}

export function formatRands(cents: number | null): string {
  if (cents === null) return 'Unknown'
  const sign = cents < 0 ? '-' : ''
  const absolute = Math.abs(cents)
  const rands = Math.trunc(absolute / 100)
  const remainder = absolute % 100
  return `${sign}R${rands.toLocaleString('en-ZA')}.${String(remainder).padStart(2, '0')}`
}

export function lineCents(pricePerUnitCents: number, quantityMilli: number): { cents: number; rounding: 'exact' | 'half-up' } {
  const product = pricePerUnitCents * quantityMilli
  if (!Number.isSafeInteger(product)) throw new Error('Amount is too large to calculate exactly.')
  return { cents: Math.round(product / 1000), rounding: product % 1000 === 0 ? 'exact' : 'half-up' }
}

/** VAT basis points. 15% is 1500. The workbook hardcodes 0.15; this module applies a rate only when the caller names it. */
export function vatOnExclusive(exVatCents: number, rateBps: number): { cents: number; rounding: 'exact' | 'half-up' } {
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 10000) throw new Error('VAT rate must be between 0 and 100 percent.')
  const product = exVatCents * rateBps
  if (!Number.isSafeInteger(product)) throw new Error('VAT amount is too large to calculate exactly.')
  return { cents: Math.round(product / 10000), rounding: product % 10000 === 0 ? 'exact' : 'half-up' }
}

export function marginBps(profitCents: number, revenueCents: number): number | null {
  if (revenueCents === 0) return null
  const product = profitCents * 10000
  if (!Number.isSafeInteger(product)) return null
  return Math.round(product / revenueCents)
}
