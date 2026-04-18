// js/juegos/core.js — Datos comunes, audio y utilidades para los minijuegos.
(function () {
  "use strict";

  var STORAGE_KEY =
    (window.LETRO_CONFIG && window.LETRO_CONFIG.STORAGE_KEY) || "letro_profile";
  var LETTERS = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");

  var WORDS_BY_LETTER = {
    A: ["avion", "arbol", "abeja", "agua", "ajo", "ala"],
    B: ["barco", "ballena", "botella", "bota", "bebe", "boca"],
    C: ["casa", "conejo", "cuchara", "camion", "cebra", "cola"],
    D: ["dado", "delfin", "dragon", "diente", "dos", "dedo"],
    E: ["elefante", "escalera", "estrella", "escuela", "escoba", "enfermera"],
    F: ["flor", "foca", "fruta", "flecha", "faro", "falda"],
    G: ["gato", "gallina", "guitarra", "gorra", "globo", "gafas"],
    H: ["helado", "hormiga", "hospital", "hacha", "hilo", "hueso"],
    I: ["isla", "iguana", "iman", "iglesia", "invierno", "indio"],
    J: ["jirafa", "juguete", "jabon", "jardin", "jarra", "joven"],
    K: ["kiwi", "koala", "karate", "kimono", "ketchup", "kayak"],
    L: ["luna", "leon", "lapiz", "libro", "lampara", "leche"],
    M: ["mano", "mesa", "mariposa", "montana", "manzana", "mochila"],
    N: ["nube", "naranja", "nido", "navio", "nariz", "nene"],
    "Ñ": ["ñandu", "ñoqui", "ñu", "ñora", "ñame", "ñanduti"],
    O: ["oso", "oveja", "oreja", "oruga", "olla", "ojo"],
    P: ["perro", "pelota", "pan", "pajaro", "puente", "pera"],
    Q: ["queso", "quetzal", "quinua", "quiosco", "quena", "quimica"],
    R: ["raton", "reloj", "rana", "rio", "robot", "rueda"],
    S: ["sol", "silla", "sapo", "sombrero", "sandia", "serpiente"],
    T: ["taza", "tiburon", "tren", "tomate", "tortuga", "tambor"],
    U: ["uva", "uña", "uno", "uniforme", "urraca", "utensilio"],
    V: ["vaca", "vaso", "ventana", "violin", "vela", "viento"],
    W: ["wagon", "watusi", "wallaby", "weta", "walkie", "whisky"],
    X: ["xilofono", "xifoides", "xantina", "xiloteca", "xenial", "xenofobia"],
    Y: ["yoyo", "yema", "yogur", "yunque", "yuca", "yeso"],
    Z: ["zapato", "zorro", "zanahoria", "zoologico", "zumo", "zona"],
  };

  var EMOJI_MAP = {
    avion: "✈️",
    arbol: "🌳",
    abeja: "🐝",
    agua: "💧",
    ajo: "🧄",
    ala: "🪶",
    anillo: "💍",
    arroz: "🍚",
    ardilla: "🐿️",
    barco: "⛵",
    ballena: "🐋",
    botella: "🍾",
    bota: "🥾",
    bebe: "👶",
    boca: "👄",
    burro: "🐴",
    biblioteca: "🏫",
    banana: "🍌",
    casa: "🏠",
    conejo: "🐰",
    cuchara: "🥄",
    camion: "🚚",
    cebra: "🦓",
    cereza: "🍒",
    cola: "🦊",
    dado: "🎲",
    delfin: "🐬",
    dragon: "🐉",
    diente: "🦷",
    dos: "2️⃣",
    dedo: "☝️",
    durazno: "🍑",
    domador: "🎪",
    elefante: "🐘",
    escalera: "🪜",
    estrella: "⭐",
    escuela: "🏫",
    escoba: "🧹",
    ensalada: "🥗",
    enfermera: "👩‍⚕️",
    flor: "🌸",
    foca: "🦭",
    fruta: "🍎",
    flecha: "🏹",
    faro: "🗼",
    fresa: "🍓",
    gato: "🐱",
    gallina: "🐔",
    guitarra: "🎸",
    gorra: "🧢",
    globo: "🎈",
    gafas: "👓",
    galleta: "🍪",
    helado: "🍦",
    hormiga: "🐜",
    hospital: "🏥",
    hacha: "🪓",
    hilo: "🧵",
    humo: "💨",
    hueso: "🦴",
    isla: "🏝️",
    iguana: "🦎",
    iman: "🧲",
    iglesia: "⛪",
    invierno: "❄️",
    indio: "🪶",
    idea: "💡",
    jirafa: "🦒",
    juguete: "🧸",
    jabon: "🧼",
    jardin: "🌷",
    jarra: "🍶",
    jamon: "🥓",
    joven: "🧑",
    kiwi: "🥝",
    koala: "🐨",
    karate: "🥋",
    kimono: "👘",
    ketchup: "🍅",
    kayak: "🛶",
    luna: "🌙",
    leon: "🦁",
    lapiz: "✏️",
    libro: "📚",
    lampara: "💡",
    leche: "🥛",
    lobo: "🐺",
    mano: "✋",
    mesa: "🪑",
    mariposa: "🦋",
    montana: "⛰️",
    manzana: "🍎",
    mochila: "🎒",
    nube: "☁️",
    naranja: "🍊",
    nido: "🪺",
    navio: "🚢",
    nariz: "👃",
    nene: "👦",
    ñandu: "🪶",
    ñoqui: "🍝",
    ñu: "🐃",
    ñora: "🌶️",
    ñame: "🍠",
    ñanduti: "🧶",
    oso: "🐻",
    oveja: "🐑",
    oreja: "👂",
    oruga: "🐛",
    olla: "🍲",
    ojo: "👁️",
    oasis: "🏜️",
    perro: "🐶",
    pelota: "⚽",
    pan: "🥖",
    pajaro: "🐦",
    puente: "🌉",
    pera: "🍐",
    queso: "🧀",
    quetzal: "🦜",
    quinua: "🥣",
    quiosco: "🏪",
    quena: "🎶",
    quimica: "⚗️",
    raton: "🐭",
    reloj: "🕒",
    rana: "🐸",
    rio: "🌊",
    robot: "🤖",
    rueda: "🛞",
    sol: "☀️",
    silla: "🪑",
    sapo: "🐸",
    sombrero: "🎩",
    sandia: "🍉",
    serpiente: "🐍",
    taza: "☕",
    tiburon: "🦈",
    tren: "🚆",
    tomate: "🍅",
    tambor: "🥁",
    tortuga: "🐢",
    uva: "🍇",
    uña: "💅",
    uno: "1️⃣",
    uniforme: "👔",
    urraca: "🐦",
    utensilio: "🍴",
    vaca: "🐄",
    vaso: "🥛",
    ventana: "🪟",
    violin: "🎻",
    volcan: "🌋",
    viento: "💨",
    wagon: "🚃",
    watusi: "💃",
    wallaby: "🦘",
    weta: "🦗",
    walkie: "📻",
    whisky: "🥃",
    xilofono: "🎵",
    xifoides: "🦴",
    xantina: "⚗️",
    xiloteca: "📚",
    xenial: "🤝",
    xenofobia: "🚫",
    yate: "🛥️",
    yema: "🥚",
    yoyo: "🪀",
    yogur: "🥛",
    yunque: "⚒️",
    yuca: "🌱",
    yeso: "🩹",
    zapato: "👟",
    zorro: "🦊",
    zanahoria: "🥕",
    zoologico: "🦁",
    zumo: "🧃",
    zona: "📍"
  };

  function loadProfile() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var p = raw ? JSON.parse(raw) : {};
      return p && typeof p === "object" ? p : {};
    } catch (e) {
      return {};
    }
  }

  /** Lo que guarda el perfil: facil, intermedio o dificil (si no, facil). */
  function getDifficulty() {
    var d = loadProfile().dificultad;
    if (d === "intermedio" || d === "dificil") return d;
    return "facil";
  }

  function soundEnabled() {
    return loadProfile().sonido !== false;
  }

  function speak(text) {
    // Validar sonido habilitado ANTES de hacer nada
    if (!soundEnabled()) {
      // Cancelar cualquier reproducción en curso
      if (window.speechSynthesis) {
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
      }
      return false;
    }
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    }
    var u = new SpeechSynthesisUtterance(String(text || ""));
    u.lang = "es-ES";
    u.rate = 0.5;
    u.pitch = 1.0;
    u.volume = 1.0;
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    var es = voices.find(function (v) {
      return v && v.lang && v.lang.toLowerCase().indexOf("es") === 0;
    });
    if (es) u.voice = es;
    window.speechSynthesis.speak(u);
    return true;
  }

  /** Corta la síntesis de voz al cambiar de pestaña o abandonar la pantalla. */
  function stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    }
  }

  function showBanner(ok) {
    var el = document.querySelector(".game-banner-feedback");
    if (!el) {
      el = document.createElement("div");
      el.className = "game-banner-feedback";
      document.body.appendChild(el);
    }
    el.textContent = ok ? "Lo lograste" : "No te rindas";
    el.classList.toggle("is-success", !!ok);
    el.classList.toggle("is-error", !ok);
    el.classList.add("is-visible");
    window.clearTimeout(showBanner._timer);
    showBanner._timer = window.setTimeout(function () {
      el.classList.remove("is-visible");
    }, 1700);
  }

  function normalizeToken(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9ñ]/g, "");
  }

  function getWordPhotoUrl(word) {
    var raw = normalizeToken(word);
    var tagMap = {
      avion: "airplane",
      arbol: "tree",
      abeja: "bee",
      anillo: "ring",
      arroz: "rice",
      ardilla: "squirrel",
      barco: "boat",
      ballena: "whale",
      botella: "bottle",
      burro: "donkey",
      biblioteca: "library",
      banana: "banana",
      casa: "house",
      conejo: "rabbit",
      cuchara: "spoon",
      camion: "truck",
      cebra: "zebra",
      cereza: "cherry",
      dado: "dice",
      delfin: "dolphin",
      dragon: "dragon",
      diente: "tooth",
      durazno: "peach",
      domador: "trainer",
      elefante: "elephant",
      escalera: "ladder",
      estrella: "star",
      escuela: "school",
      escoba: "broom",
      ensalada: "salad",
      flor: "flower",
      foca: "seal",
      fruta: "fruit",
      flecha: "arrow",
      faro: "lighthouse",
      fresa: "strawberry",
      gato: "cat",
      gallina: "chicken",
      guitarra: "guitar",
      gorra: "cap",
      globo: "balloon",
      galleta: "cookie",
      helado: "icecream",
      hormiga: "ant",
      isla: "island",
      iguana: "iguana",
      iman: "magnet",
      iglesia: "church",
      incendio: "fire",
      idea: "idea",
      jirafa: "giraffe",
      juguete: "toy",
      jabon: "soap",
      jardin: "garden",
      jarra: "jug",
      jamon: "ham",
      kiwi: "kiwi",
      koala: "koala",
      karate: "karate",
      kimono: "kimono",
      ketchup: "ketchup",
      kayak: "kayak",
      luna: "moon",
      leon: "lion",
      lapiz: "pencil",
      libro: "book",
      lampara: "lamp",
      lobo: "wolf",
      mano: "hand",
      mesa: "table",
      mariposa: "butterfly",
      montana: "mountain",
      manzana: "apple",
      mochila: "backpack",
      nube: "cloud",
      naranja: "orange",
      nido: "nest",
      navio: "ship",
      nariz: "nose",
      nutria: "otter",
      ñandu: "rhea",
      ñoqui: "gnocchi",
      ñu: "gnu",
      ñora: "pepper",
      ñame: "yam",
      ñanduti: "lace",
      oso: "bear",
      oveja: "sheep",
      oreja: "ear",
      oruga: "caterpillar",
      olla: "pot",
      oasis: "oasis",
      perro: "dog",
      pelota: "ball",
      pan: "bread",
      pajaro: "bird",
      puente: "bridge",
      pera: "pear",
      queso: "cheese",
      quetzal: "quetzal",
      quinua: "quinoa",
      quiosco: "kiosk",
      quena: "flute",
      quimica: "chemistry",
      raton: "mouse",
      reloj: "clock",
      rana: "frog",
      rio: "river",
      robot: "robot",
      rueda: "wheel",
      sol: "sun",
      silla: "chair",
      sapo: "toad",
      sombrero: "hat",
      sandia: "watermelon",
      serpiente: "snake",
      taza: "cup",
      tiburon: "shark",
      tren: "train",
      tomate: "tomato",
      tortuga: "turtle",
      uva: "grapes",
      una: "one",
      vaca: "cow",
      vaso: "glass",
      ventana: "window",
      violin: "violin",
      volcan: "volcano",
      yate: "yacht",
      yogur: "yogurt",
      zapato: "shoe",
      zorro: "fox",
      zanahoria: "carrot",
      zoologico: "zoo",
      zumo: "juice",
    };
    var tag = tagMap[raw] || raw || "object";
    var lock = encodeURIComponent(raw || "word");
    return {
      primary: "https://loremflickr.com/200/140/" + encodeURIComponent(tag + ",cartoon") + "?lock=" + lock,
      fallback: "https://loremflickr.com/200/140/cartoon?lock=" + lock,
    };
  }

  function clearChildren(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function nearestMatchRoot(el) {
    while (el) {
      if (el.classList && (el.classList.contains("match-root") || el.classList.contains("match-columns"))) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function getCenterWithin(el, root) {
    var r = el.getBoundingClientRect();
    var rr = root.getBoundingClientRect();
    return { x: r.left - rr.left + r.width / 2, y: r.top - rr.top + r.height / 2 };
  }

  function createOrGetSvgOverlay(root) {
    if (!root) return null;
    var svg = root.querySelector(".match-lines");
    if (svg) return svg;
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "match-lines");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    svg.style.inset = "0";
    svg.style.pointerEvents = "none";
    root.style.position = "relative";
    root.appendChild(svg);
    return svg;
  }

  function resizeSvgToRoot(svg, root) {
    if (!svg || !root) return;
    var rr = root.getBoundingClientRect();
    svg.setAttribute("width", String(rr.width));
    svg.setAttribute("height", String(rr.height));
    svg.setAttribute("viewBox", "0 0 " + rr.width + " " + rr.height);
  }

  function drawCurvedLine(svg, a, b, color, id) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (id) path.setAttribute("data-line-id", id);
    var dx = Math.max(40, Math.abs(b.x - a.x) * 0.35);
    var c1 = { x: a.x + dx, y: a.y };
    var c2 = { x: b.x - dx, y: b.y };
    path.setAttribute(
      "d",
      "M " + a.x + " " + a.y + " C " + c1.x + " " + c1.y + ", " + c2.x + " " + c2.y + ", " + b.x + " " + b.y
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color || "#8FB1CC");
    path.setAttribute("stroke-width", "6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("opacity", "0.92");
    svg.appendChild(path);
    return path;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function sample(list, n) {
    return shuffle(list).slice(0, n);
  }

  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function getEmoji(word) {
    var key = normalizeToken(String(word || ""));
    if (!key) return "🎈";
    if (EMOJI_MAP[key]) return EMOJI_MAP[key];
    if (key === "tambor") return "🥁";
    if (key === "uña") return "💅";
    if (key === "unicornio") return "🦄";
    if (key === "universidad") return "🎓";
    if (key === "urna") return "🏺";
    if (key === "uniforme") return "👔";
    if (key === "velero") return "⛵";
    if (key === "waffle") return "🧇";
    if (key === "waterpolo") return "🤽";
    if (key === "wifi") return "📶";
    if (key === "web") return "🕸️";
    if (key === "wombat") return "🐨";
    if (key === "wakame") return "🌿";
    if (key === "xilofono") return "🎵";
    if (key === "xilografia") return "🎨";
    if (key === "xenon") return "💡";
    if (key === "xiloteca") return "📚";
    if (key === "xerografia") return "📋";
    if (key === "xifoides") return "🦴";
    if (key === "yema") return "🥚";
    if (key === "yoyo") return "🪀";
    if (key === "yuca") return "🌱";
    if (key === "yeso") return "🩹";
    if (key === "zafiro") return "💎";
    if (key.indexOf("bebe") === 0) return "👶";
    if (key.indexOf("ba") === 0) return "🛁";
    if (key.indexOf("bo") === 0) return "🎈";
    if (key.indexOf("ca") === 0) return "🐱";
    if (key.indexOf("do") === 0) return "🐶";
    if (key.indexOf("mu") === 0) return "🎵";
    return "🎈";
  }

  function getAllWords() {
    var all = [];
    LETTERS.forEach(function (letter) {
      (WORDS_BY_LETTER[letter] || []).forEach(function (word) {
        all.push({ letter: letter, word: word, emoji: getEmoji(word) });
      });
    });
    return all;
  }

  function makeWrongWord(word) {
    var w = String(word).toUpperCase();
    if (w.length < 3) return w + "H";
    var a = w.replace("B", "V");
    if (a !== w) return a;
    a = w.replace("V", "B");
    if (a !== w) return a;
    return w.slice(0, -1) + "H";
  }

  function createVoiceNext(btn, onNext, statusEl) {
    if (!btn || typeof onNext !== "function") return;
    var R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) {
      btn.disabled = true;
      if (statusEl) statusEl.textContent = 'Tu navegador no soporta voz. Usa el botón "Siguiente".';
      return;
    }
    var rec = new R();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    btn.addEventListener("click", function () {
      try {
        rec.start();
        if (statusEl) statusEl.textContent = 'Escuchando... di "siguiente".';
      } catch (e) {}
    });
    rec.onresult = function (ev) {
      var t = "";
      try {
        t = ev.results[0][0].transcript.toLowerCase();
      } catch (e) {}
      if (t.indexOf("siguiente") !== -1) {
        onNext();
        if (statusEl) statusEl.textContent = 'Comando detectado: "siguiente".';
      } else if (statusEl) {
        statusEl.textContent = 'No escuché "siguiente". Intenta otra vez.';
      }
    };
  }

  /** Oculta contenedores marcados cuando el sonido está desactivado (minijuegos). */
  function syncSoundBlocks() {
    var enabled = soundEnabled();
    var blocks = document.querySelectorAll("#sonidoLetra");
    blocks.forEach(function (element) {
      element.classList.toggle("d-none", !enabled);
    });
  }

  window.LetroCore = {
    LETTERS: LETTERS,
    getDifficulty: getDifficulty,
    speak: speak,
    stopSpeech: stopSpeech,
    showBanner: showBanner,
    soundEnabled: soundEnabled,
    getAllWords: getAllWords,
    randomItem: randomItem,
    sample: sample,
    shuffle: shuffle,
    makeWrongWord: makeWrongWord,
    createVoiceNext: createVoiceNext,
    nearestMatchRoot: nearestMatchRoot,
    clearChildren: clearChildren,
    getCenterWithin: getCenterWithin,
    createOrGetSvgOverlay: createOrGetSvgOverlay,
    resizeSvgToRoot: resizeSvgToRoot,
    drawCurvedLine: drawCurvedLine,
    getWordPhotoUrl: getWordPhotoUrl,
    syncSoundBlocks: syncSoundBlocks,
  };

  window.LetroGames = {
    letters: LETTERS.slice(),
    totalWords: getAllWords().length,
    getDifficulty: getDifficulty,
    nextLetter: function (letter) {
      var i = LETTERS.indexOf(letter);
      if (i < 0) return LETTERS[0];
      return LETTERS[(i + 1) % LETTERS.length];
    },
    speak: speak,
    stopSpeech: stopSpeech,
    voiceNext: createVoiceNext,
    soundEnabled: soundEnabled,
    syncSoundBlocks: syncSoundBlocks,
  };

  function updateSoundControls() {
    var enabled = soundEnabled();
    var soundButtons = Array.prototype.slice.call(document.querySelectorAll(
      "#btnEscuchar, #btnEscucharPalabra, #btnEscucharSilaba, #btnEscucharJuego, #btnSonidoLetra"
    ));
    soundButtons.forEach(function (btn) {
      if (!enabled) {
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
        btn.title = "Sonido desactivado";
      } else {
        btn.disabled = false;
        btn.removeAttribute("aria-disabled");
        btn.title = btn.id === "btnSonidoLetra" ? "Reproducir sonido" : "Escuchar sonido";
      }
    });
    syncSoundBlocks();
  }

  window.addEventListener("soundSettingChanged", function () {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    updateSoundControls();
  });

  updateSoundControls();

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") stopSpeech();
  });
  window.addEventListener("pagehide", stopSpeech);
})();
