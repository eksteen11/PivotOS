import { MeetingCapture } from '@/components/meetings/MeetingCapture'
import { MeetingCard } from '@/components/meetings/MeetingCard'
import { getEntities } from '@/lib/data/queries'
import { getMeetings } from '@/lib/data/meetings'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'

export default async function MeetingsPage() {
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const meetings = await getMeetings(resolveEntityIds(entities, scope))

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Prepare and remember</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Meetings</h1>
        <p className="mt-2 text-sm text-muted">Save meeting notes and paste a real transcript. Calendar sync is not connected, and Pivot does not invent transcripts.</p>
      </div>
      <MeetingCapture entities={entities} />
      <div className="grid gap-4 md:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
        {meetings.length === 0 && (
          <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-8 text-sm text-muted">
            No meetings in this business view yet. Calendar sync and transcript import are not connected.
          </p>
        )}
      </div>
    </section>
  )
}
