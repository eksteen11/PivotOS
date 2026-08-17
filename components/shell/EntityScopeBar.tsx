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
        className="field-input w-full text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Business scope"
      >
        <option value="__all__">All businesses</option>
        {entities.map((e) => (
          <option key={e.id} value={e.slug}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  )
}
