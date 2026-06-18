'use client'

import { useEffect, useRef } from 'react'

import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { runSyncOnce } from '@/lib/sync/runSyncOnce'

export function SyncRunner() {
  const running = useRef(false)

  useEffect(() => {
    const sb = getSupabaseBrowser()
    if (!sb) return

    let interval: number | null = null
    let cancelled = false

    async function safeSync() {
      if (cancelled || running.current || !sb) return
      const { data } = await sb.auth.getSession()
      if (!data.session) return
      running.current = true
      try {
        await runSyncOnce(data.session)
      } catch (e) {
        console.error('Sync failed', e)
      } finally {
        running.current = false
      }
    }

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (session) void safeSync()
    })

    void safeSync()
    interval = window.setInterval(() => void safeSync(), 15_000)

    return () => {
      cancelled = true
      if (interval) window.clearInterval(interval)
      sub.subscription.unsubscribe()
    }
  }, [])

  return null
}
