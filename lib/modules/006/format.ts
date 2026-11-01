export function formatZar(cents: number | null): string {
  if (cents === null) return 'Unknown'
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const rands = Math.floor(abs / 100)
  const centsPart = String(abs % 100).padStart(2, '0')
  const grouped = String(rands).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${sign}R ${grouped}.${centsPart}`
}

export function formatPercentBps(bps: number): string {
  const value = bps / 100
  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)}%`
}

export function parseRands(value: string): number | null {
  const trimmed = value.trim().replace(/\s/g, '').replace(/^R/i, '')
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null
  const [rands, fraction = ''] = trimmed.split('.')
  const cents = Number(rands) * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isSafeInteger(cents)) return null
  return cents
}

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function validTimestamp(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)
}
