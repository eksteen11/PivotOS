import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeachMemoryEntry } from './teach'
import type { WhatsappMediaRecord } from './media'
import type { WhatsappConversation } from './conversations'

export function teachEntryToRow(ownerId: string, entry: TeachMemoryEntry) {
  return {
    id: entry.id,
    owner_id: ownerId,
    contact_key: entry.contactKey,
    context: entry.context,
    kind: entry.kind,
    body: entry.body,
    source: entry.source,
    confirmed: entry.confirmed,
    active: entry.active,
    superseded_by: entry.supersededBy,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  }
}

export function teachRowToEntry(row: Record<string, unknown>): TeachMemoryEntry {
  return {
    id: String(row.id),
    contactKey: String(row.contact_key ?? ''),
    context: (row.context as TeachMemoryEntry['context']) ?? null,
    kind: row.kind as TeachMemoryEntry['kind'],
    body: String(row.body ?? ''),
    source: row.source as TeachMemoryEntry['source'],
    confirmed: Boolean(row.confirmed),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
    supersededBy: row.superseded_by ? String(row.superseded_by) : null,
    active: Boolean(row.active),
  }
}

export function mediaRecordToRow(record: WhatsappMediaRecord) {
  return {
    id: record.id,
    owner_id: record.ownerId,
    message_id: null,
    contact_key: record.contactKey,
    mime_type: record.mimeType,
    kind: record.kind,
    storage_path: record.storagePath,
    bucket: record.bucket,
    privacy: record.privacy,
    retained_independently: record.retainedIndependently,
    drive_copy_status: record.driveCopyStatus,
    created_at: record.createdAt,
  }
}

export async function listTeachMemory(admin: SupabaseClient, ownerId: string, contactKey?: string) {
  let query = admin.from('whatsapp_teach_memory').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false })
  if (contactKey) query = query.eq('contact_key', contactKey.replace(/\D/g, ''))
  const { data, error } = await query
  if (error) return { ok: false as const, error: error.message, entries: [] as TeachMemoryEntry[] }
  return { ok: true as const, entries: (data ?? []).map((row) => teachRowToEntry(row as Record<string, unknown>)) }
}

export async function upsertTeachMemory(admin: SupabaseClient, ownerId: string, entry: TeachMemoryEntry) {
  const { error } = await admin.from('whatsapp_teach_memory').upsert(teachEntryToRow(ownerId, entry), { onConflict: 'id' })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, entry }
}

export async function persistTeachUndo(admin: SupabaseClient, ownerId: string, entryId: string, at: string) {
  const { data, error } = await admin
    .from('whatsapp_teach_memory')
    .update({ active: false, updated_at: at })
    .eq('owner_id', ownerId)
    .eq('id', entryId)
    .select('*')
    .maybeSingle()
  if (error) return { ok: false as const, error: error.message }
  if (!data) return { ok: false as const, error: 'Memory entry not found.' }
  return { ok: true as const, entry: teachRowToEntry(data as Record<string, unknown>) }
}

export async function persistTeachEdit(admin: SupabaseClient, ownerId: string, entryId: string, body: string, at: string) {
  const { data, error } = await admin
    .from('whatsapp_teach_memory')
    .update({ body, updated_at: at, confirmed: true, source: 'explicit-teaching', active: true })
    .eq('owner_id', ownerId)
    .eq('id', entryId)
    .eq('active', true)
    .select('*')
    .maybeSingle()
  if (error) return { ok: false as const, error: error.message }
  if (!data) return { ok: false as const, error: 'Active memory entry not found.' }
  return { ok: true as const, entry: teachRowToEntry(data as Record<string, unknown>) }
}

export async function upsertMediaRecord(admin: SupabaseClient, record: WhatsappMediaRecord) {
  const { error } = await admin.from('whatsapp_media').upsert(mediaRecordToRow(record), { onConflict: 'id' })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, record }
}

export async function markConversationOpened(admin: SupabaseClient, ownerId: string, conversation: WhatsappConversation, openedAt: string) {
  const row = {
    id: conversation.id,
    owner_id: ownerId,
    kind: conversation.kind,
    contact_key: conversation.contactKey,
    display_name: conversation.displayName,
    group_id: conversation.groupId,
    context: conversation.context,
    privacy: conversation.privacy,
    unread_count: 0,
    opened_at: openedAt,
    read_at: openedAt,
    group_support: conversation.groupSupport === 'supported' ? 'supported' : conversation.kind === 'group' ? 'not-supported' : 'n/a',
    sync_note: conversation.syncNote,
    updated_at: openedAt,
  }
  const { error } = await admin.from('whatsapp_conversations').upsert(row, { onConflict: 'id' })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}

/** Media bytes are not downloaded without live provider media tokens. Reserve path only. */
export function mediaDownloadStatus(accessTokenPresent: boolean) {
  if (!accessTokenPresent) {
    return {
      status: 'disconnected' as const,
      detail: 'Media download requires WHATSAPP_ACCESS_TOKEN and a provider media id. Path is reserved in private whatsapp-media storage; bytes are not fetched yet.',
    }
  }
  return {
    status: 'ready-to-fetch' as const,
    detail: 'Credentials present locally. Fetch remains unexecuted until authorized live media pipeline runs.',
  }
}
