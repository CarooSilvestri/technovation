/* /js/pwa.js */
/* Registro de PWA (service worker) para Letro */

(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  // Evita errores en entornos no seguros (file://). En localhost sí suele funcionar.
  var isLocalhost =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === "[::1]";

  if (location.protocol !== "https:" && !isLocalhost) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("sw.js")
      .catch(function () {
        // Silencioso: la app web debe seguir funcionando igual
      });
  });
})();

