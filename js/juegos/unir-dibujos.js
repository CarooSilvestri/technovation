// js/juegos/unir-dibujos.js — Unir cada palabra con su dibujo (emoji).

(function () {
  "use strict";

  var C = window.LetroCore;
  if (!C || document.body.getAttribute("data-game") !== "unir-dibujos") return;

  var boardEl = document.getElementById("listaFilas");
  var btnCheck = document.getElementById("btnComprobar");
  var btnListen = document.getElementById("btnEscucharJuego");
  var btnNext = document.getElementById("btnSiguiente");
  var btnVoice = document.getElementById("btnVozSiguiente");
  var state = document.getElementById("estadoJuego");
  if (!boardEl || !btnCheck || !btnNext) return;

  var round = [];
  var emojis = [];
  var pairs = {};
  var selectedWord = null;
  var selectedEmoji = null;

  function redrawLines() {
    var root = C.nearestMatchRoot(boardEl);
    if (!root) return;
    var svg = C.createOrGetSvgOverlay(root);
    if (!svg) return;
    C.resizeSvgToRoot(svg, root);
    C.clearChildren(svg);
    Object.keys(pairs).forEach(function (k) {
      var wi = parseInt(k, 10);
      var ei = pairs[k];
      var wBtn = boardEl.querySelector('[data-word-idx="' + wi + '"]');
      var eBtn = boardEl.querySelector('[data-emoji-idx="' + ei + '"]');
      if (!wBtn || !eBtn) return;
      var a = C.getCenterWithin(wBtn, root);
      var b = C.getCenterWithin(eBtn, root);
      C.drawCurvedLine(svg, a, b, "var(--letro-blue)", "w" + wi);
    });
  }

  function clearSelections() {
    selectedWord = null;
    selectedEmoji = null;
    Array.prototype.forEach.call(boardEl.querySelectorAll(".match-word-btn"), function (b) {
      b.classList.remove("is-selected");
    });
    Array.prototype.forEach.call(boardEl.querySelectorAll(".match-emoji-btn"), function (b) {
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
    boardEl.innerHTML = "";
    round.forEach(function (r, rowIdx) {
      var row = document.createElement("div");
      row.className = "row g-5 align-items-stretch match-pair-row";

      var colWord = document.createElement("div");
      colWord.className = "col-6 d-flex align-items-stretch";
      var wBtn = document.createElement("button");
      wBtn.type = "button";
      wBtn.className =
        "match-item match-item-btn match-word-btn w-100 h-100";
      wBtn.style.fontSize = "1.05rem";
      wBtn.textContent = r.word.toUpperCase();
      wBtn.setAttribute("data-word-idx", String(rowIdx));
      wBtn.addEventListener("click", function () {
        selectedWord = parseInt(wBtn.getAttribute("data-word-idx"), 10);
        Array.prototype.forEach.call(boardEl.querySelectorAll(".match-word-btn"), function (b) {
          b.classList.toggle("is-selected", b === wBtn);
        });
        tryConnect();
      });
      colWord.appendChild(wBtn);

      var colEmoji = document.createElement("div");
      colEmoji.className = "col-6 unir-dibujos-col-dibujo";
      var emojiWrap = document.createElement("div");
      emojiWrap.className =
        "unir-dibujos-emoji-wrap d-flex justify-content-center align-items-stretch w-100";
      var eBtn = document.createElement("button");
      eBtn.type = "button";
      eBtn.className =
        "match-item match-item-btn match-emoji-btn h-100";
      eBtn.style.fontSize = "3rem";
      eBtn.innerHTML = "<span aria-hidden='true'>" + emojis[rowIdx] + "</span>";
      eBtn.setAttribute("data-emoji-idx", String(rowIdx));
      eBtn.addEventListener("click", function () {
        selectedEmoji = parseInt(eBtn.getAttribute("data-emoji-idx"), 10);
        Array.prototype.forEach.call(boardEl.querySelectorAll(".match-emoji-btn"), function (b) {
          b.classList.toggle("is-selected", b === eBtn);
        });
        tryConnect();
      });
      emojiWrap.appendChild(eBtn);
      colEmoji.appendChild(emojiWrap);

      row.appendChild(colWord);
      row.appendChild(colEmoji);
      boardEl.appendChild(row);
    });
    if (state) state.textContent = "";
    redrawLines();
  }

  btnCheck.addEventListener("click", function () {
    var ok = true;
    for (var i = 0; i < round.length; i++) {
      var pick = pairs[String(i)];
      if (pick == null) ok = false;
      else if (round[i].emoji !== emojis[pick]) ok = false;
    }
    if (state) {
      state.className = "small mt-2 " + (ok ? "text-success" : "text-danger");
      state.textContent = ok ? "Correcto." : "Hay uniones incorrectas.";
    }
    C.showBanner(ok);
    if (ok) setTimeout(renderRound, 2000);
  });
  if (btnListen) {
    btnListen.addEventListener("click", function () {
      var words = round.map(function (r) {
        return r.word;
      }).join(", ");
      C.speak(words);
    });
  }
  btnNext.addEventListener("click", renderRound);
  C.createVoiceNext(btnVoice, renderRound, state);
  window.addEventListener("resize", redrawLines);
  renderRound();
})();
