import { createClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/intake/shared'
import { companies, type Company } from '@/lib/workspace/catalogue'
import { followUpView, visibleFollowUp, type FollowUpView } from '@/lib/meetings/followUpView'

export async function readMeetingFollowUps(ids: string[]): Promise<FollowUpView[]> {
  const unique = [...new Set(ids.filter((id) => isUuid(id)))]
  if (!unique.length) return []
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return []
  const { data: owned, error: entityError } = await sb.from('entities').select('id, slug').eq('user_id', user.id)
  if (entityError) return []
  const entityCompany = new Map<string, Company>()
  for (const entity of owned ?? []) {
    const company = companies.find((entry) => entry.slug === entity.slug)?.id
    if (company && entity.id) entityCompany.set(String(entity.id), company)
  }
  const rows = []
  for (let index = 0; index < unique.length; index += 100) {
    const { data, error } = await sb.from('items').select('id,user_id,entity_id,title,status,meta').in('id', unique.slice(index, index + 100)).eq('user_id', user.id).is('deleted_at', null)
    if (error) return []
    rows.push(...(data ?? []))
  }
  const byId = new Map(rows.map((row) => [String(row.id), row]))
  return unique.flatMap((id) => {
    const row = byId.get(id)
    if (!row) return []
    const outcome = visibleFollowUp({
      id: String(row.id),
      user_id: String(row.user_id),
      entity_id: row.entity_id ? String(row.entity_id) : null,
      title: typeof row.title === 'string' ? row.title : null,
      status: typeof row.status === 'string' ? row.status : null,
      meta: (row.meta as Record<string, unknown> | null) ?? {},
    }, user.id, entityCompany)
    const view = outcome ? followUpView({ ...outcome, reviewed: true, source: 'meeting-follow-up' }) : null
    return view ? [view] : []
  })
}
