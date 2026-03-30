// app/sw.js — Service worker mínimo: activación rápida sin caché obligatoria (maquetación).
self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
