
(function () {
  "use strict";

  if (document.body.getAttribute("data-game") !== "dibujar-letra") return;

  const canvas = document.getElementById("traceCanvas");
  const guide = document.querySelector(".trace-guide");
  const select = document.getElementById("letraElegida");
  const btnClear = document.getElementById("btnLimpiar");
  const btnSound = document.getElementById("btnSonidoLetra");
  const btnNext = document.getElementById("btnSiguiente");
  const btnVoice = document.getElementById("btnVozSiguiente");
  const colorPicker = document.getElementById("colorPicker");

  if (!canvas || !guide) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let drawing = false;
  let currentColor = "#4a677d";

  function setGuideFromSelect() {
    const v = select?.value || "A";
    const lower = v.toLowerCase();
    guide.replaceChildren();
    const spanMay = document.createElement("span");
    spanMay.style.marginRight = "0.15em";
    spanMay.textContent = v;
    const spanMin = document.createElement("span");
    spanMin.style.fontSize = "0.65em";
    spanMin.textContent = lower;
    guide.append(spanMay, spanMin);
  }

  /** Al cambiar de letra (lista o “siguiente”) se borra lo dibujado. */
  function syncLetterAndClearStroke() {
    drawing = false;
    setGuideFromSelect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const todas =
    (window.LetroGames && window.LetroGames.letters) || ["A", "E", "I", "O", "U"];
  var modo =
    window.LetroGames && typeof window.LetroGames.getDifficulty === "function"
      ? window.LetroGames.getDifficulty()
      : "facil";
  let letras;
  if (modo === "facil") letras = ["A", "E", "I", "O", "U"];
  else if (modo === "intermedio") letras = todas.slice(0, Math.min(18, todas.length));
  else letras = todas.slice();
  if (select) {
    select.innerHTML = "";
    letras.forEach((l) => {
      const op = document.createElement("option");
      op.value = l;
      op.textContent = `${l} ${l.toLowerCase()}`;
      select.appendChild(op);
    });
  }

  select?.addEventListener("change", syncLetterAndClearStroke);
  setGuideFromSelect();

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - r.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - r.top;
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    return { x: x * sx, y: y * sy };
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function end() {
    drawing = false;
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mouseleave", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);

  btnClear?.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  btnSound?.addEventListener("click", () => {
    const letra = select?.value || "A";
    window.LetroGames && window.LetroGames.speak
      ? window.LetroGames.speak(letra)
      : false;
    btnSound.classList.add("active");
    setTimeout(() => btnSound.classList.remove("active"), 200);
  });

  btnNext?.addEventListener("click", () => {
    if (!select) return;
    const cur = select.value || "A";
    const next = window.LetroGames && window.LetroGames.nextLetter
      ? window.LetroGames.nextLetter(cur)
      : cur;
    select.value = next;
    syncLetterAndClearStroke();
  });

  if (colorPicker) {
    colorPicker.addEventListener("click", (e) => {
      if (e.target.dataset.color) {
        currentColor = e.target.dataset.color;
        Array.from(colorPicker.children).forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
      }
    });
    colorPicker.children[0].classList.add("active");
  }

  if (window.LetroGames && window.LetroGames.voiceNext) {
    window.LetroGames.voiceNext(btnVoice, () => {
      btnNext?.click();
    }, null);
  }
})();
