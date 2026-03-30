// app/js/juego-dibujar-letra.js — Canvas de trazo de demostración y actualización de guía tipográfica.

(function () {
  "use strict";

  const canvas = document.getElementById("traceCanvas");
  const guide = document.querySelector(".trace-guide");
  const select = document.getElementById("letraElegida");
  const btnClear = document.getElementById("btnLimpiar");
  const btnSound = document.getElementById("btnSonidoLetra");

  if (!canvas || !guide) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let drawing = false;

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

  select?.addEventListener("change", setGuideFromSelect);
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
    ctx.strokeStyle = "#0d6efd";
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
    // Maqueta: sin archivo de audio; en producción: Audio() o Web Speech API
    btnSound.classList.add("active");
    setTimeout(() => btnSound.classList.remove("active"), 200);
  });
})();
