export async function middleware(request: import('next/server').NextRequest) {
  const { updateSession } = await import('@/lib/supabase/middleware')
  return updateSession(request)
}

export const config = {
  matcher: [
    '/today/:path*',
    '/inbox/:path*',
    '/processes/:path*',
    '/agents/:path*',
    '/tools/:path*',
    '/approvals/:path*',
    '/settings/:path*',
    '/more/:path*',
    '/activity/:path*',
    '/meetings/:path*',
    '/contacts/:path*',
    '/documents/:path*',
    '/workspaces/:path*',
    '/login',
    '/register',
  ],
}
