import { actionPlanNextMove, readActionPlan } from '@/lib/workspace/actionPlan'
import { companies } from '@/lib/workspace/catalogue'
import type { WorkCase } from '@/lib/workspace/model'
import {
  founderDomains,
  restrictedFounderDomains,
  type FounderAcceptance,
  type FounderCommandView,
  type FounderDomain,
  type FounderLens,
  type FounderNextAction,
  type FounderPrivacy,
  type FounderProposal,
  type FounderQueueItem,
  type FounderSignal,
  type FounderUrgency,
  type NextActionKind,
  type ProposalKind,
} from './contract'

const lenses: readonly FounderLens[] = ['founder', 'digikraal', 'farm-feed', 'northpoint']
const urgencies: readonly FounderUrgency[] = ['now', 'today', 'later']
const proposalKinds: readonly ProposalKind[] = ['reply', 'task', 'deal', 'payment', 'meeting', 'invoice', 'debt', 'archive']
const moneyKinds = new Set<ProposalKind>(['payment', 'invoice', 'debt'])
const forbiddenButton = /^(send|pay|release payment|auto-send|execute|post payment)\b/i
const claimedExecution = /(?<!nothing )(?<!not )(?<!does not )(?<!will not )\b(has been sent|was sent|payment released|has been paid|agent executed)\b/i
const urgencyRank = { now: 0, today: 1, later: 2 }

export function founderToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export function signalFromWork(
  work: Pick<WorkCase, 'id' | 'title' | 'company' | 'due' | 'status' | 'updatedAt' | 'checked' | 'plan'>,
  input: { domain: FounderDomain; privacy: FounderPrivacy; urgency?: FounderUrgency; moneyRisk?: boolean; relationshipRisk?: boolean; proposal?: FounderProposal },
): FounderSignal {
  return {
    id: work.id,
    title: work.title,
    domain: input.domain,
    privacy: isRestricted(input.domain) ? 'founder-private' : input.privacy,
    company: work.company,
    updatedAt: work.updatedAt,
    ...(work.due ? { due: work.due } : {}),
    urgency: input.urgency ?? 'today',
    moneyRisk: input.moneyRisk ?? false,
    relationshipRisk: input.relationshipRisk ?? false,
    work: { status: work.status, checked: work.checked, ...(work.plan ? { plan: work.plan } : {}) },
    ...(input.proposal ? { proposal: input.proposal } : {}),
  }
}

export function buildFounderCommand(input: readonly FounderSignal[], lens: FounderLens, today: string): FounderCommandView {
  const { accepted, rejections } = normalise(input)
  const visible = accepted.filter((signal) => showsOnLens(signal, lens))
  const byId = new Map(visible.map((signal) => [signal.id, signal]))
  const ranked = rank(visible.map(toItem), byId, today)
  const needsYou = ranked.filter((item) => item.band <= 3)
  const ready = ranked.filter((item) => item.band === 4)
  const leverage = ready.slice(0, 3)
  const communications = visible.filter((signal) => signal.domain === 'communications')
  const waiting = communications.filter((signal) => bandFor(signal, resolveNext(signal)) <= 3).length
  return {
    moduleId: '002',
    lens,
    today,
    focus: needsYou[0] ?? leverage[0] ?? null,
    needsYou,
    leverage,
    parkedCount: Math.max(0, ready.length - leverage.length),
    bottleneck: waiting
      ? { label: 'Communications still need a decision', count: waiting }
      : { label: communications.length ? 'No communication is waiting on you' : 'WhatsApp and email are not connected', count: 0 },
    clearedCount: visible.filter((signal) => resolveNext(signal).kind === 'none').length,
    hiddenPrivateCount: lens === 'founder' ? 0 : input.filter(isPrivate).length,
    rejections,
    providerStatus: 'not-connected',
  }
}

export function acceptFounderCommand(input: readonly FounderSignal[], lens: FounderLens, today: string): FounderAcceptance {
  return auditFounderCommand(buildFounderCommand(input, lens, today), input, lens, today)
}

