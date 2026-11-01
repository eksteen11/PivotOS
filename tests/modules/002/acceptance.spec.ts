import { expect, test } from '@playwright/test'
import { actionPlanNextMove } from '../../../lib/workspace/actionPlan'
import { acceptFounderCommand, auditFounderCommand, buildFounderCommand, founderToday, signalFromWork } from '../../../lib/modules/002/prioritise'
import { MODULE_002_INTEGRATION } from '../../../lib/modules/002/contract'
import { deskSignals, founderPlan, today } from './fixtures'

const ids = (items: { id: string }[]) => items.map((item) => item.id)

test('founder queue ranks risk first, caps leverage at three, and passes acceptance', () => {
  const snapshot = structuredClone(deskSignals)
  const view = buildFounderCommand(deskSignals, 'founder', today)
  expect(deskSignals).toEqual(snapshot)
  expect(ids(view.needsYou)).toEqual(['leslie-payment', 'buyer-reply', 'plan-owner', 'church-roster', 'personal-debt'])
  expect(ids(view.leverage)).toEqual(['goal-overdue', 'goal-today', 'goal-later'])
  expect(view.parkedCount).toBe(2)
  expect(view.focus?.id).toBe('leslie-payment')
  expect(view.focus?.next).toMatchObject({ kind: 'evidence', button: 'Add evidence', executes: false })
  expect(view.focus?.next.detail).toContain('will not pay')
  expect(view.needsYou[1].next.detail).toContain('does not send')
  expect(view.needsYou[2].next.detail).toBe(actionPlanNextMove({ plan: founderPlan({ owner: '' }), status: 'planned', checked: [] })?.detail)
  expect(view.bottleneck).toEqual({ label: 'Communications still need a decision', count: 1 })
  expect(view.clearedCount).toBe(2)
  expect(view.hiddenPrivateCount).toBe(0)
  expect(view.providerStatus).toBe('not-connected')
  expect(view.needsYou.find((item) => item.id === 'buyer-reply')?.company).toBe('digikraal')
  expect(acceptFounderCommand(deskSignals, 'founder', today)).toEqual({ ok: true, violations: [] })
  expect(ids(buildFounderCommand([...deskSignals].reverse(), 'founder', today).needsYou)).toEqual(ids(view.needsYou))
})

test('company lenses keep family, church, health and personal money off the view', () => {
  const view = buildFounderCommand(deskSignals, 'digikraal', today)
  const rendered = JSON.stringify(view)
  expect(ids(view.needsYou)).toEqual(['buyer-reply', 'plan-owner'])
  expect(ids(view.leverage)).toEqual(['goal-overdue', 'goal-today', 'goal-later'])
  expect(view.hiddenPrivateCount).toBe(4)
  expect(view.clearedCount).toBe(1)
  for (const title of ['Leslie payment', 'Church roster', 'Personal debt note', 'Completed visit note']) expect(rendered).not.toContain(title)
  expect(acceptFounderCommand(deskSignals, 'digikraal', today).ok).toBe(true)
  const farm = buildFounderCommand(deskSignals, 'farm-feed', today)
  expect(farm.focus).toBeNull()
  expect(farm.needsYou).toEqual([])
  expect(farm.bottleneck.label).toBe('WhatsApp and email are not connected')
  expect(acceptFounderCommand(deskSignals, 'farm-feed', today).ok).toBe(true)
})

test('a restricted record marked company-visible is rejected and still hidden', () => {
  const leaked = deskSignals.map((signal) => signal.id === 'leslie-payment' ? { ...signal, privacy: 'company-visible' as const } : signal)
  const company = buildFounderCommand(leaked, 'digikraal', today)
  expect(JSON.stringify(company)).not.toContain('Leslie payment')
  const acceptance = acceptFounderCommand(leaked, 'founder', today)
  expect(acceptance.ok).toBe(false)
  expect(acceptance.violations.join(' ')).toContain('cannot be company-visible')
})

test('approval and agent plans stay explicit and do not execute', () => {
  const approved = buildFounderCommand([{
    id: 'approved-pay', title: 'Approved supplier note', domain: 'communications', privacy: 'company-visible', company: 'digikraal', updatedAt: '2026-10-25T06:00:00.000Z', urgency: 'today', moneyRisk: true, relationshipRisk: false,
    proposal: { kind: 'payment', consequential: true, approved: true, evidence: 'Invoice 18 · FNB proof pending' },
  }], 'founder', today)
  expect(approved.focus?.next).toMatchObject({ kind: 'record', button: 'Record the external step', executes: false })
  expect(approved.focus?.next.detail).toContain('Nothing has been sent or paid')
  const agent = signalFromWork(
    { id: 'agent-plan', title: 'Draft the chase', company: 'digikraal', due: '', status: 'planned', updatedAt: '2026-10-25T06:00:00.000Z', checked: [], plan: { ...founderPlan(), owner: 'Proposed assistant', ownerType: 'agent', approvedAt: '2026-10-25T05:00:00.000Z' } },
    { domain: 'agents', privacy: 'company-visible' },
  )
  const queued = buildFounderCommand([agent], 'founder', today)
  expect(queued.focus?.next.label).toBe('Waiting for an available owner')
  expect(queued.focus?.next.detail).toContain('Agent execution is not connected')
  expect(queued.focus?.next.executes).toBe(false)
  const moving = buildFounderCommand([{
    id: 'money-moving', title: 'Chase the overdue invoice', domain: 'goals', privacy: 'company-visible', company: 'farm-feed', updatedAt: '2026-10-25T06:00:00.000Z', due: today, urgency: 'now', moneyRisk: true, relationshipRisk: false,
    work: { status: 'in_progress', checked: [], plan: founderPlan() },
  }], 'founder', today)
  expect(moving.needsYou.map((item) => item.id)).toEqual(['money-moving'])
  expect(moving.leverage).toEqual([])
  expect(moving.focus?.next.button).toBe('Record progress')
})

test('acceptance fails closed on execution claims, bad records and the wrong day', () => {
  const view = buildFounderCommand(deskSignals, 'founder', today)
  const tampered = structuredClone(view)
  tampered.focus!.next.executes = true as unknown as false
  expect(auditFounderCommand(tampered, deskSignals, 'founder', today).violations.join(' ')).toContain('claims execution')
  expect(acceptFounderCommand([...deskSignals, deskSignals[0]], 'founder', today).ok).toBe(false)
  expect(acceptFounderCommand(deskSignals, 'founder', '2026-02-31').ok).toBe(false)
  expect(founderToday(new Date('2026-10-25T22:30:00.000Z'))).toBe('2026-10-26')
  expect(founderToday(new Date('2026-10-25T21:30:00.000Z'))).toBe('2026-10-25')
  expect(signalFromWork(
    { id: 'family-case', title: 'Parents estate', company: 'personal', due: '', status: 'planned', updatedAt: '2026-10-25T06:00:00.000Z', checked: [], plan: founderPlan() },
    { domain: 'family', privacy: 'company-visible' },
  ).privacy).toBe('founder-private')
  expect(MODULE_002_INTEGRATION.placement).toBe('internal-module')
  expect(MODULE_002_INTEGRATION.entry.build).toBe('buildFounderCommand')
  expect(MODULE_002_INTEGRATION.doesNotDuplicate).toContain('applyWorkAction')
})
