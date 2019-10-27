"use strict";
//Variables globales de gestion du quizz
var numero = 0;
var occurence = 0;
var boucle=0;
var aide = false;
var resultat=false;
var script=false;
var lib_q="";

//Variables globales de gestion de la réussite
var compteur_correctes = 0;
var compteur_incorrectes = 0;
var score=0.00
var temps=[];
var temps_question=0.00;
var delai_question=0.00;

//Variables globales de gestion de la rémanence des données+console supervision
var DB = new PouchDB('PedagogueSilencieuxDB', {auto_compaction: true});
var DB_ID = "";
var DB_date = new Date().toISOString();
var DB_revision =false;
var reprise = false;
var DB_remoteCouch = false;
var DB_murmur = "";

//Lecture des paramètres de page
var resultat = [];
var tmp = [];
//location: Variable globale
location.search
	.substr(1)
	.split("&")
	.forEach(function (item) {
		tmp = item.split("=");
		resultat[tmp[0]] = decodeURIComponent(tmp[1]);
	});

var fichier_parametre = false;
for(var index in resultat) {
	if(index == "file") {
		$.getScript(resultat[index])
			.done(function( script, textStatus ) {
				console.log( textStatus );
				fichier_parametre = true;
			})
			.fail(function( jqxhr, settings, exception ) {
				$("#quizz").append("Problème de chargement des questions");
				$("#quizz").append(exception);
				console.log( settings );
			});
	}
}

if(!fichier_parametre) {
	$.getScript("./questions.json")
		.done(function( script, textStatus ) {
			console.log( textStatus );
			fichier_parametre = true;
		})
		.fail(function( jqxhr, settings, exception ) {
			$("#quizz").append("Problème de chargement des questions");
			$("#quizz").append(exception);
			console.log( settings );
		});
}

//Fonctions du quizz
function ajouterQuestion(){
	//Gestion d'un script de question/réponse et d'une éventuelle erreur sur le script d'une question
	resultat = false;
	script=false;
	lib_q = "";
	if(questions[numero]['script']!="") {
		try {
			eval(questions[numero]['script']);
			script=true;
		}
		catch(error) {
			console.log("Erreur de script sur question:"+numero);
			console.error(error);
			return false;
		}
	}
	
	//Ajout des champs de gestion question
	var conteneur = $('<div/>', {class: "conteneur", id : "conteneur_"+occurence});
	var box_q = $('<div/>', {class: "question", id : "question_"+occurence});
	var box_lib_q = $('<div/>', {class: "lib_q", id : "lib_q_"+occurence, html:questions[numero]['lib_q']+lib_q});
	box_q.append(box_lib_q);
	if(questions[numero]['boucle']<=1) {
		//Affichage de l'aide si on ne passe qu'une seule fois sur la question
		aide = true;
	}
	if(aide && questions[numero]['aide']!="") {
		//Affichage de l'aide si elle n'est pas vide
		var box_aide = $('<div/>', {class: "aide", id : "aide_"+occurence, text:questions[numero]['aide'] });
		box_q.append(box_aide);
		aide = false;
	}
	conteneur.append(box_q);
	
	//Ajout des champs de gestion réponse
	var box_r = $('<div/>', {class: "reponse", id : "reponse_"+occurence});
	var box_lib_r = $('<div/>', {class: "lib_r", id : "lib_r_"+occurence, html: questions[numero]['lib_r']});
	box_r.append(box_lib_r);
	
	var box_r_interface = $('<div/>', {class: "reponse_interface", id : "r_interface_"+occurence});
	var box_input_r = $("<input/>", {type: "text", class: "reponse", id : "input_"+occurence, autocomplete:"off", onchange: "verifier(value)" });	
	box_r_interface.append(box_input_r);
	box_r.append(box_r_interface);
	conteneur.append(box_r);
	
	$("#quizz").append(conteneur);
	conteneur.addClass("actif");

	box_input_r.focus();
	$('html, body').animate({
		scrollTop: conteneur.offset().top
	}, 500);
	temps_question = Date.now();
}

function demarrrerQuestionnaire() {
	DB.allDocs({include_docs: true, descending: true}, function(erreur, donnees) {
		if(erreur)
			console.error(erreur);

		var element={};
		for(element of donnees.rows) {
			console.log(element);
			if(element.doc.questions_id == questions_id && element.doc.questions_version_id == questions_version_id) {
				if(element.doc.etat!='Fin') {
					//Reprise du questionnaire
					reprise = true;
					DB_ID = element.doc._id
					DB_revision = element.doc._rev;
					numero = element.doc.numero;
					occurence =  element.doc.occurence;
					boucle = element.doc.boucle;
					aide = element.doc.aide;
					score = element.doc.score;
					compteur_correctes = element.doc.compteur_correctes;
					compteur_incorrectes = element.doc.compteur_incorrectes;
					temps = element.doc.temps;

					$("#titre").text(titre+" (Reprise)");
					document.title = titre+" (Reprise)";
				}
				break;
			}
		}
		ajouterQuestion();
	});
}

