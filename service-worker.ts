/// <reference lib="webworker" />
declare const workbox: any;

// 1. Import Workbox from its official CDN.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// 2. Set up precaching for the application shell.
// These files are cached upon installation, ensuring the app can always load.
const { precacheAndRoute, createHandlerBoundToURL } = workbox.precaching;
precacheAndRoute([
  { url: '/', revision: 'v1' },
  { url: '/index.html', revision: 'v1' },
  { url: '/index.tsx', revision: 'v1' }, // Main application logic
  { url: '/manifest.json', revision: 'v1' },
  { url: '/icon-192x192.png', revision: 'v1' },
  { url: '/icon-512x512.png', revision: 'v1' },
]);

// 3. Set up routing for different types of requests.
const { registerRoute, NavigationRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Handle SPA navigation. All navigation requests will be served the precached /index.html.
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);


// 4. Implement runtime caching strategies for assets loaded from CDNs.

// Google Fonts Stylesheets: Use StaleWhileRevalidate to get updates in the background.
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Google Fonts Webfonts: Use CacheFirst as they are versioned and rarely change.
registerRoute(
  ({url}) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses for cross-origin requests
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 Year
        maxEntries: 30,
      }),
    ],
  })
);

// TailwindCSS from CDN: Use StaleWhileRevalidate.
registerRoute(
  ({url}) => url.origin === 'https://cdn.tailwindcss.com',
  new StaleWhileRevalidate({
    cacheName: 'tailwindcss-cdn',
  })
);

// React & other libs from aistudiocdn.com: Use CacheFirst as these are versioned libraries.
registerRoute(
  ({url}) => url.origin === 'https://aistudiocdn.com',
  new CacheFirst({
    cacheName: 'aistudio-cdn-libs',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 Year
      }),
    ],
  })
);

// 5. Add a listener to activate the new service worker immediately.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
  }
});
