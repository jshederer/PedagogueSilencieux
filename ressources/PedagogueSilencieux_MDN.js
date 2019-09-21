// Fonctions mathématiques issues de https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/random
// On renvoie un nombre aléatoire entre 0 (inclus) et 1 (exclus)
function getRandom() {
  return Math.random();
}

// On renvoie un nombre aléatoire entre une valeur min (incluse) 
// et une valeur max (exclue)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// On renvoie un entier aléatoire entre une valeur min (incluse)
// et une valeur max (exclue).
// Attention : si on utilisait Math.round(), on aurait une distribution
// non uniforme !
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// On renvoie un entier aléatoire entre une valeur min (incluse)
// et une valeur max (incluse).
// Attention : si on utilisait Math.round(), on aurait une distribution
// non uniforme !
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}
