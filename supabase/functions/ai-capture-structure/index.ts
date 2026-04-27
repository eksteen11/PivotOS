const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Input = { text: string }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const auth = req.headers.get('Authorization')
    if (!auth) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) return json({ error: 'OPENAI_API_KEY not set' }, 500)

    const model = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'
    const body = (await req.json()) as Input
    const text = (body?.text ?? '').toString().trim()
    if (!text) return json({ error: 'Missing text' }, 400)

    const prompt = [
      'You are an operations assistant.',
      'Extract actionable tasks from the input and return ONLY JSON.',
      '',
      'Allowed entity slugs: dj, digikraal, farm_feed, northpoint',
      'Allowed division slugs (only if entity_slug is digikraal): dk_agency, dk_tech, dk_property, dk_agri',
      '',
      'Return JSON with this shape:',
      '{ "tasks": [{ "title": string, "entity_slug": string, "division_slug": string|null, "due_at": string|null, "priority": 1|2|3 }], "notes": string[] }',
      '',
      'Rules:',
      '- Keep titles short and concrete.',
      '- due_at is ISO date (YYYY-MM-DD) when confident, else null.',
      '- priority: 1 high, 2 medium, 3 low.',
      '- If unsure about entity/division, use entity_slug="dj" and division_slug=null.',
      '',
      'Input:',
      text,
    ].join('\n')

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Return only valid JSON. No markdown.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!resp.ok) {
      const t = await resp.text()
      return json({ error: 'OpenAI error', detail: t }, 502)
    }

    const raw = await resp.json()
    const content = raw?.choices?.[0]?.message?.content
    if (typeof content !== 'string') return json({ error: 'Bad OpenAI response' }, 502)

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      return json({ error: 'Model did not return JSON', content }, 502)
    }

    return json(parsed, 200)
  } catch (e) {
    return json({ error: 'Unhandled', detail: `${e}` }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

