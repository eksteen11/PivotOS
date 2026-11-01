export type WhatsappSyncState =
  | 'disconnected'
  | 'awaiting-credentials'
  | 'webhook-ready'
  | 'syncing'
  | 'in-sync'
  | 'delayed'
  | 'failed'
  | 'retrying'

export type WhatsappSyncObservation = {
  state: WhatsappSyncState
  detail: string
  lastEventAt: string | null
  retryCount: number
  providerConnected: false | true
}

const MAX_RETRIES = 5

/** Honest sync state machine. Never claims connected without credentials + live acceptance. */
export function observeWhatsappSync(input: {
  credentialsPresent: boolean
  tableReady: boolean
  lastEventAt?: string | null
  lastError?: string | null
  retryCount?: number
  now?: string
}): WhatsappSyncObservation {
  const retryCount = Math.max(0, input.retryCount ?? 0)
  if (!input.credentialsPresent) {
    return {
      state: 'awaiting-credentials',
      detail: 'WHATSAPP_* secrets are not configured. Inbox stays local-only.',
      lastEventAt: input.lastEventAt ?? null,
      retryCount: 0,
      providerConnected: false,
    }
  }
  if (!input.tableReady) {
    return {
      state: 'disconnected',
      detail: 'Durable WhatsApp tables are not ready on this project.',
      lastEventAt: input.lastEventAt ?? null,
      retryCount: 0,
      providerConnected: false,
    }
  }
  if (input.lastError) {
    if (retryCount > 0 && retryCount < MAX_RETRIES) {
      return {
        state: 'retrying',
        detail: `Inbound persist failed; retry ${retryCount}/${MAX_RETRIES}. ${input.lastError}`,
        lastEventAt: input.lastEventAt ?? null,
        retryCount,
        providerConnected: true,
      }
    }
    return {
      state: 'failed',
      detail: input.lastError,
      lastEventAt: input.lastEventAt ?? null,
      retryCount,
      providerConnected: true,
    }
  }
  if (!input.lastEventAt) {
    return {
      state: 'webhook-ready',
      detail: 'Webhook path is configured. No inbound event received yet.',
      lastEventAt: null,
      retryCount: 0,
      providerConnected: true,
    }
  }
  const now = Date.parse(input.now ?? new Date().toISOString())
  const last = Date.parse(input.lastEventAt)
  if (Number.isFinite(now) && Number.isFinite(last) && now - last > 15 * 60_000) {
    return {
      state: 'delayed',
      detail: 'Last provider event is older than 15 minutes. Sync may be delayed; do not assume live parity with the phone.',
      lastEventAt: input.lastEventAt,
      retryCount: 0,
      providerConnected: true,
    }
  }
  return {
    state: 'in-sync',
    detail: 'Recent provider events were accepted. Instantaneous phone parity is not promised.',
    lastEventAt: input.lastEventAt,
    retryCount: 0,
    providerConnected: true,
  }
}

export function nextWebhookRetry(retryCount: number) {
  const next = Math.min(MAX_RETRIES, Math.max(0, retryCount) + 1)
  const delayMs = Math.min(60_000, 1_000 * 2 ** Math.min(5, next))
  return { retryCount: next, delayMs, exhausted: next >= MAX_RETRIES }
}

/** Deduplicate provider message ids within a batch and against known ids. */
export function dedupeProviderMessageIds(ids: string[], known: Iterable<string> = []) {
  const seen = new Set(Array.from(known).filter(Boolean))
  const unique: string[] = []
  const duplicates: string[] = []
  for (const id of ids) {
    const key = id.trim()
    if (!key) continue
    if (seen.has(key)) {
      duplicates.push(key)
      continue
    }
    seen.add(key)
    unique.push(key)
  }
  return { unique, duplicates }
}
