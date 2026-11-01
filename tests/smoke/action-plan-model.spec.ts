import { expect, test } from '@playwright/test'
import { actionPlanNextMove, emptyActionPlan, type ActionPlan } from '../../lib/workspace/actionPlan'
import { applyWorkAction, caseSteps, sampleCases, validateWorkInput } from '../../lib/workspace/model'
import { caseFromRow } from '../../lib/workspace/data'
import { normalizeAnalysisContent } from '../../lib/intake/analyse'

const complete: ActionPlan = { ...emptyActionPlan(['Confirm availability', 'Prepare the visit brief']), forWhom: 'CP · Ceres', outcome: 'A prepared visit', owner: 'Drikus', method: 'Confirm details then prepare the brief', tools: 'Phone and saved documents', inputs: 'Seller details', timing: 'Next week after availability is confirmed' }
const work = () => ({ ...sampleCases()[0], plan: structuredClone(complete), source: 'WhatsApp/text/voice/call · manual import', intake: { sourceCaptureId: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f', proposalKind: 'project', externalBlocked: true } })

test('incomplete plans persist, ask a specific question and cannot bypass approval or start', () => {
  const current = { ...work(), plan: { ...complete, owner: '' } }
  expect(actionPlanNextMove(current)?.label).toBe('Needs your answer')
  expect(actionPlanNextMove(current)?.detail).toContain('Who is responsible')
  expect(() => applyWorkAction(current, { kind: 'approve' }, '2026-10-25T15:00:00Z')).toThrow('Who is responsible')
  expect(() => applyWorkAction(current, { kind: 'start' }, '2026-10-25T15:00:00Z')).toThrow('Complete and approve')
  expect(() => applyWorkAction(current, { kind: 'status', status: 'in_progress' }, '2026-10-25T15:00:00Z')).toThrow('Approve')
  expect(() => applyWorkAction(current, { kind: 'task', index: 0, checked: true }, '2026-10-25T15:00:00Z')).toThrow('Approve')
  expect(validateWorkInput({ ...current, plan: { ...current.plan, approvedAt: '2026-10-25T14:00:00Z' } }).plan?.approvedAt).toBeUndefined()
})

test('save, approve and start are distinct across reload and preserve source links', () => {
  const current = work()
  expect(caseSteps(current)).toEqual(complete.actions)
  expect(actionPlanNextMove(current)?.label).toBe('Ready for approval')
  const approved = applyWorkAction(current, { kind: 'approve' }, '2026-10-25T15:00:00Z')
  expect(approved.status).toBe('planned')
  expect(approved.checked).toEqual([])
  const reloaded = caseFromRow({ id: current.id, entity_id: 'owned-entity', status: approved.status, title: current.title, content: current.notes, updated_at: approved.updatedAt, meta: { pivot_case: approved } })!
  expect(actionPlanNextMove(reloaded)?.label).toBe('Ready to start')
  expect(reloaded.intake).toEqual(current.intake)
  expect(() => applyWorkAction(reloaded, { kind: 'approve' }, '2026-10-25T15:01:00Z')).toThrow('already approved')
  const started = applyWorkAction(reloaded, { kind: 'start' }, '2026-10-25T15:02:00Z')
  expect(started.status).toBe('in_progress')
  expect(() => applyWorkAction(started, { kind: 'status', status: 'done' }, '2026-10-25T15:03:00Z')).toThrow('Complete each')
  const firstDone = applyWorkAction(started, { kind: 'task', index: 0, checked: true }, '2026-10-25T15:04:00Z')
  expect(actionPlanNextMove(firstDone)?.detail).toContain('Prepare the visit brief')
  expect(current.checked).toEqual([])
})

test('editing approved plans requires fresh approval and agent plans cannot pretend to execute', () => {
  const approved = applyWorkAction(work(), { kind: 'approve' }, '2026-10-25T15:00:00Z')
  const edited = applyWorkAction(approved, { kind: 'plan', plan: { ...complete, owner: 'Proposed assistant', ownerType: 'agent', approvedAt: approved.plan!.approvedAt } }, '2026-10-25T15:01:00Z')
  expect(edited.plan?.approvedAt).toBeUndefined()
  expect(actionPlanNextMove(edited)?.label).toBe('Ready for approval')
  const agentApproved = applyWorkAction(edited, { kind: 'approve' }, '2026-10-25T15:02:00Z')
  expect(actionPlanNextMove(agentApproved)?.label).toBe('Waiting for an available owner')
  expect(() => applyWorkAction(agentApproved, { kind: 'start' }, '2026-10-25T15:03:00Z')).toThrow('Agent execution is not connected')
})

test('legacy checklists remain intact and routing rejects cross-business plans', () => {
  const legacy = sampleCases()[0]
  expect(caseSteps(legacy).length).toBe(7)
  expect(applyWorkAction(legacy, { kind: 'approve' }, '2026-10-25T15:00:00Z').status).toBe('in_progress')
  expect(() => validateWorkInput({ title: 'Family appointment', notes: '', due: '', company: 'personal', systemId: '005', plan: complete })).toThrow('belonging to this business')
})

test('AI extraction retains supported plan details while old structured responses remain readable', () => {
  const base = { kind: 'task', title: 'Prepare visit brief', company: 'digikraal', systemId: '005', notes: '', requiresExternalApproval: false, uncertainties: [], meeting: { confirmedSchedule: false, startAt: '', endAt: '', people: '', place: '' } }
  const parsed = normalizeAnalysisContent(JSON.stringify({ language: 'en', summary: 'Visit preparation', questions: [], proposals: [{ ...base, plan: complete }] }))
  expect(parsed.proposals[0].plan).toEqual(complete)
  const old = normalizeAnalysisContent(JSON.stringify({ language: 'en', summary: '', questions: [], proposals: [base] }))
  expect(old.proposals[0].plan?.owner).toBe('')
  expect(old.proposals[0].plan?.actions).toEqual(['Prepare visit brief'])
})
