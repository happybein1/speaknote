const CACHE_NAME = 'speaknote-v1-4';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json',
  '/icons/icon-72x72.png', '/icons/icon-96x96.png', '/icons/icon-128x128.png',
  '/icons/icon-144x144.png', '/icons/icon-152x152.png', '/icons/icon-192x192.png',
  '/icons/icon-384x384.png', '/icons/icon-512x512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).catch(() => caches.match('/index.html'))));
});