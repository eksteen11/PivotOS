import type { Entity } from '@/lib/types/database'

export const ENTITY_SCOPE_COOKIE = 'pivotos.entityScope'
export const ENTITY_SCOPE_ALL = '__all__'

export function resolveEntityIds(entities: Entity[], scopeSlug?: string | null): string[] {
  const slug = scopeSlug && scopeSlug !== ENTITY_SCOPE_ALL ? scopeSlug : null
  if (!slug) return entities.map((e) => e.id)
  return entities.filter((e) => e.slug === slug).map((e) => e.id)
}
