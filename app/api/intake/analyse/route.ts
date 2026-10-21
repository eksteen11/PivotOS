import { NextResponse } from 'next/server'

import { openaiApiKey, openaiModel } from '@/lib/env'
import { readJsonBody } from '@/lib/http/readJson'
import { intakeAnalysisPrompt, intakeAnalysisResponseFormat, intakeUserPayload, normalizeAnalysisContent, type IntakeAnalysis } from '@/lib/intake/analyse'
import { asSourceLabel, clampText } from '@/lib/intake/shared'
import { requireFounderSession, sameOrigin, withTimeout } from '@/lib/intake/server'

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  }
  const auth = await requireFounderSession()
  if (!auth) {
    return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  }
  const body = await readJsonBody(request)
  const transcript = clampText(body.transcript, 12000)
  if (!transcript) {
    return NextResponse.json({ error: 'Transcript is required.' }, { status: 400 })
  }
  const sourceLabel = asSourceLabel(body.sourceLabel)
  const clarifications = Array.isArray(body.clarifications)
    ? body.clarifications.flatMap((entry) => {
        if (!entry || typeof entry !== 'object') return []
        const row = entry as Record<string, unknown>
        const field = clampText(row.field, 80)
        const answer = clampText(row.answer, 400)
        return field && answer ? [{ field, answer }] : []
      }).slice(0, 8)
    : []
  const payloadSize = JSON.stringify({ transcript, sourceLabel, clarifications }).length
  if (payloadSize > 25000) {
    return NextResponse.json({ error: 'Intake payload is too large for analysis.' }, { status: 413 })
  }

  if (!openaiApiKey) {
    return NextResponse.json({ error: 'AI analysis is unavailable until OpenAI is configured.' }, { status: 503 })
  }

  const timeout = withTimeout(20000)
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.1,
        response_format: intakeAnalysisResponseFormat(),
        messages: [
          { role: 'system', content: intakeAnalysisPrompt() },
          { role: 'user', content: intakeUserPayload({ sourceLabel, transcript, clarifications }) },
        ],
      }),
      signal: timeout.signal,
    })
    if (!response.ok) return NextResponse.json({ error: `AI analysis failed (${response.status}).` }, { status: 502 })
    const payload = await response.json()
    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'AI analysis returned an empty response.' }, { status: 502 })
    }
    let result: IntakeAnalysis
    try {
      result = normalizeAnalysisContent(content)
    } catch {
      return NextResponse.json({ error: 'AI analysis returned invalid structured output.' }, { status: 502 })
    }
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'AI analysis timed out. Please retry.'
      : 'AI analysis request failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  } finally {
    timeout.clear()
  }
}
