import type { Company } from '../../workspace/catalogue'
import { MODULE_010_ID, type CommitmentState, type Idea } from './contract'
import { NEVER_A_COMMITMENT } from './contract'
import { filled, normalise, validDate } from './format'

const boundary = 'Shared ideas stay on DigiKraal. Founder-private ideas stay on Personal until they are shared.'

export function commitmentState(): CommitmentState {
  return {
    committed: false,
    spends: false,
    signs: false,
    orders: false,
    launches: false,
    statement: NEVER_A_COMMITMENT,
  }
}

export function sealIdea(idea: Idea): Idea {
  return { ...idea, moduleId: MODULE_010_ID, approved: false, commitment: commitmentState() }
}

export type IdeaInput = {
  id: string
  title: string
  capturedOn: string
  originator: string
  source: string
  description: string
  problem: string
  beneficiary: string
  originalWording: string
  confidentiality: 'shared' | 'founder-private'
  company: Company
  explorationOwner: string
}

export function captureIdea(input: IdeaInput, existing: readonly Idea[] = []): { ok: true; idea: Idea; duplicateOf: string | null } | { ok: false; error: string } {
  if (!filled(input.id) || !filled(input.title) || !filled(input.originator) || !filled(input.source) || !filled(input.originalWording)) {
    return { ok: false, error: 'Give the idea a title, originator, source and the original wording.' }
  }
  if (!validDate(input.capturedOn)) return { ok: false, error: 'Use a real capture date.' }
  const company = input.confidentiality === 'founder-private' ? 'personal' : 'digikraal'
  if (input.company !== company) return { ok: false, error: boundary }
  const duplicate = existing.find((idea) => normalise(idea.title) === normalise(input.title) && normalise(idea.originator) === normalise(input.originator))
  if (duplicate) return { ok: true, idea: duplicate, duplicateOf: duplicate.id }
  if (existing.some((idea) => idea.id === input.id.trim())) return { ok: false, error: 'This idea id is already in the register.' }
  const needsDetail = !filled(input.description) || !filled(input.problem) || !filled(input.beneficiary) || !filled(input.explorationOwner)
  return {
    ok: true,
    duplicateOf: null,
    idea: sealIdea({
      id: input.id.trim(),
      moduleId: MODULE_010_ID,
      title: input.title.trim(),
      capturedOn: input.capturedOn,
      originator: input.originator.trim(),
      source: input.source.trim(),
      description: input.description.trim(),
      problem: input.problem.trim(),
      beneficiary: input.beneficiary.trim(),
      originalWording: input.originalWording,
      confidentiality: input.confidentiality,
      company,
      explorationOwner: input.explorationOwner.trim(),
      stage: 'captured',
      status: needsDetail ? 'Needs Clarification' : 'New',
      approved: false,
      commitment: commitmentState(),
    }),
  }
}

export function silentlyCommit<T extends { commitment: CommitmentState }>(record: T): { ok: false; error: string; record: T } {
  return { ok: false, error: 'An idea cannot become a commitment on its own.', record }
}
