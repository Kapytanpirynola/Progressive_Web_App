const CACHE_NAME = 'cv-cache-v1';

const urlToCache = [
    './',
    './index.html',
    './styles.css',
    './main.js',

    // Imágenes reales (ajusta según tu estructura)
    './assets/A.jpeg',
    './assets/cv.png'
];

// INSTALL
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlToCache);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.log('Error en cache:', err))
    );
});

// ACTIVATE
self.addEventListener('activate', e => {
    const whitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (!whitelist.includes(name)) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener('fetch', e => {
    e.respondWith(
        // Primero intenta obtener el recurso del cache
        caches.match(e.request)
        .then(response => {
            if (response) {
                
                return response; // Devuelve el recurso cacheado
            }   
            return fetch(e.request); // Si no está en cache, lo busca en la red
        })
    );
});



