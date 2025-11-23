const CACHE_NAME = 'spectrum-pwa-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  // simple cache-first strategy for assets
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  )
})
