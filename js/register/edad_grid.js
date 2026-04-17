/** Construye la grilla de edades (una vez) y escribe el valor en el input oculto #edad para el submit. */
export function buildEdadGrid() {
  var edadInput = document.getElementById("edad");
  var edadGrid = document.getElementById("edad-grid");

  var EDAD_MIN = window.AGES.MIN;
  var EDAD_MAX = window.AGES.MAX;

  for (let age = EDAD_MIN; age <= EDAD_MAX; age++) {
    var wrap = document.createElement("div");
    wrap.className = "d-flex flex-wrap justify-content-center box-button";

    let chip = document.createElement("button");
    chip.type = "button";
    chip.className = "btn btn-outline-primary p-3 btn-lg rounded-circle app-edad-chip";
    chip.setAttribute("data-edad", String(age));
    chip.setAttribute("aria-label", age + " años");
    chip.textContent = String(age);
    chip.addEventListener("click", function () {
      if (edadInput) edadInput.value = String(age);
      edadGrid.querySelectorAll(".app-edad-chip.is-selected").forEach(function (c) {
        c.classList.remove("is-selected");
      });
      chip.classList.add("is-selected");
    });

    wrap.appendChild(chip);
    edadGrid.appendChild(wrap);
  }
}
