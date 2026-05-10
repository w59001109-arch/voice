const CACHE = 'breeze-asr-v2';
const ASSETS = ['/voice/', '/voice/index.html', '/voice/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  const OLD = ['breeze-asr-v1', 'breeze-asr-v0'];
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => OLD.includes(k)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/transcribe') || e.request.url.includes('/health')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
