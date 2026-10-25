export async function middleware(request: import('next/server').NextRequest) {
  const { updateSession } = await import('@/lib/supabase/middleware')
  return updateSession(request)
}

export const config = {
  matcher: [
    '/today/:path*',
    '/account/:path*',
    '/reset-password',
    '/inbox/:path*',
    '/processes/:path*',
    '/agents/:path*',
    '/tools/:path*',
    '/approvals/:path*',
    '/settings/:path*',
    '/more/:path*',
    '/activity/:path*',
    '/meetings/:path*',
    '/calendar/:path*',
    '/contacts/:path*',
    '/documents/:path*',
    '/workspaces/:path*',
    '/login',
    '/register',
  ],
}
