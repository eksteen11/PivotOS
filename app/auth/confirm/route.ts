import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNextPath } from '@/lib/auth/navigation'
export async function GET(request: Request) {
  const url = new URL(request.url)
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')
  if (token_hash && (type === 'email' || type === 'signup' || type === 'recovery' || type === 'invite' || type === 'email_change')) {
    try {
      const sb = await createClient()
      const { error } = await sb.auth.verifyOtp({ token_hash, type })
      if (!error) return NextResponse.redirect(new URL(type === 'recovery' ? '/reset-password' : safeNextPath(url.searchParams.get('next')), url.origin))
    } catch { /* Invalid links return to a recoverable sign-in state. */ }
  }
  return NextResponse.redirect(new URL('/login?error=link', url.origin))
}
