// js/juegos/silabas.js — Completar la letra que falta en la palabra.

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "silabas") return;

  var LETTERS = C.LETTERS;
  var text = document.getElementById("textoSilaba");
  var hint = document.getElementById("ayudaSilaba");
  var emoji = document.getElementById("emojiSilaba");
  var opts = document.getElementById("silabaOpciones");
  var state = document.getElementById("estadoJuego");
  var btnListen = document.getElementById("btnEscucharSilaba");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  if (!text || !opts || !btnListen || !btnNext) return;

  var current = null;
  var idx = 1;
  var all = C.getAllWords();

  function renderRound() {
    current = C.randomItem(all);
    var w = current.word.toUpperCase();
    idx = w.length > 2 ? 1 : 0;
    var correct = w[idx];
    text.textContent = w.slice(0, idx) + "_" + w.slice(idx + 1);
    hint.textContent = "Completa la palabra";
    emoji.innerHTML =
      "<div style='font-size: 5rem; margin-bottom: 1rem;' aria-hidden='true'>" +
      current.emoji +
      "</div>" +
      "<span class='d-block fs-6'>" +
      current.emoji +
      "</span>";
    var nv = C.getDifficulty();
    var malas = nv === "facil" ? 3 : nv === "intermedio" ? 4 : 6;
    var letters = C.shuffle([correct].concat(C.sample(LETTERS.filter(function (l) { return l !== correct; }), malas)));
    opts.innerHTML = "";
    letters.forEach(function (l) {
      var col = document.createElement("div");
      col.className = "col-6";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline-primary btn-lg w-100 py-4 fs-2";
      btn.textContent = l;
      btn.addEventListener("click", function () {
        if (l === correct) {
          text.textContent = w;
          state.className = "small text-success mt-2";
          state.textContent = "Muy bien.";
          C.showBanner(true);
          setTimeout(renderRound, 2000);
        } else {
          state.className = "small text-danger mt-2";
          state.textContent = "Intenta de nuevo.";
          C.showBanner(false);
        }
      });
      col.appendChild(btn);
      opts.appendChild(col);
    });
    state.textContent = "";
  }

  btnListen.addEventListener("click", function () {
    if (current) C.speak(current.word);
  });
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, state);
  renderRound();
})();
