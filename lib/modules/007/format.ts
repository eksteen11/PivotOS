export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const absolute = Math.abs(cents)
  const rands = String(Math.trunc(absolute / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const remainder = String(absolute % 100).padStart(2, '0')
  return `${sign}R${rands}.${remainder}`
}

export function formatMilli(milli: number): string {
  const sign = milli < 0 ? '-' : ''
  const absolute = Math.abs(milli)
  const whole = String(Math.trunc(absolute / 1000)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const fraction = String(absolute % 1000).padStart(3, '0')
  return `${sign}${whole}.${fraction}`
}
