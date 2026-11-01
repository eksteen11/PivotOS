import type { Quantity, Unit } from './contract'

/** One tonne is 1 000 kilograms. This is the SI definition, not the workbook factor cell. */
export const GRAMS_PER_KG = 1000
export const KG_PER_TONNE = 1000

const UNITS = new Set<Unit>(['kg', 'tonne', 'bale'])

export function isUnit(value: string): value is Unit {
  return UNITS.has(value as Unit)
}

/** Thousandths of the stated unit. 30.5 tonnes is 30500. Blank stays blank. */
export function parseQuantity(text: string, unit: Unit | ''): { quantity: Quantity | null; error?: string } {
  const trimmed = text.trim()
  if (!trimmed) return { quantity: null }
  if (!isUnit(unit)) return { quantity: null, error: 'Choose kg, tonne or bale.' }
  if (!/^\d+(\.\d{1,3})?$/.test(trimmed)) return { quantity: null, error: 'Quantity must be a positive number with at most 3 decimal places.' }
  const milli = Math.round(Number(trimmed) * 1000)
  if (!Number.isSafeInteger(milli) || milli <= 0) return { quantity: null, error: 'Quantity must be greater than zero.' }
  return { quantity: { milli, unit } }
}

export function formatQuantity(quantity: Quantity | null): string {
  if (!quantity) return 'Quantity unknown'
  const whole = quantity.milli / 1000
  const text = Number.isInteger(whole) ? String(whole) : whole.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
  return `${text} ${quantity.unit}`
}

/**
 * Convert to grams only through a declared relationship.
 * A bale has no mass until someone records kilograms per bale.
 */
export function toGrams(quantity: Quantity, kgPerBaleMilli: number | null): { grams: number } | { error: string } {
  if (quantity.unit === 'kg') return { grams: quantity.milli }
  if (quantity.unit === 'tonne') return { grams: quantity.milli * KG_PER_TONNE }
  if (kgPerBaleMilli === null || kgPerBaleMilli <= 0) return { error: 'A bale needs an explicit kilogram weight before it can be compared with kilograms or tonnes.' }
  if (quantity.milli * kgPerBaleMilli % GRAMS_PER_KG !== 0) return { error: 'The bale weight does not convert exactly. Record a more precise kilogram weight.' }
  return { grams: quantity.milli * kgPerBaleMilli / GRAMS_PER_KG }
}

export function sameOrConvertible(left: Quantity, right: Quantity, leftBale: number | null, rightBale: number | null): { gramsLeft: number; gramsRight: number } | { error: string } {
  const a = toGrams(left, leftBale)
  const b = toGrams(right, rightBale)
  if ('error' in a) return a
  if ('error' in b) return b
  return { gramsLeft: a.grams, gramsRight: b.grams }
}
