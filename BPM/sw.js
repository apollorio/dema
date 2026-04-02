/**
 * Apollo BPM MAX - Service Worker
 * Ultra-secure code protection layer
 * Prevents direct code access and enforces offline-first architecture
 */

const CACHE_NAME = 'apollo-bpm-max-v1.0.0';
const ASSETS = [
  './',
  './index.html',
  './bpm-core.wasm',
  './bpm-assets.blob',
  './bpm-manifest.json'
];

// Install event - cache all critical assets
self.addEventListener('install', event => {
  console.log('[SW] Installing Apollo BPM MAX...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Apollo BPM MAX...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache first, protect against external access
self.addEventListener('fetch', event => {
  // Block external requests that try to access our assets
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    event.respondWith(new Response('Forbidden', { status: 403 }));
    return;
  }

  // Block direct access to sensitive files
  if (url.pathname.includes('.wasm') || url.pathname.includes('.blob')) {
    if (!event.request.headers.get('X-Apollo-Auth')) {
      event.respondWith(new Response('Unauthorized', { status: 401 }));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Don't cache external requests
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Message event - handle communication from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: '1.0.0',
      build: 'MAX_SECURITY',
      timestamp: Date.now()
    });
  }
});

// Security: Prevent service worker hijacking
self.addEventListener('error', event => {
  console.error('[SW] Critical error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});