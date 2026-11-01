export {
  companyForWhatsappContext,
  isFounderPrivateContext,
  isWhatsappContext,
  whatsappContextLabels,
  whatsappContexts,
} from './contexts'
export type { WhatsappContext } from './contexts'
export {
  assignInboundContext,
  captureInboundMessage,
} from './inbound'
export type { WhatsappInboundInput, WhatsappInboundMessage, WhatsappInboundStatus, WhatsappMediaKind } from './inbound'
export {
  approveWhatsappReply,
  draftWhatsappReply,
  sendWhatsappReply,
} from './outbound'
export type { WhatsappApprovedSend, WhatsappOutboundDraft } from './outbound'
export {
  WHATSAPP_FOUNDER_E164,
  WHATSAPP_FOUNDER_DIGITS,
  WHATSAPP_PRODUCTION_ORIGIN,
  WHATSAPP_WEBHOOK_PATH,
  normalizeWhatsappE164,
  readWhatsappChannelConfig,
  webhookCallbackUrl,
} from './config'
export {
  inboundRowsFromWebhook,
  privacyForContext,
  rowFromInbound,
  visibleWhatsappMessage,
} from './persist'
export type { WhatsappMessageRow } from './persist'
export {
  buildWhatsappReadiness,
  readWhatsappEnvPresence,
  recommendCoexistenceRoute,
} from './readiness'
export type { WhatsappEnvPresence, WhatsappProviderStatus, WhatsappReadinessCheck } from './readiness'
export {
  assertWhatsappWebhookBinding,
  parseWhatsappWebhook,
  verifyWhatsappChallenge,
  verifyWhatsappSignature,
  WHATSAPP_WEBHOOK_MAX_BODY_BYTES,
  WHATSAPP_WEBHOOK_MAX_MESSAGES,
} from './webhook'
export type { ParsedWhatsappWebhook } from './webhook'
export {
  authorizeWhatsappWebhookPost,
  handleWhatsappChallenge,
} from './webhookHandlers'
export {
  acceptanceGateBlockers,
  capabilityById,
  groupsCoexistenceSupported,
  whatsappOfficialCapabilities,
} from './capabilities'
export type { WhatsappCapability, WhatsappCapabilityStatus } from './capabilities'
export {
  executeMarkConversationRead,
  planMarkConversationRead,
} from './markRead'
export type { WhatsappMarkReadPlan, WhatsappMarkReadRequest } from './markRead'
export {
  listTeachMemory,
  mediaDownloadStatus,
  persistTeachEdit,
  persistTeachUndo,
  teachEntryToRow,
  teachRowToEntry,
  upsertMediaRecord,
  upsertTeachMemory,
} from './store'
export {
  appendThreadMessage,
  buildConversation,
  contactKeyFromE164,
  conversationIdFor,
  conversationStillUnread,
  listConversationsForLens,
  openConversation,
} from './conversations'
export type { WhatsappConversation, WhatsappThreadKind, WhatsappThreadMessage } from './conversations'
export {
  dedupeProviderMessageIds,
  nextWebhookRetry,
  observeWhatsappSync,
} from './sync'
export type { WhatsappSyncObservation, WhatsappSyncState } from './sync'
export {
  activeTeachMemory,
  editTeachMemory,
  rememberFromDraftCorrection,
  rememberTeachEntry,
  startTeachPivotSession,
  teachPivotLabel,
  undoTeachMemory,
} from './teach'
export type { TeachMemoryEntry, TeachMemoryKind, TeachMemorySource, TeachSession } from './teach'
export {
  buildVoiceTranscriptInterfaces,
  transcriptPanels,
} from './transcripts'
export type { VoiceTranscript } from './transcripts'
export {
  WHATSAPP_MEDIA_BUCKET,
  approveDriveCopy,
  approveMediaDerivedDraft,
  createMediaRecord,
  rejectDriveCopy,
  rejectMediaDerivedDraft,
  retainAfterProviderDelete,
  suggestDriveCopy,
  suggestMediaDerivedDraft,
} from './media'
export type { MediaDerivedDraft, MediaDraftKind, WhatsappMediaRecord } from './media'
export {
  canProceedAfterRace,
  detectReplyRace,
} from './replyRace'
export type { ReplyRaceClear, ReplyRaceWarning } from './replyRace'
export {
  connectionsMustNotCollide,
  readWhatsappDualConnections,
  resolveConnectionByPhoneNumberId,
} from './connections'
export type { WhatsappConnectionBinding, WhatsappConnectionRole, WhatsappDualConnectionConfig } from './connections'
export {
  isVerifiedFounderSender,
  readFounderIntakeAllowlist,
  rejectUnknownIntakeSender,
} from './allowlist'
export type { VerifiedSender } from './allowlist'
export {
  addIntakeSuggestion,
  approveIntakeContext,
  applyProvenanceAnswer,
  captureIntakeItem,
  completeIntakeNeedsAction,
  decideIntakeSuggestion,
  emptyProvenance,
  linkIntakeItems,
  markIntakeRead,
  mergeIntakeIdempotent,
  suggestIntakeContext,
} from './intake'
export type { IntakeItem, IntakeProvenance, IntakeSuggestion } from './intake'
export {
  answerClarification,
  buildClarificationState,
  classifyIntakeReply,
  isOwnClarificationEcho,
  openClarificationQuestion,
  registerClarificationOutbound,
} from './clarification'
export type { ClarificationChannel, ClarificationQuestion, ClarificationState } from './clarification'
export {
  advanceFounderClarificationOutbox,
  planFounderClarificationOutbox,
  rejectCustomerOrGroupOutbox,
  simulateFounderClarificationSend,
} from './outbox'
export type { OutboxDraft, OutboxEligibility } from './outbox'
export {
  promoteApprovedSuggestion,
  workCaseFromPromotion,
  workIdForIntakeSuggestion,
} from './promote'
export type { PromotedWorkDraft } from './promote'
export {
  confirmGroupReplySent,
  draftGroupReply,
  markGroupReplyCopied,
} from './groupReply'
export type { GroupReplyDraft } from './groupReply'
