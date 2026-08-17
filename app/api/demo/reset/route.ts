import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await sb.rpc('reset_my_pivot_os_demo')
  if (!error) return NextResponse.json({ ok: true, mode: 'rpc' })

  // Fallback if migration 0012 is not applied yet.
  await sb.from('items').delete().eq('user_id', user.id).contains('meta', { seed_batch: 'pivot_os_demo' })
  await sb.from('approvals').delete().eq('user_id', user.id).in('reason', [
    'Sales Agent drafted follow-up email for Rohan Rule 72 lead.',
    'Finance Agent proposes debtor reminder via WhatsApp.',
    'Executive Assistant proposes calendar block for trust remittance.',
  ])
  await sb.from('processes').delete().eq('user_id', user.id).in('title', [
    'Rohan Rule 72 — platform build lead',
    'Hartebeesfontein listing',
    'Maize quote — Western Cape',
    'Invoice follow-up batch',
    'Church trust remittance',
  ])
  await sb.from('memories').delete().eq('user_id', user.id).eq('key', 'invoice_follow_ups')

  const { error: seedError } = await sb.rpc('seed_pivot_os_demo', { p_user_id: user.id })
  if (seedError) return NextResponse.json({ error: 'Demo reset failed', detail: seedError.message }, { status: 500 })

  return NextResponse.json({ ok: true, mode: 'fallback' })
}
