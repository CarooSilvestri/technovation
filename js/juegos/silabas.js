// js/juegos/silabas.js — Completar la letra que falta en una sílaba según la dificultad.

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "silabas") return;

  var LETTERS = C.LETTERS;
  var VOCALES = "AEIOU";
  var OPCIONES_TOTAL = 4;
  var text = document.getElementById("textoSilaba");
  var hint = document.getElementById("ayudaSilaba");
  var opts = document.getElementById("silabaOpciones");
  var btnListen = document.getElementById("btnEscucharSilaba");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  if (!text || !opts || !btnListen || !btnNext) return;

  var current = null;
  var roundLocked = false;

  function esVocal(letra) {
    return VOCALES.indexOf(letra) !== -1;
  }

  /** Tres letras incorrectas: si la correcta es vocal (p. ej. J_), solo consonantes incorrectas. */
  function letrasIncorrectas(correct) {
    var n = OPCIONES_TOTAL - 1;
    var pool;
    if (esVocal(correct)) {
      pool = LETTERS.filter(function (l) {
        return l !== correct && !esVocal(l);
      });
    } else {
      pool = LETTERS.filter(function (l) {
        return l !== correct;
      });
    }
    return C.sample(pool, Math.min(n, pool.length));
  }

  function indiceLetraOculta(syllableUpper) {
    var n = syllableUpper.length;
    if (n <= 1) return 0;
    if (n === 2) return 1;
    return 1;
  }

  function deshabilitarOpciones() {
    Array.prototype.forEach.call(opts.querySelectorAll("button"), function (b) {
      b.disabled = true;
    });
  }

  function renderRound() {
    roundLocked = false;
    current = C.randomSilabaItem();
    var w = String(current.syllable || "").toUpperCase();
    var idx = indiceLetraOculta(w);
    var correct = w.charAt(idx);
    text.textContent = w.slice(0, idx) + "_" + w.slice(idx + 1);
    hint.textContent = "¿Qué letra falta para completar la sílaba?";
    var malas = letrasIncorrectas(correct);
    var letters = C.shuffle([correct].concat(malas));
    opts.innerHTML = "";
    letters.forEach(function (l) {
      var col = document.createElement("div");
      col.className = "col-6";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline-primary btn-lg w-100 py-4 fs-2";
      btn.textContent = l;
      btn.addEventListener("click", function () {
        if (roundLocked) return;
        if (l === correct) {
          roundLocked = true;
          text.textContent = w;
          deshabilitarOpciones();
          C.showBanner(true);
        } else {
          C.showBanner(false);
        }
      });
      col.appendChild(btn);
      opts.appendChild(col);
    });
  }

  btnListen.addEventListener("click", function () {
    if (current && current.syllable) C.speak(current.syllable);
  });
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, null);
  renderRound();
})();
