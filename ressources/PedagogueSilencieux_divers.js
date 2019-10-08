// Fonctions de chaîne de caractères aléatoire
function getRandomString(possible,longueur) {
  var texte=[];
  for (var i = 0; i < longueur; i++)
    texte[i] = possible.charAt(Math.floor(Math.random() * possible.length));
  return texte.join('');
}

function getRandomStringAlphabetShort(longueur) {
	var possible = "abcdefghijklmnopqrstuvwxyz";
	return getRandomString(possible,longueur);
}

function getRandomStringAlphabet(longueur) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	return getRandomString(possible,longueur);
}

function getRandomStringNum(longueur) {
	var possible = "0123456789";
	return getRandomString(possible,longueur);
}

function getRandomStringAlphaNum(longueur) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return getRandomString(possible,longueur);
}

function getRandomStringComplet(longueur) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:;,?/!()";
	return getRandomString(possible,longueur);
}
