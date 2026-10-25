// Bump CACHE_NAME when the caching strategy or PRECACHE list changes; old caches are deleted on activate.
const CACHE_NAME = 'spectrum-pwa-v2';
const PRECACHE = ['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

async function cacheResponse(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GETs; never intercept form posts or third-party requests.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Network-first for the HTML shell so new deployments are picked up; fall back offline.
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse('/', response))
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Cache-first for static assets; Vite's hashed filenames make cached copies safe to reuse.
  event.respondWith(
    caches
      .match(request)
      .then(
        (cached) => cached ?? fetch(request).then((response) => cacheResponse(request, response))
      )
  );
});
