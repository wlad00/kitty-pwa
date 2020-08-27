
const staticVersion = 'v0';

const staticFiles = [
    './',
    './manifest.json',
    './index.html',
    './images/icons/icon-128x128.png',
    './images/icons/icon-192x192.png',
    './images/icons/icon-144x144.png',

    './images/words.png',
    './images/text.png',
    './images/book6.png',

    './css/main.css',

    './js/app.js',
    './js/main.js',

];


/*-------- 1) PUT ALL to Cache --- --  -- -*/

self.addEventListener('install', async event => {

    const cache = await caches.open(staticVersion);
    await cache.addAll(staticFiles);

});



/*------------- 2) FETCH -----------------------------*/

self.addEventListener('fetch', event => {

    event.respondWith(

        caches.match(event.request).then((res)=>{


            if(res)
                return res;
            else
                return fetch(event.request);
        })
    );
});


