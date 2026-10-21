import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function requireFounder() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profile?.role !== 'founder') redirect('/closed')
  return user
}
