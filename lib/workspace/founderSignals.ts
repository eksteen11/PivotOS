import type { FounderDomain, FounderLens, FounderSignal } from '@/lib/modules/002/contract'
import { founderToday, signalFromWork } from '@/lib/modules/002/prioritise'
import type { Company } from '@/lib/workspace/catalogue'
import type { WorkCase } from '@/lib/workspace/model'

const domainBySystem: Record<string, FounderDomain> = {
  '008': 'goals',
  '010': 'ideas',
  '011': 'coding',
}

export { founderToday }

/** Company pills use a company lens. All businesses and Personal stay on the founder lens. */
export function founderLensForScope(scope: Company | 'all'): FounderLens {
  if (scope === 'digikraal' || scope === 'farm-feed' || scope === 'northpoint') return scope
  return 'founder'
}

/**
 * Rank work the desk already loaded. Personal and module 002 stay founder-private.
 * Done work without a plan is omitted so it is not asked for again.
 * This does not approve, start, send, or pay.
 */
export function founderDeskSignals(items: readonly WorkCase[], scope: Company | 'all', today = founderToday()): FounderSignal[] {
  const source = scope === 'personal' ? items.filter((item) => item.company === 'personal') : items
  return source.flatMap((item) => {
    if (item.status === 'done' && !item.plan) return []
    const title = item.title.trim().slice(0, 180)
    if (!title) return []
    const due = validDay(item.due) ? item.due : ''
    const personal = item.company === 'personal' || item.systemId === '002'
    return [signalFromWork(
      { ...item, title, due },
      {
        domain: personal ? 'planning' : domainBySystem[item.systemId] ?? 'planning',
        privacy: personal ? 'founder-private' : 'company-visible',
        urgency: urgencyFor(due, today),
      },
    )]
  })
}

function urgencyFor(due: string, today: string): 'now' | 'today' | 'later' {
  if (!due || !validDay(today)) return 'later'
  if (due < today) return 'now'
  if (due === today) return 'today'
  return 'later'
}

function validDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}
