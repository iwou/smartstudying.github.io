var version = 'v1::1';
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(version)
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/css/index.css',
          '/js/index.js',
          'index.json',
          'history.html',
          'share.html',
        ]);
      })
  );
});
self.addEventListener("fetch", function(event) {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);
        if(cached){
          event.waitUntil(async function() {
          if (!event.clientId) return cached || networked;
          const client = await clients.get(event.clientId);
          if (!client) return;
          self.clients.matchAll().then(function (clients){
            clients.forEach(function(client){
              client.postMessage({
                url: event.request.url
              });
            });
          });

        }());
        }
        return cached || networked;

        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();
          caches
            .open(version)
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            });
          return response;
        }
        function unableToResolve () {
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function() {
      })
  );
});
