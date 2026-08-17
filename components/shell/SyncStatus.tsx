'use client'

import { useDirtyCount, useLastSyncAt } from '@/lib/sync/syncStatus'

export function SyncStatus() {
  const dirty = useDirtyCount() ?? 0
  const lastSyncAt = useLastSyncAt()
  const label = dirty > 0 ? `${dirty} offline drafts` : lastSyncAt ? 'Online' : 'Ready'

  return (
    <p className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold text-muted" title={lastSyncAt ? `Last sync ${lastSyncAt}` : 'No sync yet'}>
      {label}
    </p>
  )
}
