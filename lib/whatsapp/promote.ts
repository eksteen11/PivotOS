import type { Company } from '@/lib/workspace/catalogue'
import type { WorkCase } from '@/lib/workspace/model'
import { companyForWhatsappContext } from './contexts'
import type { IntakeItem, IntakeSuggestion } from './intake'

export type PromotedWorkDraft = {
  workId: string
  company: Company
  systemId: string
  title: string
  notes: string
  kind: WorkCase['kind']
  source: string
  evidence: {
    intakeItemId: string
    suggestionId: string
    providerMessageId: string
    provenance: IntakeItem['provenance']
  }
}

/** Stable work id from suggestion id — safe create retries / duplicate prevention. */
export function workIdForIntakeSuggestion(suggestionId: string) {
  return suggestionId
}

export function promoteApprovedSuggestion(
  item: IntakeItem,
  suggestion: IntakeSuggestion,
  at: string,
): { ok: true; draft: PromotedWorkDraft } | { ok: false; error: string } {
  if (suggestion.status !== 'approved') return { ok: false, error: 'Only approved suggestions become shared work drafts.' }
  if (suggestion.workItemId) {
    return {
      ok: true,
      draft: {
        workId: suggestion.workItemId,
        company: companyForWhatsappContext(item.context || suggestion.context || 'digikraal') || 'digikraal',
        systemId: systemForSuggestion(suggestion),
        title: suggestion.title,
        notes: suggestion.summary,
        kind: suggestion.kind === 'livestock-listing' ? 'work' : 'task',
        source: 'WhatsApp intake approval',
        evidence: {
          intakeItemId: item.id,
          suggestionId: suggestion.id,
          providerMessageId: item.providerMessageId,
          provenance: item.provenance,
        },
      },
    }
  }
  if (suggestion.kind === 'context') return { ok: false, error: 'Context suggestions do not create work records.' }
  const context = item.context || suggestion.context
  if (!context) return { ok: false, error: 'Approve a business context before creating shared work from this suggestion.' }
  const company = companyForWhatsappContext(context)
  if (!company) return { ok: false, error: 'Lebab context stays founder-private until a company mapping exists. Choose DigiKraal, Farm Feed, Northpoint or DJ Eksteen private.' }
  const systemId = systemForSuggestion(suggestion)
  const provenanceLines = [
    `Intake item ${item.id}`,
    `Provider message ${item.providerMessageId}`,
    item.provenance.claimedForward ? 'Claimed forward: yes' : 'Claimed forward: no',
    `Original group: ${item.provenance.originalGroupName || 'unknown (not invented)'}`,
    `Original sender: ${item.provenance.originalSenderName || item.provenance.originalSenderE164 || 'unknown (not invented)'}`,
    item.provenance.notes ? `Notes: ${item.provenance.notes}` : '',
    '',
    suggestion.summary,
    '',
    `Source body: ${item.body || '(no text)'}`,
    `Approved suggestion at ${at}. No external send or listing publish was executed.`,
  ].filter(Boolean)
  return {
    ok: true,
    draft: {
      workId: workIdForIntakeSuggestion(suggestion.id),
      company,
      systemId,
      title: suggestion.title.slice(0, 180),
      notes: provenanceLines.join('\n').slice(0, 12_000),
      kind: suggestion.kind === 'livestock-listing' || suggestion.kind === 'deal' || suggestion.kind === 'lead' ? 'work' : 'task',
      source: 'WhatsApp intake approval',
      evidence: {
        intakeItemId: item.id,
        suggestionId: suggestion.id,
        providerMessageId: item.providerMessageId,
        provenance: item.provenance,
      },
    },
  }
}

function systemForSuggestion(suggestion: IntakeSuggestion) {
  if (suggestion.kind === 'livestock-listing') return '005'
  if (suggestion.kind === 'lead' || suggestion.kind === 'deal') {
    if (suggestion.context === 'northpoint') return '003'
    if (suggestion.context === 'farm-feed') return '004'
    return '005'
  }
  return '005'
}

export function workCaseFromPromotion(
  draft: PromotedWorkDraft,
  entityId: string,
  at: string,
): WorkCase {
  return {
    id: draft.workId,
    entityId,
    company: draft.company,
    systemId: draft.systemId,
    title: draft.title,
    notes: draft.notes,
    due: '',
    status: 'planned',
    source: draft.source,
    updatedAt: at,
    facts: {
      'Intake item': draft.evidence.intakeItemId,
      'Provider message': draft.evidence.providerMessageId,
      'Original group': draft.evidence.provenance.originalGroupName || 'unknown',
      'Original sender': draft.evidence.provenance.originalSenderName || draft.evidence.provenance.originalSenderE164 || 'unknown',
    },
    checked: [],
    history: [{ at, text: 'Created from approved WhatsApp intake suggestion. Source evidence retained. Nothing sent or published externally.' }],
    lessons: [],
    kind: draft.kind,
    intake: {
      sourceCaptureId: draft.evidence.intakeItemId,
      proposalKind: draft.kind,
      externalBlocked: true,
    },
  }
}
