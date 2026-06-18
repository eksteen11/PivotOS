'use client'

import { useEffect, useState } from 'react'

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

export function useEntityScope(entities: Entity[]) {
  const [entitySlug, setEntitySlug] = useState('__all__')
  useEffect(() => {
    const saved = localStorage.getItem('pivotos.entityScope')
    if (saved) setEntitySlug(saved)
  }, [])
  const setScope = (slug: string) => {
    setEntitySlug(slug)
    localStorage.setItem('pivotos.entityScope', slug)
  }
  const entityIds = entitySlug === '__all__' ? entities.map((e) => e.id) : entities.filter((e) => e.slug === entitySlug).map((e) => e.id)
  return { entitySlug, setScope, entityIds }
}
