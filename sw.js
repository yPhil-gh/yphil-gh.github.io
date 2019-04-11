const cacheName = 'v1';

console.log('SW: I am alive, the cache is [%s]', cacheName);

const cacheAssets = [
    'index.html',
    'style.css',
    'favicon.ico'
];


self.addEventListener('install', (e) => {
    console.log('Service worker: Installed');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                return cache.addAll(cacheAssets);
            })
    );
});
