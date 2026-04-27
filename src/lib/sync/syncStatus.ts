import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../db/db'

export function useDirtyCount() {
  return useLiveQuery(async () => {
    return await db.items.where('syncState').equals('dirty').and((x) => x.deletedAt == null).count()
  }, [])
}

export function useLastSyncAt() {
  return useLiveQuery(async () => {
    const row = await db.kv.get('lastSyncOkAt')
    return (row?.value as string | undefined) ?? null
  }, [])
}

