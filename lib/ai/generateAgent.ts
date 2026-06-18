import { hasOpenaiEnv, openaiApiKey, openaiModel } from '@/lib/env'

export type GeneratedAgent = {
  name: string
  role: string
  slug: string
  job_description: string
  tools: string[]
  first_actions: string[]
}

type GenerateInput = {
  brief: string
  entityNames: string[]
  memoryHints?: string[]
}

export async function generateAgentSpec(input: GenerateInput): Promise<GeneratedAgent> {
  if (!hasOpenaiEnv) throw new Error('OPENAI_API_KEY not configured')

  const prompt = [
    'You design AI business agents for Pivot OS — digital employees with roles, tools, and clear job descriptions.',
    '',
    `Entities: ${input.entityNames.join(', ') || 'general business'}`,
    input.memoryHints?.length ? `Context from memory:\n- ${input.memoryHints.join('\n- ')}` : '',
    '',
    'User brief:',
    input.brief,
    '',
    'Return ONLY JSON:',
    '{ "name": string, "role": string, "slug": string, "job_description": string, "tools": string[], "first_actions": string[] }',
    '',
    'Rules:',
    '- slug: lowercase snake_case, max 32 chars',
    '- job_description: 2-4 sentences, concrete responsibilities',
    '- tools: 2-5 tool names (e.g. Gmail, Xero, WhatsApp, Calendar)',
    '- first_actions: 3 short actionable steps this agent would take first',
  ]
    .filter(Boolean)
    .join('\n')

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openaiModel,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return only valid JSON. No markdown.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!resp.ok) {
    const detail = await resp.text()
    throw new Error(`OpenAI error: ${detail.slice(0, 200)}`)
  }

  const raw = await resp.json()
  const content = raw?.choices?.[0]?.message?.content
  if (typeof content !== 'string') throw new Error('Bad OpenAI response')

  const parsed = JSON.parse(content) as GeneratedAgent
  if (!parsed.name || !parsed.role) throw new Error('Incomplete agent spec from model')

  return {
    name: parsed.name,
    role: parsed.role,
    slug: parsed.slug || parsed.name.toLowerCase().replace(/\s+/g, '_').slice(0, 32),
    job_description: parsed.job_description ?? '',
    tools: Array.isArray(parsed.tools) ? parsed.tools : [],
    first_actions: Array.isArray(parsed.first_actions) ? parsed.first_actions : [],
  }
}
