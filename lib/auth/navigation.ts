// Auth redirects must stay inside this app, including after email confirmation.
export function safeNextPath(value: string | null | undefined, fallback = '/today') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || (value.includes('\\') || [...value].some((char) => char.charCodeAt(0) <= 32))) return fallback
  try {
    const url = new URL(value, 'https://pivot.invalid')
    if (url.origin !== 'https://pivot.invalid' || /^\/(auth|login|register)(\/|$)/.test(url.pathname)) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch { return fallback }
}

export function accountName(user: { email?: string; user_metadata?: Record<string, unknown> }) {
  const name = user.user_metadata?.display_name
  return typeof name === 'string' && name.trim() ? name.trim() : user.email?.split('@')[0] || 'Your account'
}

export function accountInitials(name: string) {
  // The founder's confirmed preferred initials are DJ.
  if (name.trim().toLowerCase() === 'drikus eksteen') return 'DJ'
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}
