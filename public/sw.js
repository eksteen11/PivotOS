const OFFLINE_CACHE = 'pivot-offline-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(OFFLINE_CACHE)
    await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key.startsWith('pivot-offline-') && key !== OFFLINE_CACHE).map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

// Authenticated Pivot data is intentionally not cached by the service worker.
// Only full-page navigations get the public offline fallback. API calls, writes,
// and Next.js data requests retain their normal network behavior.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate' || new URL(event.request.url).origin !== self.location.origin) return

  event.respondWith((async () => {
    try {
      return await fetch(event.request)
    } catch {
      const fallback = await caches.match(OFFLINE_URL, { cacheName: OFFLINE_CACHE })
      return fallback || new Response('Pivot OS needs a connection. Reconnect and try again.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  })())
})