export function auditFounderCommand(view: FounderCommandView, input: readonly FounderSignal[], lens: FounderLens, today: string): FounderAcceptance {
  const violations: string[] = []
  if (!validDay(today)) violations.push('today must be a real YYYY-MM-DD date')
  if (view.lens !== lens || view.moduleId !== '002' || view.providerStatus !== 'not-connected') violations.push('view identity does not match module 002')
  if (view.leverage.length > 3) violations.push('leverage is capped at 3')
  const needs = new Set(view.needsYou.map((item) => item.id))
  if (view.leverage.some((item) => needs.has(item.id))) violations.push('needs-you and leverage must be different items')
  if ((view.focus?.id ?? null) !== (view.needsYou[0]?.id ?? view.leverage[0]?.id ?? null)) violations.push('focus must be the first explicit next action')
  for (const item of [...view.needsYou, ...view.leverage]) {
    if (!item.next.label || !item.next.detail || !item.next.button) violations.push(`${item.id} is missing an explicit next action`)
    if (item.next.executes !== false) violations.push(`${item.id} claims execution`)
    if (item.next.kind === 'none') violations.push(`${item.id} is cleared and must stay out of the queues`)
    if (forbiddenButton.test(item.next.button) || claimedExecution.test(`${item.next.detail} ${item.next.button}`)) violations.push(`${item.id} claims a send, payment or agent execution`)
    if ((item.next.kind === 'approve' || item.next.kind === 'evidence') && !/does not|will not/i.test(item.next.detail)) violations.push(`${item.id} must say approval does not send or pay`)
  }
  if (lens !== 'founder') {
    const leaked = [...view.needsYou, ...view.leverage, ...(view.focus ? [view.focus] : [])].filter((item) => item.privacy !== 'company-visible' || isRestricted(item.domain) || item.company !== lens)
    if (leaked.length) violations.push('company lens contains a private or other-company record')
    const rendered = JSON.stringify({ needsYou: view.needsYou, leverage: view.leverage, focus: view.focus })
    if (input.filter(isPrivate).some((signal) => signal.title && rendered.includes(signal.title))) violations.push('company lens renders a private title')
  }
  for (const signal of input) {
    if (!signal) continue
    if (isRestricted(signal.domain) && signal.privacy === 'company-visible') violations.push(`${signal.id} is ${signal.domain} and cannot be company-visible`)
    const cleared = signal.work?.status === 'done' || (signal.proposal?.kind === 'archive' && !signal.work)
    if (cleared && (needs.has(signal.id) || view.leverage.some((item) => item.id === signal.id) || view.focus?.id === signal.id)) violations.push(`${signal.id} is cleared and must stay out of the queues`)
  }
  if (view.rejections.length) violations.push(...view.rejections)
  const again = buildFounderCommand(input, lens, today)
  if (again.needsYou.map((item) => item.id).join() !== view.needsYou.map((item) => item.id).join() || again.leverage.map((item) => item.id).join() !== view.leverage.map((item) => item.id).join()) {
    violations.push('order is not stable')
  }
  return { ok: violations.length === 0, violations }
}

function normalise(input: readonly FounderSignal[]) {
  const accepted: FounderSignal[] = []
  const rejections: string[] = []
  const seen = new Set<string>()
  input.forEach((signal, index) => {
    const reason = rejectReason(signal, seen)
    if (reason) rejections.push(`${signal?.id || index}: ${reason}`)
    else {
      seen.add(signal.id)
      const plan = signal.work?.plan ? readActionPlan(signal.work.plan) : undefined
      accepted.push({
        ...signal,
        privacy: isRestricted(signal.domain) ? 'founder-private' : signal.privacy,
        ...(signal.work ? { work: { ...signal.work, ...(plan ? { plan } : {}) } } : {}),
      })
    }
  })
  return { accepted, rejections }
}

function rejectReason(signal: FounderSignal, seen: Set<string>) {
  if (!signal || typeof signal !== 'object') return 'record is empty'
  if (!signal.id || seen.has(signal.id)) return 'id is missing or duplicated'
  if (!signal.title?.trim() || signal.title.length > 180) return 'title must be 1 to 180 characters'
  if (!founderDomains.includes(signal.domain)) return 'domain is not a founder domain'
  if (signal.privacy !== 'founder-private' && signal.privacy !== 'company-visible') return 'privacy is missing'
  if (!companies.some((company) => company.id === signal.company)) return 'company is not a known business'
  if (!Number.isFinite(Date.parse(signal.updatedAt))) return 'updated time is invalid'
  if (signal.due && !validDay(signal.due)) return 'due date is invalid'
  if (!urgencies.includes(signal.urgency)) return 'urgency is invalid'
  if (typeof signal.moneyRisk !== 'boolean' || typeof signal.relationshipRisk !== 'boolean') return 'risk flags are missing'
  if (signal.work) {
    if (!Array.isArray(signal.work.checked) || signal.work.checked.some((value) => typeof value !== 'number')) return 'checked actions are invalid'
    if (signal.work.plan && !readActionPlan(signal.work.plan)) return 'action plan is invalid'
  }
  if (signal.proposal) {
    if (!proposalKinds.includes(signal.proposal.kind)) return 'proposal kind is invalid'
    if (typeof signal.proposal.consequential !== 'boolean' || typeof signal.proposal.approved !== 'boolean') return 'proposal flags are invalid'
    if (typeof signal.proposal.evidence !== 'string' || signal.proposal.evidence.length > 2000) return 'evidence must be text up to 2,000 characters'
  }
  return ''
}

