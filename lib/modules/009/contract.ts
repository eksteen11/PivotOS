/** Capability 009 stays inside Pivot OS. It is not a separate finance app and not a statutory ledger. */
export const MODULE_009_ID = '009' as const

export const module009Integration = {
  moduleId: MODULE_009_ID,
  product: 'Pivot OS',
  name: 'Finance, treasury and corporate administration',
  surface: 'internal',
  sharedFinanceWorkspace: 'Clark',
  statutoryLedgers: {
    digikraal: 'xero',
    'dk-agri': 'xero',
    'farm-feed': 'sage',
  },
  storage: 'No schema in this slice. Persist finance records only after the CEO assigns a shared writer.',
  auth: 'Use the existing founder boundary. This module does not sign anyone in or grant a finance role.',
  privacy: 'A founder note stays off the shared finance view. Shared company records are not stored only here.',
  approval: 'A recorded decision is not a ledger post and not a bank release.',
  audit: 'If the audit record cannot be kept, accounting approval and payment preparation stop.',
  evidence: 'Forecast, accrual and cash-backed amounts stay separate. Unknown is not zero. Demo is not live.',
  ledgerWrite: false,
  paymentExecution: false,
  bankRelease: 'The bank releases money. This module can prepare an instruction and note external evidence.',
  payroll: 'Payroll authority is not confirmed. No payroll integration is claimed.',
  external: 'No bank, Xero, Sage, SARS, email or WhatsApp call is made.',
  formula: '009-finance-control-v1',
} as const

export const payrollDiscovery = {
  authorityConfirmed: false,
  integrationClaimed: false,
} as const

export function refuseLedgerWrite(): { ok: false; ledgerWrite: false; error: string } {
  return { ok: false, ledgerWrite: false, error: 'Xero or Sage keeps the statutory ledger. This module does not post.' }
}

export function refuseBankRelease(): { ok: false; released: false; paymentExecuted: false; error: string } {
  return { ok: false, released: false, paymentExecuted: false, error: 'The bank releases money. Approval does not pay.' }
}
