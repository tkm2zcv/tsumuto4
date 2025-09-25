const CACHE_NAME = 'tsumuto-v2';
// HTML(ドキュメント)はキャッシュしない。初期プリキャッシュは最小限。
const urlsToCache = [
  '/manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチイベントでキャッシュを使用
self.addEventListener('fetch', (event) => {
  // GET以外は無視
  if (event.request.method !== 'GET') return;

  const acceptHeader = event.request.headers.get('accept') || '';
  const isDocument = event.request.mode === 'navigate' || acceptHeader.includes('text/html');

  // ドキュメント(HTML)は常にネットワーク優先（キャッシュしない）
  if (isDocument) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('オフラインです', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({ 'Content-Type': 'text/plain' })
      }))
    );
    return;
  }

  // 静的アセット等はキャッシュ優先でフォールバック
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
