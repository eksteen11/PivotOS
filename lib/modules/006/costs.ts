export const costRoles = ['selling', 'immediate', 'other'] as const
export type CostRole = (typeof costRoles)[number]
export const costStatuses = ['known', 'provisional', 'unknown'] as const
export type CostStatus = (typeof costStatuses)[number]

export type CostLine = {
  id: string
  name: string
  role: CostRole
  status: CostStatus
  amountCents: number | null
  explicitZero: boolean
  source: string
}

export function createCostLine(input: {
  id: string
  name: string
  role: CostRole
  status: CostStatus
  amountCents?: number | null
  explicitZero?: boolean
  source?: string
}): { ok: true; line: CostLine } | { ok: false; error: string } {
  const name = input.name.trim()
  const source = (input.source ?? '').trim()
  const amountCents = input.amountCents === undefined ? null : input.amountCents
  if (!input.id.trim() || !name || name.length > 120) return { ok: false, error: 'A cost needs a name.' }
  if (input.status === 'unknown') {
    if (amountCents !== null || input.explicitZero) return { ok: false, error: 'Unknown costs cannot be treated as zero.' }
    return { ok: true, line: { id: input.id.trim(), name, role: input.role, status: 'unknown', amountCents: null, explicitZero: false, source: '' } }
  }
  if (amountCents === null || !Number.isSafeInteger(amountCents) || amountCents < 0) return { ok: false, error: 'A known cost needs an amount, or it must stay unknown.' }
  if (amountCents === 0 && input.explicitZero !== true) return { ok: false, error: 'A zero cost must be explicitly entered. It cannot be assumed.' }
  if (!source) return { ok: false, error: 'A known cost needs a source.' }
  if (source.length > 200) return { ok: false, error: 'Shorten the cost source.' }
  return {
    ok: true,
    line: {
      id: input.id.trim(),
      name,
      role: input.role,
      status: input.status,
      amountCents,
      explicitZero: amountCents === 0,
      source,
    },
  }
}

export function sumRole(lines: CostLine[], role: CostRole): { ok: true; cents: number } | { ok: false; unknown: string[]; provisional: string[] } {
  const selected = lines.filter((line) => line.role === role)
  const unknown = selected.filter((line) => line.status === 'unknown').map((line) => line.name)
  const provisional = selected.filter((line) => line.status === 'provisional').map((line) => line.name)
  if (unknown.length || provisional.length) return { ok: false, unknown, provisional }
  if (selected.some((line) => line.amountCents === null)) return { ok: false, unknown: selected.filter((line) => line.amountCents === null).map((line) => line.name), provisional }
  const cents = selected.reduce((total, line) => total + (line.amountCents as number), 0)
  if (!Number.isSafeInteger(cents)) return { ok: false, unknown: [role], provisional: [] }
  return { ok: true, cents }
}
