export type Stage = { key: string; label: string }

export const COMMERCIAL_STAGES: Stage[] = [
  { key: 'intake', label: 'Intake' },
  { key: 'qualify', label: 'Qualify' },
  { key: 'match', label: 'Match' },
  { key: 'negotiate', label: 'Negotiate' },
  { key: 'document', label: 'Documents' },
  { key: 'execute', label: 'Execute' },
  { key: 'close', label: 'Close' },
]

export const FINANCE_STAGES: Stage[] = [
  { key: 'capture', label: 'Capture' },
  { key: 'prepare', label: 'Prepare' },
  { key: 'approve', label: 'Approve' },
  { key: 'release', label: 'Release' },
  { key: 'reconcile', label: 'Reconcile' },
  { key: 'report', label: 'Report' },
]

export function stageForProcess(title: string, templateSlug: string | null, kind: 'commercial' | 'finance') {
  const text = `${title} ${templateSlug ?? ''}`.toLowerCase()
  if (kind === 'finance') {
    if (/reconcil|vat|month/.test(text)) return 'reconcile'
    if (/payment|release|bank/.test(text)) return 'approve'
    if (/invoice|bill/.test(text)) return 'prepare'
    return 'capture'
  }
  if (/close|paid|sold|transfer/.test(text)) return 'close'
  if (/document|otp|contract|mandate/.test(text)) return 'document'
  if (/match|view|quote/.test(text)) return 'match'
  if (/lead|intake|enquiry/.test(text)) return 'intake'
  if (/negotiat|offer/.test(text)) return 'negotiate'
  if (/listing|active|process/.test(text)) return 'qualify'
  return 'qualify'
}
