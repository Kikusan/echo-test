# 🛠️ Test Technique Backend – NestJS & Docker

Ce projet est un test technique backend réalisé avec **NestJS**.  
Il permet de gérer une liste d’utilisateurs avec un système d’authentification basé sur des rôles (`admin` / `user`) et des routes protégées.

---

## 🚀 Fonctionnalités

- Création, récupération et gestion d'utilisateurs
- Authentification JWT
- Système de rôles (`admin`, `user`)
- Routes sécurisées selon le rôle
- Configuration et exécution via **Docker Compose**

---

## 🧱 Stack technique

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/)

---

## ⚙️ Installation

### 1. Cloner le dépôt

Récupérer le projet via git clone ou en téléchargeant le zip

### 2. Installation des dépendances

```bash
cd echo-test
npm i
```

### 3. Lancer le projet

```bash
docker compose up 
```
ou docker-compose up selon la version de docker compose
le swagger sera accessible sur [http://localhost:4000/api](http://localhost:4000/api)

### 4. désinstaller le projet

```bash
docker compose down --volumes
```
ou docker-compose down --volumes selon la version de docker compose
Vous pouvez supprimer le dossier par la suite.

## Journal de bord

Vous pouvez voir l'évolution de ma réfléxion [ici](diary.md)

## Stratégie et réflexion sur les tests

Vous pouvez voir ma réfléxion sur les tests [ici](Test-todo.md)

## TODO

Les choses que je pourrais faire pour améliorer la code base[ici](TODO.md)