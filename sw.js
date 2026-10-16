/* AI Leaders — Service Worker (PWA): oflayn ishlash va tez yuklash */
const CACHE = 'ai-leaders-v2.7.0';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest',
  '/assets/icon-192.png', '/assets/icon-512.png', '/assets/apple-touch-icon.png', '/assets/og.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  /* HTML: tarmoq birinchi, oflayn bo'lsa kesh */
  if (r.mode === 'navigate' || (r.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('/index.html', cp)); return res; })
      .catch(() => caches.match('/index.html')));
    return;
  }
  /* boshqa resurslar: kesh birinchi, fonda yangilash */
  e.respondWith(caches.match(r).then(cached => {
    const net = fetch(r).then(res => { if (res && res.status === 200) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
      .catch(() => cached);
    return cached || net;
  }));
});
