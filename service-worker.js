const CACHE_NAME = 'perfectly-secret-cache-v1';
// Add all the files and directories you want to cache for offline use
const urlsToCache = [
  '/', // Represents the root, often serving index.html
  '/index.html',
  // HTML files
  '/click_on_index/decrypt.html',
  '/click_on_index/encrypt.html',
  '/click_on_index/importkey.html',
  '/click_on_index/manual.html',
  '/click_on_index/shortenkey.html',
  '/click_on_index/transferkey.html',
  '/click_on_index/Donate.html',
  '/click_on_index/randomcharactergen/trng-image.html', // Corrected path based on file list
  // CSS files (adjust paths if needed)
  '/click_on_index/randomcharactergen/css/common.css',
  '/click_on_index/randomcharactergen/css/trng-photo.css',
  '/click_on_index/randomcharactergen/css/lib/normalize.css',
  '/click_on_index/randomcharactergen/css/lib/ui-lightness/jquery-ui.css',
  // JS library files (adjust paths if needed)
  '/click_on_index/randomcharactergen/js/lib/jquery.js',
  '/click_on_index/randomcharactergen/js/lib/jquery-ui.js',
  '/click_on_index/randomcharactergen/js/lib/filesaver.js',
  '/click_on_index/randomcharactergen/js/lib/cryptojs-core.js',
  '/click_on_index/randomcharactergen/js/lib/cryptojs-x64core.js',
  '/click_on_index/randomcharactergen/js/lib/cryptojs-enc-base64.js',
  // Your custom JS files (adjust paths if needed)
  '/click_on_index/randomcharactergen/js/common.js',
  '/click_on_index/randomcharactergen/js/export.js',
  '/click_on_index/randomcharactergen/js/trng-photo.js',
  '/click_on_index/randomcharactergen/js/tests-randomness.js',
  // Other JS potentially needed (like QRCode.js, jsQR.js - add paths if used directly in HTML)
  // '/click_on_index/jsQR.js', // Example, verify location and add if needed
  // '/click_on_index/QRCode.js', // Example, verify location and add if needed
  // Images
  '/click_on_index/PerfectlySecretBTCaddress.png' // Example image
];

// Install event: Cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use { cache: 'reload' } to ensure fresh files are fetched during install
        const promises = urlsToCache.map(url => {
          return cache.add(new Request(url, {cache: 'reload'})).catch(err => {
            console.warn(`Failed to cache ${url}: ${err}`); // Log specific file caching errors
          });
        });
        return Promise.all(promises);
      })
      .catch(error => {
        console.error('Failed to open cache or cache files during install:', error);
      })
  );
});


// Fetch event: Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Optional: Cache fetched resources dynamically (use with caution)
            // if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            //   return networkResponse;
            // }
            // const responseToCache = networkResponse.clone();
            // caches.open(CACHE_NAME)
            //   .then(cache => {
            //     cache.put(event.request, responseToCache);
            //   });
            return networkResponse;
          }
        ).catch(error => {
           console.log('Fetch failed; returning offline page instead.', error);
           // Optional: return a specific offline fallback page:
           // return caches.match('/offline.html');
         });
      }
    )
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});