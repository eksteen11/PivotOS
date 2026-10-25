import { createClient } from '@/lib/supabase/server'

export { sameOrigin } from '@/lib/http/sameOrigin'

export async function requireFounderSession() {
  const sb = await createClient()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return null
  const { data: profile } = await sb.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (profile?.role !== 'founder') return null
  return { sb, user }
}

export function withTimeout(ms: number) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  return {
    signal: controller.signal,
    clear() {
      clearTimeout(timeout)
    },
  }
}
