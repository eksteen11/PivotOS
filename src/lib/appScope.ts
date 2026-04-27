/** Entity selector value: aggregate data across every synced entity */
export const ALL_ENTITIES_SLUG = '__all__' as const

export function isAllEntitiesScope(slug: string): boolean {
  return slug === ALL_ENTITIES_SLUG
}
