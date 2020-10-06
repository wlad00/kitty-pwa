
const staticVersion = 'static-cache-v1';
const dynamicVersion = 'dynamic-cache-v0';

const staticFiles = [
    './',
    // './index.html',
    /*'./images/icons/icon-128x128.png',
    './images/icons/icon-192x192.png',*/

    // './css/main.css',
    // './js/app.js',
    // './js/main.js',

/* заглушки */
    './offline.html',
    './images/no-image.jpg'
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


/*self.addEventListener('fetch', event => {

    // console.log('request->');
    // console.log(event.request);

    event.respondWith(

        caches.match(event.request).then((res)=>{


            if(res)
                return res;
            else
                return fetch(event.request);
        })
    );
});*/

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
        // const cachedRes = await cache.match(req);

        /* FROM CACHE -> */
        /*if (cachedRes) {
            return cachedRes;
            /!* вместо всех .html достаем заглушку offline.html*!/
        } else */

            if (req.url.indexOf('.html') !== -1) {

            /*console.log('no internet caches =>');
            console.log(caches);*/

            return caches.match('./offline.html');
            /* вместо всех .jpg достаем заглушку no-image.jpg*/
        }  else {
            return caches.match('./images/no-image.jpg');
        }
    }
}
