import { expect, test } from '@playwright/test'

import { intakeAnalysisPrompt, intakeAnalysisResponseFormat, intakeUserPayload, normalizeAnalysisContent, type IntakeAnalysis } from '../../lib/intake/analyse'
import { isUuid } from '../../lib/intake/shared'

const transcript = '[TOETS] DigiKraal: CP het 50 Angus koeie en 30 kalwers in Ceres. Projek om hulle te verkoop. Taak: bevestig pryse en ouderdomme. Nota: dragtigheidsertifikate ontbreek. Besoek Woensdag 08:00. Vra die presiese datum en eindtyd.'
const reply = 'Woensdag 28 Oktober 2026 van 08:00 tot 09:00, CP plaas Ceres, Drikus + CP, use 005'

async function analyse(apiKey: string, model: string, clarifications: { field: string; answer: string }[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: intakeAnalysisResponseFormat(),
      messages: [
        { role: 'system', content: intakeAnalysisPrompt() },
        { role: 'user', content: intakeUserPayload({ sourceLabel: 'Manual', transcript, clarifications }) },
      ],
    }),
  })
  const payload = await response.json()
  expect(response.ok, JSON.stringify(payload?.error ?? payload).slice(0, 500)).toBe(true)
  const content = payload?.choices?.[0]?.message?.content
  expect(typeof content).toBe('string')
  return normalizeAnalysisContent(content)
}

function kindsOf(result: IntakeAnalysis) {
  return result.proposals.map((proposal) => proposal.kind).sort()
}

test('real afrikaans follow-up confirms the visit without asking again', async () => {
  test.setTimeout(90_000)
  test.skip(process.env.RUN_LIVE_INTAKE !== '1', 'Set RUN_LIVE_INTAKE=1 to call the local OpenAI key.')
  const apiKey = process.env.OPENAI_API_KEY ?? ''
  expect(apiKey.length).toBeGreaterThan(20)
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  expect(model).toBe('gpt-4o-mini')

  const first = await analyse(apiKey, model, [])
  expect(kindsOf(first)).toEqual(['meeting', 'note', 'project', 'task'])
  expect(first.proposals.every((proposal) => proposal.systemId === '005' && isUuid(proposal.proposalId))).toBe(true)
  const unscheduled = first.proposals.find((proposal) => proposal.kind === 'meeting')
  expect(unscheduled?.meeting.confirmedSchedule).toBe(false)
  expect(unscheduled?.meeting.startAt).toBe('')
  expect(unscheduled?.meeting.endAt).toBe('')
  expect(first.questions.some((question) => /datum|date|eind|end|tyd|time/i.test(`${question.question} ${question.field}`))).toBe(true)

  const second = await analyse(apiKey, model, [{ field: 'visit_date', answer: reply }])
  expect(kindsOf(second), JSON.stringify({ questions: second.questions, proposals: second.proposals.map((proposal) => ({ kind: proposal.kind, systemId: proposal.systemId, meeting: proposal.meeting })) })).toEqual(['meeting', 'note', 'project', 'task'])
  expect(second.proposals.every((proposal) => proposal.systemId === '005')).toBe(true)
  const visit = second.proposals.find((proposal) => proposal.kind === 'meeting')
  expect(visit?.meeting.confirmedSchedule).toBe(true)
  expect(visit?.meeting.startAt).toBe('2026-10-28T08:00')
  expect(visit?.meeting.endAt).toBe('2026-10-28T09:00')
  expect(second.questions.some((question) => /datum|date|eind|end|tyd|time/i.test(`${question.question} ${question.field}`))).toBe(false)
})
