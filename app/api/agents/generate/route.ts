import { NextResponse } from 'next/server'

import { generateAgentSpec } from '@/lib/ai/generateAgent'
import { getAiService } from '@/lib/ai/service'
import { getEntities, getMemories } from '@/lib/data/queries'
import { hasOpenaiEnv } from '@/lib/env'
import { readJsonBody } from '@/lib/http/readJson'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const sb = await createClient()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await readJsonBody(request)
  const brief = (body?.brief ?? '').toString().trim()
  if (!brief) return NextResponse.json({ error: 'Missing brief' }, { status: 400 })

  const entities = await getEntities()
  const memories = await getMemories(entities.map((e) => e.id))
  const memoryHints = memories.slice(0, 3).map((m) => m.content)
  const entityNames = entities.map((e) => e.name)

  try {
    if (hasOpenaiEnv) {
      const agent = await generateAgentSpec({ brief, entityNames, memoryHints })
      return NextResponse.json({ agent, source: 'openai' })
    }

    const ai = await getAiService()
    const recommendation = await ai.generateAgentSpec({ brief, entityNames, memoryHints })
    return NextResponse.json({ agent: recommendation.payload, source: 'mock', recommendation })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Generation failed' }, { status: 502 })
  }
}
