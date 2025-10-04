const CACHE_NAME = "ligabem-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/doar.html",
  "/lista.html",
  "/minhas-doacoes.html",
  "/meus-interesses.html",
  "/assets/css/style.css",
  "/assets/js/db.js",
  "/assets/js/firebase-config.js",
  "/assets/js/auth.js",
];

// Instala e faz cache dos arquivos principais
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando nova versão...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // força ativação imediata
});

// Ativa e limpa caches antigos
self.addEventListener("activate", (event) => {
  console.log("[SW] Ativando e limpando caches antigos...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[SW] Deletando cache antigo:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim(); // força o controle imediato da página
});

// Intercepta requests e usa cache inteligente
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // se existir no cache, retorna imediatamente
      if (response) return response;

      // caso contrário, busca online e adiciona ao cache
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;

        const clonedResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return networkResponse;
      });
    })
  );
});
