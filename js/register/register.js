// js/register/register.js — Wizard de alta y persistencia del perfil en localStorage.
import { buildAvatarGrid } from "./avatar_grid.js";
import { buildEdadGrid } from "./edad_grid.js";
import { createRegistroSteps } from "./steps.js";

(function () {
  "use strict";

  /** Controla el flujo de registro (pasos + persistencia del perfil). */
  function initRegistro() {

    var btnBack = document.getElementById("btnBack");
    var btnNext = document.getElementById("btnNext");

    var btnSubmit = document.getElementById("btnSubmit");

    var nombreInput = document.getElementById("nombre");
    var edadInput = document.getElementById("edad");
    var avatarInput = document.getElementById("avatar");

    buildAvatarGrid();
    buildEdadGrid();

    var nivelMount = document.getElementById("registro-nivel-mount");
    if (nivelMount && window.LetroNivelCards) {
      window.LetroNivelCards.render(nivelMount, "registro", {
        defaultId: "facil",
      });
    }

    var registroSteps = createRegistroSteps({
      btnBack: btnBack,
      btnNext: btnNext,
      btnSubmit: btnSubmit,
      nombreInput: nombreInput,
      edadInput: edadInput,
    });

    var showStep = registroSteps.showStep;

    registroSteps.bindNavigation();

    function collectProfile() {
      var checked = document.querySelector('input[name="dificultad"]:checked');
      return {
        nombre: nombreInput.value,
        edad: edadInput.value,
        dificultad: checked ? checked.value : "facil",
        avatar: avatarInput.value,
      };
    }

    btnSubmit.addEventListener("click", function () {
      localStorage.setItem(
        window.LETRO_CONFIG.STORAGE_KEY,
        JSON.stringify(collectProfile())
      );
      window.location.href = window.PAGES.HOME;
    });

    function syncNivelCards() {
      document.querySelectorAll(".app-nivel-card").forEach(function (card) {
        var inp = card.querySelector('input[name="dificultad"]');
        if (!inp) return;
        card.classList.toggle("is-selected", inp.checked);
      });
    }

    document.querySelectorAll('input[name="dificultad"]').forEach(function (
      r
    ) {
      r.addEventListener("change", syncNivelCards);
    });
    syncNivelCards();

    showStep(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegistro);
  } else {
    initRegistro();
  }
})();
