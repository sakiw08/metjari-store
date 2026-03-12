const CACHE_NAME = 'mimnoon-store-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './products.html',
  './cart.html',
  './login.html',
  './about.html',
  './contact.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// تفعيل: حذف الكاشات القديمة عند تغيير CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

// جلب الطلبات: استراتيجية cache-first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
