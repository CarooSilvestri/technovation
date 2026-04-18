// js/juegos/palabras.js — Elegir la palabra que corresponde al dibujo.

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "palabras") return;

  var clue = document.getElementById("pistaTexto");
  var options = document.getElementById("palabraOpciones");
  var state = document.getElementById("estadoJuego");
  var btnListen = document.getElementById("btnEscucharPalabra");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  if (!clue || !options || !btnListen || !btnNext) return;

  var current = null;
  var all = C.getAllWords();

  function armarListaPalabras(c, cuantas) {
    var lista = [c];
    var posibles = [
      C.makeWrongWord(c),
      C.makeWrongWord(c + "S").replace("SS", "S"),
      C.makeWrongWord(c + "M"),
      C.makeWrongWord(c + "K"),
      c.length > 2 ? c.charAt(0) + c.slice(2) : c + "H",
    ];
    var i = 0;
    while (lista.length < cuantas && i < posibles.length) {
      var x = posibles[i++];
      if (x && lista.indexOf(x) === -1) lista.push(x);
    }
    while (lista.length < cuantas) {
      lista.push(c + lista.length);
    }
    return C.shuffle(lista.slice(0, cuantas));
  }

  function renderRound() {
    current = C.randomItem(all);
    clue.innerHTML =
      "<div class='text-center' style='font-size: 6rem; margin-bottom: 1rem;' aria-hidden='true'>" +
      current.emoji +
      "</div>" +
      "<span class='d-block text-center'>" +
      current.emoji +
      " Identifica el nombre</span>";
    var c = current.word.toUpperCase();
    var nivel = C.getDifficulty();
    var nOpciones = nivel === "facil" ? 3 : nivel === "intermedio" ? 4 : 5;
    var arr = armarListaPalabras(c, nOpciones);
    options.innerHTML = "";
    arr.forEach(function (w) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-light border btn-lg text-center py-3";
      btn.textContent = w;
      btn.addEventListener("click", function () {
        var ok = w === c;
        if (state) {
          state.className = "alert mt-4 mb-0 small " + (ok ? "alert-success" : "alert-warning");
          state.textContent = ok ? "Correcto." : "No, prueba otra opción.";
        }
        C.showBanner(ok);
        if (ok) setTimeout(renderRound, 2000);
      });
      options.appendChild(btn);
    });
    if (state) {
      state.className = "alert alert-info mt-4 mb-0 small";
      state.textContent = "Elige una opción.";
    }
  }

  btnListen.addEventListener("click", function () {
    if (current) C.speak(current.word);
  });
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, state);
  renderRound();
})();
