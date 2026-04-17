const CACHE_NAME = 'fivetimes-cache-v12';
const STATIC_ASSETS = [
  '/tasbeh',
  '/tasbeh/index.html',
  '/tasbeh/style.css?v=3.1',
  '/tasbeh/app.js?v=3.1',
  '/tasbeh/icon.svg',
  '/tasbeh/icon-192.png',
  '/tasbeh/icon-512.png',
  '/tasbeh/manifest.json'
];

// Install: pre-cache all static assets
self.addEventListener('install', event => {
  self.skipWaiting(); // activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for JS/CSS (always get fresh code), cache-first for images
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname === '/tasbeh' || url.pathname === '/tasbeh/') {
    event.respondWith(
      caches.match('/tasbeh/index.html').then(r => r || fetch(event.request))
    );
    return;
  }

  // JS & CSS: network first, fallback to cache
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return r;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Everything else: cache first
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});
