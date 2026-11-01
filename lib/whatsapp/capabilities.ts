/**
 * Official Meta WhatsApp capability flags for Pivot acceptance gates.
 * Primary sources (fetched/verified 27 Oct 2026):
 * - Coexistence: developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users (updated Jun 26 2026)
 * - Groups API: developers.facebook.com/documentation/business-messaging/whatsapp/groups (updated Jun 16 2026)
 * - Mark as read: developers.facebook.com/documentation/business-messaging/whatsapp/messages/mark-message-as-read (updated Jul 2 2026)
 * - Linked devices section inside coexistence docs + WhatsApp Help “linked devices”
 */

export type WhatsappCapabilityStatus =
  | 'supported'
  | 'not-supported'
  | 'unverified'
  | 'local-only'
  | 'blocked-for-acceptance'

export type WhatsappCapability = {
  id: string
  label: string
  status: WhatsappCapabilityStatus
  evidence: string
  productStance: string
  acceptanceGate?: boolean
}

export function whatsappOfficialCapabilities(): WhatsappCapability[] {
  return [
    {
      id: 'one-to-one-coexistence',
      label: '1:1 chats mirrored with Business app',
      status: 'supported',
      evidence: 'Meta coexistence feature table: individual chats supported; recent history sync; messages mirrored between Cloud API and Business app.',
      productStance: 'Primary path for +27827721220 after Pivot OS Tech Provider + Embedded Signup v4.',
    },
    {
      id: 'smb-message-echoes',
      label: 'Business-app outbound echoes',
      status: 'supported',
      evidence: 'Meta coexistence: subscribe smb_message_echoes for messages sent from Business app / supported companions.',
      productStance: 'Digest with provider-id dedupe; show delayed/failed sync honestly.',
    },
    {
      id: 'existing-group-sync-coexistence',
      label: 'Existing Business-app GROUP synchronization into Pivot',
      status: 'not-supported',
      acceptanceGate: false,
      evidence: 'Meta coexistence feature table (Jun 2026): “Group chats — Not supported. Group chats will not be synchronized.” Groups remain usable in the phone app only.',
      productStance: 'Still unsupported — do not claim it works. Limited rollout: groups stay in Business app; selected items manually forwarded to dedicated intake number. Keep limitation visible. Do not share this workaround outside Pivot.',
    },
    {
      id: 'dedicated-intake-forward-workflow',
      label: 'Dedicated intake number + manual forward workflow',
      status: 'local-only',
      evidence: 'Founder revised rollout 27 Oct 2026 (private): new SIM/eSIM intake number; founder allowlist; each forward separate; shared clarification state.',
      productStance: 'Independent engineering path while intake SIM and provider credentials are missing. No live sends.',
    },
    {
      id: 'cloud-groups-api',
      label: 'Cloud API Groups API (new invite-only groups)',
      status: 'not-supported',
      evidence: 'Meta Groups API (Jun 2026): open to Official Business Accounts (OBA); “Groups are not available for WhatsApp Business app phone numbers and phone numbers onboarded to Multi-solution Conversations.” Max 8 participants; invite-link model — not a sync of existing phone groups.',
      productStance: 'Cannot attach to coexistence number. Even on Cloud-API-only OBA numbers it creates NEW small groups; it does not import existing Business-app groups.',
    },
    {
      id: 'phone-unread-clear-on-pivot-open',
      label: 'Clear Business PHONE APP unread when opening a Pivot chat',
      status: 'unverified',
      acceptanceGate: false,
      evidence: 'Meta Mark messages as read API (Jul 2026) marks inbound wamid as read (and earlier in thread) toward the WhatsApp user. Official docs do not state a dedicated “clear Business app unread badge” guarantee. Partner coexistence reports claim API read state can mirror to the phone app unread list — secondary evidence only.',
      productStance: 'Still unverified — do not claim parity. Limited rollout: Pivot Needs action is independent of read/unread. Keep limitation visible.',
    },
    {
      id: 'recipient-read-receipt',
      label: 'Customer-facing read receipt (mark as read)',
      status: 'supported',
      evidence: 'Meta Mark messages as read: POST /{phone-number-id}/messages with status=read + message_id.',
      productStance: 'Supported API once credentials exist; still disabled in Pivot until authorized. Opening Pivot should not auto-fire without founder-approved unread policy.',
    },
    {
      id: 'official-linked-companions',
      label: 'Official WhatsApp linked companion devices',
      status: 'supported',
      evidence: 'Meta coexistence Linked devices: up to four companions; Windows/WearOS unsupported. Onboarding unlinks companions; supported ones may be re-linked. Companions are WhatsApp clients, not a server Groups API.',
      productStance: 'Useful for human multi-device use of the Business app. NOT a supported architecture for Pivot server-side group sync or unread control. Relinking does not give Pivot webhooks for groups.',
    },
    {
      id: 'unofficial-linked-device-bridge',
      label: 'Unofficial linked-device / web scrape bridge',
      status: 'not-supported',
      evidence: 'No Meta developer API authorizes automating WhatsApp Web/companion sessions for server ingestion. Violates Platform Terms risk; ban/number-loss risk; privacy exposure of full session.',
      productStance: 'Rejected. Do not install, recommend, or silently adopt.',
    },
    {
      id: 'history-sync',
      label: 'History synchronisation (1:1)',
      status: 'supported',
      evidence: 'Meta coexistence history webhook / smb_app_data history sync for 1:1; groups excluded.',
      productStance: 'Import only provider-delivered 1:1 history.',
    },
  ]
}

export function capabilityById(id: string) {
  return whatsappOfficialCapabilities().find((row) => row.id === id) ?? null
}

export function groupsCoexistenceSupported() {
  return capabilityById('existing-group-sync-coexistence')?.status === 'supported'
}

export function acceptanceGateBlockers() {
  return whatsappOfficialCapabilities().filter((row) => row.acceptanceGate && row.status !== 'supported')
}
