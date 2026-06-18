'use client'

import type { Entity } from '@/lib/types/database'

type Props = {
  entities: Entity[]
  value: string
  onChange: (slug: string) => void
}

export function EntityScopeBar({ entities, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        className="field-input max-w-xs text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Entity"
      >
        <option value="__all__">All entities</option>
        {entities.map((e) => (
          <option key={e.id} value={e.slug}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  )
}
