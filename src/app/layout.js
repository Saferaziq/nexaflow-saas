import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'NexaFlow SaaS - Restoran UMKM',
  description: 'Sistem manajemen restoran modern dengan QR Code',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}