// js/perfil/perfil.js — Pantalla perfil: requiere app.js (LetroProfile + resolveLetroAvatarEmoji).
(function () {
  "use strict";

  function perfilSubtitle(p) {
    var e = p.edad;
    if (e == null || Number.isNaN(Number(e))) return "EXPLORACIÓN";
    var n = parseInt(e, 10);
    var ageStr = n + (n === 1 ? " AÑO" : " AÑOS");
    var tag =
      n <= 7
        ? "PRIMEROS PASOS"
        : n <= 12
          ? "SIGUIENDO EL VIAJE"
          : "APRENDIZAJE AVANZADO";
    return ageStr + " · " + tag;
  }

  function initPerfil() {
    var LP = window.LetroProfile;
    var loadProfile = LP.loadProfile;
    var saveProfile = LP.saveProfile;
    var applyBwMode = LP.applyBwMode;
    var getAvatarList = LP.getAvatarList;
    var STORAGE_KEY = LP.STORAGE_KEY;
    var resolveEmoji = window.resolveLetroAvatarEmoji;

    if (!document.body || document.body.id !== "app-page-perfil") return;

    var p = loadProfile();
    if (!LP.hasValidLetroUser(p)) {
      window.location.replace(window.PAGES.INDEX);
      return;
    }

    var nombreEl = document.getElementById("perfil-nombre");
    var subEl = document.getElementById("perfil-subtitulo");
    var emojiEl = document.getElementById("perfil-emoji");
    var bwEl = document.getElementById("perfil-bw");
    var soundEl = document.getElementById("perfil-sound");
    var nivelMount = document.getElementById("perfil-nivel-mount");
    if (nivelMount && window.LetroNivelCards) {
      window.LetroNivelCards.render(nivelMount, "perfil");
    }
    var levelBtns = document.querySelectorAll(".perfil-nivel-btn");
    var camBtn = document.getElementById("perfil-btn-avatar");
    var logoutBtn = document.getElementById("perfil-logout");
    var avatarModalEl = document.getElementById("perfilAvatarModal");
    var avatarGridEl = document.getElementById("perfil-avatar-grid");
    var avatarSaveBtn = document.getElementById("btnGuardarAvatarPerfil");

    if (nombreEl) nombreEl.textContent = String(p.nombre).trim();
    if (subEl) subEl.textContent = perfilSubtitle(p);
    if (emojiEl) emojiEl.textContent = resolveEmoji(p);

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
        if (window.speechSynthesis) {
          window.speechSynthesis.pause();
          window.speechSynthesis.cancel();
        }
        window.dispatchEvent(new Event("soundSettingChanged"));
      });
    }

    function nivelFromBtn(btn) {
      return String(btn.id || "").replace(/^perfil-nivel-/, "");
    }

    function syncLevelUI(d) {
      var val = d || "facil";
      levelBtns.forEach(function (btn) {
        var v = nivelFromBtn(btn);
        btn.classList.toggle("is-selected", v === val);
        btn.setAttribute("aria-pressed", v === val ? "true" : "false");
      });
    }

    syncLevelUI(p.dificultad || "facil");

    levelBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = nivelFromBtn(btn);
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
          avatarGridEl.querySelectorAll(".avatar-pick").forEach(function (el) {
            el.classList.remove("selected");
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
      var curLabel = cur.avatar != null ? String(cur.avatar) : "";

      var picks = avatarGridEl.querySelectorAll(".avatar-pick");
      var selected = null;
      picks.forEach(function (pick) {
        pick.classList.remove("selected");
        var id = (pick.getAttribute("data-avatar-id") || "").toLowerCase();
        var labelEl = pick.querySelector(".small");
        var label = labelEl ? String(labelEl.textContent || "") : "";
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
            var label = labelEl ? String(labelEl.textContent || "") : "";
            chosen = { id: id, emoji: em, label: label };
          }
        }
        if (!chosen || !chosen.emoji) {
          modal.hide();
          return;
        }

        p = saveProfile({
          avatarId: chosen.id,
          avatarEmoji: chosen.emoji,
          avatar: chosen.label,
        });
        if (emojiEl) emojiEl.textContent = resolveEmoji(p);
        window.syncLetroAvatarFromStorage();
        modal.hide();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(STORAGE_KEY);
        document.documentElement.classList.remove("letro-bw-on");
        window.location.href = window.PAGES.INDEX;
      });
    }
  }

  function boot() {
    initPerfil();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
