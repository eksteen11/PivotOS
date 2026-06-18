import { type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/today/:path*', '/inbox/:path*', '/processes/:path*', '/agents/:path*', '/tools/:path*', '/approvals/:path*', '/settings/:path*', '/more/:path*', '/login'],
}
