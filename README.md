# PedagogueSilencieux
Outil pédagogique permettant de poser des questions de manière dynamique. Chaque élève répondant au questionnaire a des questions différentes de son voisin. 
La démarche s'effectue par essais et erreurs. La correction est donnée pour une question si le drapeau "correction" sur la question est positionné à "true".
Une aide pour chaque question est affichée si le premier essai est infructueux.

Les questions sont lues d'un fichier JSON passé en paramètre. S'il n'y a pas de fichier passé en paramètre, le fichier par défaut est "questions.json". Le fichier "questions.json" de base permet d'utiliser une série de questions pour une initiation à Python. 
Il suffit de fournir un autre fichier questions.json pour changer de domaine de questions ou de passer un fichier JSON en paramètre.

Test de l'outil disponible sur le site http://hedererjs.free.fr
