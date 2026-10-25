/** Check the browser-facing host; Next's request URL may use its bind hostname. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    const target = new URL(request.url)
    const host = request.headers.get('host')
    // Do not trust client-supplied forwarded-host headers or allow all local ports.
    if (host) target.host = host
    const source = new URL(origin)
    return (source.protocol === 'http:' || source.protocol === 'https:')
      && source.origin === origin
      && source.origin === target.origin
  } catch {
    return false
  }
}
