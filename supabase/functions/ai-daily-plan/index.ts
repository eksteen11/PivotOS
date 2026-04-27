const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Input = { context: string; tasks: { title: string }[] }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const auth = req.headers.get('Authorization')
    if (!auth) return json({ error: 'Unauthorized' }, 401)

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) return json({ error: 'OPENAI_API_KEY not set' }, 500)

    const model = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'
    const body = (await req.json()) as Input
    const context = (body?.context ?? '').toString().trim()
    const tasks = Array.isArray(body?.tasks) ? body.tasks : []

    const prompt = [
      'You are a planner for a busy operator running multiple businesses.',
      'Create a calm daily plan with 3 outcomes and time blocks.',
      '',
      'Output ONLY JSON with shape:',
      '{ "top3": string[3], "blocks": [{ "label": string, "minutes": number }] }',
      '',
      'Rules:',
      '- top3 must be outcome-focused, not vague.',
      '- blocks total should be 240 to 420 minutes.',
      '- Include at least one deep work block (>=90 minutes).',
      '- Prefer 4-6 blocks.',
      '',
      `Context: ${context || 'general'}`,
      '',
      'Tasks:',
      ...tasks.slice(0, 25).map((t, i) => `${i + 1}. ${String(t?.title ?? '').trim()}`),
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

