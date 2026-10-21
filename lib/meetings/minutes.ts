import { actionTarget, type MeetingAction, type MeetingMinutes } from '@/lib/meetings/core'
import { companies, systems } from '@/lib/workspace/catalogue'

export function minutesEvidence(input: { liveNotes?: string; meetingTranscript?: string }) {
  const transcript = (input.meetingTranscript ?? '').trim()
  const notes = (input.liveNotes ?? '').trim()
  if (transcript) return { kind: 'transcript' as const, text: transcript.slice(0, 12000) }
  if (notes) return { kind: 'notes' as const, text: notes.slice(0, 12000) }
  return { kind: 'none' as const, text: '' }
}

export function evidenceText(input: { transcript?: string; notes?: string }) {
  const transcript = (input.transcript ?? '').trim()
  const notes = (input.notes ?? '').trim()
  if (transcript) return { kind: 'transcript' as const, text: transcript.slice(0, 12000) }
  if (notes) return { kind: 'notes' as const, text: notes.slice(0, 12000) }
  return { kind: 'none' as const, text: '' }
}

export function emptyMinutes(): MeetingMinutes {
  return { revision: 0, discussion: '', decisions: [], questions: [], actions: [], evidence: 'none' }
}

export function minutesFromModel(content: string, evidence: 'transcript' | 'notes'): MeetingMinutes {
  const parsed = JSON.parse(content) as Record<string, unknown>
  const actions = Array.isArray(parsed.actions) ? parsed.actions : []
  return {
    revision: 0,
    discussion: typeof parsed.discussion === 'string' ? parsed.discussion.trim().slice(0, 4000) : '',
    decisions: Array.isArray(parsed.decisions) ? parsed.decisions.map((item) => String(item).trim()).filter(Boolean).slice(0, 8) : [],
    questions: Array.isArray(parsed.questions) ? parsed.questions.map((item) => String(item).trim()).filter(Boolean).slice(0, 8) : [],
    actions: actions.slice(0, 8).flatMap((item, index) => {
      if (!item || typeof item !== 'object') return []
      const row = item as { title?: string; company?: string; systemId?: string; owner?: string; due?: string }
      const title = String(row.title ?? '').trim().slice(0, 180)
      if (!title) return []
      const action: MeetingAction = {
        id: `action-${index + 1}`,
        title,
        include: true,
        company: row.company === 'personal' || row.company === 'digikraal' || row.company === 'farm-feed' || row.company === 'northpoint' ? row.company : '',
        systemId: String(row.systemId ?? '').trim(),
        owner: String(row.owner ?? '').trim().slice(0, 120),
        due: /^\d{4}-\d{2}-\d{2}$/.test(String(row.due ?? '').trim()) ? String(row.due).trim() : '',
      }
      const target = actionTarget(action)
      return [target ? { ...action, company: target.company, systemId: target.systemId, owner: target.owner, due: target.due } : { ...action, include: false, company: '' as const, systemId: '' }]
    }),
    evidence,
  }
}

export function minutesResponseFormat() {
  return {
    type: 'json_schema' as const,
    json_schema: {
      name: 'meeting_minutes',
      strict: true,
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['discussion', 'decisions', 'questions', 'actions'],
        properties: {
          discussion: { type: 'string' },
          decisions: { type: 'array', items: { type: 'string' } },
          questions: { type: 'array', items: { type: 'string' } },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['title', 'company', 'systemId', 'owner', 'due'],
              properties: {
                title: { type: 'string' },
                company: { type: 'string', enum: ['', ...companies.map((item) => item.id)] },
                systemId: { type: 'string', enum: ['', ...systems.map((item) => item.id)] },
                owner: { type: 'string' },
                due: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }
}

export function minutesPrompt() {
  return [
    'Draft meeting minutes from the supplied evidence only.',
    'Do not invent people, dates, amounts, decisions or actions that are not in the evidence.',
    'If the evidence is incomplete, leave lists empty and say what is missing in the discussion.',
    'Actions are proposals for the founder to review. Do not mark them as already done.',
    'Set company and systemId only when the evidence names that business and subdivision. Otherwise use empty strings. Do not copy the meeting business just because the action was spoken there.',
    'Set owner and due only when the evidence states them. due is YYYY-MM-DD or empty. Do not invent a deadline.',
  ].join('\n')
}
