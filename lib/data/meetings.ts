import { createClient } from '@/lib/supabase/server'

export type MeetingItem = {
  id: string
  entity_id: string | null
  title: string | null
  content: string
  due_at: string | null
  meta: Record<string, unknown>
  entities?: { slug: string; name: string } | null
}

export async function getMeetings(entityIds?: string[]): Promise<MeetingItem[]> {
  const sb = await createClient()
  let q = sb
    .from('items')
    .select('id,entity_id,title,content,due_at,meta,entities(slug,name)')
    .eq('type', 'meeting')
    .is('deleted_at', null)
    .order('due_at', { ascending: true })
    .limit(50)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as unknown as MeetingItem[]
}
