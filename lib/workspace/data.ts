import { companies, getSystem, systemFitsCompany } from './catalogue'
import type { WorkCase } from './model'

const WORK_STATUSES = new Set<WorkCase['status']>(['planned', 'in_progress', 'waiting', 'done'])

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asStringMap(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const entries = Object.entries(value as Record<string, unknown>)
  const result: Record<string, string> = {}
  for (const [key, raw] of entries) {
    if (typeof raw !== 'string') continue
    result[key] = raw.slice(0, 2000)
  }
  return result
}

function asIndexList(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => Number.isInteger(entry) && Number(entry) >= 0)
    .map((entry) => Number(entry))
}

function asHistory(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      at: asString((entry as Record<string, unknown>).at),
      text: asString((entry as Record<string, unknown>).text).slice(0, 4000),
    }))
    .filter((entry) => entry.at && entry.text)
}

function asLessons(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => {
      const text = asString((entry as Record<string, unknown>).text).slice(0, 2000)
      const status = asString((entry as Record<string, unknown>).status)
      return text ? { text, status: status === 'proposed' ? 'proposed' as const : 'proposed' as const } : null
    })
    .flatMap((entry) => entry ? [entry] : [])
}

export function caseFromRow(row: Record<string, unknown>): WorkCase | null {
  const meta = row.meta as Record<string, unknown> | null
  const data = meta?.pivot_case as Record<string, unknown> | undefined
  if (!data) return null
  const intake = data.intake as Record<string, unknown> | undefined

  const systemId = asString(data.systemId)
  const company = asString(data.company)
  const kind = asString(data.kind || data.proposalKind || 'work')
  const system = getSystem(systemId)
  if (!system || !companies.some((c) => c.id === company)) return null

  const statusFromRow = asString(row.status)
  if (!WORK_STATUSES.has(statusFromRow as WorkCase['status'])) return null

  return {
    id: asString(row.id),
    entityId: asString(row.entity_id),
    company: company as WorkCase['company'],
    systemId,
    title: asString(row.title).slice(0, 180),
    notes: asString(row.content).slice(0, 12000),
    due: asString(data.due),
    status: statusFromRow as WorkCase['status'],
    source: asString(data.source, 'Manual capture'),
    updatedAt: asString(row.updated_at),
    kind: ['task', 'project', 'job', 'build', 'work', 'idea', 'note', 'handoff', 'outcome'].includes(kind) ? (kind as WorkCase['kind']) : 'work',
    facts: asStringMap(data.facts),
    checked: asIndexList(data.checked),
    history: asHistory(data.history),
    lessons: asLessons(data.lessons),
    intake: {
      sourceCaptureId: asString(intake?.sourceCaptureId, asString(data.sourceCaptureId)),
      proposalKind: asString(intake?.proposalKind, asString(data.proposalKind)),
      externalBlocked: Boolean(intake?.externalBlocked ?? data.externalBlocked),
    },
  }
}
export async function readWorkCases() {
  const { createClient } = await import('@/lib/supabase/server')
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Sign in to read your work.')
  const { data, error } = await sb.from('items').select('id,entity_id,title,content,status,meta,updated_at').eq('user_id', user.id).eq('meta->>workspace_version', '1').is('deleted_at', null).order('updated_at', { ascending: false }).limit(200)
  if (error) throw new Error('Your saved work could not be loaded. Please retry.')
  return (data ?? []).flatMap((row) => { const item = caseFromRow(row); return item ? [item] : [] })
}
export function validateCaseEntity(item: WorkCase, slug: string) {
  const company = companies.find((c) => c.id === item.company)
  const system = getSystem(item.systemId)
  return company?.slug === slug && system && systemFitsCompany(system, item.company)
}
