import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env'

const APP_PREFIXES = [
  '/today',
  '/inbox',
  '/processes',
  '/agents',
  '/tools',
  '/approvals',
  '/settings',
  '/more',
  '/activity',
  '/meetings',
  '/contacts',
  '/documents',
  '/workspaces',
]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  if (!hasSupabaseEnv) return supabaseResponse

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
    return supabaseResponse
  }

  const path = request.nextUrl.pathname
  const isApp = APP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

  if (path === '/register') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (!user && isApp) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (user && path === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/today'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
