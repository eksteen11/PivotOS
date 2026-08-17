'use client'

import { useEffect, useState } from 'react'

import { getSupabaseBrowser, hasSupabaseEnv } from '@/lib/supabase/browser'

export function AuthConnectionBanner() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'missing' | 'down'>('checking')

  useEffect(() => {
    let cancelled = false
    async function check() {
      if (!hasSupabaseEnv) {
        if (!cancelled) setStatus('missing')
        return
      }
      const sb = getSupabaseBrowser()
      if (!sb) {
        if (!cancelled) setStatus('missing')
        return
      }
      try {
        const { error } = await sb.auth.getSession()
        if (cancelled) return
        setStatus(error ? 'down' : 'ok')
      } catch {
        if (!cancelled) setStatus('down')
      }
    }
    void check()
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'checking' || status === 'ok') return null

  if (status === 'missing') {
    return (
      <p className="rounded-xl bg-warn/10 px-3 py-2 text-sm text-warn">
        Supabase is not configured in `.env.local`.
      </p>
    )
  }

  return (
    <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
      Cannot reach Supabase (`vntcdfzumwjgefyxhkie.supabase.co`). Check the project is active and the URL/keys in `.env.local` are correct.
    </p>
  )
}
