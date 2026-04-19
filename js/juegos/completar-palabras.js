// js/juegos/completar-palabras.js — Elegir la letra que falta para completar una palabra del diccionario.

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "completar-palabras") return;

  var LETTERS = C.LETTERS;
  var VOCALES = "AEIOU";
  var OPCIONES_TOTAL = 4;
  var emojiEl = document.getElementById("emojiPalabra");
  var text = document.getElementById("textoPalabra");
  var hint = document.getElementById("ayudaPalabra");
  var opts = document.getElementById("palabraOpciones");
  var btnListen = document.getElementById("btnEscucharCompletar");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  if (!text || !opts || !btnListen || !btnNext) return;

  var current = null;
  var roundLocked = false;
  var all = C.getAllWords().filter(function (r) {
    return r && r.word && String(r.word).length >= 2;
  });

  function esVocal(letra) {
    return VOCALES.indexOf(letra) !== -1;
  }

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

  /** Misma convención que la maqueta original: 2ª letra si la palabra tiene más de 2 letras. */
  function indiceLetraOculta(palabraUpper) {
    return palabraUpper.length > 2 ? 1 : 0;
  }

  function deshabilitarOpciones() {
    Array.prototype.forEach.call(opts.querySelectorAll("button"), function (b) {
      b.disabled = true;
    });
  }

  function renderRound() {
    roundLocked = false;
    current = C.randomItem(all);
    var w = String(current.word || "").toUpperCase();
    var idx = indiceLetraOculta(w);
    var correct = w.charAt(idx);
    if (emojiEl) {
      emojiEl.textContent = current.emoji || "🎈";
    }
    text.textContent = w.slice(0, idx) + "_" + w.slice(idx + 1);
    hint.textContent = "¿Qué letra falta para completar la palabra?";
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
    if (current && current.word) C.speak(current.word);
  });
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, null);
  renderRound();
})();
