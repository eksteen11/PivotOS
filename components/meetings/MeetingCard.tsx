import Link from 'next/link'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { MeetingItem } from '@/lib/data/meetings'

export function MeetingCard({ meeting }: { meeting: MeetingItem }) {
  const prep = Array.isArray(meeting.meta?.prep) ? meeting.meta.prep.filter((item): item is string => typeof item === 'string') : []
  const transcript = typeof meeting.meta?.transcript === 'string' ? meeting.meta.transcript : null
  const decisions = Array.isArray(meeting.meta?.decisions) ? meeting.meta.decisions.filter((item): item is string => typeof item === 'string') : []

  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white/85 p-5 shadow-deck">
      <div className="mb-3 flex flex-wrap gap-2">
        <StatusBadge label="meeting" tone="normal" />
        {meeting.entities?.name ? <StatusBadge label={meeting.entities.name} tone="active" /> : null}
      </div>
      <h3 className="text-base font-semibold">{meeting.title ?? 'Meeting'}</h3>
      <p className="mt-1 text-sm text-muted">
        {meeting.due_at ? new Date(meeting.due_at).toLocaleString() : 'Unscheduled'}
      </p>
      <p className="mt-2 text-sm text-muted">{meeting.content}</p>
      {prep.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-ink/70">
          {prep.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : null}
      {transcript ? (
        <pre className="mt-3 max-h-32 overflow-auto rounded-xl bg-black/[0.03] p-3 text-xs text-muted">{transcript}</pre>
      ) : null}
      {decisions.length > 0 ? (
        <div className="mt-3 text-xs">
          <p className="font-semibold text-accent">Approved tasks queued</p>
          <ul className="mt-1 space-y-1 text-muted">
            {decisions.map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <Link className="btn-primary mt-4 inline-flex text-sm" href={`/today/meetings/${meeting.id}`}>Open meeting</Link>
      <p className="mt-2 text-[10px] leading-4 text-muted">Minutes are drafted from notes or the original source in the meeting workspace.</p>
    </article>
  )
}
