import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default:  'DentaCare Clinic',
    template: '%s | DentaCare Clinic',
  },
  description: 'Professional dental care you can trust. Book your appointment online.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}