
const staticVersion = 'static-cache-v2';
const dynamicVersion = 'dynamic-cache-v1';

const staticFiles = [
    './',
    './css/no.css',
    './js/no.js',
    './images/no-image.jpg',

    // './index.html',
    /*'./images/icons/icon-128x128.png',
    './images/icons/icon-192x192.png',*/

    // './css/main.css',
    // './js/app.js',
    // './js/main.js',

/* заглушки */
    // './offline.html',
    //
];



/* ------ 1) REMOVE OLD versions  ----- -------*/

self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();

    const checkKeys = cachesKeys.map(async key => {
        if (![staticVersion, dynamicVersion].includes(key)) {
            await caches.delete(key);
        }
    });

    await Promise.all(checkKeys);


    console.log('Service worker has been activated');
});




/*self.addEventListener ('activate', async () => {
    // Это будет вызвано только один раз, когда сервисный работник активирован.
    try {
        const options = {}
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(JSON.stringify(subscription))
    } catch (err) {
        console.log('Error', err)
    }
});*/

/*-------- 2) PUT ALL to Cache --- --  -- -*/

self.addEventListener('install', async event => {

    const cache = await caches.open(staticVersion);
    await cache.addAll(staticFiles);

    console.log('Service worker has been installed');
});



/*------------- FETCH -----------------------------*/

self.addEventListener('fetch', event => {

    // console.log(`Trying to fetch ${event.request.url}`);

    // console.log('/1 fetch---');

    event.respondWith(
        checkCache(event.request)
    );
});


async function checkCache(req) {

    // console.log('/2 checkCache---');


    const cachedResponse = await caches.match(req);

    // кэш ? КЭШ : Онлайн

    return cachedResponse || checkOnline(req);
}

/*--------------------------------------------------------*/

async function checkOnline(req) {

    // console.log('/3 checkOnline---');

    /*const res = await fetch(req);
    return res;*/

    /* GET FILE FROM INTERNET */
    // const cache = await caches.open(dynamicVersion);
    try {
        const res = await fetch(req);
        // await cache.put(req, res.clone());
        return res;


        /* NO INTERNET */
    } catch (error) {

        console.log(req);

        if (req.url.indexOf('.html') !== -1) {

            return caches.match('./offline.html');
            /* вместо всех .jpg достаем заглушку no-image.jpg*/
        }
        else if(req.url.indexOf('.css') !== -1) {
            return caches.match('./css/no.css');
        }
        else if(req.url.indexOf('.png') !== -1) {
            return caches.match('./images/no-image.jpg');
        }
        else if(req.url.indexOf('.js') !== -1) {
            return caches.match('./js/no.js');
        }
    }
}
