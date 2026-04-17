const CACHE_NAME = 'tasbeh-cache-v3';
const urlsToCache = [
  '/tasbeh/index.html',
  '/tasbeh/style.css?v=1.1',
  '/tasbeh/app.js?v=1.1',
  '/tasbeh/icon.svg',
  '/tasbeh/icon-192.png',
  '/tasbeh/icon-512.png',
  '/tasbeh/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v3');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle directory requests by serving index.html from cache
  if (url.pathname === '/tasbeh/' || url.pathname === '/tasbeh') {
    event.respondWith(
      caches.match('/tasbeh/index.html').then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If fetch fails (offline/error), try to return index.html for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/tasbeh/index.html');
          }
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