function showsOnLens(signal: FounderSignal, lens: FounderLens) {
  if (!lenses.includes(lens)) return false
  if (lens === 'founder') return true
  return signal.company === lens && signal.privacy === 'company-visible' && !isRestricted(signal.domain)
}

function isPrivate(signal: FounderSignal) {
  return Boolean(signal) && (signal.privacy !== 'company-visible' || isRestricted(signal.domain))
}

function isRestricted(domain: string) {
  return (restrictedFounderDomains as readonly string[]).includes(domain)
}

function resolveNext(signal: FounderSignal): FounderNextAction {
  const proposal = signal.proposal
  if (proposal?.kind === 'archive' && !signal.work) return { label: 'No action', detail: 'Filed as noise. Nothing was sent.', button: 'Keep filed', kind: 'none', executes: false }
  if (proposal?.consequential && !proposal.approved) {
    if ((moneyKinds.has(proposal.kind) || signal.moneyRisk) && !proposal.evidence.trim()) {
      return { label: 'Needs evidence', detail: 'Add the amount, payee and source record before approval. Approval will not pay.', button: 'Add evidence', kind: 'evidence', executes: false }
    }
    const reply = proposal.kind === 'reply'
    return { label: 'Needs your approval', detail: reply ? 'Approval records your decision. It does not send the message or start an agent.' : 'Approval records your decision. It does not send, pay or start an agent.', button: 'Review for approval', kind: 'approve', executes: false }
  }
  if (signal.work) {
    const next = fromWork(signal.work)
    if (next.kind !== 'none' || signal.work.status === 'done') return next
  }
  if (proposal?.consequential && proposal.approved) {
    return { label: 'Approved, not carried out', detail: 'This decision is saved. Nothing has been sent or paid.', button: 'Record the external step', kind: 'record', executes: false }
  }
  if (proposal && proposal.kind !== 'archive') {
    return { label: 'Ready to keep', detail: 'This stays inside Pivot. Nothing external is waiting.', button: 'Keep it on the plan', kind: 'record', executes: false }
  }
  return { label: 'Name the next action', detail: 'Say the next action. Pivot will not guess a send or a payment.', button: 'Add the next action', kind: 'answer', executes: false }
}

function fromWork(work: NonNullable<FounderSignal['work']>): FounderNextAction {
  const move = actionPlanNextMove({ plan: work.plan, status: work.status, checked: work.checked })
  if (!move) return { label: 'Name the next action', detail: 'This work has no action plan. Name the next action before it enters today’s queue.', button: 'Add the next action', kind: 'answer', executes: false }
  const kind: NextActionKind = move.label === 'Done' ? 'none' : move.label === 'Needs your answer' ? 'answer' : move.label === 'Waiting for an available owner' ? 'hold' : move.label === 'Ready for approval' ? 'approve' : move.label === 'Ready to start' ? 'start' : 'progress'
  return { label: move.label, detail: move.detail, button: move.button, kind, executes: false }
}

function bandFor(signal: FounderSignal, next: FounderNextAction) {
  if (next.kind === 'none') return 9
  if (signal.moneyRisk || signal.relationshipRisk) return 0
  if (next.kind === 'evidence') return 1
  if (next.kind === 'approve' || (next.kind === 'record' && signal.proposal?.consequential)) return 2
  if (next.kind === 'answer' || next.kind === 'hold') return 3
  return 4
}

function toItem(signal: FounderSignal): FounderQueueItem {
  const next = resolveNext(signal)
  return { id: signal.id, title: signal.title, domain: signal.domain, privacy: signal.privacy, company: signal.company, ...(signal.due ? { due: signal.due } : {}), band: bandFor(signal, next), next }
}

function rank(items: FounderQueueItem[], signals: Map<string, FounderSignal>, today: string) {
  return [...items].sort((a, b) => {
    const left = signals.get(a.id)
    const right = signals.get(b.id)
    const dueGap = dueRank(a.due, today) - dueRank(b.due, today)
    return a.band - b.band
      || dueGap
      || (dueGap === 0 && a.due && b.due ? a.due.localeCompare(b.due) : 0)
      || urgencyRank[left?.urgency ?? 'later'] - urgencyRank[right?.urgency ?? 'later']
      || (left?.updatedAt ?? '').localeCompare(right?.updatedAt ?? '')
      || a.id.localeCompare(b.id)
  })
}

function dueRank(due: string | undefined, today: string) {
  if (!due) return 3
  if (!today) return 2
  if (due < today) return 0
  if (due === today) return 1
  return 2
}

function validDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}
