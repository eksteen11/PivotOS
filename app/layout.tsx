import type { Viewport } from 'next'

import { ServiceWorkerRegistration } from '@/components/providers/ServiceWorkerRegistration'

import { siteMetadata } from './site-metadata'
import './globals.css'
import './pivot.css'

export const metadata = siteMetadata
export const viewport: Viewport = {
  themeColor: '#17724b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
