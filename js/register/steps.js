// js/register/steps.js — Pasos del wizard de registro y validación por paso.
function validateNombreStep(nombreInput) {
  var trimmed = nombreInput && nombreInput.value.trim();
  if (!trimmed) {
    if (nombreInput) nombreInput.focus();
    return false;
  }
  return true;
}

export function createRegistroSteps(opts) {

  var stepCurrentEl = document.getElementById("current-step");
  var stepTotalEl = document.getElementById("total-steps");

  var steps = [
    document.getElementById("step-0"),
    document.getElementById("step-1"),
    document.getElementById("step-2"),
  ].filter(Boolean);

  var progressEl = document.getElementById("registro-progress");
  var dots = progressEl
    ? Array.prototype.slice.call(progressEl.querySelectorAll(".step-bar"))
    : [];

  var btnBack = opts.btnBack;
  var btnNext = opts.btnNext;
  var btnSubmit = opts.btnSubmit;

  var nombreInput = opts.nombreInput;
  var edadInput = opts.edadInput;

  var current = 0;
  var total = steps.length;

  function validateStep(index) {
    if (index === 0) {
      return validateNombreStep(nombreInput);
    }

    if (index === 1) {
      if (!edadInput) return false;
      var edadRaw = String(edadInput.value);
      if (edadRaw === "") return false;
      var edadNum = parseInt(edadRaw, 10);
      return !Number.isNaN(edadNum);
    }
    return true;
  }

  function showStep(index) {
    current = Math.max(0, Math.min(index, total - 1));
    steps.forEach(function (el, i) {
      el.hidden = i !== current;
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i <= current);
      dot.classList.toggle("is-current", i === current);
    });
    if (progressEl) {
      progressEl.setAttribute("aria-valuenow", String(current + 1));
      progressEl.setAttribute("aria-valuemax", String(total));
    }
    if (stepCurrentEl) {
      stepCurrentEl.textContent = String(current + 1);
    }
    if (stepTotalEl) {
      stepTotalEl.textContent = String(total);
    }
    if (btnBack) btnBack.hidden = current === 0;
    if (btnNext) btnNext.hidden = current === total - 1;
    if (btnSubmit) btnSubmit.hidden = current !== total - 1;
  }

  function bindNavigation() {
    btnNext.addEventListener("click", function () {
      if (!validateStep(current)) return;
      showStep(current + 1);
    });
    if (btnBack) {
      btnBack.addEventListener("click", function () {
        showStep(current - 1);
      });
    }
  }

  return {
    validateStep: validateStep,
    showStep: showStep,
    getCurrent: function () {
      return current;
    },
    bindNavigation: bindNavigation,
  };
}
