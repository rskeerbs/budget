const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js'
    '/manifest.webmanifest',
    '/assets/css/style.css',
    '/assets/images/icons/icon-152x152.png',
    '/assets/images/icons/icon-512x512.png',
    '/transaction.js'
  ];
  
  const CACHE_NAME = "static-cache-v2";
  const DATA_CACHE_NAME = "data-cache-v1";
  
  self.addEventListener('install', function(evt) {
      evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log("Your files were pre-cached successfully!");
          return cache.addAll(FILES_TO_CACHE);
        })
      );
  
      self.skipWaiting();
    });
  
    self.addEventListener("activate", function(evt) {
      evt.waitUntil(
        caches.keys().then(keyList => {
          return Promise.all(
            keyList.map(key => {
              if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                console.log("Removing old cache data", key);
                return caches.delete(key);
              }
            })
          );
        });
      );
  
      self.clients.claim();
    });
  
    self.addEventListener('fetch', function(evt) {
      evt.respondWith(
          caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
              return response || fetch(evt.request);
            });
          })
        );