import type { DbItem, ItemType } from '../db/db'

export const TYPE_LABELS: Record<ItemType, string> = {
  task: 'Task',
  goal: 'Goal',
  process: 'Process',
  decision: 'Decision',
  problem: 'Problem',
  solution: 'Solution',
  meeting: 'Meeting',
  deal: 'Deal',
  lead: 'Lead',
  note: 'Note',
  opportunity: 'Opportunity',
  idea: 'Idea',
  follow_up: 'Follow-up',
  call: 'Call',
  email: 'Email',
  message: 'Message',
  payment: 'Payment',
  invoice: 'Invoice',
  expense: 'Expense',
  sale: 'Sale',
  listing: 'Listing',
  project: 'Project',
  contact: 'Contact',
  company: 'Company',
}

export function typeLabel(type: ItemType): string {
  return TYPE_LABELS[type] ?? type
}

export function formatZar(value: number | null | undefined): string {
  if (value == null) return '—'
  return `R ${Math.round(value).toLocaleString('en-ZA')}`
}

export function isOverdue(it: DbItem): boolean {
  if (!it.dueAt || it.status === 'done' || it.status === 'cancelled') return false
  return new Date(it.dueAt).getTime() < Date.now()
}

export function isDueToday(it: DbItem): boolean {
  if (!it.dueAt || it.status === 'done' || it.status === 'cancelled') return false
  const d = new Date(it.dueAt)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function dueLabel(it: DbItem): string | null {
  if (!it.dueAt) return null
  return new Date(it.dueAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}
