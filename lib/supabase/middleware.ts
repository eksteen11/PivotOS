import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { needsSecondFactor } from '@/lib/auth/mfa'
import { safeNextPath } from '@/lib/auth/navigation'
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env'

const APP_PREFIXES = [
  '/today',
  '/account',
  '/inbox',
  '/processes',
  '/agents',
  '/tools',
  '/approvals',
  '/settings',
  '/more',
  '/activity',
  '/meetings',
  '/calendar',
  '/contacts',
  '/documents',
  '/workspaces',
]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const path = request.nextUrl.pathname
  const isApp = APP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  function redirectTo(target: URL) {
    const response = NextResponse.redirect(target)
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
    return response
  }
  if (!hasSupabaseEnv) {
    if (!isApp) return supabaseResponse
    const url = new URL('/login', request.url)
    url.searchParams.set('next', `${path}${request.nextUrl.search}`)
    return redirectTo(url)
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase outage must not break public auth pages.
    if (!isApp) return supabaseResponse
  }

  if (user && (isApp || path.startsWith('/api/') || path === '/login')) {
    try {
      if (await needsSecondFactor(supabase)) {
        if (path.startsWith('/api/')) return NextResponse.json({ error: 'Second-factor verification required', code: 'mfa_required' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
        const url = new URL('/verify', request.url)
        url.searchParams.set('next', path === '/login' ? safeNextPath(request.nextUrl.searchParams.get('next')) : `${path}${request.nextUrl.search}`)
        return redirectTo(url)
      }
    } catch {
      return NextResponse.json({ error: 'Sign-in protection is temporarily unavailable. Please try again.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
    }
  }

  if (user && isApp) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    if (profile?.role !== 'founder') {
      const url = request.nextUrl.clone()
      url.pathname = '/closed'
      url.search = ''
      return redirectTo(url)
    }
  }

  if (!user && isApp) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('next', `${path}${request.nextUrl.search}`)
    return redirectTo(url)
  }

  if (user && path === '/login') {
    const url = request.nextUrl.clone()
    const target = new URL(safeNextPath(request.nextUrl.searchParams.get('next')), request.url)
    url.pathname = target.pathname
    url.search = target.search
    return redirectTo(url)
  }

  return supabaseResponse
}
