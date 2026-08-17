import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: 'Pivot OS',
  description: "DJ Eksteen's mobile-first Founder Operating System",
  applicationName: 'Pivot OS',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pivot OS',
  },
  icons: {
    icon: '/pwa-192x192.svg',
    apple: '/apple-touch-icon.svg',
  },
}
