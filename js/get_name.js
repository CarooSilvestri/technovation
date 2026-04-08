(function () {
  "use strict";

  function getName() {
    const user = localStorage.getItem(window.LETRO_CONFIG.STORAGE_KEY);
    if (!user) return null;
    return JSON.parse(user).nombre;
  }

  function setName() {
    const name = document.getElementById("name");
    if (!name) return null;
    name.textContent = getName();
  }

  setName();
})();
