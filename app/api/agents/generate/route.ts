import { NextResponse } from 'next/server'

import { generateAgentSpec } from '@/lib/ai/generateAgent'
import { hasOpenaiEnv } from '@/lib/env'
import { getEntities, getMemories } from '@/lib/data/queries'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const sb = await createClient()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasOpenaiEnv) return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })

  const body = await request.json()
  const brief = (body?.brief ?? '').toString().trim()
  if (!brief) return NextResponse.json({ error: 'Missing brief' }, { status: 400 })

  const entities = await getEntities()
  const memories = await getMemories(entities.map((e) => e.id))

  try {
    const agent = await generateAgentSpec({
      brief,
      entityNames: entities.map((e) => e.name),
      memoryHints: memories.slice(0, 3).map((m) => m.content),
    })
    return NextResponse.json({ agent })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Generation failed' }, { status: 502 })
  }
}
