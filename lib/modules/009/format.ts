export function formatZar(cents: number | null): string {
  if (cents === null) return 'Unknown'
  const sign = cents < 0 ? '-' : ''
  const absolute = Math.abs(cents)
  const rands = Math.floor(absolute / 100)
  const remainder = String(absolute % 100).padStart(2, '0')
  const grouped = String(rands).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${sign}R ${grouped}.${remainder}`
}

export function parseRands(value: string): { cents: number | null; error?: string } {
  const trimmed = value.trim()
  if (!trimmed) return { cents: null, error: 'Enter a rand amount. A blank amount stays unknown and is not zero.' }
  const cleaned = trimmed.replace(/\s/g, '').replace(/^r/i, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { cents: null, error: 'Enter rands with at most 2 decimal places.' }
  const [rands, fraction = ''] = cleaned.split('.')
  const cents = Number(rands) * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isSafeInteger(cents)) return { cents: null, error: 'That amount is too large.' }
  return { cents }
}

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function validTimestamp(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) && !Number.isNaN(Date.parse(value))
}

export function fingerprint(value: unknown): string {
  const text = canonical(value)
  let hash = 5381
  for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash, 33) ^ text.charCodeAt(index)
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((item) => canonical(item)).join(',')}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).filter((key) => record[key] !== undefined).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(',')}}`
}
