import { NextResponse } from 'next/server'

import { openaiApiKey, openaiModel } from '@/lib/env'
import { readJsonBody } from '@/lib/http/readJson'
import { systems } from '@/lib/workspace/catalogue'
import { asSourceLabel, clampText, intakeProposalKinds, intakeSourceLabels, isUuid, type IntakeProposal, type IntakeQuestion } from '@/lib/intake/shared'
import { requireFounderSession, sameOrigin, withTimeout } from '@/lib/intake/server'
import { normalizeProposal } from '@/lib/intake/validators'

type AnalyseResult = {
  language: string
  summary: string
  questions: IntakeQuestion[]
  proposals: IntakeProposal[]
}

function normalizeQuestions(value: unknown) {
  if (!Array.isArray(value)) return []
  if (value.length > 8) throw new Error('Too many clarification questions returned.')
  const output: IntakeQuestion[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const row = entry as Record<string, unknown>
    const id = isUuid(String(row.id ?? '')) ? String(row.id) : crypto.randomUUID()
    const question = clampText(row.question, 220)
    const field = clampText(row.field, 80)
    if (!question || !field) continue
    output.push({ id, question, field })
  }
  return output.slice(0, 8)
}

function normalizeResponse(content: string): AnalyseResult {
  const parsed = JSON.parse(content) as Record<string, unknown>
  if (!Array.isArray(parsed.proposals)) throw new Error('AI response is missing proposals array.')
  if (!parsed.proposals.length) throw new Error('AI returned no proposals.')
  if (parsed.proposals.length > 8) throw new Error('AI returned too many proposals.')
  const proposals = parsed.proposals.map((entry) => {
    const enriched =
      entry && typeof entry === 'object'
        ? ({ proposalId: isUuid(String((entry as Record<string, unknown>).proposalId ?? '')) ? (entry as Record<string, unknown>).proposalId : crypto.randomUUID(), ...entry } as Record<string, unknown>)
        : entry
    const normalized = normalizeProposal(enriched)
    if (!normalized) throw new Error('AI returned an invalid proposal.')
    return normalized
  })
  if (!proposals.length) {
    throw new Error('No valid proposals were returned.')
  }
  return {
    language: clampText(parsed.language, 32) || 'mixed',
    summary: clampText(parsed.summary, 400),
    questions: normalizeQuestions(parsed.questions),
    proposals,
  }
}

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

  const catalogue = systems.map((system) => ({
    company: system.company,
    systemId: system.id,
    name: system.name,
    summary: system.summary,
  }))
  const prompt = [
    'You are Pivot OS conversational intake extraction.',
    'Input language may be English, Afrikaans, or mixed South African language. Keep original language in transcript-derived text.',
    'Return JSON only with keys: language, summary, questions, proposals.',
    'questions[] must contain only essential missing details that block safe planning (e.g. exact dates, names, amounts, destination systems).',
    'proposals[] may include multiple intents from one input. Each proposal must include:',
    `proposalId(uuid), kind(${intakeProposalKinds.join('|')}), title, company(personal|digikraal|farm-feed|northpoint), systemId(001-011), notes, requiresExternalApproval(boolean), uncertainties(string[]), meeting object.`,
    'meeting object: confirmedSchedule(boolean), startAt(local datetime YYYY-MM-DDTHH:mm), endAt(local datetime YYYY-MM-DDTHH:mm), people, place.',
    'Never invent dates. If user says a weekday without exact date, keep meeting.confirmedSchedule false and add a question.',
    'Timezone context is Africa/Johannesburg.',
    'External sends/app changes must be proposed, never executed.',
    `Catalogue mapping (use only these system IDs): ${JSON.stringify(catalogue)}`,
  ].join('\n')

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
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: prompt },
          {
            role: 'user',
            content: JSON.stringify({
              sourceLabel,
              sourceOptions: intakeSourceLabels,
              transcript,
              clarifications,
            }),
          },
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
    let result: AnalyseResult
    try {
      result = normalizeResponse(content)
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
