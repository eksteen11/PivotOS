import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../db/db'

export type TodayPlan = {
  createdAt: string
  top3: string[]
  blocks: { label: string; minutes: number }[]
}

export function useTodayPlan() {
  return useLiveQuery(async () => {
    const row = await db.kv.get('todayPlan')
    return (row?.value as TodayPlan | undefined) ?? null
  }, [])
}

export async function setTodayPlan(plan: TodayPlan) {
  await db.kv.put({ key: 'todayPlan', value: plan })
}

