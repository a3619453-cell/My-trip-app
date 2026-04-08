const CACHE_NAME = 'trip-planner-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. 安裝階段：將必備檔案存入快取
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // 強制立刻啟用最新的 Service Worker
});

// 2. 啟動階段：清除舊版本的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // 立刻接管所有開啟的網頁
});

// 3. 攔截網路請求：斷網時提供快取檔案
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取裡有，就回傳快取；如果沒有，就透過網路抓取
        return response || fetch(event.request);
      }).catch(() => {
        // 如果連網路都失敗（斷網），且請求的是 HTML，可以考慮回傳 index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
