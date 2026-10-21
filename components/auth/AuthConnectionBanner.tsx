'use client'

import { useEffect, useState } from 'react'

const AUTH_UNAVAILABLE_MESSAGE = 'Sign-in is temporarily unavailable. Please try again shortly.'

export function AuthConnectionBanner() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'missing' | 'unreachable' | 'credentials' | 'unhealthy'>('checking')

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    async function check() {
      try {
        const response = await fetch('/api/auth/health', {
          cache: 'no-store',
          signal: controller.signal,
        })
        const body = (await response.json().catch(() => ({}))) as { status?: string; ok?: boolean }
        if (cancelled) return
        if (body.ok) {
          setStatus('ok')
          return
        }
        if (body.status === 'missing') {
          setStatus('missing')
          return
        }
        if (body.status === 'credentials') {
          setStatus('credentials')
          return
        }
        if (body.status === 'unreachable') {
          setStatus('unreachable')
          return
        }
        setStatus('unhealthy')
      } catch {
        if (!cancelled) setStatus('unreachable')
      }
    }
    void check()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  if (status === 'checking' || status === 'ok') return null

  if (status === 'missing') {
    return (
      <p className="rounded-xl bg-warn/10 px-3 py-2 text-sm text-warn">
        {AUTH_UNAVAILABLE_MESSAGE}
      </p>
    )
  }

  if (status === 'credentials') {
    return (
      <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
        {AUTH_UNAVAILABLE_MESSAGE}
      </p>
    )
  }

  if (status === 'unreachable') {
    return (
      <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
        {AUTH_UNAVAILABLE_MESSAGE}
      </p>
    )
  }

  return (
    <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
      {AUTH_UNAVAILABLE_MESSAGE}
    </p>
  )
}
