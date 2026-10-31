import './globals.css';
import RegisterSW from '@/components/RegisterSW';

export const metadata = {
  title: 'NexaFlow — Kasir Restoran',
  description: 'Sistem Kasir & Manajemen Restoran NexaFlow',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NexaFlow',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#F4EFE9', 
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}