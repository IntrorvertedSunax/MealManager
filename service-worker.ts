/// <reference lib="webworker" />

const CACHE_NAME = 'meal-management-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching basic assets');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  // For SPAs, navigation requests should always serve the app shell (index.html).
  // This allows the client-side router to handle deep links like /members or /calendar.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cachedResponse) => {
        // Return index.html from cache, or fetch it if not available.
        // This ensures the app loads, and the router can take over.
        return cachedResponse || fetch(event.request);
      })
    );
    return;
  }

  // For other requests (JS, CSS, images), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, go to the network and cache the result.
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response to cache.
            // Opaque responses are for cross-origin requests (like CDNs) and are OK to cache.
            if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});
