import { hasValidMeetingWindow } from '@/lib/intake/shared'
import { getSystem, companies, systems, type Company } from '@/lib/workspace/catalogue'
import { knownCompany, nextQuestion, type MeetingCore, type MeetingPatch } from '@/lib/meetings/core'

const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)

export function clarificationResponseFormat() {
  return {
    type: 'json_schema' as const,
    json_schema: {
      name: 'meeting_clarification',
      strict: true,
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['company', 'systemId', 'purpose', 'desiredOutcome', 'attendees', 'place', 'link', 'startAt', 'endAt', 'reminderPreparationMinutes', 'reminderStartMinutes'],
        properties: {
          company: { type: 'string', enum: ['', ...companies.map((item) => item.id)] },
          systemId: { type: 'string', enum: ['', ...systems.map((item) => item.id)] },
          purpose: { type: 'string' },
          desiredOutcome: { type: 'string' },
          attendees: { type: 'string' },
          place: { type: 'string' },
          link: { type: 'string' },
          startAt: { type: 'string' },
          endAt: { type: 'string' },
          reminderPreparationMinutes: { type: ['integer', 'null'], minimum: 0, maximum: 10080 },
          reminderStartMinutes: { type: ['integer', 'null'], minimum: 0, maximum: 10080 },
        },
      },
    },
  }
}

export function clarificationPrompt(today: string) {
  return [
    'Read the current question, the saved details, the previous replies, and the new reply together.',
    `Today is ${today} in Africa/Johannesburg.`,
    'The new reply adds to what is already known. Do not drop a saved person, place, business or time.',
    'A later reply such as "one hour" means the meeting ends one hour after a start that was already saved or stated. Keep that same calendar date.',
    'Do not invent a calendar date. A weekday without a calendar date leaves startAt and endAt empty.',
    'startAt and endAt are wall-clock times as YYYY-MM-DDTHH:mm, or empty strings. Do not convert them to UTC.',
    'Afrikaans months count: Januarie 01, Februarie 02, Maart 03, April 04, Mei 05, Junie 06, Julie 07, Augustus 08, September 09, Oktober 10, November 11, Desember 12.',
    'company and systemId stay empty unless a reply names that business or subdivision.',
    'Reminder offsets are minutes before the meeting. Return null unless the new reply explicitly changes a reminder. One day = 1440 minutes. Never invent a new reminder timing.',
    'Repeat saved facts that still apply. Use an empty string only when that fact was never stated.',
  ].join('\n')
}

export function clarificationUserPayload(core: MeetingCore, reply: string) {
  const previous = core.clarifications.map((item, index) => `${index + 1}. ${item.answer}`).filter((item) => item.trim().length > 3)
  return [
    `Current question: ${nextQuestion(core)?.prompt ?? 'None. Add only new facts.'}`,
    'Saved details:',
    `Purpose: ${core.purpose || '(empty)'}`,
    `Desired outcome: ${core.desiredOutcome || '(empty)'}`,
    `Attendees: ${core.attendees || '(empty)'}`,
    `Place: ${core.place || '(empty)'}`,
    `Business: ${core.company}`,
    `Subdivision: ${core.systemId}`,
    `Start: ${core.schedule.startAt || '(empty)'}`,
    `End: ${core.schedule.endAt || '(empty)'}`,
    `Preparation reminder: ${core.reminders.preparationMinutes} minutes before`,
    `Start reminder: ${core.reminders.startMinutes} minutes before`,
    'Previous replies:',
    previous.join('\n') || '(none)',
    'New reply:',
    reply,
  ].join('\n')
}

export function clarificationPatch(content: string): MeetingPatch {
  const parsed = JSON.parse(content) as Record<string, unknown>
  const patch: MeetingPatch = {}
  for (const field of ['reminderPreparationMinutes', 'reminderStartMinutes'] as const) {
    const value = parsed[field]
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10080) patch[field] = value
  }
  const company = knownCompany(parsed.company)
  const system = getSystem(clip(parsed.systemId, 8))
  if (company) patch.company = company
  else if (system && system.company !== 'shared') patch.company = system.company as Company
  if (system) patch.systemId = system.id
  const purpose = clip(parsed.purpose, 2000)
  const desiredOutcome = clip(parsed.desiredOutcome, 2000)
  const attendees = clip(parsed.attendees, 1000)
  const place = clip(parsed.place, 500)
  const link = clip(parsed.link, 500)
  if (purpose) patch.purpose = purpose
  if (desiredOutcome) patch.desiredOutcome = desiredOutcome
  if (attendees) patch.attendees = attendees
  if (place) patch.place = place
  if (link) patch.link = link
  const startAt = clip(parsed.startAt, 16)
  const endAt = clip(parsed.endAt, 16)
  if (startAt && endAt && hasValidMeetingWindow(startAt, endAt)) {
    patch.startAt = startAt
    patch.endAt = endAt
  }
  return patch
}
