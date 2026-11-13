const CACHE_NAME = 'nexaflow-cache-v100-rotation'; // ✅ Versi dinaikkan agar cache lama terhapus
const urlsToCache = [
  '/'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  // ✅ JANGAN SIMPAN file JS, _next, dan manifest.json di cache.
  // Selalu ambil versi terbaru dari internet agar rotasi langsung aktif.
  if (
    event.request.url.includes('/_next/') || 
    event.request.url.includes('js') || 
    event.request.url.includes('manifest.json')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});