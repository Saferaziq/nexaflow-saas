'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    // Pastikan kode berjalan di sisi client (browser)
    if (typeof window === 'undefined') return;
    
    // Cek apakah browser mendukung Service Worker
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('Service Worker registered successfully.');
      } catch (err) {
        console.error('SW registration failed:', err);
      }
    };

    // Daftarkan SW setelah halaman selesai dimuat
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}