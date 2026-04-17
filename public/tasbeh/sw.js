const CACHE_NAME = 'fivetimes-cache-v4';
const urlsToCache = [
  '/tasbeh/index.html',
  '/tasbeh/style.css?v=1.2',
  '/tasbeh/app.js?v=1.2',
  '/tasbeh/icon.svg',
  '/tasbeh/icon-192.png',
  '/tasbeh/icon-512.png',
  '/tasbeh/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened fivetimes cache v4');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
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
