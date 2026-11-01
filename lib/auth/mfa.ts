import type { SupabaseClient } from '@supabase/supabase-js'

export async function needsSecondFactor(sb: SupabaseClient) {
  // Get factors from Auth, not the cookie's cached user (which can be stale or edited).
  const [user, claims] = await Promise.all([sb.auth.getUser(), sb.auth.getClaims()])
  if (user.error || claims.error || !user.data.user || !claims.data?.claims) throw new Error('Could not verify sign-in protection. Please try again.')
  const enrolled = user.data.user.factors?.some((factor) => factor.status === 'verified')
  return Boolean(enrolled && claims.data.claims.aal !== 'aal2')
}
