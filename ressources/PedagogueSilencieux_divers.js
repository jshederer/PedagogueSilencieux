// Fonctions de chaîne de caractères aléatoire
function getRandomString(possible,length) {
  var texte=[];
  for (var i = 0; i < length; i++)
    texte[i] = possible.charAt(Math.floor(Math.random() * possible.length));
  return texte.join('');
}

function getRandomStringAlphabetShort(length) {
	var possible = "abcdefghijklmnopqrstuvwxyz";
	return getRandomString(possible,length);
}

function getRandomStringAlphabet(length) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	return getRandomString(possible,length);
}

function getRandomStringNum(length) {
	var possible = "0123456789";
	return getRandomString(possible,length);
}

function getRandomStringAlphaNum(length) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return getRandomString(possible,length);
}

function getRandomStringComplet(length) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:;,?/!()";
	return getRandomString(possible,length);
}
