# 🛠️ Journal de bord

Ici vous allez pouvoir suivre mes intentions durant certaines étapes clés du projet

---

## Intention initiale

Dans un premier temps était de monter le projet avec la modélisation de la base. Habituellement je fais la modélisation de la base à la fin et travaille plutot avec des fake repository qui stocke la données en mémoire pour me concentrer sur les use cases. Ceci dit puisque l'exercice semble être plus axés sur la gestion des droits et la protection des routes, j'ai fait directement le repository avec typeorm (ceci dit le fake risque d'arriver quand je vais écrire les tests).

=> le but était de lever la problématique du boilerplate. Il n'y a donc aucun contrôle ni tests.

Pour la base de données, mon champ adresse est une simple chaine de caractères. En effet pour pouvoir faire une recherche pertinante dessus, il aurait fallut avoir un objet avec adresse, ville voire pays. Sachant que la ville et le pays proviennent d'une source également. Dans un cas réel, il y a de fortes chances qu'un service tierce existe dans l'organisation ou qu'on utilise un service disponible (comme celui du gouvernement par exemple). J'ai donc pris le partie de laisser une chaîne de caractères libre car d'une part c'est facultatif mais d'autre part, aucun use case ne m'obligeait à avoir quelque chose de plus solide.

J'ai pris le parti d'utiliser useFactory plutôt que les annotations de nestJS au niveau de mon service et de mon repository car je voulais avoir un couplage minimum avec le framework (je peux garder mon service tel quel si je devais passer sur un autre framework).
Ce qui est surement overkill pour l'exercice mais je me suis dit que puisque je le fais autant essayer de le faire le plus propre possible à mon sens.
Dans la vraie vie, mon style de code s'adaptera aux conventions de l'équipe et à leur contraintes.

Pour des raisons pratiques, j'ai injecté via les migrations les rôles user et admin en base avec des id fixe et facile à reconnaître.
Bien entendu dans la réalité, il y a une route pour créer et récupérer les rôles et à la création un formulaire renvoie correctement l'objet rôle avec son id.

## Deuxième temps

j'ai voulu dans un second temps sécurisé mon domaine avant de faire la partie authentification.
Le but étant de couvrir les règles métiers sur le plan fonctionnel mais également des tests.
Je n'ai pas testé la partie repository car pour que le test soit pertinent, il faut monter une base et réinitialiser les données.
Par conséquent, les tests du service consistait à savoir si les appels vers le repository était conforme à ce qu'on attendait mais visait surtout à valider le comportement en cas d'erreur.

Pour le moment, un user est mis arbitrairement en paramètre mais par la suite ce user sera récupérer grâce au token.

Ce qui devrait me permettre de me concentrer par la suite sur l'authentification sans avoir la nécessité de revenir dans la couche service ou repository.

## Troisième temps

Mise en place de l'authentification, étant donné que je m'appuie fortement sur nestJS, ce module utilise le système d'annotations.
Le but était dans un premier temps de permettre l'authentification et la récupération des rôles afin de gérer les droits.
Ce faisant, je me suis aperçu d'un leger problème: les rôles devrait avoir un attribut action qui serait un tableau de droit possible (tel que la lecture de la liste des utilisateurs, la suppression ou la modification meme si ce dernier tout le monde à le droit à partir du moment où un en identifié)

cet étape me permet de supprimer le user mis aribitrairement à l'étape précédente.
