import { COMMERCIAL_STAGES, type Stage } from '@/lib/engines/stages'
import type { Quantity } from './contract'
import { formatQuantity, toGrams } from './units'

export type StageEvent = { id: string; stage: string; at: string; reason: string; evidence: string }

export function appendStage(history: StageEvent[], next: StageEvent): StageEvent[] {
  if (history.some((event) => event.id === next.id)) throw new Error('Stage history is append-only.')
  return [...history, next]
}

export type DeliveryReconciliation = {
  instructed: string
  loaded: string
  delivered: string
  varianceGrams: number | null
  outcome: 'exact' | 'short' | 'over' | 'unknown'
  proofOfDelivery: string | null
  stage: Stage
  canClose: boolean
  reasons: string[]
  execution: 'not_executed'
}

export function reconcileDelivery(input: {
  instructed: Quantity | null
  loaded: Quantity | null
  delivered: Quantity | null
  kgPerBaleMilli: number | null
  proofOfDelivery: string
  qualityRejected: boolean
  marginApproved: boolean
}): DeliveryReconciliation {
  const reasons: string[] = []
  const proof = input.proofOfDelivery.trim()
  if (!input.instructed) reasons.push('Instructed quantity is missing.')
  if (!input.delivered) reasons.push('Delivered quantity is missing. The instructed quantity is not used as the actual quantity.')
  if (!proof) reasons.push('Proof of delivery is missing.')
  if (input.qualityRejected) reasons.push('Quality rejection is unresolved.')
  if (!input.marginApproved) reasons.push('Margin decision is not recorded.')
  let varianceGrams: number | null = null
  let outcome: DeliveryReconciliation['outcome'] = 'unknown'
  if (input.instructed && input.delivered) {
    const instructedGrams = toGrams(input.instructed, input.kgPerBaleMilli)
    const deliveredGrams = toGrams(input.delivered, input.kgPerBaleMilli)
    if ('error' in instructedGrams || 'error' in deliveredGrams) reasons.push('error' in instructedGrams ? instructedGrams.error : ('error' in deliveredGrams ? deliveredGrams.error : ''))
    else {
      varianceGrams = deliveredGrams.grams - instructedGrams.grams
      outcome = varianceGrams === 0 ? 'exact' : varianceGrams < 0 ? 'short' : 'over'
      if (outcome !== 'exact') reasons.push(`Delivered quantity is ${outcome} by ${Math.abs(varianceGrams)} grams.`)
    }
  }
  const canClose = reasons.length === 0 && outcome === 'exact'
  const stage = COMMERCIAL_STAGES.find((item) => item.key === (canClose ? 'close' : 'execute')) as Stage
  return {
    instructed: formatQuantity(input.instructed),
    loaded: formatQuantity(input.loaded),
    delivered: formatQuantity(input.delivered),
    varianceGrams,
    outcome,
    proofOfDelivery: proof || null,
    stage,
    canClose,
    reasons,
    execution: 'not_executed',
  }
}
