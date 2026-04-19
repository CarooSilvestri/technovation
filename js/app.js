// js/app.js — Perfil en localStorage, cabecera home y modo B/N; protege pantallas que incluyen este script.
(function () {
  "use strict";

  var STORAGE_KEY = window.LETRO_CONFIG.STORAGE_KEY;

  function loadProfile() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    var p = JSON.parse(raw);
    return p && typeof p === "object" ? p : null;
  }

  /** Perfil guardado por registro: exige nombre para considerar sesión válida. */
  function hasValidLetroUser(profile) {
    return !!(
      profile &&
      typeof profile === "object" &&
      String(profile.nombre || "").trim()
    );
  }

  function redirectToIndexIfNoUser() {
    if (hasValidLetroUser(loadProfile())) return false;
    window.location.replace(window.PAGES.INDEX);
    return true;
  }

  if (redirectToIndexIfNoUser()) return;

  function getAvatarList() {
    return window.LETRO_CONFIG.AVATARS;
  }

  /** Emoji coherente con LETRO_CONFIG.AVATARS y el perfil (avatarId, etiqueta en avatar, o avatarEmoji). */
  function resolveLetroAvatarEmoji(profile) {
    var list = getAvatarList();
    var fallback = list.length ? list[0].emoji : "🐰";
    if (!profile || typeof profile !== "object") return fallback;

    var id =
      profile.avatarId != null ? String(profile.avatarId).toLowerCase() : "";
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

    var label = profile.avatar != null ? String(profile.avatar) : "";
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
    emojiEl.textContent = resolveLetroAvatarEmoji(loadProfile());
  }

  /** Saludo + emoji en cabeceras que comparten #name y #emoji / [data-home-emoji]. */
  function initHomeHeader() {
    var nombreEl = document.getElementById("name");
    var emojiEl =
      document.getElementById("emoji") ||
      document.querySelector("[data-home-emoji]");
    if (!nombreEl && !emojiEl) return;
    var raw = localStorage.getItem(STORAGE_KEY);
    var p = raw ? JSON.parse(raw) : null;
    var n = p && p.nombre && String(p.nombre).trim();
    if (nombreEl) nombreEl.textContent = n || "explorador";
    if (emojiEl) emojiEl.textContent = resolveLetroAvatarEmoji(p);
  }

  window.resolveLetroAvatarEmoji = resolveLetroAvatarEmoji;
  window.syncLetroAvatarFromStorage = syncLetroAvatarFromStorage;

  /** Modo blanco y negro global (persistido en perfil). */
  function applyBwMode() {
    var root = document.documentElement;
    var p = loadProfile();
    root.classList.toggle("letro-bw-on", !!(p && p.bw));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  /** API compartida con js/perfil/perfil.js */
  window.LetroProfile = {
    STORAGE_KEY: STORAGE_KEY,
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    getAvatarList: getAvatarList,
    applyBwMode: applyBwMode,
    hasValidLetroUser: hasValidLetroUser,
  };

  function boot() {
    applyBwMode();
    initHomeHeader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
