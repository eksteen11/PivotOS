import { clampText } from '@/lib/intake/shared'
import type { IntakeItem } from './intake'

export type ClarificationChannel = 'pivot' | 'whatsapp'

export type ClarificationQuestion = {
  id: string
  key: 'original-group' | 'original-sender' | 'business-context' | 'other'
  prompt: string
  status: 'open' | 'answered'
  answer: string | null
  answeredAt: string | null
  answeredVia: ClarificationChannel | null
}

export type ClarificationState = {
  id: string
  ownerId: string
  intakeItemId: string
  toE164: string
  questions: ClarificationQuestion[]
  status: 'open' | 'resolved'
  createdAt: string
  updatedAt: string
  /** Provider message ids of clarification questions we sent — used to prevent recursive intake. */
  outboundProviderMessageIds: string[]
}

export function buildClarificationState(input: {
  id: string
  ownerId: string
  item: IntakeItem
  toE164: string
  at: string
}): ClarificationState {
  const questions: ClarificationQuestion[] = input.item.missingDetails.map((key, index) => ({
    id: `${input.id}-q${index}`,
    key: key === 'original-group' || key === 'original-sender' || key === 'business-context' ? key : 'other',
    prompt: promptFor(key),
    status: 'open',
    answer: null,
    answeredAt: null,
    answeredVia: null,
  }))
  return {
    id: input.id,
    ownerId: input.ownerId,
    intakeItemId: input.item.id,
    toE164: input.toE164,
    questions,
    status: questions.length ? 'open' : 'resolved',
    createdAt: input.at,
    updatedAt: input.at,
    outboundProviderMessageIds: [],
  }
}

function promptFor(key: string) {
  if (key === 'original-group') return 'Which WhatsApp group did this forward come from?'
  if (key === 'original-sender') return 'Who originally sent it in that group (name or number)?'
  if (key === 'business-context') return 'Which business/context should this belong to (DigiKraal, Farm Feed, Northpoint, Lebab, or DJ Eksteen private)?'
  return 'Please add the missing detail for this intake item.'
}

/** Answer once — resolves both Pivot and WhatsApp views of the same clarification. */
export function answerClarification(
  state: ClarificationState,
  input: { questionId: string; answer: string; via: ClarificationChannel; at: string },
): { ok: true; state: ClarificationState } | { ok: false; error: string } {
  const answer = clampText(input.answer, 2_000)
  if (!answer) return { ok: false, error: 'Write an answer before resolving.' }
  let found = false
  const questions = state.questions.map((question) => {
    if (question.id !== input.questionId) return question
    found = true
    return {
      ...question,
      status: 'answered' as const,
      answer,
      answeredAt: input.at,
      answeredVia: input.via,
    }
  })
  if (!found) return { ok: false, error: 'Clarification question not found.' }
  const open = questions.some((question) => question.status === 'open')
  return {
    ok: true,
    state: {
      ...state,
      questions,
      status: open ? 'open' : 'resolved',
      updatedAt: input.at,
    },
  }
}

export function registerClarificationOutbound(state: ClarificationState, providerMessageId: string): ClarificationState {
  const id = providerMessageId.trim()
  if (!id || state.outboundProviderMessageIds.includes(id)) return state
  return { ...state, outboundProviderMessageIds: [...state.outboundProviderMessageIds, id] }
}

export function isOwnClarificationEcho(providerMessageId: string, states: ClarificationState[]) {
  return states.some((state) => state.outboundProviderMessageIds.includes(providerMessageId))
}

export function classifyIntakeReply(input: {
  body: string
  clarification: ClarificationState | null
}): 'clarification-answer' | 'new-forwarded-item' {
  if (!input.clarification || input.clarification.status !== 'open') return 'new-forwarded-item'
  const text = input.body.trim().toLowerCase()
  if (!text) return 'new-forwarded-item'
  // Prefer attaching to the first open question when founder replies on WhatsApp.
  return 'clarification-answer'
}

export function openClarificationQuestion(state: ClarificationState) {
  return state.questions.find((question) => question.status === 'open') ?? null
}
