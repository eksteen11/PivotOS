'use client'

import { useEffect, useState } from 'react'

import type { Entity } from '@/lib/types/database'

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
