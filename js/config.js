
(function () {
  "use strict";

  window.LETRO_CONFIG = {
    STORAGE_KEY: "letro_profile",
    SPLASH_DELAY_MS: 5000,
    STEPS: 3,
    /** Avatares del registro: id estable (perfil/localStorage), emoji, etiqueta y color de fondo (CSS). */
    AVATARS: [
      { id: "abeja", emoji: "🐝", label: "Abeja", background: "var(--letro-blue)" },
      { id: "gato", emoji: "🐱", label: "Gato", background: "var(--letro-green)" },
      { id: "oso", emoji: "🐻", label: "Oso", background: "var(--letro-pink)" },
      { id: "conejo", emoji: "🐰", label: "Conejo", background: "var(--letro-avatar-gray)" },
      { id: "buho", emoji: "🦉", label: "Búho", background: "var(--letro-blue)" },
      { id: "zorro", emoji: "🦊", label: "Zorro", background: "var(--letro-green)" },
    ],
  };

  window.PAGES = {
    REGISTER: "register.html",
    HOME: "home.html",
    PROFILE: "perfil.html",
    GAME_UNIR_DIBUJOS: "juego-unir-dibujos.html",
    GAME_UNIR_MAYUSCULAS: "juego-unir-mayusculas.html",
    GAME_SILABAS: "juego-silabas.html",
  };
})();

