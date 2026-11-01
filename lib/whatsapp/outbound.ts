import { clampText } from '@/lib/intake/shared'
import { isWhatsappContext, type WhatsappContext } from './contexts'

export type WhatsappOutboundDraft = {
  id: string
  to: string
  context: WhatsappContext
  body: string
  approved: false
  approvedAt: null
  approvedBy: null
  executes: false
  status: 'draft' | 'awaiting-approval' | 'blocked'
  providerStatus: 'not-connected'
  reason: string
}

export type WhatsappApprovedSend = {
  id: string
  to: string
  context: WhatsappContext
  body: string
  approved: true
  approvedAt: string
  approvedBy: string
  executes: false
  status: 'approved-not-sent'
  providerStatus: 'not-connected'
  reason: string
}

function validPhone(value: string) {
  return /^\d{8,15}$/.test(value)
}

/** Prepare a reply draft. Never sends. */
export function draftWhatsappReply(input: {
  id: string
  to: string
  context: string
  body: string
}): { ok: true; draft: WhatsappOutboundDraft } | { ok: false; error: string } {
  if (!input.id?.trim()) return { ok: false, error: 'A draft id is required.' }
  if (!validPhone(input.to)) return { ok: false, error: 'The recipient number must be digits only, 8 to 15 characters.' }
  if (!isWhatsappContext(input.context)) return { ok: false, error: 'Choose a known WhatsApp context before drafting.' }
  const body = clampText(input.body, 4_000)
  if (!body) return { ok: false, error: 'Write the reply before asking for approval.' }
  return {
    ok: true,
    draft: {
      id: input.id.trim(),
      to: input.to,
      context: input.context,
      body,
      approved: false,
      approvedAt: null,
      approvedBy: null,
      executes: false,
      status: 'awaiting-approval',
      providerStatus: 'not-connected',
      reason: 'Founder approval is required. Nothing has been sent.',
    },
  }
}

/** Record a human approval. Still does not send. */
export function approveWhatsappReply(
  draft: WhatsappOutboundDraft,
  input: { approvedBy: string; approvedAt: string },
): { ok: true; send: WhatsappApprovedSend } | { ok: false; error: string } {
  if (draft.approved || draft.executes) return { ok: false, error: 'This draft is no longer waiting for approval.' }
  if (!input.approvedBy.trim()) return { ok: false, error: 'Name the person approving the reply.' }
  if (!Number.isFinite(Date.parse(input.approvedAt))) return { ok: false, error: 'A real approval time is required.' }
  return {
    ok: true,
    send: {
      id: draft.id,
      to: draft.to,
      context: draft.context,
      body: draft.body,
      approved: true,
      approvedAt: input.approvedAt,
      approvedBy: input.approvedBy.trim(),
      executes: false,
      status: 'approved-not-sent',
      providerStatus: 'not-connected',
      reason: 'Approval is recorded. The Cloud API send path is not connected, so nothing was delivered.',
    },
  }
}

/** Hard refuse any attempt to treat approval as delivery. */
export function sendWhatsappReply(value: WhatsappOutboundDraft | WhatsappApprovedSend): { ok: false; error: string; executes: false } {
  void value
  return { ok: false, executes: false, error: 'Outbound WhatsApp is not connected. Approval does not send a message.' }
}
