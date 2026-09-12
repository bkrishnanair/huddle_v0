// Deliberately cache only public build assets. Never cache documents, RSC,
// API responses, user data, or third-party resources (including Maps tiles).
const CACHE_PREFIX = 'huddle-';
const OFFLINE_CACHE = 'huddle-offline-v2';
const ASSET_CACHE = 'huddle-assets-v2';
const OFFLINE_URL = '/offline.html';
const MAX_ASSETS = 128;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then(cache => cache.add(OFFLINE_URL)));
  // Updates wait for existing tabs to close or an explicit user-approved reload.
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) &&
      name !== OFFLINE_CACHE && name !== ASSET_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function offlineResponse() {
  try {
    const cached = await (await caches.open(OFFLINE_CACHE)).match(OFFLINE_URL);
    if (cached) return cached;
  } catch { /* Storage may be unavailable in restricted browsers. */ }
  return new Response('Huddle is offline. Reconnect and reload to see live events.', {
    status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

async function rememberAsset(request, response) {
  try {
    // No opaque responses, redirects, errors or server-declared private content.
    if (!response.ok || response.redirected || response.type === 'opaque' ||
      /no-store|private/i.test(response.headers.get('Cache-Control') || '')) return;
    const cache = await caches.open(ASSET_CACHE);
    await cache.put(request, response);
    const keys = await cache.keys();
    await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_ASSETS)).map(key => cache.delete(key)));
  } catch { /* Quota/cache failures must not turn successful requests into errors. */ }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    // No authenticated HTML is persisted; offline always shows the public fallback.
    event.respondWith(fetch(request).catch(offlineResponse));
    return;
  }

  if (!url.pathname.startsWith('/_next/static/') &&
      !url.pathname.startsWith('/icons/') && !url.pathname.startsWith('/fonts/')) return;

  // Register the lifetime promise synchronously, before any asynchronous cache read.
  let finish;
  event.waitUntil(new Promise(resolve => { finish = resolve; }));
  event.respondWith((async () => {
    try {
      let cached;
      try { cached = await (await caches.open(ASSET_CACHE)).match(request); } catch {}
      if (cached) return cached;
      const response = await fetch(request);
      await rememberAsset(request, response.clone());
      return response;
    } finally { finish(); }
  })());
});
