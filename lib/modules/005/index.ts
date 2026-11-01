/** Digikraal livestock agency, module 005 inside Pivot OS. */

export { integrationContract } from './contract'
export {
  DEAL_STAGES,
  SAMPLE_BUYER_TEXT,
  SAMPLE_CAPTURED_AT,
  SAMPLE_ON_DATE,
  SAMPLE_SELLER_TEXT,
  appendStage,
  buildCase,
  buildDeskModel,
  recommendedDealStage,
  sampleCase,
  sampleDeskModel,
  sampleViewing,
} from './case'
export type { DeskModel, LivestockCase } from './case'
export { assessCompleteness, draftInformationRequest } from './completeness'
export { confirmFact, normaliseText, statedFact } from './facts'
export { approvalHolds, approve, assessPermit, canReleaseLoading } from './gates'
export { buyerReadiness, captureBuyer, captureSeller, describeGroup, proposeBuyerFromText, proposeSellerFromText } from './intake'
export { explainMatch } from './matching'
export { assertLivestockScope } from './scope'
export type {
  Approval,
  BuyerRequirement,
  CompletenessAssessment,
  CompletenessStage,
  DraftMessage,
  Fact,
  GateId,
  LivestockGroup,
  MatchExplanation,
  MovementPermit,
  SellerStock,
  Species,
  StageEvent,
  VerificationLevel,
} from './types'
