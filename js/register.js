
(function () {
  "use strict";

  /** Controla el flujo de registro (pasos + persistencia del perfil). */
  function initRegistro() {
    var steps = [
      document.getElementById("step-0"),
      document.getElementById("step-1"),
      document.getElementById("step-2"),
    ].filter(Boolean);
    
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-step-dot]"));
    
    var progressEl = document.querySelector("[data-registro-progress]");

    var stepCurrentEl = document.getElementById("current-step");
    var stepTotalEl = document.getElementById("total-steps");

    var btnPrev = document.querySelector("[data-registro-prev]");
    var btnNext = document.querySelector("[data-registro-next]");
    var btnSubmit = document.querySelector("[data-registro-submit]");
    var nombreInput = document.getElementById("nombre");
    var edadInput = document.getElementById("edad");
    var edadGrid = document.querySelector("[data-edad-grid]");
    var STORAGE_KEY =
      (window.LETRO_CONFIG && window.LETRO_CONFIG.STORAGE_KEY) || "letro_profile";

    if (!steps.length || !btnNext) return;

    /** Construye la grilla de avatares desde LETRO_CONFIG.AVATARS (una sola vez). */
    function buildAvatarGrid() {
      const avatarGrid = document.getElementById("avatar-grid");
      window.LETRO_CONFIG.AVATARS.forEach((avatar, i) => {
        var col = document.createElement("div");
        col.className = "col-4";
        var pick = document.createElement("div");
        pick.className = "avatar-pick text-center" + (i === 0 ? " selected" : "");
        pick.setAttribute("role", "button");
        pick.setAttribute("tabindex", "0");
        pick.setAttribute("data-avatar-id", avatar.id);
        pick.setAttribute("data-emoji", avatar.emoji);
        if (avatar.background) pick.style.background = avatar.background;
        var emoji = document.createElement("div");
        emoji.className = "emoji-wrap";
        emoji.textContent = avatar.emoji;
        var label = document.createElement("span");
        label.className = "small d-block mt-1";
        label.textContent = avatar.label;
        pick.appendChild(emoji);
        pick.appendChild(label);
        col.appendChild(pick);
        avatarGrid.appendChild(col);
      });
    }

    buildAvatarGrid();

    // Estado del wizard.
    var current = 0;
    var total = steps.length;
    // Rango de edades permitido y selección inicial.
    var EDAD_MIN = 3;
    var EDAD_MAX = 18;
    var EDAD_DEFAULT = 6;

    /** Mantiene sincronizada la selección visual de edad con el valor actual. */
    function syncEdadChips() {
      var sel = parseInt(edadInput && edadInput.value, 10);
      if (Number.isNaN(sel)) sel = EDAD_DEFAULT;
      document.querySelectorAll(".app-edad-pill-wrap").forEach(function (wrap) {
        var chip = wrap.querySelector(".app-edad-chip");
        if (!chip) return;
        var n = parseInt(chip.getAttribute("data-edad"), 10);
        var on = n === sel;
        chip.classList.toggle("is-selected", on);
        wrap.classList.toggle("is-selected", on);
        chip.setAttribute("aria-pressed", on ? "true" : "false");
        chip.setAttribute("aria-checked", on ? "true" : "false");
      });
    }

    /** Normaliza y aplica un valor de edad dentro del rango permitido. */
    function setEdadValue(n) {
      var v = Math.max(EDAD_MIN, Math.min(EDAD_MAX, parseInt(n, 10) || EDAD_DEFAULT));
      if (edadInput) edadInput.value = String(v);
      syncEdadChips();
    }

    /** Construye la grilla de edades (una vez) y define la selección inicial. */
    function buildEdadGrid() {
      if (!edadGrid || edadGrid.querySelector(".app-edad-chip")) return;
      var a;
      for (a = EDAD_MIN; a <= EDAD_MAX; a++) {
        (function (age) {
          var wrap = document.createElement("div");
          wrap.className = "app-edad-pill-wrap";
          var chip = document.createElement("button");
          chip.type = "button";
          chip.className = "app-edad-chip";
          chip.setAttribute("data-edad", String(age));
          chip.setAttribute("role", "radio");
          chip.setAttribute("aria-label", age + " años");
          chip.textContent = String(age);
          chip.addEventListener("click", function () {
            setEdadValue(age);
          });
          wrap.appendChild(chip);
          edadGrid.appendChild(wrap);
        })(a);
      }
      setEdadValue((edadInput && edadInput.value) || EDAD_DEFAULT);
    }

    buildEdadGrid();

    /** Renderiza el paso actual y el estado de navegación/indicadores. */
    function showStep(index) {
      current = Math.max(0, Math.min(index, total - 1));
      steps.forEach(function (el, i) {
        el.hidden = i !== current;
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i <= current);
        dot.classList.toggle("is-current", i === current);
      });
      if (progressEl) {
        progressEl.setAttribute("aria-valuenow", String(current + 1));
        progressEl.setAttribute("aria-valuemax", String(total));
      }
      if (stepCurrentEl) {
        stepCurrentEl.textContent = String(current + 1);
      }
      if (stepTotalEl) {
        stepTotalEl.textContent = String(total);
      }
      if (btnPrev) btnPrev.hidden = current === 0;
      if (btnNext) btnNext.hidden = current === total - 1;
      if (btnSubmit) btnSubmit.hidden = current !== total - 1;
    }

    /** Genera un id estable para el avatar usando el texto visible (fallback). */
    function avatarIdFromPick(el) {
      var label = el.querySelector(".small");
      var raw = (label && label.textContent.trim()) || "oso";
      return raw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
    }

    /** Resuelve el avatar seleccionado (id + emoji) con valores por defecto. */
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

    /** Valida los datos mínimos requeridos por paso antes de avanzar/finalizar. */
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
        if (Number.isNaN(edad) || edad < EDAD_MIN || edad > EDAD_MAX) {
          setEdadValue(EDAD_DEFAULT);
          return false;
        }
        return true;
      }
      return true;
    }

    /** Arma el perfil a persistir desde el estado actual del formulario. */
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

    // Navegación: avanzar (con validación del paso actual).
    btnNext.addEventListener("click", function () {
      if (!validateStep(current)) return;
      showStep(current + 1);
    });

    if (btnPrev) {
      // Navegación: volver.
      btnPrev.addEventListener("click", function () {
        showStep(current - 1);
      });
    }

    if (btnSubmit) {
      // Finalización: valida datos base y persiste el perfil para el resto de la app.
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
        window.location.href = "perfil.html";
      });
    }

    // Selección de avatar: mantiene una única opción marcada.
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

    /** Sincroniza el estilo de tarjetas con el radio de dificultad elegido. */
    function syncNivelCards() {
      document.querySelectorAll(".app-nivel-card").forEach(function (card) {
        var inp = card.querySelector('input[name="dificultad"]');
        if (!inp) return;
        card.classList.toggle("is-selected", inp.checked);
      });
    }

    // Dificultad: actualizar UI cuando cambia el radio seleccionado.
    document.querySelectorAll('input[name="dificultad"]').forEach(function (r) {
      r.addEventListener("change", syncNivelCards);
    });
    syncNivelCards();

    // Estado inicial del wizard.
    showStep(0);
  }

  // Inicialización segura independientemente del punto de carga del script.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegistro);
  } else {
    initRegistro();
  }
})();