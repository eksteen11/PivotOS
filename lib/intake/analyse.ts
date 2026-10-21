import { companies, systems } from '@/lib/workspace/catalogue'
import { clampText, intakeProposalKinds, intakeSourceLabels, type IntakeProposal, type IntakeQuestion } from '@/lib/intake/shared'
import { normalizeProposal } from '@/lib/intake/validators'

export type IntakeAnalysis = {
  language: string
  summary: string
  questions: IntakeQuestion[]
  proposals: IntakeProposal[]
}

const companyIds = companies.map((company) => company.id)
const systemIds = systems.map((system) => system.id)

export function intakeAnalysisSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['language', 'summary', 'questions', 'proposals'],
    properties: {
      language: { type: 'string' },
      summary: { type: 'string' },
      questions: {
        type: 'array',
        maxItems: 8,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['question', 'field'],
          properties: {
            question: { type: 'string' },
            field: { type: 'string' },
          },
        },
      },
      proposals: {
        type: 'array',
        minItems: 1,
        maxItems: 8,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['kind', 'title', 'company', 'systemId', 'notes', 'requiresExternalApproval', 'uncertainties', 'meeting'],
          properties: {
            kind: { type: 'string', enum: [...intakeProposalKinds] },
            title: { type: 'string' },
            company: { type: 'string', enum: companyIds },
            systemId: { type: 'string', enum: systemIds },
            notes: { type: 'string' },
            requiresExternalApproval: { type: 'boolean' },
            uncertainties: { type: 'array', maxItems: 10, items: { type: 'string' } },
            meeting: {
              type: 'object',
              additionalProperties: false,
              required: ['confirmedSchedule', 'startAt', 'endAt', 'people', 'place'],
              properties: {
                confirmedSchedule: { type: 'boolean' },
                startAt: { type: 'string' },
                endAt: { type: 'string' },
                people: { type: 'string' },
                place: { type: 'string' },
              },
            },
          },
        },
      },
    },
  } as const
}

export function intakeAnalysisResponseFormat() {
  return {
    type: 'json_schema' as const,
    json_schema: {
      name: 'pivot_intake_analysis',
      strict: true,
      schema: intakeAnalysisSchema(),
    },
  }
}

export function intakeAnalysisPrompt() {
  const catalogue = systems.map((system) => ({
    company: system.company,
    systemId: system.id,
    name: system.name,
    summary: system.summary,
  }))
  return [
    'You are Pivot OS conversational intake extraction.',
    'Input language may be English, Afrikaans, or mixed South African language. Keep original language in transcript-derived text.',
    'Do not invent database ids. The server assigns every proposal id.',
    'questions[] must contain only essential missing details that block safe planning (exact calendar dates, end times, names, amounts).',
    `proposals[] may include multiple intents. kind must be one of: ${intakeProposalKinds.join(', ')}.`,
    'company must be personal, digikraal, farm-feed, or northpoint. systemId must be a catalogue id that belongs to that company. Shared system 001 fits every company.',
    'meeting.startAt and meeting.endAt are Africa/Johannesburg wall times in YYYY-MM-DDTHH:mm, or empty strings.',
    'Split distinct intents into separate proposals: a sale or project, a follow-up task, a missing-document note, and a visit or meeting when the transcript contains them.',
    'A visit, appointment, or besoek is kind meeting even when it is not yet scheduled.',
    'Never invent a calendar date. A weekday plus a clock time, such as Wednesday 08:00, is not a complete schedule.',
    'When the exact calendar date or end time is missing, set confirmedSchedule false and leave startAt and endAt as empty strings. Ask one clarification for the exact date and end time.',
    'External sends and app changes stay proposed. Set requiresExternalApproval true for those, and never mark them executed.',
    `Catalogue: ${JSON.stringify(catalogue)}`,
  ].join('\n')
}

export function stampServerProposalId(entry: unknown) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry
  return { ...(entry as Record<string, unknown>), proposalId: crypto.randomUUID() }
}

function normalizeQuestions(value: unknown) {
  if (!Array.isArray(value)) return []
  if (value.length > 8) throw new Error('Too many clarification questions returned.')
  const output: IntakeQuestion[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const row = entry as Record<string, unknown>
    const question = clampText(row.question, 220)
    const field = clampText(row.field, 80)
    if (!question || !field) continue
    output.push({ id: crypto.randomUUID(), question, field })
  }
  return output
}

export function normalizeAnalysisContent(content: string): IntakeAnalysis {
  const parsed = JSON.parse(content) as Record<string, unknown>
  if (!Array.isArray(parsed.proposals)) throw new Error('AI response is missing proposals array.')
  if (!parsed.proposals.length) throw new Error('AI returned no proposals.')
  if (parsed.proposals.length > 8) throw new Error('AI returned too many proposals.')
  const proposals = parsed.proposals.map((entry, index) => {
    const normalized = normalizeProposal(stampServerProposalId(entry))
    if (!normalized) throw new Error(`AI proposal ${index + 1} failed catalogue validation.`)
    return normalized
  })
  return {
    language: clampText(parsed.language, 32) || 'mixed',
    summary: clampText(parsed.summary, 400),
    questions: normalizeQuestions(parsed.questions),
    proposals,
  }
}

export function intakeUserPayload(input: { sourceLabel: string; transcript: string; clarifications: { field: string; answer: string }[] }) {
  return JSON.stringify({
    sourceLabel: input.sourceLabel,
    sourceOptions: intakeSourceLabels,
    transcript: input.transcript,
    clarifications: input.clarifications,
  })
}
