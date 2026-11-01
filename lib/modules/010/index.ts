export { MODULE_010_ID, MODULE_010_INTEGRATION, NEVER_A_COMMITMENT, evidenceLevel, receivingCapabilities } from './contract'
export type {
  CapitalGates,
  CommitmentState,
  Confidentiality,
  Decision,
  Evidence,
  EvidenceKind,
  EvidenceLevel,
  Experiment,
  ExperimentResult,
  FounderDecisionSignal,
  Handover,
  Idea,
  IdeaStage,
  LabAcceptance,
  LabLens,
  MoneyLabel,
  ReceivingCapability,
  Rejection,
  RouteSuggestion,
} from './contract'
export { budgetStatement } from './decisions'
export type { DeskAction, DeskState, LabMove } from './desk'
export { acceptOpportunityLab, applyDeskAction, attentionItems, currentHandover, exampleDeskState, founderDecisionSignal, nextMove, openLab, visibleToLens } from './desk'
export { advisoryScore } from './evidence'
export { spendFromExperiment } from './experiment'
export { captureIdea, silentlyCommit } from './idea'
export type { IdeaInput } from './idea'
export { capabilityLabel, suggestRoute } from './route'
