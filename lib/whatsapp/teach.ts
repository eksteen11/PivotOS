import { clampText } from '@/lib/intake/shared'
import { isWhatsappContext, type WhatsappContext } from './contexts'

export type TeachMemoryKind =
  | 'relationship'
  | 'communication-preference'
  | 'tone'
  | 'handling-instruction'
  | 'goal'
  | 'fact'

export type TeachMemorySource = 'explicit-teaching' | 'draft-correction' | 'ai-suggestion'

export type TeachMemoryEntry = {
  id: string
  contactKey: string
  context: WhatsappContext | null
  kind: TeachMemoryKind
  body: string
  source: TeachMemorySource
  confirmed: boolean
  createdAt: string
  updatedAt: string
  supersededBy: string | null
  active: boolean
}

export type TeachSession = {
  id: string
  contactKey: string
  startedAt: string
  mode: 'voice' | 'text' | 'correction'
  notes: string
  followUps: string[]
  entries: TeachMemoryEntry[]
}

export function startTeachPivotSession(input: {
  id: string
  contactKey: string
  startedAt: string
  mode?: 'voice' | 'text' | 'correction'
}): TeachSession {
  return {
    id: input.id,
    contactKey: input.contactKey.replace(/\D/g, ''),
    startedAt: input.startedAt,
    mode: input.mode ?? 'text',
    notes: '',
    followUps: [
      'What is the relationship and why does it matter?',
      'Which company or private context should this knowledge live in?',
      'How should Pivot sound and what should it avoid?',
      'Any standing handling instructions for future drafts?',
    ],
    entries: [],
  }
}

export function rememberTeachEntry(input: {
  id: string
  contactKey: string
  context?: string | null
  kind: TeachMemoryKind
  body: string
  source: TeachMemorySource
  at: string
  confirmed?: boolean
}): { ok: true; entry: TeachMemoryEntry } | { ok: false; error: string } {
  const contactKey = input.contactKey.replace(/\D/g, '')
  if (!contactKey) return { ok: false, error: 'A contact is required to remember teaching.' }
  const body = clampText(input.body, 4_000)
  if (!body) return { ok: false, error: 'Write what Pivot should remember.' }
  const context = input.context == null || input.context === ''
    ? null
    : isWhatsappContext(input.context)
      ? input.context
      : null
  if (input.context && !context) return { ok: false, error: 'Choose a known WhatsApp context, or leave it unset.' }
  const confirmed = input.source === 'ai-suggestion' ? false : input.confirmed !== false
  return {
    ok: true,
    entry: {
      id: input.id,
      contactKey,
      context,
      kind: input.kind,
      body,
      source: input.source,
      confirmed,
      createdAt: input.at,
      updatedAt: input.at,
      supersededBy: null,
      active: true,
    },
  }
}

/** Draft corrections may auto-remember communication preferences with undo. */
export function rememberFromDraftCorrection(input: {
  id: string
  contactKey: string
  context?: string | null
  preference: string
  at: string
}) {
  return rememberTeachEntry({
    id: input.id,
    contactKey: input.contactKey,
    context: input.context,
    kind: 'communication-preference',
    body: input.preference,
    source: 'draft-correction',
    at: input.at,
    confirmed: true,
  })
}

export function undoTeachMemory(
  entries: TeachMemoryEntry[],
  entryId: string,
  at: string,
): TeachMemoryEntry[] {
  return entries.map((entry) => {
    if (entry.id !== entryId) return entry
    return { ...entry, active: false, updatedAt: at, supersededBy: entry.supersededBy }
  })
}

export function editTeachMemory(
  entries: TeachMemoryEntry[],
  entryId: string,
  body: string,
  at: string,
): { ok: true; entries: TeachMemoryEntry[] } | { ok: false; error: string } {
  const nextBody = clampText(body, 4_000)
  if (!nextBody) return { ok: false, error: 'Memory text cannot be empty.' }
  let found = false
  const next = entries.map((entry) => {
    if (entry.id !== entryId || !entry.active) return entry
    found = true
    return { ...entry, body: nextBody, updatedAt: at, source: entry.source === 'ai-suggestion' ? 'explicit-teaching' as const : entry.source, confirmed: true }
  })
  if (!found) return { ok: false, error: 'That memory entry is not active.' }
  return { ok: true, entries: next }
}

export function activeTeachMemory(entries: TeachMemoryEntry[], contactKey: string, context?: WhatsappContext | null) {
  const key = contactKey.replace(/\D/g, '')
  return entries.filter((entry) => {
    if (!entry.active || entry.contactKey !== key) return false
    if (context == null) return true
    return entry.context == null || entry.context === context
  })
}

export function teachPivotLabel() {
  return 'Teach Pivot'
}
