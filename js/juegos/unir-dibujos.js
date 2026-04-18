// js/juegos/unir-dibujos.js — Unir cada palabra con su dibujo (emoji).

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "unir-dibujos") return;

  var wordsEl = document.getElementById("listaPalabras");
  var drawsEl = document.getElementById("listaDibujos");
  var selEl = document.getElementById("listaSelects");
  var btnCheck = document.getElementById("btnComprobar");
  var btnListen = document.getElementById("btnEscucharJuego");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  var state = document.getElementById("estadoJuego");
  if (!wordsEl || !drawsEl || !selEl || !btnCheck || !btnNext) return;

  var round = [];
  var emojis = [];
  var pairs = {};
  var selectedWord = null;
  var selectedEmoji = null;

  function redrawLines() {
    var root = C.nearestMatchRoot(wordsEl);
    if (!root) return;
    var svg = C.createOrGetSvgOverlay(root);
    if (!svg) return;
    C.resizeSvgToRoot(svg, root);
    C.clearChildren(svg);
    Object.keys(pairs).forEach(function (k) {
      var wi = parseInt(k, 10);
      var ei = pairs[k];
      var wBtn = wordsEl.querySelector('[data-word-idx="' + wi + '"]');
      var eBtn = drawsEl.querySelector('[data-emoji-idx="' + ei + '"]');
      if (!wBtn || !eBtn) return;
      var a = C.getCenterWithin(wBtn, root);
      var b = C.getCenterWithin(eBtn, root);
      C.drawCurvedLine(svg, a, b, "var(--letro-blue)", "w" + wi);
    });
  }

  function clearSelections() {
    selectedWord = null;
    selectedEmoji = null;
    Array.prototype.forEach.call(wordsEl.querySelectorAll(".match-item-btn"), function (b) {
      b.classList.remove("is-selected");
    });
    Array.prototype.forEach.call(drawsEl.querySelectorAll(".match-item-btn"), function (b) {
      b.classList.remove("is-selected");
    });
  }

  function tryConnect() {
    if (selectedWord == null || selectedEmoji == null) return;
    pairs[String(selectedWord)] = selectedEmoji;
    clearSelections();
    redrawLines();
  }

  function renderRound() {
    var nvUd = C.getDifficulty();
    var cuantosPares =
      nvUd === "facil" ? 3 : nvUd === "intermedio" ? 4 : 6;
    round = C.sample(C.getAllWords(), cuantosPares);
    emojis = C.shuffle(
      round.map(function (r) {
        return r.emoji;
      })
    );
    pairs = {};
    clearSelections();
    wordsEl.innerHTML = "";
    drawsEl.innerHTML = "";
    selEl.innerHTML = "";
    round.forEach(function (r) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "match-item match-item-btn";
      d.style.fontSize = "1.05rem";
      d.textContent = r.word.toUpperCase();
      d.setAttribute("data-word-idx", String(wordsEl.childElementCount));
      d.addEventListener("click", function () {
        selectedWord = parseInt(d.getAttribute("data-word-idx"), 10);
        Array.prototype.forEach.call(wordsEl.querySelectorAll(".match-item-btn"), function (b) {
          b.classList.toggle("is-selected", b === d);
        });
        tryConnect();
      });
      wordsEl.appendChild(d);
    });
    emojis.forEach(function (e) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "match-item match-item-btn";
      d.style.fontSize = "3rem";
      d.innerHTML = "<span aria-hidden='true'>" + e + "</span>";
      d.setAttribute("data-emoji-idx", String(drawsEl.childElementCount));
      d.addEventListener("click", function () {
        selectedEmoji = parseInt(d.getAttribute("data-emoji-idx"), 10);
        Array.prototype.forEach.call(drawsEl.querySelectorAll(".match-item-btn"), function (b) {
          b.classList.toggle("is-selected", b === d);
        });
        tryConnect();
      });
      drawsEl.appendChild(d);
    });
    state.textContent = "";
    redrawLines();
  }

  btnCheck.addEventListener("click", function () {
    var ok = true;
    for (var i = 0; i < round.length; i++) {
      var pick = pairs[String(i)];
      if (pick == null) ok = false;
      else if (round[i].emoji !== emojis[pick]) ok = false;
    }
    state.className = "small mt-2 " + (ok ? "text-success" : "text-danger");
    state.textContent = ok ? "Correcto." : "Hay uniones incorrectas.";
    C.showBanner(ok);
    if (ok) setTimeout(renderRound, 2000);
  });
  if (btnListen) {
    btnListen.addEventListener("click", function () {
      var words = round.map(function (r) { return r.word; }).join(", ");
      C.speak(words);
    });
  }
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, state);
  window.addEventListener("resize", redrawLines);
  renderRound();
})();
