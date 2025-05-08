# 🛠️ Journal de bord

Ici vous allez pouvoir suivre mes intentions durant certaines étapes clés du projet

---

## Intention initiale

Dans un premier temps était de monter le projet avec la modélisation de la base. Habituellement je fais la modélisation de la base à la fin et travaille plutot avec des fake repository qui stocke la données en mémoire pour me concentrer sur les use cases. Ceci dit puisque l'exercice semble être plus axés sur la gestion des droits et la protection des routes, j'ai fait directement le repository avec typeorm (ceci dit le fake risque d'arriver quand je vais écrire les tests).

=> le but était de lever la problématique du boilerplate. Il n'y a donc aucun contrôle ni tests.

J'ai pris le parti d'utiliser useFactory plutôt que les annotations de nestJS au niveau de mon service et de mon repository car je voulais avoir un couplage minimum avec le framework (je peux garder mon service tel quel si je devais passer sur un autre framework).
