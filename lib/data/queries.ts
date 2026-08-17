import { createClient } from '@/lib/supabase/server'
import type { Agent, Approval, Entity, InboxItem, Memory, Process, Tool, ToolConnection } from '@/lib/types/database'

export async function getEntities(): Promise<Entity[]> {
  const sb = await createClient()
  const { data } = await sb.from('entities').select('id,slug,name,sort_order').order('sort_order')
  return (data ?? []) as Entity[]
}

export async function getPendingApprovals(entityIds?: string[]): Promise<Approval[]> {
  const sb = await createClient()
  let q = sb
    .from('approvals')
    .select('*, agents(name), entities(name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as Approval[]
}

export async function getProcesses(entityIds?: string[]): Promise<Process[]> {
  const sb = await createClient()
  let q = sb
    .from('processes')
    .select('*, agents(name), entities(slug,name), process_steps(*)')
    .order('updated_at', { ascending: false })
    .limit(50)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as Process[]
}

export async function getAgents(entityIds?: string[]): Promise<Agent[]> {
  const sb = await createClient()
  let q = sb.from('agents').select('*, entities(slug,name)').order('name')
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as Agent[]
}

export async function getInboxItems(entityIds?: string[]): Promise<InboxItem[]> {
  const sb = await createClient()
  let q = sb
    .from('items')
    .select('id,entity_id,title,content,source,meta, entities(slug,name)')
    .eq('status', 'inbox')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(20)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...(row as InboxItem),
    suggested_process: (row.meta as Record<string, unknown>)?.suggested_process as string ?? '',
    suggested_agent: (row.meta as Record<string, unknown>)?.suggested_agent as string ?? '',
    urgency: (row.meta as Record<string, unknown>)?.urgency as string ?? 'normal',
  }))
}

export async function getOverdueTasks(entityIds?: string[]) {
  const sb = await createClient()
  let q = sb
    .from('items')
    .select('id,title,type,due_at,entities(slug)')
    .neq('status', 'done')
    .neq('status', 'cancelled')
    .neq('status', 'inbox')
    .lt('due_at', new Date().toISOString())
    .is('deleted_at', null)
    .order('due_at')
    .limit(8)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return data ?? []
}

export async function getTools(): Promise<Tool[]> {
  const sb = await createClient()
  const { data } = await sb.from('tools').select('*').order('sort_order')
  return (data ?? []) as Tool[]
}

export async function getToolConnections(entityIds?: string[]): Promise<ToolConnection[]> {
  const sb = await createClient()
  let q = sb.from('tool_connections').select('*, tools(*), entities(name)')
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as ToolConnection[]
}

export async function getAgentTools(agentId: string) {
  const sb = await createClient()
  const { data } = await sb
    .from('agent_tools')
    .select('*, tool_connections(*, tools(name,slug))')
    .eq('agent_id', agentId)
  return data ?? []
}

export async function getMemories(entityIds?: string[]): Promise<Memory[]> {
  const sb = await createClient()
  let q = sb.from('memories').select('id,kind,key,content').eq('kind', 'pattern').limit(5)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return (data ?? []) as Memory[]
}

export async function getActivityLogs(entityIds?: string[]) {
  const sb = await createClient()
  let q = sb.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50)
  if (entityIds?.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  return data ?? []
}
