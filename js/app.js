(function () {
  "use strict";

  var STORAGE_KEY =
    (window.LETRO_CONFIG && window.LETRO_CONFIG.STORAGE_KEY) || "letro_user";

  function initInicio() {
    var body = document.body;
    if (!body || !body.hasAttribute("data-inicio")) return;
    var emojiEl = document.querySelector("[data-home-emoji]");
    if (!nombreEl && !emojiEl) return;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var p = raw ? JSON.parse(raw) : null;
      var n =
        typeof getNombre === "function"
          ? getNombre() || (p && p.nombre && String(p.nombre).trim())
          : p && p.nombre && String(p.nombre).trim();
      if (nombreEl) nombreEl.textContent = n || "explorador";
      if (emojiEl) emojiEl.textContent = (p && p.avatarEmoji) || "🐰";
    } catch (e) {
      if (nombreEl) nombreEl.textContent = "explorador";
      if (emojiEl) emojiEl.textContent = "🐰";
    }
  }

  function loadProfile() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      return p && typeof p === "object" ? p : null;
    } catch (e) {
      return null;
    }
  }

  /** Modo blanco y negro global (persistido en perfil). */
  function applyBwMode() {
    var root = document.documentElement;
    try {
      var p = loadProfile();
      root.classList.toggle("letritas-bw-on", !!(p && p.bw));
    } catch (e) {
      root.classList.remove("letritas-bw-on");
    }
  }

  function saveProfile(patch) {
    var cur = loadProfile() || {};
    var next = {};
    for (var k in cur) {
      if (Object.prototype.hasOwnProperty.call(cur, k)) next[k] = cur[k];
    }
    for (var j in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, j)) next[j] = patch[j];
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  }

  function perfilSubtitle(p) {
    var e = p.edad;
    if (e == null || Number.isNaN(Number(e))) return "EXPLORADOR";
    var n = parseInt(e, 10);
    var ageStr = n + (n === 1 ? " AÑO" : " AÑOS");
    var tag =
      n <= 7 ? "PEQUEÑO EXPLORADOR" : n <= 12 ? "JOVEN EXPLORADOR" : "APRENDIZ";
    return ageStr + " · " + tag;
  }

  function initPerfil() {
    var body = document.body;
    if (!body || !body.hasAttribute("data-perfil")) return;

    var p = loadProfile();
    if (!p || !String(p.nombre || "").trim()) {
      window.location.href = "registro.html";
      return;
    }

    var nombreEl = document.querySelector("[data-perfil-nombre]");
    var subEl = document.querySelector("[data-perfil-subtitulo]");
    var emojiEl = document.querySelector("[data-perfil-emoji]");
    var bwEl = document.querySelector("[data-profile-bw]");
    var soundEl = document.querySelector("[data-profile-sound]");
    var levelBtns = document.querySelectorAll("[data-perfil-level]");
    var avatarBtns = document.querySelectorAll(".app-perfil-avatar-pick");
    var camBtn = document.querySelector("[data-perfil-toggle-avatars]");
    var panel = document.querySelector("[data-perfil-avatar-panel]");
    var logoutBtn = document.querySelector("[data-perfil-logout]");

    if (nombreEl) nombreEl.textContent = String(p.nombre).trim();
    if (subEl) subEl.textContent = perfilSubtitle(p);
    if (emojiEl) emojiEl.textContent = p.avatarEmoji || "🐝";

    if (bwEl) {
      bwEl.checked = !!p.bw;
      bwEl.addEventListener("change", function () {
        saveProfile({ bw: bwEl.checked });
        applyBwMode();
      });
      applyBwMode();
    }

    if (soundEl) {
      soundEl.checked = p.sonido !== false;
      soundEl.addEventListener("change", function () {
        saveProfile({ sonido: soundEl.checked });
        // Cancelar cualquier sonido en reproducción
        if (window.speechSynthesis) {
          window.speechSynthesis.pause();
          window.speechSynthesis.cancel();
        }
        // Notificar a otros scripts que el sonido cambió
        window.dispatchEvent(new Event("soundSettingChanged"));
      });
    }

    function syncLevelUI(d) {
      var val = d || "facil";
      levelBtns.forEach(function (btn) {
        var v = btn.getAttribute("data-perfil-level");
        btn.classList.toggle("is-selected", v === val);
        btn.setAttribute("aria-pressed", v === val ? "true" : "false");
      });
    }

    syncLevelUI(p.dificultad || "facil");

    levelBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = btn.getAttribute("data-perfil-level");
        if (!v) return;
        p = saveProfile({ dificultad: v });
        syncLevelUI(v);
      });
    });

    function syncAvatarUI() {
      var cur = loadProfile() || {};
      var curId = (cur.avatarId || "abeja").toLowerCase();
      avatarBtns.forEach(function (b) {
        var id = (b.getAttribute("data-avatar-id") || "").toLowerCase();
        b.classList.toggle("is-current", id === curId);
      });
    }

    syncAvatarUI();

    avatarBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-avatar-id");
        var em = b.getAttribute("data-emoji");
        if (!em) return;
        p = saveProfile({ avatarId: id, avatarEmoji: em });
        if (emojiEl) emojiEl.textContent = em;
        syncAvatarUI();
      });
    });

    if (camBtn && panel) {
      camBtn.addEventListener("click", function () {
        var open = panel.hidden;
        panel.hidden = !open;
        camBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        document.documentElement.classList.remove("letritas-bw-on");
        window.location.href = "index.html";
      });
    }
  }

  function boot() {
    applyBwMode();
    initInicio();
    initPerfil();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
