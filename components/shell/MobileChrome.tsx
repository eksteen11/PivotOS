'use client'

import { EntityScopeBar } from '@/components/shell/EntityScopeBar'
import { SyncStatus } from '@/components/shell/SyncStatus'
import { useEntityScope } from '@/lib/hooks/useEntityScope'
import type { Entity } from '@/lib/types/database'

export function MobileChrome({ email, entities }: { email: string; entities: Entity[] }) {
  const { entitySlug, setScope } = useEntityScope(entities)

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.05] bg-surface/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="text-sm font-bold tracking-tight text-ink">Pivot OS</p>
        <div className="flex items-center gap-2">
          <SyncStatus />
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-xs font-bold text-ink">
            {email.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6">
        <EntityScopeBar entities={entities} value={entitySlug} onChange={setScope} />
      </div>
    </header>
  )
}
