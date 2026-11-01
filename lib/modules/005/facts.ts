import type { Approval, Fact } from './types'
import { approvalHolds } from './gates'

const AGENT = /^(ai|agent|system|pivot)$/i

export function normaliseText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function statedFact<T>(value: T, originalWording: string, source: string, suppliedBy: string, capturedAt: string): Fact<T> {
  if (!originalWording.trim()) throw new Error('Original wording is required. A blank fact was not created.')
  if (typeof value === 'string' && !value.trim()) throw new Error('Original wording is required. A blank fact was not created.')
  if (typeof value === 'number' && (!Number.isInteger(value) || value < 0)) {
    throw new Error('Quantity must be a whole number from the source. It was not guessed.')
  }
  return {
    value,
    originalWording: originalWording.trim(),
    source,
    suppliedBy,
    capturedAt,
    verification: 'seller_stated',
    confidence: 'stated',
  }
}

export function confirmFact<T>(
  fact: Fact<T>,
  input: {
    field: string
    level: 'agent_observed' | 'veterinarian_confirmed' | 'document_confirmed'
    confirmer: string
    confirmedAt: string
    approval?: Approval
    payload?: unknown
  },
): Fact<T> {
  if (!input.confirmer.trim() || AGENT.test(input.confirmer.trim())) throw new Error('A person must confirm this fact.')
  const sensitive = input.field === 'pregnancy' || input.field === 'health'
  if (sensitive) {
    if (!input.approval || input.payload === undefined || !approvalHolds(input.approval, 'health_or_pregnancy_confirmation', input.payload)) {
      throw new Error('Health and pregnancy confirmation needs a matching approval.')
    }
  }
  return {
    ...fact,
    verification: input.level,
    confidence: 'confirmed',
    lastConfirmedAt: input.confirmedAt,
  }
}
