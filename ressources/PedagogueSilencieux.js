"use strict";
//Variables globales de gestion du quizz
var numero = 0;
var occurence = 0;
var compteur_correctes = 0;
var compteur_incorrectes = 0;
var boucle=0;
var aide = false;
var result=false;
var script=false;
var lib_q="";
//var time = new TimelineLite({paused:true});

//Fonctions du quizz
function ajouterQuestion(){
	//Gestion d'un script de question/réponse et d'une éventuelle erreur sur le script d'une question
	result = false;
	script=false;
	lib_q = "";
	while(questions[numero]['script']!="") {
		try {
			eval(questions[numero]['script']);
			script=true;
			break;
		}
		catch(error) {
			if(numero<questions.length)
				numero+=1;
			else
				break;
			console.error(error);
			console.error(error);
		}
	}
	//Ajout des champs de gestion question
	var conteneur = $('<div/>', {class: "conteneur", id : "conteneur_"+occurence});
	var box_q = $('<div/>', {class: "question", id : "question_"+occurence});
	var box_lib_q = $('<div/>', {class: "lib_q", id : "lib_q_"+occurence, html:questions[numero]['lib_q']+lib_q});
	box_q.append(box_lib_q);
	if(questions[numero]['boucle']<=1 && questions[numero]['aide']!="") 
		aide = true;
	if(aide) {
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
}

function demarrrerQuestionnaire() {
	ajouterQuestion();
}

function verifier(value) {
	$("#conteneur_"+occurence).removeClass("actif");
	var box_r_interface = $("#r_interface_"+occurence);
	var box_input_r = $("#input_"+occurence);
	box_input_r.addClass("gris");
	
	//Gestion des attendus: fixe ou déterminé par le script
	var attendu="";
	if(questions[numero]['r']!==false)
		attendu=questions[numero]['r']
	else
		attendu=result;
	
	if(value==attendu) {
		compteur_correctes+=1;
		box_input_r.addClass("sourire");
		var sourire = $('<span/>', {class: "sourire", text:":)"});
		box_r_interface.append(sourire);
		aide = false;
		if(numero<(questions.length-1)) {
			numero+=1;
			occurence+=1;
			ajouterQuestion();
		} else {
			var resume = $('<div/>', {class: "resume"});
			var correctes = $('<div/>', {class: "correctes", text:"Réponses correctes:"+compteur_correctes});
			var incorrectes = $('<div/>', {class: "incorrectes", text:"Réponses incorrectes:"+compteur_incorrectes});
			resume.append(correctes);
			resume.append(incorrectes);
			$("#quizz").append(resume);
		}
	} else {
		compteur_incorrectes+=1;
		box_input_r.addClass("tristesse");
		if(questions[numero]['correction']===true) {
			var correction = $('<span/>', {class: "correction", text:"=>"+attendu});
			box_r_interface.append(correction);
		}
		var tristesse = $('<span/>', {class: "tristesse", text:":("});
		box_r_interface.append(tristesse);
		occurence+=1;
		//Boucle sur la question
		boucle+=1;
		if(questions[numero]['boucle']>boucle && questions[numero]['aide'] != "") {
			if(boucle>=1)
				aide = true;
		} else {
			//Fin de la boucle
			boucle=0;
			aide = false;
			numero+=1;
		}
		ajouterQuestion();
	}
	box_input_r.prop('disabled', true);
	box_input_r.blur();
	console.log("Réponses correctes:"+compteur_correctes);
	console.log("Réponses incorrectes:"+compteur_incorrectes);
}

window.onload = function(e) {
	console.log("Window onload start");
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
	console.log("Window onload stop");
}