function ajouterResume() {
	var resume = $('<div/>', {class: "resume"});
	var correctes = $('<div/>', {class: "correctes", text:"Réponses correctes:"+compteur_correctes});
	var incorrectes = $('<div/>', {class: "incorrectes", text:"Réponses incorrectes:"+compteur_incorrectes});
	resume.append(correctes);
	resume.append(incorrectes);
	$("#quizz").append(resume);
	$('html, body').animate({
		scrollTop: resume.offset().top
	}, 500);
}

function ajouterTemps(numero_question, reponse_correcte) {
	temps.push({'delai': delai_question, 'numero_question':numero_question, 'correcte': reponse_correcte});
}

function verifier(value) {
	delai_question = Date.now() - temps_question;
	var etat = 'En cours';
	//Désactivation conteneur
	$("#conteneur_"+occurence).removeClass("actif");
	var box_r_interface = $("#r_interface_"+occurence);
	var box_input_r = $("#input_"+occurence);
	box_input_r.addClass("gris");
	
	//Gestion des attendus: fixe ou déterminé par le script
	var attendu="";
	if(questions[numero]['r']!==false)
		attendu=questions[numero]['r']
	else
		attendu=resultat;
	
	if(value==attendu) {
		//Réponse correcte
		compteur_correctes+=1;

		box_input_r.addClass("sourire");
		var sourire = $('<span/>', {class: "sourire", text:":)"});
		box_r_interface.append(sourire);

		score += 1-boucle/questions[numero]['boucle'];
		boucle=0;
		aide = false;
		
		ajouterTemps(numero,true);

		if(numero<(questions.length-1)) {
			//Il reste des questions
			numero+=1;
			occurence+=1;
			ajouterQuestion();
		} else {
			etat = 'Fin';
			ajouterResume();
		}
	} else {
		//Réponse incorrecte
		compteur_incorrectes+=1;

		box_input_r.addClass("tristesse");
		//Affichage de la correction si cela est configuré sur la question
		if(questions[numero]['correction']===true) {
			var correction = $('<span/>', {class: "correction", text:"=>"+attendu});
			box_r_interface.append(correction);
		}
		var tristesse = $('<span/>', {class: "tristesse", text:":("});
		box_r_interface.append(tristesse);

		ajouterTemps(numero,false);

		//Boucle sur la question
		boucle+=1;
		if(questions[numero]['boucle']>boucle) {
			//On réaffiche la même question autant de fois que configuré sur la question
			aide = true;
			occurence+=1;
			ajouterQuestion();
		} else {
			//Fin de la boucle, réinitialisations
			boucle=0;
			aide = false;

			if(numero<(questions.length-1)) {
				//Il reste des questions
				numero+=1;
				occurence+=1;
				ajouterQuestion();
			} else {
				etat = 'Fin';
				ajouterResume();
			}
		}
	}
	//Désactivation du champ de réponse et retrait du focus
	box_input_r.prop('disabled', true);
	box_input_r.blur();
	
	//Gestion DB
	var donnees = {
		questions_id: questions_id,
		questions_version_id: questions_version_id,
		numero: numero,
		occurence: occurence,
		boucle: boucle,
		aide: aide,
		compteur_correctes: compteur_correctes,
		compteur_incorrectes: compteur_incorrectes,
		score: score,
		temps: temps,
		etat: etat
	};
	if(reprise!==false) {
		donnees._id = DB_ID;
		donnees._rev = DB_revision;
	} else {
		donnees._id = DB_date+DB_murmur;

	}
	DB.put(donnees,function callback(error, result) {
		if (error) {
			console.log("Pb sauvegarde DB"+DB_revision);
			console.log(error);
		} else {
			DB_revision = result.rev;
			console.log("Sauvegarde DB ok"+DB_revision);
		}
	});
	console.log("Réponses correctes:"+compteur_correctes);
	console.log("Réponses incorrectes:"+compteur_incorrectes);
	console.log("Score:"+score);
}

window.onload = function(e) {
	console.log("Début lancement Pédagogue Silencieux");
	if (window.requestIdleCallback) {
		requestIdleCallback(function () {
			Fingerprint2.get(function (components) {
				var values = components.map(function (component) { return component.value });
				DB_murmur = Fingerprint2.x64hash128(values.join(''), 31);
				console.log(DB_murmur);
			})
		})
	} else {
		setTimeout(function () {
			Fingerprint2.get(function (components) {
				var values = components.map(function (component) { return component.value });
				DB_murmur = Fingerprint2.x64hash128(values.join(''), 31);
				console.log(DB_murmur);
			})  
		}, 500)
	}
	
	try {
		$("#titre").text(titre);
		document.title = titre;
	}
	catch(error) {
		console.error("Titre invalide");
		console.error(error);
	}
	try {
		$("#quizz").text(message);
	}
	catch(error) {
		console.error("Message invalide");
		console.error(error);
	}

	try {
		console.log("Nombre de questions chargées:"+questions.length);
		demarrrerQuestionnaire();
	}
	catch(error) {
		console.error("Questions non chargées");
		console.error(error);
	}
	
	console.log("Fin lancement Pédagogue silencieux");
}
