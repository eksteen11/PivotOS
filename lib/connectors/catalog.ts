export type ConnectorStatus = 'disconnected' | 'connecting' | 'connected' | 'syncing' | 'failed'

export type ConnectorDefinition = {
  slug: string
  name: string
  provider: string
  category: string
  defaultStatus: ConnectorStatus
  lastActivity: string
  incomingExample: string
  outgoingExample: string
  requiresApproval: boolean
}

export const CONNECTORS: ConnectorDefinition[] = [
  { slug: 'whatsapp', name: 'WhatsApp Business', provider: 'Meta', category: 'messaging', defaultStatus: 'disconnected', lastActivity: 'Awaiting Business API credentials', incomingExample: 'Lead conversation', outgoingExample: 'Approved reply', requiresApproval: true },
  { slug: 'gmail', name: 'Gmail', provider: 'Google', category: 'email', defaultStatus: 'disconnected', lastActivity: 'Mailbox not linked', incomingExample: 'Triaged email', outgoingExample: 'Approved send', requiresApproval: true },
  { slug: 'google_calendar', name: 'Google Calendar', provider: 'Google', category: 'calendar', defaultStatus: 'disconnected', lastActivity: 'No calendar sync', incomingExample: 'Meeting invite', outgoingExample: 'Create event', requiresApproval: true },
  { slug: 'google_drive', name: 'Google Drive', provider: 'Google', category: 'storage', defaultStatus: 'disconnected', lastActivity: 'No folder linked', incomingExample: 'Document metadata', outgoingExample: 'Attach file link', requiresApproval: false },
  { slug: 'xero', name: 'Xero', provider: 'Xero', category: 'finance', defaultStatus: 'disconnected', lastActivity: 'Ledger offline', incomingExample: 'Invoice draft', outgoingExample: 'Post invoice draft', requiresApproval: true },
  { slug: 'sage', name: 'Sage', provider: 'Sage', category: 'finance', defaultStatus: 'disconnected', lastActivity: 'Farm Feed ledger offline', incomingExample: 'Bill draft', outgoingExample: 'Post bill draft', requiresApproval: true },
  { slug: 'banking', name: 'Banking Exports', provider: 'FNB / Capitec', category: 'finance', defaultStatus: 'disconnected', lastActivity: 'CSV import not connected', incomingExample: 'Transaction export', outgoingExample: 'Payment batch', requiresApproval: true },
  { slug: 'airtable', name: 'Airtable', provider: 'Airtable', category: 'data', defaultStatus: 'disconnected', lastActivity: 'Migration snapshot available', incomingExample: 'Deal rows', outgoingExample: 'Write-back blocked', requiresApproval: true },
  { slug: 'propverse', name: 'Propverse', provider: 'Propverse', category: 'property', defaultStatus: 'disconnected', lastActivity: 'CRM mirror pending', incomingExample: 'Listing enquiry', outgoingExample: 'Listing update', requiresApproval: true },
  { slug: 'property24', name: 'Property24', provider: 'Property24', category: 'listings', defaultStatus: 'disconnected', lastActivity: 'Publish checklist only', incomingExample: 'Portal lead', outgoingExample: 'Listing publish', requiresApproval: true },
  { slug: 'marketplace', name: 'Digikraal Marketplace', provider: 'digikraal.co.za', category: 'commerce', defaultStatus: 'disconnected', lastActivity: 'Webhook placeholder', incomingExample: 'Website offer', outgoingExample: 'Listing sync', requiresApproval: true },
  { slug: 'paystack', name: 'Paystack', provider: 'Paystack', category: 'payments', defaultStatus: 'disconnected', lastActivity: 'Subscription monitor idle', incomingExample: 'Payment event', outgoingExample: 'Refund (blocked)', requiresApproval: true },
  { slug: 'jira', name: 'Jira', provider: 'Atlassian', category: 'delivery', defaultStatus: 'disconnected', lastActivity: 'Ticket mirror idle', incomingExample: 'Sprint tickets', outgoingExample: 'Create ticket draft', requiresApproval: true },
  { slug: 'github', name: 'GitHub', provider: 'GitHub', category: 'delivery', defaultStatus: 'disconnected', lastActivity: 'Repo watch idle', incomingExample: 'PR status', outgoingExample: 'Comment draft', requiresApproval: true },
  { slug: 'confluence', name: 'Confluence', provider: 'Atlassian', category: 'docs', defaultStatus: 'disconnected', lastActivity: 'Docs mirror idle', incomingExample: 'Page summary', outgoingExample: 'Publish draft', requiresApproval: true },
]

export function getConnector(slug: string) {
  return CONNECTORS.find((c) => c.slug === slug)
}
