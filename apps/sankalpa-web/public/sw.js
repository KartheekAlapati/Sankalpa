const CACHE_VERSION = 'sankalpa-shell-v13'
const SHELL_URLS = ['/', '/today', '/manifest.webmanifest', '/icons/mark.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/maskable-512.png']

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(SHELL_URLS)))
})

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('sankalpa-shell-') && key !== CACHE_VERSION).map(key => caches.delete(key)))),
    self.clients.claim(),
  ]))
})

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting()
  if (event.data?.type === 'CACHE_ASSETS' && Array.isArray(event.data.urls)) {
    const urls = event.data.urls.filter(value => {
      if (typeof value !== 'string') return false
      const url = new URL(value, self.location.origin)
      return url.origin === self.location.origin && url.pathname.startsWith('/assets/')
    })
    event.waitUntil(caches.open(CACHE_VERSION).then(cache => Promise.all(urls.map(url => cache.add(url).catch(() => undefined)))))
  }
})

const cacheableAsset = request => request.destination === 'script' || request.destination === 'style' || request.destination === 'font' || request.destination === 'image' || request.url.endsWith('/manifest.webmanifest')

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || request.headers.has('authorization')) return

  if (request.mode === 'navigate') {
    event.respondWith(caches.match('/today').then(cached => {
      if (!self.navigator.onLine && cached) return cached
      return fetch(request).then(response => {
        if (response.ok) void caches.open(CACHE_VERSION).then(cache => cache.put('/today', response.clone()))
        return response
      }).catch(() => cached ?? Response.error())
    }))
    return
  }

  if (cacheableAsset(request)) {
    event.respondWith(caches.match(request).then(cached => cached ?? fetch(request).then(response => {
      if (response.ok && response.type === 'basic') void caches.open(CACHE_VERSION).then(cache => cache.put(request, response.clone()))
      return response
    })))
  }
})
