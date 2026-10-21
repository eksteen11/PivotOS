import { createRoot } from 'react-dom/client'

import { MeetingWorkspace } from '@/components/meetings/MeetingWorkspace'
import { createMeetingCore, type MeetingCore } from '@/lib/meetings/core'

const core = createMeetingCore({
  company: 'northpoint',
  purpose: 'View the listing',
  desiredOutcome: 'Agree the next step',
  attendees: 'Drikus and Ruan',
  sourceCaptureId: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f',
})

const flow = new URLSearchParams(window.location.search).get('flow') === '1'
const calls: { url: string; updatedAt: string }[] = []
let current: MeetingCore = structuredClone(core)
let stamp = '2026-10-21T12:00:00.000Z'

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input)
  const body = init?.body ? JSON.parse(String(init.body)) as { updatedAt?: string; patch?: { liveNotes?: string; meetingTranscript?: string } } : {}
  calls.push({ url, updatedAt: String(body.updatedAt ?? '') })
  if (url.includes('/api/intake/source')) {
    return json(200, { transcript: 'Ruan called about the listing.', summary: 'A request to view the listing.', sourceLabel: 'Phone', retainedAudio: false })
  }
  if (!flow) return json(400, { error: 'Add what was said in the meeting. The original request is not minutes.' })
  if (String(body.updatedAt ?? '') !== stamp) return json(409, { error: 'This meeting changed in another window. Reload before saving.' })
  if (url.includes('/minutes')) {
    stamp = `2026-10-21T12:00:0${calls.length}.000Z`
    const minutes = { revision: 1, discussion: 'Prices were discussed.', decisions: [] as string[], questions: [] as string[], actions: [{ id: 'action-1', title: 'Confirm prices', include: true, company: 'northpoint' as const, systemId: '003', owner: 'Drikus', due: '2026-10-30' }], evidence: 'notes' as const }
    current = { ...current, minutes, lifecycle: 'minutes_review', minutesStale: false }
    return json(200, { minutes, updatedAt: stamp })
  }
  if (url.includes('/approve')) {
    stamp = `2026-10-21T12:00:0${calls.length}.000Z`
    current = { ...current, lifecycle: 'follow_up', approvedRevision: 1, followUpItemIds: ['bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee'], minutesStale: false }
    return json(200, { meeting: current, updatedAt: stamp, followUpItemIds: current.followUpItemIds, followUps: [{ id: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee', title: 'Confirm prices', status: 'planned' }] })
  }
  stamp = `2026-10-21T12:00:0${calls.length}.000Z`
  current = { ...current, liveNotes: String(body.patch?.liveNotes ?? current.liveNotes), meetingTranscript: String(body.patch?.meetingTranscript ?? current.meetingTranscript) }
  return json(200, { meeting: current, updatedAt: stamp })
}) as typeof fetch

export function Harness() {
  return (
    <MeetingWorkspace
      meetingId="aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee"
      founderId="founder-1"
      title="Listing visit"
      updatedAt="2026-10-21T12:00:00.000Z"
      core={core}
      timeLabel=""
      sourceHref="/api/intake/source/0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f"
    />
  )
}

const root = document.getElementById('root')
if (root) createRoot(root).render(<Harness />)
;(window as unknown as { meetingCalls: { url: string; updatedAt: string }[] }).meetingCalls = calls
