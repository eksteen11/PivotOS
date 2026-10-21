import { expect, test } from '@playwright/test'

import { proposalBelongsToIntake, sourceIdMatchesIntake } from '../../lib/intake/idempotency'
import { normalizeProposal, validateSessionIds } from '../../lib/intake/validators'
import { hasValidMeetingWindow } from '../../lib/intake/shared'
import { caseFromRow } from '../../lib/workspace/data'
import { applyWorkAction } from '../../lib/workspace/model'

const smokeMode = process.env.SMOKE_MODE === 'local' ? 'local' : 'production'

test('meeting dates preserve SAST wall time on any server timezone', () => {
  expect(hasValidMeetingWindow('2026-10-28T08:00', '2026-10-28T09:00')).toBe(true)
  expect(hasValidMeetingWindow('2026-02-30T08:00', '2026-02-30T09:00')).toBe(false)
  expect(hasValidMeetingWindow('2026-10-28T25:00', '2026-10-29T02:00')).toBe(false)
})

test('approving saved intake work preserves its source after reload', () => {
  const sourceId = '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f'
  const row = {
    id: '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d', entity_id: 'test-entity',
    title: 'Confirm seller details', content: 'Synthetic regression case', status: 'planned',
    updated_at: '2026-10-21T10:00:00Z',
    meta: { pivot_case: { company: 'digikraal', systemId: '005', kind: 'task', sourceCaptureId: sourceId } },
  }
  const captured = caseFromRow(row)
  expect(captured).not.toBeNull()
  const approved = applyWorkAction(captured!, { kind: 'approve' }, '2026-10-21T10:01:00Z')
  const reloaded = caseFromRow({ ...row, status: approved.status, meta: { pivot_case: approved } })
  expect(reloaded?.intake?.sourceCaptureId).toBe(sourceId)
  expect(reloaded?.kind).toBe('task')
  const acceptedNote = applyWorkAction({ ...captured!, kind: 'note' }, { kind: 'approve' }, '2026-10-21T10:01:00Z')
  expect(acceptedNote.status).toBe('done')
  expect(acceptedNote.checked).toEqual([])
})

test('date validation rejects ambiguous or invalid meeting windows', async () => {
  const invalid = normalizeProposal({
    proposalId: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f',
    kind: 'meeting',
    title: 'Seller call',
    company: 'digikraal',
    systemId: '001',
    notes: 'Need exact meeting date',
    meeting: {
      confirmedSchedule: true,
      startAt: '2026-10-22T08:00',
      endAt: '2026-10-22T07:30',
    },
  })
  expect(invalid).toBeNull()
})

test('idempotency identifiers require UUID values', async () => {
  expect(validateSessionIds('not-a-uuid', 'also-not-a-uuid')).toBe(false)
  expect(
    validateSessionIds(
      '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f',
      '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d',
    ),
  ).toBe(true)
})

test('proposal kind remains distinguishable in normalization', async () => {
  const proposal = normalizeProposal({
    proposalId: '7a7b7c7d-3333-4333-8333-7a7b7c7d7a7b',
    kind: 'handoff',
    title: 'Send seller pack to legal team',
    company: 'digikraal',
    systemId: '005',
    notes: 'Prepare handoff only',
    meeting: { confirmedSchedule: false, startAt: '', endAt: '' },
  })
  expect(proposal).not.toBeNull()
  expect(proposal?.kind).toBe('handoff')
})

test('same IDs can safely resume and unrelated source conflicts', async () => {
  const meta = { idempotency_key: '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d' }
  const intakeMeta = { intake_version: 1, idempotency_key: '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d' }
  expect(sourceIdMatchesIntake(intakeMeta, '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d')).toBe(true)
  expect(sourceIdMatchesIntake(meta, 'aaaaaaaa-2222-4222-8222-9e9d9c9b9e9d')).toBe(false)
  expect(sourceIdMatchesIntake(meta, '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d')).toBe(false)
})

test('proposal ownership conflicts are rejected by intake source linkage', async () => {
  const matchingMeta = { intake: { source_capture_id: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f' } }
  const unrelatedMeta = { intake: { source_capture_id: '11111111-2222-4333-8444-555555555555' } }
  expect(proposalBelongsToIntake(matchingMeta, '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f')).toBe(true)
  expect(proposalBelongsToIntake(unrelatedMeta, '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f')).toBe(false)
})

test('ownership/auth required for intake save', async ({ request, baseURL }) => {
  test.skip(smokeMode === 'local', 'Local mode may not run against configured Supabase auth.')
  if (!baseURL) throw new Error('Base URL is required for smoke tests.')
  const response = await request.post(new URL('/api/intake/save', baseURL).toString(), {
    data: {
      sourceCaptureId: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f',
      idempotencyKey: '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d',
      transcript: 'test',
      proposals: [],
    },
  })
  expect(response.status()).toBe(401)
})
