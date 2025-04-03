import './globals.css'
import type { Metadata } from 'next'
import InactivityWatcher from './InactivityWatcher'

export const metadata: Metadata = {
  title: 'Welcome IQ',
  description: 'Professional check-in and kiosk experience for contractors and teams.',
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/favicon-32x32.png',
    apple: '/icon-192x192.png'
  },
  openGraph: {
    title: 'Welcome IQ',
    description: 'Professional check-in and kiosk experience for contractors and teams.',
    images: ['/logo.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <InactivityWatcher />
        {children}
      </body>
    </html>
  )
}
