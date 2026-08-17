import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pivot OS',
    short_name: 'Pivot',
    description: "DJ Eksteen's mobile-first Founder Operating System",
    start_url: '/today',
    display: 'standalone',
    background_color: '#f7f7f4',
    theme_color: '#17724b',
    orientation: 'any',
    icons: [
      {
        src: '/pwa-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
