/* /sw.js */
/* Service Worker para Letro: cacheo offline y carga rápida */

"use strict";

const CACHE_VERSION = "letro-pwa-v1";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./home.html",
  "./register.html",
  "./perfil.html",
  "./juego-dibujar-letra.html",
  "./juego-letra-sonido.html",
  "./juego-palabras.html",
  "./juego-silabas.html",
  "./juego-unir-dibujos.html",
  "./juego-unir-mayusculas.html",
  "./css/styles.css",
  "./js/config.js",
  "./js/app.js",
  "./js/juegos.js",
  "./js/pwa.js",
  "./manifest.json",
  "./assets/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function isHttpOk(response) {
  return response && response.status >= 200 && response.status < 300;
}

function isSameOrigin(url) {
  try {
    return new URL(url).origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (!isSameOrigin(req.url)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(req, { ignoreSearch: true });

      // HTML: network-first para evitar “app” desactualizada, con fallback offline
      const acceptsHtml = req.headers.get("accept")?.includes("text/html");
      if (acceptsHtml) {
        try {
          const res = await fetch(req);
          if (isHttpOk(res)) cache.put(req, res.clone());
          return res;
        } catch {
          return (
            cached ||
            (await cache.match("./index.html")) ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          );
        }
      }

      // Assets (css/js/svg): cache-first + revalidación en background
      if (cached) {
        event.waitUntil(
          (async () => {
            try {
              const res = await fetch(req);
              if (isHttpOk(res)) await cache.put(req, res.clone());
            } catch {
              // Silencioso: seguimos con lo cacheado
            }
          })()
        );
        return cached;
      }

      try {
        const res = await fetch(req);
        if (isHttpOk(res)) await cache.put(req, res.clone());
        return res;
      } catch {
        return new Response("Offline", { status: 503, statusText: "Offline" });
      }
    })()
  );
});

// app/sw.js — Service worker mínimo: activación rápida sin caché obligatoria (maquetación).
self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
