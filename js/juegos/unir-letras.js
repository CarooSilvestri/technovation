// js/juegos/unir-letras.js — Unir mayúscula/minúscula: 3 pares (fácil, vocales), 4 (intermedio), 5 (difícil).

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "unir-letras") return;

  var LETTERS = C.LETTERS;
  /** Pool del modo fácil: solo vocales (alineado al resto de juegos). */
  var VOCALES = ["A", "E", "I", "O", "U"];
  var upEl = document.getElementById("listaMayusculas");
  var lowEl = document.getElementById("listaMinusculas");
  var selEl = document.getElementById("listaSelectsLetras");
  var btnCheck = document.getElementById("btnComprobar");
  var btnListen = document.getElementById("btnEscucharJuego");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  var state = document.getElementById("estadoJuego");

  var letters = [];
  var lowers = [];
  var pairs = {};
  var selectedUp = null;
  var selectedLow = null;

  function redrawLines() {
    var root = C.nearestMatchRoot(upEl);
    if (!root) return;
    var svg = C.createOrGetSvgOverlay(root);
    if (!svg) return;
    C.resizeSvgToRoot(svg, root);
    C.clearChildren(svg);
    Object.keys(pairs).forEach(function (k) {
      var ui = parseInt(k, 10);
      var li = pairs[k];
      var upBtn = upEl.querySelector('[data-up-idx="' + ui + '"]');
      var lowBtn = lowEl.querySelector('[data-low-idx="' + li + '"]');
      if (!upBtn || !lowBtn) return;
      var a = C.getCenterWithin(upBtn, root);
      var b = C.getCenterWithin(lowBtn, root);
      C.drawCurvedLine(svg, a, b, "var(--letro-pink)", "u" + ui);
    });
  }

  function clearSelections() {
    selectedUp = null;
    selectedLow = null;
    Array.prototype.forEach.call(upEl.querySelectorAll(".match-item-btn"), function (b) {
      b.classList.remove("is-selected");
    });
    Array.prototype.forEach.call(lowEl.querySelectorAll(".match-item-btn"), function (b) {
      b.classList.remove("is-selected");
    });
  }

  function tryConnect() {
    if (selectedUp == null || selectedLow == null) return;
    pairs[String(selectedUp)] = selectedLow;
    clearSelections();
    redrawLines();
  }

  function renderRound() {
    var nvM = C.getDifficulty();
    var nOpciones =
      nvM === "facil" ? 3 : nvM === "intermedio" ? 4 : 5;
    letters =
      nvM === "facil"
        ? C.sample(VOCALES, nOpciones)
        : C.sample(LETTERS, nOpciones);
    lowers = C.shuffle(
      letters.map(function (l) {
        return l.toLowerCase();
      })
    );
    pairs = {};
    clearSelections();
    upEl.innerHTML = "";
    lowEl.innerHTML = "";
    selEl.innerHTML = "";
    letters.forEach(function (l) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "match-item match-item-btn";
      d.textContent = l;
      d.setAttribute("data-up-idx", String(upEl.childElementCount));
      d.addEventListener("click", function () {
        selectedUp = parseInt(d.getAttribute("data-up-idx"), 10);
        Array.prototype.forEach.call(upEl.querySelectorAll(".match-item-btn"), function (b) {
          b.classList.toggle("is-selected", b === d);
        });
        tryConnect();
      });
      upEl.appendChild(d);
    });
    lowers.forEach(function (l) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "match-item match-item-btn";
      d.textContent = l;
      d.setAttribute("data-low-idx", String(lowEl.childElementCount));
      d.addEventListener("click", function () {
        selectedLow = parseInt(d.getAttribute("data-low-idx"), 10);
        Array.prototype.forEach.call(lowEl.querySelectorAll(".match-item-btn"), function (b) {
          b.classList.toggle("is-selected", b === d);
        });
        tryConnect();
      });
      lowEl.appendChild(d);
    });
    if (state) state.textContent = "";
    redrawLines();
  }

  btnCheck.addEventListener("click", function () {
    var ok = true;
    for (var i = 0; i < letters.length; i++) {
      var pick = pairs[String(i)];
      if (pick == null) ok = false;
      else if (lowers[pick] !== letters[i].toLowerCase()) ok = false;
    }
    if (state) {
      state.className = "small mt-2 " + (ok ? "text-success" : "text-danger");
      state.textContent = ok ? "Correcto." : "Algunas uniones no coinciden.";
    }
    C.showBanner(ok);
    if (ok) setTimeout(renderRound, 2000);
  });
  if (btnListen) {
    btnListen.addEventListener("click", function () {
      C.speak(letters.join(", "));
    });
  }
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, state);
  window.addEventListener("resize", redrawLines);
  renderRound();
})();
