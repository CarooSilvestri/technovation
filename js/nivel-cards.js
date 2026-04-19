// js/nivel-cards.js — Tarjetas de dificultad compartidas entre registro y perfil.
(function () {
  "use strict";

  /** Definición única de niveles: textos registro + título compacto en perfil. */
  var ITEMS = [
    {
      id: "facil",
      emoji: "👶",
      name: "Fácil",
      perfilTitle: "FÁCIL",
      desc: "Solo vocales para un comienzo suave.",
      badge: "RECOMENDADO",
    },
    {
      id: "intermedio",
      emoji: "📖",
      name: "Intermedio",
      perfilTitle: "INTERMEDIO",
      desc: "Vocales + consonantes para frases.",
    },
    {
      id: "dificil",
      emoji: "🎓",
      name: "Difícil",
      perfilTitle: "DIFÍCIL",
      desc: "Abecedario completo. El gran reto.",
    },
  ];

  function modifierClass(id) {
    return "app-nivel-card--" + id;
  }

  /**
   * @param {HTMLElement} container
   * @param {"registro"|"perfil"} variant — mismo dato: registro = label+radio; perfil = botón+indicador
   * @param {{ defaultId?: string, inputName?: string }} [opts] — solo registro
   */
  function render(container, variant, opts) {
    opts = opts || {};
    if (variant !== "registro" && variant !== "perfil") return;
    container.innerHTML = "";
    var frag = document.createDocumentFragment();

    ITEMS.forEach(function (item) {
      if (variant === "registro") {
        var defaultId = opts.defaultId || "facil";
        var inputName = opts.inputName || "dificultad";
        var label = document.createElement("label");
        label.className = "app-nivel-card " + modifierClass(item.id);
        var input = document.createElement("input");
        input.type = "radio";
        input.name = inputName;
        input.value = item.id;
        input.className = "visually-hidden";
        if (item.id === defaultId) input.checked = true;
        label.appendChild(input);
        if (item.badge) {
          var badge = document.createElement("span");
          badge.className = "app-nivel-badge";
          badge.textContent = item.badge;
          label.appendChild(badge);
        }
        var row = document.createElement("div");
        row.className = "d-flex gap-3";
        var icon = document.createElement("span");
        icon.className = "app-nivel-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = item.emoji;
        var copy = document.createElement("div");
        copy.className = "app-nivel-copy";
        var nameEl = document.createElement("span");
        nameEl.className = "app-nivel-name";
        nameEl.textContent = item.name;
        var descEl = document.createElement("span");
        descEl.className = "app-nivel-desc";
        descEl.textContent = item.desc;
        copy.appendChild(nameEl);
        copy.appendChild(descEl);
        row.appendChild(icon);
        row.appendChild(copy);
        label.appendChild(row);
        frag.appendChild(label);
        return;
      }

      if (variant === "perfil") {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.id = "perfil-nivel-" + item.id;
        btn.className =
          "perfil-nivel-btn app-perfil-level app-nivel-card " +
          modifierClass(item.id) +
          " d-flex align-items-center gap-3 w-100 text-start";
        var iconP = document.createElement("span");
        iconP.className = "app-nivel-icon app-perfil-level-face fs-5";
        iconP.setAttribute("aria-hidden", "true");
        iconP.textContent = item.emoji;
        var col = document.createElement("span");
        col.className = "d-flex flex-column flex-grow-1 gap-0";
        var kicker = document.createElement("span");
        kicker.className = "small fw-bold opacity-75 text-uppercase";
        kicker.textContent = "NIVEL";
        var title = document.createElement("span");
        title.className = "fs-6 fw-bold";
        title.textContent = item.perfilTitle;
        col.appendChild(kicker);
        col.appendChild(title);
        var trail = document.createElement("span");
        trail.className =
          "app-perfil-level-trail d-inline-flex align-items-center justify-content-center flex-shrink-0 fw-bold fs-6";
        btn.appendChild(iconP);
        btn.appendChild(col);
        btn.appendChild(trail);
        frag.appendChild(btn);
      }
    });

    container.appendChild(frag);
  }

  window.LetroNivelCards = {
    items: ITEMS,
    render: render,
  };
})();
