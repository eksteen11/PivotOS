import { cookies } from 'next/headers'

import { ENTITY_SCOPE_ALL, ENTITY_SCOPE_COOKIE } from '@/lib/scope/entityScope'

export async function getEntityScopeSlug(): Promise<string> {
  const store = await cookies()
  return store.get(ENTITY_SCOPE_COOKIE)?.value || ENTITY_SCOPE_ALL
}
