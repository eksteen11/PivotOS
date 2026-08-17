import type { SupabaseClient } from '@supabase/supabase-js'

export async function writeActivityLog(
  sb: SupabaseClient,
  row: {
    user_id: string
    entity_id?: string | null
    agent_id?: string | null
    approval_id?: string | null
    process_id?: string | null
    action: string
    payload?: Record<string, unknown>
  },
) {
  const { error } = await sb.from('activity_logs').insert({
    user_id: row.user_id,
    entity_id: row.entity_id ?? null,
    agent_id: row.agent_id ?? null,
    approval_id: row.approval_id ?? null,
    process_id: row.process_id ?? null,
    action: row.action,
    payload: row.payload ?? {},
  })
  return error
}
