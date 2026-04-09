// Extensión del EMOJI_MAP con palabras faltantes
// Este archivo debe incluirse ANTES de cualquier juego
(function() {
  // Esperar a que EMOJI_MAP esté disponible
  var intentos = 0;
  var intervalo = setInterval(function() {
    if (typeof EMOJI_MAP !== 'undefined') {
      clearInterval(intervalo);
      
      // Definir emojis usando código Unicode para evitar problemas de codificación
      var extensiones = {
        'tambor': '\uD83E\uDD41',       // 🥁
        'uña': '\uD83D\uDC85',          // 💅
        'unicornio': '\uD83E\uDD84',    // 🦄
        'universidad': '\uD83C\uDF93',  // 🎓
        'urna': '\uD83C\uDFFA',         // 🏺
        'uniforme': '\uD83D\uDC54',     // 👔
        'velero': '\u26F5',              // ⛵
        'waffle': '\uD83E\uDDC7',        // 🧇
        'waterpolo': '\uD83E\uDDCF',     // 🤽
        'wifi': '\uD83D\uDCF6',          // 📶
        'web': '\uD83D\uDD78',           // 🕸️
        'wombat': '\uD83D\uDC28',        // 🐨
        'wakame': '\uD83C\uDF3F',        // 🌿
        'xilofono': '\uD83C\uDFB5',      // 🎵
        'xilografia': '\uD83C\uDFAE',    // 🎨
        'xenon': '\uD83D\uDCA1',         // 💡
        'xiloteca': '\uD83D\uDCDA',      // 📚
        'xerografia': '\uD83D\uDCCB',    // 📋
        'xifoides': '\uD83D\uDDA4',      // 🦴
        'yema': '\uD83E\uDD5A',          // 🥚
        'yoyo': '\uD83E\uDD80',          // 🪀
        'yuca': '\uD83C\uDF31',          // 🌱
        'yeso': '\uD83E\uDCAF',          // 🩹
        'zafiro': '\uD83D\uDC8E',        // 💎
        'uno': '1\uFE0F\u20E3',         // 1️⃣
        'urraca': '\uD83D\uDC26',        // 🐦
        'utensilio': '\uD83C\uDF74',    // 🍴
        'viento': '\uD83D\uDCA8',        // 💨
        'zona': '\uD83D\uDCCD',          // 📍
        'bota': '\uD83E\uDD7E',          // 🥾
        'bebe': '\uD83D\uDC76',          // 👶
        'boca': '\uD83D\uDC44',          // 👄
        'cola': '\uD83E\uDD8A',          // 🦊
        'dos': '2\uFE0F\u20E3',         // 2️⃣
        'dedo': '\u261D\uFE0F',          // ☝️
        'enfermera': '\uD83D\uDC69\u200D\u2695\uFE0F', // 👩‍⚕️
        'gafas': '\uD83D\uDC53',         // 👓
        'hueso': '\uD83E\uDD74',         // 🦴
        'invierno': '\u2744\uFE0F',       // ❄️
        'indio': '\uD83E\uDEB6',         // 🪶
        'joven': '\uD83E\uDDD1',         // 🧑
        'leche': '\uD83E\uDD5B',         // 🥛
        'nene': '\uD83D\uDC66',          // 👦
        'ojo': '\uD83D\uDC41\uFE0F',     // 👁️
        'yunque': '\u2692\uFE0F',         // ⚒️
        'wagon': '\uD83D\uDE83',         // 🚃
        'watusi': '\uD83D\uDC83',        // 💃
        'wallaby': '\uD83E\uDD98',       // 🦘
        'weta': '\uD83E\uDD97',          // 🦗
        'walkie': '\uD83D\uDCFB',        // 📻
        'whisky': '\uD83E\uDD43',        // 🥃
        'xantina': '\u2697\uFE0F',       // ⚗️
        'xenial': '\uD83E\uDD1D',        // 🤝
        'xenofobia': '\u26D4\uFE0F'      // 🚫
      };
      
      // Extender el EMOJI_MAP
      for (var palabra in extensiones) {
        if (!(palabra in EMOJI_MAP)) {
          EMOJI_MAP[palabra] = extensiones[palabra];
        }
      }
    } else if (intentos++ > 50) {
      // Timeout después de 5 segundos
      clearInterval(intervalo);
    }
  }, 100);
})();
