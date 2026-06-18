import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env'

let client: SupabaseClient | null = null

export function getSupabaseBrowser() {
  if (!hasSupabaseEnv) return null
  if (!client) client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}

export { hasSupabaseEnv }
