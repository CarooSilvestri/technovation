(function () {
  "use strict";

  var STORAGE_KEY = "letritas_perfil";
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

  function soundEnabled() {
    return loadProfile().sonido !== false;
  }

  function speak(text) {
    if (!soundEnabled()) return false;
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
    window.speechSynthesis.cancel();
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
      if (el.classList && el.classList.contains("match-columns")) return el;
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

  function initLetraSonido() {
    if (document.body.getAttribute("data-game") !== "letra-sonido") return;
    var optionsEl = document.getElementById("letraOpciones");
    var btnListen = document.getElementById("btnEscuchar");
    var btnNext = document.getElementById("btnSiguiente");
    var btnVoice = document.getElementById("btnVozSiguiente");
    var status = document.getElementById("estadoJuego");
    var listenState = document.getElementById("estadoEscucha");
    if (!optionsEl || !btnListen || !btnNext) return;

    var current = null;
    var all = getAllWords();

    function renderRound() {
      current = randomItem(all);
      var correct = current.letter;
      var wrong = sample(
        LETTERS.filter(function (l) {
          return l !== correct;
        }),
        5
      );
      var options = shuffle([correct].concat(wrong));
      optionsEl.innerHTML = "";
      options.forEach(function (op) {
        var col = document.createElement("div");
        col.className = "col-4";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-outline-dark btn-lg w-100 py-3 fs-3";
        btn.textContent = op;
        btn.addEventListener("click", function () {
          var ok = op === correct;
          status.className = "small mt-2 " + (ok ? "text-success" : "text-danger");
          status.textContent = ok ? "Correcto." : "Intenta otra vez.";
          showBanner(ok);
          if (ok) setTimeout(renderRound, 2000);
        });
        col.appendChild(btn);
        optionsEl.appendChild(col);
      });
      status.className = "small mt-2 text-muted";
      status.textContent = "";
    }

    btnListen.addEventListener("click", function () {
      if (!current) return;
      var ok = speak(current.letter);
      if (listenState) {
        listenState.textContent = ok
          ? "Sonido reproducido."
          : "Sonido desactivado en perfil o no disponible en este navegador.";
      }
    });
    btnNext.addEventListener("click", renderRound);
    createVoiceNext(btnVoice, renderRound, status);
    renderRound();
  }

  function initPalabras() {
    if (document.body.getAttribute("data-game") !== "palabras") return;
    var clue = document.getElementById("pistaTexto");
    var options = document.getElementById("palabraOpciones");
    var state = document.getElementById("estadoJuego");
    var btnListen = document.getElementById("btnEscucharPalabra");
    var btnNext = document.getElementById("btnSiguiente");
    var btnVoice = document.getElementById("btnVozSiguiente");
    if (!clue || !options || !state || !btnListen || !btnNext) return;

    var current = null;
    var all = getAllWords();

    function renderRound() {
      current = randomItem(all);
      clue.innerHTML =
        "<div style='font-size: 6rem; margin-bottom: 1rem;' aria-hidden='true'>" +
        current.emoji +
        "</div>" +
        "<span class='d-block'>" +
        current.emoji +
        " Identifica el nombre</span>";
      var c = current.word.toUpperCase();
      var a = makeWrongWord(c);
      var b = makeWrongWord(c + "S").replace("SS", "S");
      var arr = shuffle([c, a, b]);
      options.innerHTML = "";
      arr.forEach(function (w) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-light border btn-lg text-start py-3";
        btn.textContent = w;
        btn.addEventListener("click", function () {
          var ok = w === c;
          state.className = "alert mt-4 mb-0 small " + (ok ? "alert-success" : "alert-warning");
          state.textContent = ok ? "Correcto." : "No, prueba otra opción.";
          showBanner(ok);
          if (ok) setTimeout(renderRound, 2000); // Auto next after 2 seconds
        });
        options.appendChild(btn);
      });
      state.className = "alert alert-info mt-4 mb-0 small";
      state.textContent = "Elige una opción.";
    }

    btnListen.addEventListener("click", function () {
      if (current) speak(current.word);
    });
    btnNext.addEventListener("click", renderRound);
    createVoiceNext(btnVoice, renderRound, state);
    renderRound();
  }

  function initSilabas() {
    if (document.body.getAttribute("data-game") !== "silabas") return;
    var text = document.getElementById("textoSilaba");
    var hint = document.getElementById("ayudaSilaba");
    var emoji = document.getElementById("emojiSilaba");
    var opts = document.getElementById("silabaOpciones");
    var state = document.getElementById("estadoJuego");
    var btnListen = document.getElementById("btnEscucharSilaba");
    var btnNext = document.getElementById("btnSiguiente");
    var btnVoice = document.getElementById("btnVozSiguiente");
    if (!text || !opts || !btnListen || !btnNext) return;

    var current = null;
    var idx = 1;
    var all = getAllWords();

    function renderRound() {
      current = randomItem(all);
      var w = current.word.toUpperCase();
      idx = w.length > 2 ? 1 : 0;
      var correct = w[idx];
      text.textContent = w.slice(0, idx) + "_" + w.slice(idx + 1);
      hint.textContent = "Completa la palabra";
      emoji.innerHTML =
        "<div style='font-size: 5rem; margin-bottom: 1rem;' aria-hidden='true'>" +
        current.emoji +
        "</div>" +
        "<span class='d-block fs-6'>" +
        current.emoji +
        "</span>";
      var letters = shuffle([correct].concat(sample(LETTERS.filter(function (l) { return l !== correct; }), 3)));
      opts.innerHTML = "";
      letters.forEach(function (l) {
        var col = document.createElement("div");
        col.className = "col-6";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-outline-primary btn-lg w-100 py-4 fs-2";
        btn.textContent = l;
        btn.addEventListener("click", function () {
          if (l === correct) {
            text.textContent = w;
            state.className = "small text-success mt-2";
            state.textContent = "Muy bien.";
            showBanner(true);
            setTimeout(renderRound, 2000);
          } else {
            state.className = "small text-danger mt-2";
            state.textContent = "Intenta de nuevo.";
            showBanner(false);
          }
        });
        col.appendChild(btn);
        opts.appendChild(col);
      });
      state.textContent = "";
    }

    btnListen.addEventListener("click", function () {
      if (current) speak(current.word);
    });
    btnNext.addEventListener("click", renderRound);
    createVoiceNext(btnVoice, renderRound, state);
    renderRound();
  }

  function initUnirDibujos() {
    if (document.body.getAttribute("data-game") !== "unir-dibujos") return;
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
    var pairs = {}; // wordIndex -> emojiIndex
    var selectedWord = null;
    var selectedEmoji = null;

    function redrawLines() {
      var root = nearestMatchRoot(wordsEl);
      if (!root) return;
      var svg = createOrGetSvgOverlay(root);
      if (!svg) return;
      resizeSvgToRoot(svg, root);
      clearChildren(svg);
      Object.keys(pairs).forEach(function (k) {
        var wi = parseInt(k, 10);
        var ei = pairs[k];
        var wBtn = wordsEl.querySelector('[data-word-idx="' + wi + '"]');
        var eBtn = drawsEl.querySelector('[data-emoji-idx="' + ei + '"]');
        if (!wBtn || !eBtn) return;
        var a = getCenterWithin(wBtn, root);
        var b = getCenterWithin(eBtn, root);
        drawCurvedLine(svg, a, b, "var(--letritas-blue)", "w" + wi);
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
      round = sample(getAllWords(), 4);
      emojis = shuffle(
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
      emojis.forEach(function (e, idxEmoji) {
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
      showBanner(ok);
      if (ok) setTimeout(renderRound, 2000);
    });
    if (btnListen) {
      btnListen.addEventListener("click", function () {
        var words = round.map(function (r) { return r.word; }).join(", ");
        speak(words);
      });
    }
    btnNext.addEventListener("click", renderRound);
    createVoiceNext(btnVoice, renderRound, state);
    window.addEventListener("resize", redrawLines);
    renderRound();
  }

  function initUnirMayusculas() {
    if (document.body.getAttribute("data-game") !== "unir-mayusculas") return;
    var upEl = document.getElementById("listaMayusculas");
    var lowEl = document.getElementById("listaMinusculas");
    var selEl = document.getElementById("listaSelectsLetras");
    var btnCheck = document.getElementById("btnComprobar");
    var btnListen = document.getElementById("btnEscucharJuego");
    var btnNext = document.getElementById("btnSiguiente");
    var btnVoice = document.getElementById("btnVozSiguiente");
    var state = document.getElementById("estadoJuego");
    if (!upEl || !lowEl || !selEl || !btnCheck || !btnNext) return;

    var letters = [];
    var lowers = [];
    var pairs = {}; // upperIndex -> lowerIndex
    var selectedUp = null;
    var selectedLow = null;

    function redrawLines() {
      var root = nearestMatchRoot(upEl);
      if (!root) return;
      var svg = createOrGetSvgOverlay(root);
      if (!svg) return;
      resizeSvgToRoot(svg, root);
      clearChildren(svg);
      Object.keys(pairs).forEach(function (k) {
        var ui = parseInt(k, 10);
        var li = pairs[k];
        var upBtn = upEl.querySelector('[data-up-idx="' + ui + '"]');
        var lowBtn = lowEl.querySelector('[data-low-idx="' + li + '"]');
        if (!upBtn || !lowBtn) return;
        var a = getCenterWithin(upBtn, root);
        var b = getCenterWithin(lowBtn, root);
        drawCurvedLine(svg, a, b, "var(--letritas-pink)", "u" + ui);
      });
    }

    function clearSelections() {
      selectedUp = null;
      selectedLow = null;
      Array.prototype.forEach.call(upEl.querySelectorAll(".match-item-btn"), function (b) {
        b.classList.remove("is-selected");
      });
      Array.prototype.forEach.call(lowEl.querySelectorAll(".match-item-btn"), function (b) {
        b.classList.remove("is-selected");
      });
    }

    function tryConnect() {
      if (selectedUp == null || selectedLow == null) return;
      pairs[String(selectedUp)] = selectedLow;
      clearSelections();
      redrawLines();
    }

    function renderRound() {
      letters = sample(LETTERS, 6);
      lowers = shuffle(
        letters.map(function (l) {
          return l.toLowerCase();
        })
      );
      pairs = {};
      clearSelections();
      upEl.innerHTML = "";
      lowEl.innerHTML = "";
      selEl.innerHTML = "";
      letters.forEach(function (l) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "match-item match-item-btn";
        d.textContent = l;
        d.setAttribute("data-up-idx", String(upEl.childElementCount));
        d.addEventListener("click", function () {
          selectedUp = parseInt(d.getAttribute("data-up-idx"), 10);
          Array.prototype.forEach.call(upEl.querySelectorAll(".match-item-btn"), function (b) {
            b.classList.toggle("is-selected", b === d);
          });
          tryConnect();
        });
        upEl.appendChild(d);
      });
      lowers.forEach(function (l) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "match-item match-item-btn";
        d.textContent = l;
        d.setAttribute("data-low-idx", String(lowEl.childElementCount));
        d.addEventListener("click", function () {
          selectedLow = parseInt(d.getAttribute("data-low-idx"), 10);
          Array.prototype.forEach.call(lowEl.querySelectorAll(".match-item-btn"), function (b) {
            b.classList.toggle("is-selected", b === d);
          });
          tryConnect();
        });
        lowEl.appendChild(d);
      });
      state.textContent = "";
      redrawLines();
    }

    btnCheck.addEventListener("click", function () {
      var ok = true;
      for (var i = 0; i < letters.length; i++) {
        var pick = pairs[String(i)];
        if (pick == null) ok = false;
        else if (lowers[pick] !== letters[i].toLowerCase()) ok = false;
      }
      state.className = "small mt-2 " + (ok ? "text-success" : "text-danger");
      state.textContent = ok ? "Correcto." : "Algunas uniones no coinciden.";
      showBanner(ok);
      if (ok) setTimeout(renderRound, 2000);
    });
    if (btnListen) {
      btnListen.addEventListener("click", function () {
        speak(letters.join(", "));
      });
    }
    btnNext.addEventListener("click", renderRound);
    createVoiceNext(btnVoice, renderRound, state);
    window.addEventListener("resize", redrawLines);
    renderRound();
  }

  window.LetritasGames = {
    letters: LETTERS.slice(),
    totalWords: getAllWords().length,
    nextLetter: function (letter) {
      var i = LETTERS.indexOf(letter);
      if (i < 0) return LETTERS[0];
      return LETTERS[(i + 1) % LETTERS.length];
    },
    speak: speak,
    voiceNext: createVoiceNext,
    soundEnabled: soundEnabled,
  };

  initLetraSonido();
  initPalabras();
  initSilabas();
  initUnirDibujos();
  initUnirMayusculas();
})();
