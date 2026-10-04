const CACHE_NAME = 'speaknote-v1-6';
// Relative paths so the worker works from whatever folder it is served from.
const STATIC_ASSETS = ['./', './index.html', './manifest.json',
  './icons/icon-72x72.png', './icons/icon-96x96.png', './icons/icon-128x128.png',
  './icons/icon-144x144.png', './icons/icon-152x152.png', './icons/icon-192x192.png',
  './icons/icon-384x384.png', './icons/icon-512x512.png',
  './icons/maskable-192.png', './icons/maskable-512.png'];

self.addEventListener('install', (e) => {
  // Cache each file separately: one missing file must not make the whole
  // install fail (addAll is all-or-nothing, and a failed worker install can
  // keep the browser from offering "Install app").
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => Promise.all(STATIC_ASSETS.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Pages: network first so a new version lands on the next open; fall back
  // to the cached copy when offline.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
