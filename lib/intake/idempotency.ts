export function sourceIdMatchesIntake(existingMeta: Record<string, unknown> | null | undefined, idempotencyKey: string) {
  if (!existingMeta) return false
  if (Number(existingMeta.intake_version ?? 0) !== 1) return false
  const key = String(existingMeta.idempotency_key ?? '')
  return Boolean(key) && key === idempotencyKey
}

export function proposalBelongsToIntake(existingMeta: Record<string, unknown> | null | undefined, sourceCaptureId: string) {
  const intake = (existingMeta?.intake as Record<string, unknown> | undefined) ?? {}
  return String(intake.source_capture_id ?? '') === sourceCaptureId
}
