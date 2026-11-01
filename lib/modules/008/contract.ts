export const module008Integration = {
  moduleId: '008',
  product: 'Pivot OS',
  company: 'digikraal',
  identity: 'DigiKraal strategic growth, capital and venture governance. Internal module, not a separate app.',
  storage: 'No schema in this slice. Persist only after the CEO assigns a shared writer.',
  auth: 'Use the existing founder boundary. This module does not sign anyone in.',
  privacy: 'Show a record only when the company is DigiKraal.',
  approval: 'Capital release needs a formal approval from ITS, CJ du Plessis and DJ Eksteen. A recorded decision is not a transfer.',
  segregation: 'The requester cannot be the sole verifier. An automated actor cannot approve.',
  evidence: 'Signed documents and verified statements are graded apart from pipeline, forecast, spreadsheets, planning notes and WhatsApp.',
  fundingStop: 'Overdue reporting, stock counts, reconciliations or control conditions stop funding until evidence or a recorded unanimous override.',
  smePolicy: 'Ubuntu capital stays stopped while the SME risk policy is unresolved or is only a draft that assigns losses to the SME.',
  score: '008-portfolio-score-v1 informs ranking only. It is not an approved credit model and does not release capital.',
  execution: 'Transfer, investment and distribution are refused. No bank or CIPC action is taken.',
  external: 'No bank, CIPC, investor, email, WhatsApp or payment call is made.',
  agreement: 'The signed shareholder agreement remains authoritative. These checks are the configured gate, not legal advice.',
} as const

export const wrongLaneMessage = 'Module 008 records DigiKraal strategic growth and capital only.'
