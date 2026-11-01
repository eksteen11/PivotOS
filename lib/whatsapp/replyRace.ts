import { clampText } from '@/lib/intake/shared'

export type ReplyRaceWarning = {
  active: true
  arrivedAt: string
  preview: string
  message: string
  requiresReview: true
}

export type ReplyRaceClear = {
  active: false
}

/** Warn if a newer inbound arrives while a draft is being prepared. */
export function detectReplyRace(input: {
  draftStartedAt: string
  latestInboundAt: string | null
  latestInboundPreview?: string
}): ReplyRaceWarning | ReplyRaceClear {
  if (!input.latestInboundAt) return { active: false }
  const draftAt = Date.parse(input.draftStartedAt)
  const inboundAt = Date.parse(input.latestInboundAt)
  if (!Number.isFinite(draftAt) || !Number.isFinite(inboundAt) || inboundAt <= draftAt) {
    return { active: false }
  }
  return {
    active: true,
    arrivedAt: input.latestInboundAt,
    preview: clampText(input.latestInboundPreview ?? '', 280),
    message: 'A newer message arrived while this reply was being prepared. Review the latest conversation before sending.',
    requiresReview: true,
  }
}

export function canProceedAfterRace(warning: ReplyRaceWarning | ReplyRaceClear, reviewedLatest: boolean) {
  if (!warning.active) return true
  return reviewedLatest
}
