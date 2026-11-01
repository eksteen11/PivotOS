import { companies, systems } from '@/lib/workspace/catalogue'
import { clampText, intakeProposalKinds, intakeSourceLabels, isUuid, type IntakeProposal, type IntakeQuestion } from '@/lib/intake/shared'
import { normalizeProposal } from '@/lib/intake/validators'
import { planFields } from '@/lib/workspace/actionPlan'

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
          required: ['kind', 'title', 'company', 'systemId', 'notes', 'requiresExternalApproval', 'uncertainties', 'plan', 'meeting'],
          properties: {
            kind: { type: 'string', enum: [...intakeProposalKinds] },
            title: { type: 'string' },
            company: { type: 'string', enum: companyIds },
            systemId: { type: 'string', enum: systemIds },
            notes: { type: 'string' },
            requiresExternalApproval: { type: 'boolean' },
            uncertainties: { type: 'array', maxItems: 10, items: { type: 'string' } },
            plan: {
              type: 'object', additionalProperties: false,
              required: ['version', 'actions', 'ownerType', ...planFields.map(({ key }) => key)],
              properties: {
                version: { type: 'integer', enum: [1] },
                actions: { type: 'array', minItems: 1, maxItems: 8, items: { type: 'string' } },
                ownerType: { type: 'string', enum: ['person', 'agent'] },
                ...Object.fromEntries(planFields.map(({ key }) => [key, { type: 'string' }])),
              },
            },
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
    'Work action-first: identify requested actions before routing them. Each operational proposal includes plan.version 1, actions in execution order, forWhom (person/customer/project), outcome, owner, ownerType (person or agent), method, tools, inputs and timing/dependencies.',
    'Only name an owner, recipient, tool, input or timing when supported by the transcript or newest clarification. Leave unknown plan fields as empty strings. Do not default unknown ownership to Drikus or invent an agent, connected tool, due date, or permission. Proposed methods must remain suggestions in the notes.',
    'For notes, ideas, outcomes and meetings, return the same plan object shape with actions containing the title; their existing reference or meeting workflow remains authoritative.',
    'Keep each proposal in one business and division. Personal, family, church and private context belongs only to personal. If business routing is ambiguous, ask explicitly before approval; never infer a business from a customer name alone.',
    'Input language may be English, Afrikaans, or mixed South African language. Keep original language in transcript-derived text.',
    'Do not invent database ids. The server assigns every proposal id.',
    'questions[] must contain only essential missing details that block safe planning. Never ask again for a fact already present in the transcript or in clarifications.',
    'clarifications[] are the newest authoritative user answers. They override ambiguous wording in the original transcript.',
    'Read each clarification answer as natural language. Apply every detail in that reply (calendar date, start, end, people, place, system) even when the field label is narrower or unrelated.',
    `proposals[] may include multiple intents. kind must be one of: ${intakeProposalKinds.join(', ')}.`,
    'company must be personal, digikraal, farm-feed, or northpoint. systemId must belong to that company.',
    'Choose systemId from the business operation, not from the record kind. An existing livestock sale (seller stock, cattle, cows, calves, prices, ages, pregnancy certificates, farm visit) uses 005 for the project, task, note, and meeting. Use 010 only for a new incubator or opportunity experiment that is not already a livestock sale.',
    'Always return the requested visit, appointment, or besoek as its own kind meeting proposal, including when it is still unscheduled and again after clarifications.',
    'A completed schedule does not remove that meeting and does not merge it into the project, task, or note. On a livestock sale that asked for a visit, proposals must still contain the project, the task, the note, and the meeting. Put the confirmed window only on the meeting.',
    'meeting.startAt and meeting.endAt are Africa/Johannesburg wall times in YYYY-MM-DDTHH:mm, or empty strings. Store the stated clock time. Do not convert SAST to UTC. Afrikaans month names are calendar months (Oktober = 10).',
    'Split only intents present in the input into separate proposals. For a livestock sale requesting a project, a follow-up task, a missing-document note and a visit, return those four records. Do not add that example or invent records for unrelated input.',
    'Never invent a calendar date. A weekday plus only a start time, such as Woensdag 08:00, is not a complete schedule. Then set confirmedSchedule false, leave startAt and endAt empty, and ask once for the exact date and end time.',
    'A later answer that gives a calendar date plus start and end, such as 28 Oktober 2026 van 08:00 tot 09:00, confirms the window. Set confirmedSchedule true and fill both times. Do not ask for the date or end time again.',
    'External sends and app changes stay proposed. Set requiresExternalApproval true for those, and never mark them executed.',
    `Catalogue: ${JSON.stringify(catalogue)}`,
  ].join('\n')
}

export function stampServerProposalId(entry: unknown, reusedId?: string) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry
  const proposalId = reusedId && isUuid(reusedId) ? reusedId : crypto.randomUUID()
  return { ...(entry as Record<string, unknown>), proposalId }
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

export function normalizeAnalysisContent(content: string, existingMeetingIds: string[] = []): IntakeAnalysis {
  const parsed = JSON.parse(content) as Record<string, unknown>
  if (!Array.isArray(parsed.proposals)) throw new Error('AI response is missing proposals array.')
  if (!parsed.proposals.length) throw new Error('AI returned no proposals.')
  if (parsed.proposals.length > 8) throw new Error('AI returned too many proposals.')
  let meetingSlot = 0
  const proposals = parsed.proposals.map((entry, index) => {
    const kind = entry && typeof entry === 'object' ? String((entry as { kind?: unknown }).kind ?? '') : ''
    const reused = kind === 'meeting' ? existingMeetingIds[meetingSlot++] : undefined
    const normalized = normalizeProposal(stampServerProposalId(entry, reused))
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
    clarificationsAuthority: 'Newest user answers. Apply the full answer text even if the field label is narrower. These override the transcript. Still return every requested proposal, including the visit as kind meeting.',
    clarifications: input.clarifications,
  })
}
