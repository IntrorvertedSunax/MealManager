// FIX: Added a triple-slash directive to load the Web Worker library types,
// which resolves the 'ServiceWorkerGlobalScope' not found error and allows
// for correct type inference of service worker APIs.
/// <reference lib="webworker" />

const CACHE_NAME = 'meal-management-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// FIX: Explicitly typed the `event` parameter as `ExtendableEvent`. The `install`
// event provides this event type, which has the `waitUntil` method. The default
// inferred type was `Event`, which lacks this method.
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching basic assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// FIX: Explicitly typed the `event` parameter as `ExtendableEvent`. The `activate`
// event provides this event type, which has the `waitUntil` method. The default
// inferred type was `Event`, which lacks this method.
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

// FIX: Explicitly typed the `event` parameter as `FetchEvent`. The `fetch`
// event provides this event type, which has the `respondWith` method and
// `request` property. The default inferred type was `Event`, which lacks these members.
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, go to the network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response to cache.
            // Opaque responses are for cross-origin requests (like CDNs) that we can't inspect.
            if (!response || (response.status !== 200 && response.type !== 'opaque')) {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
