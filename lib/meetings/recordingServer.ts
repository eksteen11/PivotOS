import { createClient } from '@supabase/supabase-js'
import { requireFounderSession } from '@/lib/intake/server'
import { supabaseUrl } from '@/lib/env'
import { isUuid } from '@/lib/intake/shared'

export function recordingAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key || !supabaseUrl) return null
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(20_000) }) } })
}

// Resolve the host's identity BEFORE obtaining privileged storage access.
export async function recordingContext(meetingId: string) {
  const auth = await requireFounderSession()
  if (!auth) return { ok: false as const, status: 401, error: 'Founder sign-in required.' }
  if (!isUuid(meetingId)) return { ok: false as const, status: 400, error: 'Choose a saved meeting.' }
  const { data: meeting } = await auth.sb.from('items').select('id,user_id,entity_id,meta').eq('id', meetingId).eq('user_id', auth.user.id).eq('type', 'meeting').is('deleted_at', null).maybeSingle()
  if (!meeting) return { ok: false as const, status: 404, error: 'Meeting not found.' }
  const admin = recordingAdmin()
  if (!admin) return { ok: false as const, status: 503, error: 'Private recording storage is not configured yet.' }
  return { ok: true as const, admin, ownerId: auth.user.id, meeting }
}
