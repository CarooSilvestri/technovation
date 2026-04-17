(function () {
  "use strict";

  var STORAGE_KEY =
    (window.LETRO_CONFIG && window.LETRO_CONFIG.STORAGE_KEY) || "letro_user";

  function getAvatarList() {
    var cfg = window.LETRO_CONFIG;
    return cfg && Array.isArray(cfg.AVATARS) ? cfg.AVATARS : [];
  }

  /** Emoji coherente con LETRO_CONFIG.AVATARS y el perfil (avatarId, etiqueta en avatar, o avatarEmoji). */
  function resolveLetroAvatarEmoji(profile) {
    var list = getAvatarList();
    var fallback = list.length ? list[0].emoji : "🐰";
    if (!profile || typeof profile !== "object") return fallback;

    var id =
      profile.avatarId != null
        ? String(profile.avatarId).trim().toLowerCase()
        : "";
    if (id) {
      for (var i = 0; i < list.length; i++) {
        if (
          list[i].id &&
          String(list[i].id).toLowerCase() === id
        ) {
          return list[i].emoji;
        }
      }
    }

    var label =
      profile.avatar != null ? String(profile.avatar).trim() : "";
    if (label) {
      for (var j = 0; j < list.length; j++) {
        if (list[j].label === label) return list[j].emoji;
      }
    }

    if (profile.avatarEmoji) return String(profile.avatarEmoji);

    return fallback;
  }

  function syncLetroAvatarFromStorage() {
    var emojiEl =
      document.getElementById("emoji") ||
      document.querySelector("[data-home-emoji]");
    if (!emojiEl) return;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var p = raw ? JSON.parse(raw) : null;
      emojiEl.textContent = resolveLetroAvatarEmoji(p);
    } catch (e) {
      emojiEl.textContent = resolveLetroAvatarEmoji(null);
    }
  }

  /** Saludo + emoji en cabeceras que comparten #name y #emoji / [data-home-emoji]. */
  function initHomeHeader() {
    var nombreEl = document.getElementById("name");
    var emojiEl =
      document.getElementById("emoji") ||
      document.querySelector("[data-home-emoji]");
    if (!nombreEl && !emojiEl) return;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var p = raw ? JSON.parse(raw) : null;
      var n = p && p.nombre && String(p.nombre).trim();
      if (nombreEl) nombreEl.textContent = n || "explorador";
      if (emojiEl) emojiEl.textContent = resolveLetroAvatarEmoji(p);
    } catch (e) {
      if (nombreEl) nombreEl.textContent = "explorador";
      if (emojiEl) emojiEl.textContent = resolveLetroAvatarEmoji(null);
    }
  }

  window.resolveLetroAvatarEmoji = resolveLetroAvatarEmoji;
  window.syncLetroAvatarFromStorage = syncLetroAvatarFromStorage;

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
    var camBtn = document.querySelector("[data-perfil-toggle-avatars]");
    var logoutBtn = document.querySelector("[data-perfil-logout]");
    var avatarModalEl = document.getElementById("perfilAvatarModal");
    var avatarGridEl = document.getElementById("perfil-avatar-grid");
    var avatarSaveBtn = document.getElementById("btnGuardarAvatarPerfil");

    if (nombreEl) nombreEl.textContent = String(p.nombre).trim();
    if (subEl) subEl.textContent = perfilSubtitle(p);
    if (emojiEl) emojiEl.textContent = resolveLetroAvatarEmoji(p);

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

    var pendingAvatar = null;

    function buildPerfilAvatarGrid() {
      if (!avatarGridEl) return;
      if (avatarGridEl.getAttribute("data-ready") === "1") return;
      avatarGridEl.setAttribute("data-ready", "1");

      var list = getAvatarList();
      avatarGridEl.innerHTML = "";
      list.forEach(function (avatar) {
        var col = document.createElement("div");
        col.className = "col-4";

        var pick = document.createElement("div");
        pick.className = "avatar-pick text-center";
        if (avatar.background) pick.style.background = avatar.background;
        if (avatar.id) pick.setAttribute("data-avatar-id", String(avatar.id));
        pick.setAttribute("data-emoji", String(avatar.emoji || ""));
        pick.setAttribute("role", "button");
        pick.setAttribute("tabindex", "0");

        var emoji = document.createElement("div");
        emoji.className = "emoji-wrap";
        emoji.textContent = String(avatar.emoji || "");

        var label = document.createElement("span");
        label.className = "small d-block mt-1";
        label.textContent = String(avatar.label || "");

        pick.appendChild(emoji);
        pick.appendChild(label);

        function select() {
          avatarGridEl.querySelectorAll(".avatar-pick").forEach(function (p) {
            p.classList.remove("selected");
          });
          pick.classList.add("selected");
          pendingAvatar = {
            id: avatar.id != null ? String(avatar.id) : "",
            emoji: String(avatar.emoji || ""),
            label: String(avatar.label || ""),
          };
        }

        pick.addEventListener("click", select);
        pick.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            select();
          }
        });

        col.appendChild(pick);
        avatarGridEl.appendChild(col);
      });
    }

    function syncPerfilAvatarModalSelection() {
      if (!avatarGridEl) return;
      var cur = loadProfile() || {};
      var curId = cur.avatarId != null ? String(cur.avatarId).toLowerCase() : "";
      var curLabel = cur.avatar != null ? String(cur.avatar).trim() : "";

      var picks = avatarGridEl.querySelectorAll(".avatar-pick");
      var selected = null;
      picks.forEach(function (pick) {
        pick.classList.remove("selected");
        var id = (pick.getAttribute("data-avatar-id") || "").toLowerCase();
        var labelEl = pick.querySelector(".small");
        var label = labelEl ? String(labelEl.textContent || "").trim() : "";
        if ((curId && id === curId) || (!curId && curLabel && label === curLabel)) {
          selected = pick;
        }
      });
      if (selected) selected.classList.add("selected");
    }

    if (camBtn && avatarModalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getOrCreateInstance(avatarModalEl);
      buildPerfilAvatarGrid();
      camBtn.addEventListener("click", function () {
        pendingAvatar = null;
        syncPerfilAvatarModalSelection();
        modal.show();
      });

      avatarModalEl.addEventListener("shown.bs.modal", function () {
        var first = avatarGridEl ? avatarGridEl.querySelector(".avatar-pick.selected") : null;
        if (first) first.focus();
      });
    }

    if (avatarSaveBtn) {
      avatarSaveBtn.addEventListener("click", function () {
        if (!avatarModalEl || !window.bootstrap || !window.bootstrap.Modal) return;
        var modal = window.bootstrap.Modal.getOrCreateInstance(avatarModalEl);

        var chosen = pendingAvatar;
        if (!chosen && avatarGridEl) {
          var curPick = avatarGridEl.querySelector(".avatar-pick.selected");
          if (curPick) {
            var id = curPick.getAttribute("data-avatar-id") || "";
            var em = curPick.getAttribute("data-emoji") || "";
            var labelEl = curPick.querySelector(".small");
            var label = labelEl ? String(labelEl.textContent || "").trim() : "";
            chosen = { id: id, emoji: em, label: label };
          }
        }
        if (!chosen || !chosen.emoji) {
          modal.hide();
          return;
        }

        p = saveProfile({ avatarId: chosen.id, avatarEmoji: chosen.emoji, avatar: chosen.label });
        if (emojiEl) emojiEl.textContent = resolveLetroAvatarEmoji(p);
        if (window.syncLetroAvatarFromStorage) window.syncLetroAvatarFromStorage();
        modal.hide();
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
    initHomeHeader();
    initPerfil();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
