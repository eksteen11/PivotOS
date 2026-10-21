import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA ?? null
  return NextResponse.json(
    { commitSha },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
