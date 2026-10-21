import { notFound } from 'next/navigation'

import { MeetingWorkspace } from '@/components/meetings/MeetingWorkspace'
import { getMeeting } from '@/lib/data/meetings'
import { requireFounder } from '@/lib/auth/requireFounder'
import { entitySlugFrom, readMeetingCore, sourceLink } from '@/lib/meetings/core'
import { readOwnedWorkSummaries } from '@/lib/workspace/data'

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireFounder()
  const row = await getMeeting(id)
  if (!row) notFound()
  const core = readMeetingCore(row.meta ?? {}, row.due_at, entitySlugFrom(row.entities))
  if (!core) notFound()
  const followUps = await readOwnedWorkSummaries(core.followUpItemIds).catch(() => [])
  return (
    <MeetingWorkspace
      meetingId={row.id}
      founderId={user.id}
      title={row.title || 'Meeting'}
      updatedAt={row.updated_at || ''}
      core={core}
      followUps={followUps}
      sourceHref={sourceLink(core)}
    />
  )
}
