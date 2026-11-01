import { NEVER_A_COMMITMENT, type CommitmentState } from './contract'

export function commitmentState(): CommitmentState {
  return { committed: false, spends: false, signs: false, orders: false, launches: false, statement: NEVER_A_COMMITMENT }
}
