const CACHE_NAME = 'trip-planner-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  './icon.png'
];

// 安裝時進行快取
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 攔截網路請求，優先使用快取（離線支援的核心）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取裡有，就回傳快取；如果沒有，就透過網路抓取
        return response || fetch(event.request);
      })
  );
});
