import type { Experiment, ExperimentResult } from './contract'
import { filled, parseRands, sameName, validDate } from './format'

export function readCost(costRands: string, explicitZero: boolean): { ok: true; costCents: number | null; explicitZero: boolean } | { ok: false; error: string } {
  const trimmed = costRands.trim()
  if (trimmed === '' && explicitZero) return { ok: true, costCents: 0, explicitZero: true }
  if (trimmed === '' && !explicitZero) return { ok: true, costCents: null, explicitZero: false }
  const cents = parseRands(trimmed)
  if (cents === null) return { ok: false, error: 'Enter the test cost in rands, or leave it blank if it is unknown.' }
  if (cents === 0 && !explicitZero) return { ok: false, error: 'Use zero only when the test needs no money.' }
  if (cents > 0 && explicitZero) return { ok: false, error: 'Remove the amount, or untick no money.' }
  return { ok: true, costCents: cents, explicitZero: cents === 0 }
}

export function sealExperiment(experiment: Experiment): Experiment {
  return { ...experiment, spends: false, scales: false }
}

export type ExperimentDraft = {
  id: string
  hypothesis: string
  method: string
  owner: string
  start: string
  end: string
  costRands: string
  explicitZero: boolean
  capacityNote: string
  successThreshold: string
  stopCondition: string
}

export function proposeExperiment(input: ExperimentDraft): { ok: true; experiment: Experiment } | { ok: false; error: string } {
  if (!filled(input.hypothesis) || !filled(input.method) || !filled(input.owner) || !filled(input.capacityNote) || !filled(input.successThreshold) || !filled(input.stopCondition)) {
    return { ok: false, error: 'The test needs a hypothesis, method, owner, capacity note, success line and stop line.' }
  }
  if (!validDate(input.start) || !validDate(input.end) || input.start > input.end) return { ok: false, error: 'Use a real start and end date for the test.' }
  const cost = readCost(input.costRands, input.explicitZero)
  if (!cost.ok) return cost
  if (cost.costCents === null) return { ok: false, error: 'The test cost is unknown and was not treated as zero.' }
  return {
    ok: true,
    experiment: sealExperiment({
      id: input.id,
      hypothesis: input.hypothesis.trim(),
      method: input.method.trim(),
      owner: input.owner.trim(),
      start: input.start,
      end: input.end,
      costCents: cost.costCents,
      explicitZero: cost.explicitZero,
      capacityNote: input.capacityNote.trim(),
      successThreshold: input.successThreshold.trim(),
      stopCondition: input.stopCondition.trim(),
      status: 'proposed',
      approvedBy: null,
      approvedAt: null,
      approvedCostCents: null,
      startedAt: null,
      result: null,
      lesson: '',
      spends: false,
      scales: false,
    }),
  }
}

export function approveExperiment(experiment: Experiment, input: { by: string; explorationOwner: string; at: string }): { ok: true; experiment: Experiment } | { ok: false; error: string } {
  if (experiment.status !== 'proposed') return { ok: false, error: 'There is no test waiting for review.' }
  if (sameName(input.by, input.explorationOwner) || sameName(input.by, experiment.owner)) return { ok: false, error: 'The person who prepared the test cannot approve it.' }
  if (!filled(input.by)) return { ok: false, error: 'Name the decision-maker.' }
  if (experiment.costCents === null) return { ok: false, error: 'The test cost is unknown and was not treated as zero.' }
  return {
    ok: true,
    experiment: sealExperiment({
      ...experiment,
      status: 'approved',
      approvedBy: input.by.trim(),
      approvedAt: input.at,
      approvedCostCents: experiment.costCents,
    }),
  }
}

export function startExperiment(experiment: Experiment, input: { by: string; explorationOwner: string; at: string }): { ok: true; experiment: Experiment } | { ok: false; error: string } {
  if (experiment.status !== 'approved') return { ok: false, error: 'Start the test only after a different person has approved the limit.' }
  if (!sameName(input.by, experiment.owner) && !sameName(input.by, input.explorationOwner)) return { ok: false, error: 'The test owner records the start. Starting is not spending.' }
  return { ok: true, experiment: sealExperiment({ ...experiment, status: 'running', startedAt: input.at }) }
}

export function completeExperiment(experiment: Experiment, input: { result: ExperimentResult; lesson: string }): { ok: true; experiment: Experiment } | { ok: false; error: string } {
  if (experiment.status !== 'running') return { ok: false, error: 'Record a result only while the test is running.' }
  if (!filled(input.lesson)) return { ok: false, error: 'Record what was learned.' }
  return { ok: true, experiment: sealExperiment({ ...experiment, status: 'completed', result: input.result, lesson: input.lesson.trim() }) }
}

export function spendFromExperiment(experiment: Experiment): { ok: false; error: string; experiment: Experiment } {
  return { ok: false, error: 'Opportunity Lab does not spend money. An approved test limit is not a payment.', experiment }
}
