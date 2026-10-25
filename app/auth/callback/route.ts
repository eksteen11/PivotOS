import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNextPath } from '@/lib/auth/navigation'
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  if (code) {
    try {
      const sb = await createClient()
      const { error } = await sb.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(new URL(safeNextPath(url.searchParams.get('next')), url.origin))
    } catch { /* Show the same recoverable error for expired and unavailable links. */ }
  }
  return NextResponse.redirect(new URL('/login?error=link', url.origin))
}
