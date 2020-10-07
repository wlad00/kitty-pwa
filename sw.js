
const staticVersion = 'static-cache-v0';

const staticFiles = [

    /* заглушки */

    './offline.html',
    './no.html',
];



/* ------  REMOVE OLD   ----- -------*/

self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();

    const checkKeys = cachesKeys.map(async key => {
        if (![staticVersion].includes(key)) {
            await caches.delete(key);
        }
    });

    await Promise.all(checkKeys);

});


/*--------  PUT STATIC --- --  -- -*/


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


async function checkOnline(req) {


    /* FROM INTERNET */

    try {
        const res = await fetch(req);
        return res;

        /* NO INTERNET */

    } catch (error) {

        if (req.destination === 'document') {

            return caches.match('./offline.html');
        }
        else
            return caches.match('./no.html');

    }
}
