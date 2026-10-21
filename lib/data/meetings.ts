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

export async function getArrangeMeetings(): Promise<MeetingItem[]> {
  const sb = await createClient()
  const { data } = await sb
    .from('items')
    .select('id,entity_id,title,content,due_at,meta,entities(slug,name)')
    .eq('type', 'meeting')
    .is('deleted_at', null)
    .is('due_at', null)
    .order('updated_at', { ascending: false })
    .limit(50)
  return (data ?? []) as unknown as MeetingItem[]
}

export async function getMeeting(id: string): Promise<(MeetingItem & { updated_at: string | null }) | null> {
  const sb = await createClient()
  const { data } = await sb
    .from('items')
    .select('id,entity_id,title,content,due_at,updated_at,meta,entities(slug,name)')
    .eq('id', id)
    .eq('type', 'meeting')
    .is('deleted_at', null)
    .maybeSingle()
  return (data as unknown as MeetingItem & { updated_at: string | null }) ?? null
}

export async function getMeetings(entityIds?: string[], range?: { start: string; end: string }): Promise<MeetingItem[]> {
  const sb = await createClient()
  let q = sb
    .from('items')
    .select('id,entity_id,title,content,due_at,meta,entities(slug,name)')
    .eq('type', 'meeting')
    .is('deleted_at', null)
    .order('due_at', { ascending: true })
    .limit(50)
  if (range) q = q.gte('due_at', range.start).lt('due_at', range.end)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as unknown as MeetingItem[]
}
