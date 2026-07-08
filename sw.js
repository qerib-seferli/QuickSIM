// Köhnə keşləri və servisi tamamilə dövriyyədən çıxaran təmizləyici Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Heç bir keşi oxuma, birbaşa internetdən (şəbəkədən) çək
  event.respondWith(fetch(event.request));
});
