import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseUrl } from '@/lib/env'
import { inboundRowsFromWebhook, type WhatsappMessageRow } from './persist'
import { parseWhatsappWebhook, type ParsedWhatsappWebhook } from './webhook'

export function whatsappAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key || !supabaseUrl) return null
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(20_000) }) },
  })
}

export async function persistWebhookPayload(
  admin: SupabaseClient,
  ownerId: string,
  payloadOrParsed: unknown | ParsedWhatsappWebhook,
) {
  const parsed = isParsedWebhook(payloadOrParsed) ? payloadOrParsed : parseWhatsappWebhook(payloadOrParsed)
  const rows = inboundRowsFromWebhook(ownerId, parsed)
  if (!rows.length) return { stored: 0, skipped: true as const, phoneNumberId: parsed.phoneNumberId }
  const { error } = await admin.from('whatsapp_messages').upsert(rows, {
    onConflict: 'owner_id,provider_message_id',
    ignoreDuplicates: true,
  })
  if (error) {
    if (/relation .*whatsapp_messages.* does not exist|Could not find the table/i.test(error.message)) {
      return { stored: 0, skipped: true as const, missingTable: true as const, phoneNumberId: parsed.phoneNumberId, error: error.message }
    }
    return { stored: 0, skipped: false as const, phoneNumberId: parsed.phoneNumberId, error: error.message }
  }
  return { stored: rows.length, skipped: false as const, phoneNumberId: parsed.phoneNumberId, rows: rows as WhatsappMessageRow[] }
}

function isParsedWebhook(value: unknown): value is ParsedWhatsappWebhook {
  return Boolean(
    value
    && typeof value === 'object'
    && 'phoneNumberId' in value
    && 'messages' in value
    && Array.isArray((value as ParsedWhatsappWebhook).messages),
  )
}
