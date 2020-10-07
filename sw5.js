
const staticVersion = 'static-cache-v0';
const dynamicVersion = 'dynamic-cache-v0';

const staticFiles = [

    /* заглушки */
    './offline.html',

    './css/no.css',
    './js/no.js',
    './images/no.png'
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

});


/*-------- 2) PUT ALL to Cache --- --  -- -*/


self.addEventListener('install', async event => {

    const cacheStatic = await caches.open(staticVersion);
    await cacheStatic.addAll(staticFiles);

});



/*------------- FETCH -----------------------------*/

self.addEventListener('fetch', event => {

    event.respondWith(
        checkOnline(event.request)
    );
});

async function checkCache(req) {

    // console.log('/2 checkCache---');

const cachedResponse = null;
    // const cachedResponse = await caches.match(req);

    // кэш ? КЭШ : Онлайн

    return cachedResponse || checkOnline(req);
}

/*--------------------------------------------------------*/

async function checkOnline(req) {

    // console.log('/3 checkOnline---');

    /*const res = await fetch(req);
    return res;*/

    /* GET FILE FROM INTERNET */
    // const cacheDynamic = await caches.open(dynamicVersion);


    try {
        const res = await fetch(req);
        // await cacheDynamic.put(req, res.clone());
        return res;


        /* NO INTERNET */
    } catch (error) {

        if (req.destination === 'document') {

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
        else
            return caches.match('./js/no.js');
    }
}
