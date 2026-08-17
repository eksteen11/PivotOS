'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ENTITY_SCOPE_ALL, ENTITY_SCOPE_COOKIE } from '@/lib/scope/entityScope'
import type { Entity } from '@/lib/types/database'

export function useEntityScope(entities: Entity[]) {
  const router = useRouter()
  const [entitySlug, setEntitySlug] = useState(ENTITY_SCOPE_ALL)

  useEffect(() => {
    const saved = localStorage.getItem(ENTITY_SCOPE_COOKIE) || document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${ENTITY_SCOPE_COOKIE}=`))
      ?.split('=')[1]
    if (saved) setEntitySlug(decodeURIComponent(saved))
  }, [])

  const setScope = (slug: string) => {
    setEntitySlug(slug)
    localStorage.setItem(ENTITY_SCOPE_COOKIE, slug)
    document.cookie = `${ENTITY_SCOPE_COOKIE}=${encodeURIComponent(slug)}; path=/; max-age=31536000; samesite=lax`
    router.refresh()
  }

  const entityIds =
    entitySlug === ENTITY_SCOPE_ALL
      ? entities.map((e) => e.id)
      : entities.filter((e) => e.slug === entitySlug).map((e) => e.id)

  return { entitySlug, setScope, entityIds }
}
