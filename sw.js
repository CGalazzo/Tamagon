const CACHE_NAME = "tamagon-companion-v0.18.59";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./assets/explorations/pantano.png","./assets/explorations/montanha.png","./assets/explorations/vulcao.png","./assets/explorations/usina-eletrica.png","./assets/explorations/dojo-afk.png","./assets/explorations/caverna-congelada.png","./assets/furniture/comfortable-bed.png","./assets/furniture/better-feeder.png","./assets/furniture/upgraded-bathtub.png","./assets/furniture/play-corner.png","./assets/furniture/training-bookshelf.png","./assets/furniture/luxury/royal-bed.png","./assets/furniture/luxury/premium-feeder.png","./assets/furniture/luxury/spa-bathtub.png","./assets/furniture/luxury/deluxe-play-corner.png","./assets/furniture/luxury/pro-training-corner.png","./assets/actions/punching-bag.png","./assets/actions/play-ball.png","./assets/actions/oran-berry.png","./assets/actions/bath-foam.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if(event.request.method!=="GET") return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));
      return response;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    return response;
  })));
});
