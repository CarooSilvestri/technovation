// app/js/app.js — Navegación de pasos en registro y toggles de maquetación del perfil.

(function () {
  "use strict";

  /** @param {string} sel */
  function qs(sel) {
    return document.querySelector(sel);
  }

  /** @param {string} sel */
  function qsa(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  // Registro por pasos
  const registroRoot = qs("[data-registro]");
  if (registroRoot) {
    const steps = qsa("[data-step]");
    const btnNext = qs("[data-registro-next]");
    const btnPrev = qs("[data-registro-prev]");
    const btnSubmit = qs("[data-registro-submit]");
    let current = 0;

    function showStep(i) {
      current = Math.max(0, Math.min(i, steps.length - 1));
      steps.forEach((el, idx) => {
        el.hidden = idx !== current;
      });
      if (btnPrev) btnPrev.hidden = current === 0;
      if (btnNext) btnNext.hidden = current === steps.length - 1;
      if (btnSubmit) btnSubmit.hidden = current !== steps.length - 1;
      qsa(".app-step-indicator [data-step-dot]").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === current);
        dot.classList.toggle("done", idx < current);
      });
    }

    qsa(".avatar-pick").forEach((el) => {
      el.addEventListener("click", () => {
        qsa(".avatar-pick").forEach((a) => a.classList.remove("selected"));
        el.classList.add("selected");
      });
    });

    btnNext?.addEventListener("click", () => showStep(current + 1));
    btnPrev?.addEventListener("click", () => showStep(current - 1));
    showStep(0);
  }

  // Perfil: blanco y negro y sonido (solo maquetación)
  const bwToggle = qs("[data-profile-bw]");
  if (bwToggle) {
    bwToggle.addEventListener("change", () => {
      document.body.classList.toggle("profile-bw", bwToggle.checked);
    });
  }

  // Service worker (solo en producción / file:// puede fallar; se ignora)
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
})();
