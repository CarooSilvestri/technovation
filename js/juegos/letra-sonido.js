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

  var MSG_TOQUE = "Toca para reproducir.";
  var MSG_REPRO = "Reproduciendo…";
  var MSG_APAGADO = "Sonido desactivado.";

  var current = null;
  var all = C.getAllWords();

  function renderRound() {
    current = C.randomItem(all);
    var correct = current.letter;
    var nivel = C.getDifficulty();
    var cuantasMalas = nivel === "facil" ? 1 : nivel === "intermedio" ? 2 : 3;
    var wrong = C.sample(
      LETTERS.filter(function (l) {
        return l !== correct;
      }),
      cuantasMalas
    );
    var options = C.shuffle([correct].concat(wrong));
    var nOpts = options.length;
    optionsEl.innerHTML = "";
    options.forEach(function (op) {
      var col = document.createElement("div");
      col.className =
        nOpts === 4 ? "col-6" : nOpts === 3 ? "col-4" : "col-3";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "btn btn-outline-dark btn-lg py-3 fs-3 text-center" +
        (nOpts <= 2 ? " px-4 flex-shrink-0" : " w-100");
      if (nOpts === 2) btn.style.minWidth = "3.75rem";
      else btn.style.minWidth = "";
      btn.textContent = op;
      btn.addEventListener("click", function () {
        var ok = op === correct;
        if (status) {
          status.className =
            "small text-center mt-2 mb-0 " + (ok ? "text-success" : "text-danger");
          status.textContent = ok ? "Correcto." : "Intenta otra vez.";
        }
        C.showBanner(ok);
        if (ok) setTimeout(renderRound, 2000);
      });
      col.appendChild(btn);
      optionsEl.appendChild(col);
    });
    if (status) {
      status.className = "small text-center mt-2 mb-0 text-muted";
      status.textContent = "";
    }
    if (listenState) listenState.textContent = MSG_TOQUE;
  }

  btnListen.addEventListener("click", function () {
    if (!current) return;
    if (listenState) listenState.textContent = MSG_REPRO;
    var ok = C.speak(current.letter, function () {
      if (listenState) listenState.textContent = MSG_TOQUE;
    });
    if (!ok && listenState) listenState.textContent = MSG_APAGADO;
  });
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, status);
  renderRound();
})();
