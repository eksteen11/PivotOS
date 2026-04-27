import { useEffect, useRef } from 'react'

import { hasSupabaseEnv } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { runSyncOnce } from '../../lib/sync/runSyncOnce'

export function SyncRunner() {
  const { session } = useSupabaseSession()
  const running = useRef(false)

  useEffect(() => {
    if (!hasSupabaseEnv) return
    if (!session) return

    const s = session
    let interval: number | null = null
    let cancelled = false

    async function safeSync() {
      if (cancelled) return
      if (running.current) return
      running.current = true
      try {
        await runSyncOnce(s)
      } finally {
        running.current = false
      }
    }

    void safeSync()
    interval = window.setInterval(() => void safeSync(), 15_000)

    function onOnline() {
      void safeSync()
    }

    window.addEventListener('online', onOnline)

    return () => {
      cancelled = true
      if (interval) window.clearInterval(interval)
      window.removeEventListener('online', onOnline)
    }
  }, [session])

  return null
}

