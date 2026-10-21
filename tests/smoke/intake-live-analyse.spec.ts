import { expect, test } from '@playwright/test'

import { intakeAnalysisPrompt, intakeAnalysisResponseFormat, intakeUserPayload, normalizeAnalysisContent } from '../../lib/intake/analyse'
import { isUuid } from '../../lib/intake/shared'

const prompt = '[TOETS] DigiKraal CP50Anguscows30calvesCeres project sell, task confirm prices/ages, note missing pregnancycerts, visit Wednesday08:00 ask exactdate/endtime.'

test('real afrikaans multi-intent output passes parser and asks for the missing schedule', async () => {
  test.setTimeout(45_000)
  test.skip(process.env.RUN_LIVE_INTAKE !== '1', 'Set RUN_LIVE_INTAKE=1 to call the local OpenAI key.')
  const apiKey = process.env.OPENAI_API_KEY ?? ''
  expect(apiKey.length).toBeGreaterThan(20)
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  expect(model).toBe('gpt-4o-mini')

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
        { role: 'user', content: intakeUserPayload({ sourceLabel: 'Manual', transcript: prompt, clarifications: [] }) },
      ],
    }),
  })
  const payload = await response.json()
  expect(response.ok, JSON.stringify(payload?.error ?? payload).slice(0, 500)).toBe(true)
  const content = payload?.choices?.[0]?.message?.content
  expect(typeof content).toBe('string')

  const result = normalizeAnalysisContent(content)
  expect(result.proposals.length).toBeGreaterThan(1)
  expect(result.proposals.every((proposal) => isUuid(proposal.proposalId))).toBe(true)
  expect(result.questions.some((question) => /datum|date|eind|end|tyd|time/i.test(`${question.question} ${question.field}`))).toBe(true)

  const visit = result.proposals.find((proposal) => proposal.kind === 'meeting')
  expect(visit).toBeTruthy()
  expect(visit?.meeting.confirmedSchedule).toBe(false)
  expect(visit?.meeting.startAt).toBe('')
  expect(visit?.meeting.endAt).toBe('')
  expect(result.proposals.some((proposal) => proposal.kind === 'project' || proposal.kind === 'work')).toBe(true)
  expect(result.proposals.some((proposal) => proposal.kind === 'task')).toBe(true)
  expect(result.proposals.some((proposal) => proposal.kind === 'note')).toBe(true)
})
