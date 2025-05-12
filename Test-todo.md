# Test-todo

Ici vous allez pouvoir suivre mes intentions pour les tests.

---

## Minimum

Le strict minimum est le test de mes services qui sont le coeur de l'application.
Ce sont des tests unitaires completement indépendants du framework.
Le but que j'essaie de poursuirvre est que je puisse lancer mes tests dans n'importe quel ordre quand je veux et observer le meme comportement.

## Test de contrat d'api

En faisait des tests avec supertest, je m'assure que les codes sont attendus sont bien les bons.
De la même manière, ce sont des tests totalement indépendants.

## Choses à ajouter

Théoriquement avec ces 2 parties, on a une base solide de tests. Toutefois, il manque les tests du repository et end to end.
Mais pour cela, il faudrait monter une base de tests et remettre la base de données à un état initial puis lui ajouter des fixtures pour chaque test.
Le coût est très élevé pour un gain finalement assez faible. 