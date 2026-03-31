(function () {
  "use strict";

  var STORAGE_KEY = "letritas_perfil";

  function initInicio() {
    var body = document.body;
    if (!body || !body.hasAttribute("data-inicio")) return;
    var el = document.querySelector("[data-perfil-resumen]");
    if (!el) return;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var p = JSON.parse(raw);
      if (p && p.nombre) {
        el.textContent =
          "Hola, " +
          p.nombre +
          (p.avatarEmoji ? " " + p.avatarEmoji : "") +
          ". Listo/a para seguir jugando.";
      }
    } catch (e) {}
  }

  function initRegistro() {
    var body = document.body;
    if (!body || !body.hasAttribute("data-registro")) return;

    var steps = Array.prototype.slice.call(document.querySelectorAll("[data-step]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-step-dot]"));
    var btnPrev = document.querySelector("[data-registro-prev]");
    var btnNext = document.querySelector("[data-registro-next]");
    var btnSubmit = document.querySelector("[data-registro-submit]");
    var nombreInput = document.getElementById("nombre");
    var edadInput = document.getElementById("edad");

    if (!steps.length || !btnNext) return;

    var current = 0;
    var total = steps.length;

    function showStep(index) {
      current = Math.max(0, Math.min(index, total - 1));
      steps.forEach(function (el, i) {
        el.hidden = i !== current;
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i <= current);
      });
      if (btnPrev) btnPrev.hidden = current === 0;
      if (btnNext) btnNext.hidden = current === total - 1;
      if (btnSubmit) btnSubmit.hidden = current !== total - 1;
    }

    function avatarIdFromPick(el) {
      var label = el.querySelector(".small");
      var raw = (label && label.textContent.trim()) || "oso";
      return raw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
    }

    function getSelectedAvatar() {
      var selected = document.querySelector(".avatar-pick.selected");
      if (!selected) return { id: "abeja", emoji: "🐝" };
      var idAttr = selected.getAttribute("data-avatar-id");
      var emojiAttr = selected.getAttribute("data-emoji");
      var wrap = selected.querySelector(".emoji-wrap");
      return {
        id: idAttr || avatarIdFromPick(selected),
        emoji: emojiAttr || (wrap && wrap.textContent.trim()) || "🐝",
      };
    }

    function validateStep(index) {
      if (index === 0) {
        var n = nombreInput && nombreInput.value.trim();
        if (!n) {
          if (nombreInput) nombreInput.focus();
          return false;
        }
        return true;
      }
      if (index === 1) {
        var raw = edadInput && edadInput.value;
        var edad = parseInt(raw, 10);
        if (Number.isNaN(edad) || edad < 3 || edad > 18) {
          if (edadInput) edadInput.focus();
          return false;
        }
        return true;
      }
      return true;
    }

    function collectProfile() {
      var dificultadEl = document.querySelector('input[name="dificultad"]:checked');
      var avatar = getSelectedAvatar();
      return {
        nombre: nombreInput ? nombreInput.value.trim() : "",
        edad: edadInput ? parseInt(edadInput.value, 10) : null,
        dificultad: dificultadEl ? dificultadEl.value : "facil",
        avatarId: avatar.id,
        avatarEmoji: avatar.emoji,
        creadoEn: new Date().toISOString(),
      };
    }

    btnNext.addEventListener("click", function () {
      if (!validateStep(current)) return;
      showStep(current + 1);
    });

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        showStep(current - 1);
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", function () {
        if (!validateStep(0) || !validateStep(1)) {
          showStep(!nombreInput || !nombreInput.value.trim() ? 0 : 1);
          return;
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(collectProfile()));
        } catch (e) {
          return;
        }
        window.location.href = "index.html";
      });
    }

    document.querySelectorAll(".avatar-pick").forEach(function (pick) {
      function select() {
        document.querySelectorAll(".avatar-pick").forEach(function (p) {
          p.classList.remove("selected");
        });
        pick.classList.add("selected");
      }
      pick.addEventListener("click", select);
      pick.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      });
    });

    showStep(0);
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
        body.classList.toggle("app-perfil-bw-on", bwEl.checked);
      });
      body.classList.toggle("app-perfil-bw-on", bwEl.checked);
    }

    if (soundEl) {
      soundEl.checked = p.sonido !== false;
      soundEl.addEventListener("change", function () {
        saveProfile({ sonido: soundEl.checked });
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
        window.location.href = "index.html";
      });
    }
  }

  function boot() {
    initInicio();
    initRegistro();
    initPerfil();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
