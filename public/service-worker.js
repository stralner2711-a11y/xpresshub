const CACHE_NAME = 'xpressintra-v57-profile-photo';
const APP_FILES = [
  './',
  './index.html',
  './download.html',
  './xpressbudet-logo-transparent.png',
];

function shouldBypassCache(request) {
  const url = new URL(request.url);
  const isSupabaseHost = url.hostname === 'supabase.co' || url.hostname.endsWith('.supabase.co');
  return (
    isSupabaseHost
    || url.pathname.endsWith('/app-config.js')
    || url.pathname.endsWith('/version.json')
    || url.pathname.endsWith('/preview-demo.html')
    || url.pathname.startsWith('/auth/')
    || url.pathname.startsWith('/rest/')
    || url.pathname.startsWith('/storage/')
  );
}

function shouldCache(request, response) {
  if (!response || !response.ok || request.method !== 'GET') return false;
  if (shouldBypassCache(request)) return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return (
    request.destination === 'document'
    || request.destination === 'script'
    || request.destination === 'style'
    || request.destination === 'image'
    || request.destination === 'font'
    || url.pathname.startsWith('/assets/')
  );
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || shouldBypassCache(event.request)) return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (shouldCache(event.request, response)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return caches.match(event.request);
      })
  );
});
