import '../polyfills';
import './globals.css';
import RegisterSW from '@/components/RegisterSW';

export const metadata = {
  metadataBase: new URL('https://nexaflowkasir.it.com'),
  title: {
    default: 'NexaFlow — Sistem Kasir & Manajemen Restoran',
    template: '%s | NexaFlow'
  },
  description: 'Sistem Kasir (POS) & Manajemen Restoran modern berbasis web. Dilengkapi fitur Self-Order QR, Kitchen Display System (KDS), Promo Diskon, Panggilan Suara (TTS), dan Cetak Bluetooth.',
  keywords: ['sistem kasir', 'aplikasi restoran', 'pos kafe', 'kasir online', 'qris dinamis', 'kitchen display', 'nexaflow', 'saas restoran'],
  authors: [{ name: 'NexaFlow' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NexaFlow',
  },
  icons: {
    icon: '/logo-nexaflow.png',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'NexaFlow — Sistem Kasir & Manajemen Restoran',
    description: 'Ubah cara kafe & resto Anda bekerja. Fitur lengkap mulai dari QR Order, Promo, hingga Panggilan Suara otomatis.',
    url: 'https://nexaflowkasir.it.com',
    siteName: 'NexaFlow',
    images: [
      {
        url: '/logo-nexaflow.png', // Pastikan file ini ada di folder public
        width: 800,
        height: 600,
        alt: 'NexaFlow Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaFlow — Sistem Kasir Modern',
    description: 'Kelola kafe Anda lebih cepat dan cerdas dengan NexaFlow.',
    images: ['/logo-nexaflow.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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