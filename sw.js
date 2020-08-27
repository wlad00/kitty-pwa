
const staticCacheName = 'static-cache-v0';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
    './',
    './index.html',
    './images/icons/icon-128x128.png',
    './images/icons/icon-192x192.png',

    './css/main.css',
    './js/app.js',
    './js/main.js',

/* заглушки */
    './offline.html',
    './images/no-image.jpg'
];

/*-----------------------------*/

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    console.log('Service worker has been installed');
});



self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();

    const checkKeys = cachesKeys.map(async key => {
        if (![staticCacheName, dynamicCacheName].includes(key)) {
            await caches.delete(key);
        }
    });

    await Promise.all(checkKeys);


    console.log('Service worker has been activated');
});

self.addEventListener ('activate', async () => {
    // Это будет вызвано только один раз, когда сервисный работник активирован.
    try {
        const options = {}
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(JSON.stringify(subscription))
    } catch (err) {
        console.log('Error', err)
    }
});


/*------------- FETCH -----------------------------*/

self.addEventListener('fetch', event => {
    console.log(`Trying to fetch ${event.request.url}`);

    event.respondWith(checkCache(event.request));
});


async function checkCache(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || checkOnline(req);
}

/*--------------------------------------------------------*/

async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);
        if (cachedRes) {
            return cachedRes;
        } else if (req.url.indexOf('.html') !== -1) {
            return caches.match('./offline.html');
        } else {
            return caches.match('./images/no-image.jpg');
        }
    }
}