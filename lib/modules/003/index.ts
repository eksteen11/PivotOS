export {
  applyAction, compareRequirement, emptyNorthpoint, propertyNextQuestion, readState, requirementNextQuestion, sharedStageLabel, stalledItems, unknownPropertyItems,
} from './apply'
export {
  commercialStage, commissionPosition, dealStageLabels, dealStages, documentCatalogue, evidenceLevelLabels, factKeys, factLabels, intakeSourceFor, latestFact, latestLocation, matchFactKeys, moduleCode, moduleIdentity, nextDealStages, nextRequirementStages, portalStatus, propertySegments, qualificationKeys, qualificationQuestions, requirementStageLabels, requirementStages, sourceKindLabels, sourceKinds, stagesBetween, transactionTypes,
} from './foundation'
export type {
  DealStage, Evidence, MatchReport, NorthpointState, PropertyRecord, PropertySegment, RequirementRecord, RequirementStage, SourceKind, StatedAmount, TransactionType,
} from './foundation'

export const integrationContract = {
  module: '003',
  company: 'northpoint',
  visibility: 'internal',
  persistence: 'none',
  component: 'NorthpointModule',
  sharedImports: [
    'lib/engines/stages.ts stageForProcess and COMMERCIAL_STAGES',
    'lib/intake/shared.ts clampText and intakeSourceLabels',
    'lib/workspace/catalogue.ts getSystem and systemFitsCompany',
  ],
  refuses: ['portal_publish', 'commission_calculation', 'legal_determination', 'head_office_substitution', 'external_send'],
} as const
