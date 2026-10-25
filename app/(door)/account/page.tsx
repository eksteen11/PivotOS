import { AccountSettings } from '@/components/auth/AccountSettings'
import { requireFounder } from '@/lib/auth/requireFounder'
import { accountName } from '@/lib/auth/navigation'
import { createClient } from '@/lib/supabase/server'
export default async function AccountPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireFounder()
  const sb = await createClient()
  const { data: entities, error } = await sb.from('entities').select('id,name').eq('user_id', user.id).order('sort_order')
  const params = await searchParams
  const tab = params?.tab === 'team' ? 'team' : params?.tab === 'security' ? 'security' : 'profile'
  return <AccountSettings name={accountName(user)} email={user.email ?? ''} createdAt={user.created_at} confirmed={Boolean(user.email_confirmed_at)} entities={entities ?? []} entitiesError={Boolean(error)} initialTab={tab} />
}
