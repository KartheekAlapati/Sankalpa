/* Phase 1 is deliberately network-only. Never cache auth, API, documents or user data.
   The installable app requires a connection; offline writes are a later audited feature. */
self.addEventListener('install', () => { /* Activation waits until previous clients close. */ })
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()) })
// No fetch handler, Cache Storage, background sync or third-party caching.
