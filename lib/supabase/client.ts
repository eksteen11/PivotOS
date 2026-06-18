import { createBrowserClient } from '@supabase/ssr'

import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env'

export function createClient() {
  if (!hasSupabaseEnv) {
    throw new Error('Supabase env vars missing')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
