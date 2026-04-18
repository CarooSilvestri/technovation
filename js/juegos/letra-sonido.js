// js/juegos/letra-sonido.js — Escuchar la letra y elegir entre opciones.

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "letra-sonido") return;

  var LETTERS = C.LETTERS;
  var optionsEl = document.getElementById("letraOpciones");
  var btnListen = document.getElementById("btnEscuchar");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  var status = document.getElementById("estadoJuego");
  var listenState = document.getElementById("estadoEscucha");
  if (!optionsEl || !btnListen || !btnNext) return;

  var current = null;
  var all = C.getAllWords();

  function renderRound() {
    current = C.randomItem(all);
    var correct = current.letter;
    var nivel = C.getDifficulty();
    var cuantasMalas = nivel === "facil" ? 3 : nivel === "intermedio" ? 5 : 8;
    var wrong = C.sample(
      LETTERS.filter(function (l) {
        return l !== correct;
      }),
      cuantasMalas
    );
    var options = C.shuffle([correct].concat(wrong));
    optionsEl.innerHTML = "";
    options.forEach(function (op) {
      var col = document.createElement("div");
      col.className = "col-4";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline-dark btn-lg w-100 py-3 fs-3";
      btn.textContent = op;
      btn.addEventListener("click", function () {
        var ok = op === correct;
        status.className = "small mt-2 " + (ok ? "text-success" : "text-danger");
        status.textContent = ok ? "Correcto." : "Intenta otra vez.";
        C.showBanner(ok);
        if (ok) setTimeout(renderRound, 2000);
      });
      col.appendChild(btn);
      optionsEl.appendChild(col);
    });
    status.className = "small mt-2 text-muted";
    status.textContent = "";
  }

  btnListen.addEventListener("click", function () {
    if (!current) return;
    var ok = C.speak(current.letter);
    if (listenState) {
      listenState.textContent = ok ? "Sonido reproducido." : "Sonido desactivado.";
    }
  });
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, status);
  renderRound();
})();
