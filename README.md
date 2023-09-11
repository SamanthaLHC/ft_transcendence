# ft_transcendence



### branche front_login_button (sam) (avec récupération de la branche auth_back de Nathan):
* ~~page de log-in avec redirection vers la page d'authentification  (tres basique)~~
*  ~~objectif en cours : récuperer la query string code et la transmettre au back~~
*  rediriger vers la page de profil utilisateur (récupérer les datas de Nathan) 

## Pour voir notre avancée: docker compose up puis dans la barre de recherche, taper localhost:8000
__n'oubliez pas de mettre le .env (dispo sur le notion ! ) à la racine du dosser ft_transcendence (à côté du docker-compose.yml)__

________________________________________________________________________________________________________
________________________________________________________________________________________________________

# en cas de push accidentel de credentials voici la procédure d'urgence:
* 1): se positionner sur ta branche
* 2): git rebase -i origin/main [meme si tu n'as pas push sur le main, tu vas rebase à partir de ce point là]
* 3): ça va t'ouvrir un editeur. dans les commits il faut que tu choisisses celui ou ceux qui a introduit les credentials, au lieu de pick tu mets edit
* 4): tu sauves et quittes , le rebase va se dérouler jusqu `au commit pour lequel tu as mit edit
* 5): tu edites le / les fichiers avec les credentials pour les retirer
* 6): git add du fichier en question
* 7): git commit --amend --no-edit
* 8): git rebase --continue

> si il y a plusieurs commits les étapes 5 à 8 vont etre répétés pour chaque commit à éditer 

* 9): git push --force

* Si les autres ont récupéré la branche avec un checkout, les autres devront faire un git pull --rebase
