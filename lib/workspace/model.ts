import { companies, getSystem, systemFitsCompany, type Company } from './catalogue'

export type WorkStatus = 'planned' | 'in_progress' | 'waiting' | 'done'
export type WorkCase = { id: string; entityId: string; company: Company; systemId: string; title: string; notes: string; due: string; status: WorkStatus; source: string; updatedAt: string; facts: Record<string, string>; checked: number[]; history: { at: string; text: string }[]; lessons: { text: string; status: 'proposed' }[] }
export type WorkInput = Pick<WorkCase, 'title' | 'notes' | 'company' | 'systemId' | 'due'>
export const statusLabels: Record<WorkStatus, string> = { planned: 'Needs approval', in_progress: 'In progress', waiting: 'Waiting', done: 'Done' }
export function validateWorkInput(value: Record<string, unknown>): WorkInput {
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  const notes = typeof value.notes === 'string' ? value.notes.trim() : ''
  const system = getSystem(String(value.systemId ?? ''))
  const company = String(value.company ?? '') as Company
  const due = typeof value.due === 'string' ? value.due : ''
  if (!title || title.length > 180 || notes.length > 12000) throw new Error('Add a title of up to 180 characters and notes of up to 12,000 characters.')
  if (!companies.some((c) => c.id === company) || !system || !systemFitsCompany(system, company)) throw new Error('Choose a workflow belonging to this business.')
  if (due && (!/^\d{4}-\d{2}-\d{2}$/.test(due) || new Date(due + 'T12:00:00Z').toISOString().slice(0, 10) !== due)) throw new Error('Choose a valid due date.')
  return { title, notes, company, systemId: system.id, due }
}
export function applyWorkAction(current: WorkCase, action: Record<string, unknown>, now: string): WorkCase {
  const next: WorkCase = { ...current, facts: { ...current.facts }, checked: [...current.checked], lessons: [...current.lessons], history: [...current.history], updatedAt: now }
  const system = getSystem(current.systemId)
  if (!system) throw new Error('This workflow is unavailable.')
  let text = ''
  if (action.kind === 'approve') {
    if (current.status !== 'planned') throw new Error('This work plan is already reviewed.')
    next.status = 'in_progress'; text = 'Drikus approved the internal work plan. No external action was authorised.'
  } else if (action.kind === 'task') {
    if (current.status === 'planned' || current.status === 'done') throw new Error('Approve the work plan before updating tasks, or reopen completed work.')
    const index = Number(action.index)
    if (!Number.isInteger(index) || index < 0 || index >= system.steps.length || typeof action.checked !== 'boolean') throw new Error('Choose a valid task.')
    next.checked = action.checked ? [...new Set([...current.checked, index])] : current.checked.filter((i) => i !== index)
    text = `${action.checked ? 'Completed' : 'Reopened'}: ${system.steps[index]}`
  } else if (action.kind === 'status') {
    if (!['in_progress', 'waiting', 'done'].includes(String(action.status)) || current.status === 'planned') throw new Error('Approve the work plan first.')
    if (action.status === 'done' && current.checked.length !== system.steps.length) throw new Error('Complete each checklist step before closing this work.')
    next.status = action.status as WorkStatus; text = `Work marked ${statusLabels[next.status].toLowerCase()}.`
  } else if (action.kind === 'facts') {
    if (!action.facts || typeof action.facts !== 'object' || Array.isArray(action.facts)) throw new Error('Add valid details.')
    for (const [key, value] of Object.entries(action.facts)) {
      if (!system.fields.includes(key) || typeof value !== 'string' || value.length > 2000) throw new Error('One of the detail fields is invalid.')
      next.facts[key] = value.trim()
    }
    text = 'Drikus updated the case details. Values remain user-entered, not independently verified.'
  } else if (action.kind === 'lesson') {
    const lesson = typeof action.text === 'string' ? action.text.trim() : ''
    if (!lesson || lesson.length > 2000 || current.lessons.length >= 100) throw new Error('Add a lesson of up to 2,000 characters. Maximum 100 per case.')
    next.lessons.push({ text: lesson, status: 'proposed' }); text = 'Saved a proposed lesson for review. It has not changed any agent procedure.'
  } else throw new Error('Unknown work action.')
  if (current.history.length >= 1000) throw new Error('This case has reached its history limit. Archive review is required before more changes.')
  next.history.push({ at: now, text })
  return next
}
export function sampleCases(): WorkCase[] {
  const base = { entityId: '', notes: '', due: '', source: 'Sample · manual capture', updatedAt: '2026-10-20T14:00:00.000Z', checked: [], facts: {}, history: [{ at: '2026-10-20T14:00:00.000Z', text: 'Illustrative case created. No real appointment, message or transaction.' }], lessons: [] } satisfies Partial<WorkCase>
  return [
    { ...base, id: 'sample-cattle', company: 'digikraal', systemId: '005', title: 'CP van der Merwe · Angus cows & calves', notes: 'Hypothetical workflow from Drikus: seller reports 50 Angus cows and 30 calves in Ceres. Prepare a visit and gather missing details. This is sample data.', status: 'planned', facts: { Seller: 'CP van der Merwe · sample', 'Animal category': '50 cows and 30 calves · seller reported', Breed: 'Angus · unverified', Area: 'Ceres', Certificates: 'Not supplied' } },
    { ...base, id: 'sample-property', company: 'northpoint', systemId: '003', title: 'Prepare a farm listing and viewing plan', notes: 'Sample opportunity. Confirm mandate, water information, price and buyer requirements before proposing a viewing.', status: 'in_progress', checked: [0] },
    { ...base, id: 'sample-feed', company: 'farm-feed', systemId: '004', title: 'Match an oat hay enquiry to supply', notes: 'Sample enquiry. Quantity, quality, unit and delivery costs still need confirmation.', status: 'waiting' },
    { ...base, id: 'sample-personal', company: 'personal', systemId: '002', title: 'Make room for the work that matters', notes: 'Sample founder commitment. Choose one meaningful outcome for the week.', status: 'planned' },
  ]
}
