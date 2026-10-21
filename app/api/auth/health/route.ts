import { NextResponse } from 'next/server'

import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env'

export const dynamic = 'force-dynamic'

function withTimeout(ms: number) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  return { controller, clear: () => clearTimeout(timeout) }
}

export async function GET() {
  if (!hasSupabaseEnv) {
    return NextResponse.json(
      { ok: false, status: 'missing', message: 'Auth service configuration is missing.' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  }

  const url = `${supabaseUrl.replace(/\/+$/, '')}/auth/v1/settings`
  const timeout = withTimeout(5000)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: 'no-store',
      signal: timeout.controller.signal,
    })

    if (response.ok) {
      return NextResponse.json(
        { ok: true, status: 'ok' },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } },
      )
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { ok: false, status: 'credentials', message: 'Auth service credentials were rejected.' },
        { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      )
    }

    return NextResponse.json(
      { ok: false, status: 'unhealthy', message: 'Auth service responded unexpectedly.' },
      { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  } catch {
    return NextResponse.json(
      { ok: false, status: 'unreachable', message: 'Auth service is unreachable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  } finally {
    timeout.clear()
  }
}
