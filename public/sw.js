// NexaFlow Service Worker — Minimal untuk PWA installability
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch handler kosong — biarkan network normal.
self.addEventListener('fetch', () => {});