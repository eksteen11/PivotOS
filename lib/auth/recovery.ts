// Supabase signs the authentication-method claim; user metadata is never proof.
export function isRecoverySession(claims: { amr?: unknown } | null | undefined) {
  return Array.isArray(claims?.amr) && claims.amr.some((entry: unknown) =>
    typeof entry === 'object' && entry !== null && 'method' in entry && entry.method === 'recovery')
}

export function recoveryMessage(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : ''
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'Please wait a minute before requesting another link.'
  if (error instanceof TypeError || (error instanceof Error && /fetch|network|timeout/i.test(error.message))) return 'We couldn’t reach the email service. Check your connection and try again.'
  return 'We couldn’t request a reset link. Please try again shortly.'
}
