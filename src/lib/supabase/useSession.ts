import { useEffect, useState } from 'react'

import type { Session } from '@supabase/supabase-js'

import { supabase } from './client'

export function useSupabaseSession() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null

    async function run() {
      if (!supabase) {
        setSession(null)
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setLoading(false)

      const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s)
      })
      unsub = sub.subscription
    }

    void run()

    return () => {
      unsub?.unsubscribe()
    }
  }, [])

  return { loading, session }
}

