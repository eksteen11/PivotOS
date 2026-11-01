import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env'

let client: SupabaseClient | null = null

export function getSupabaseBrowser() {
  if (!hasSupabaseEnv) return null
  if (!client) client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) => {
        const timeout = AbortSignal.timeout(15_000)
        const supplied = init?.signal
        return fetch(input, { ...init, signal: supplied ? AbortSignal.any([supplied, timeout]) : timeout })
      },
    },
  })
  return client
}

export { hasSupabaseEnv }
