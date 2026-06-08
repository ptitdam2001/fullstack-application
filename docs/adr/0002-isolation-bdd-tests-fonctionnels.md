# ADR-0002 — Isolation de la base de données pour les tests fonctionnels backend

## Status

Accepted — 2026-06-08

## Context

Les tests fonctionnels backend (ADR-0001) doivent vérifier que chaque route produit le bon effet de bord en base : création réelle de documents, contraintes de soft-delete (`notDeleted`, cf. pitfall #12 du `CLAUDE.md`), et **transactions Prisma** (ex. `PrismaTeamRepository.createWithCoach`, `backend/src/team/infrastructure/PrismaTeamRepository.ts`).

Contrainte technique majeure : **Prisma + MongoDB exige un replica set pour exécuter des transactions** (`prisma.$transaction()`). Le `docker-compose.yml` du projet utilise déjà l'image `prismagraphql/mongo-single-replica:4.4.3-bionic` pour cette raison en développement.

Trois options d'isolation ont été comparées :

| Option | Replica set | Dépendance | Portabilité moteur |
|---|---|---|---|
| **Testcontainers** | ✅ (image réelle) | Docker actif pendant les tests | Changer de moteur = changer l'image dans 1 helper |
| **mongodb-memory-server** | ✅ (mode `replSet`) | Aucune (binaire téléchargé) | Package Mongo-only, verrouillé |
| **docker-compose.test.yml** | ✅ (même image) | Docker + reset manuel | Override compose à dupliquer par moteur |

## Decision

**Testcontainers**, avec l'image `prismagraphql/mongo-single-replica:4.4.3-bionic` — **la même que celle déjà utilisée en développement** (`docker-compose.yml`).

Principe directeur : **les tests fonctionnels restent agnostiques du moteur de BDD**. Ils s'ancrent sur les requêtes/réponses HTTP définies par `openapi.yml` (ADR-0001), jamais sur le moteur sous-jacent. Seul le **bootstrap** — démarrer/réinitialiser/arrêter la base avant et entre les tests — connaît le moteur. Ce bootstrap est isolé dans **un unique fichier** : `backend/tests/support/database.ts`.

Conséquence directe de cette isolation : si le projet change un jour de moteur (ex. migration vers PostgreSQL), **un seul fichier change** — l'image passée à testcontainers et la commande de migration (`prisma db push`) — alors que `mongodb-memory-server` aurait nécessité de jeter tout le package et réécrire le bootstrap avec un outil différent (le binaire embarqué est spécifique à MongoDB).

Pourquoi pas les autres options :

- **mongodb-memory-server** : démarrage plus rapide et zéro dépendance Docker (atout réel pour l'itération locale), mais verrouille définitivement le bootstrap à MongoDB et introduit un risque de dérive de version par rapport à l'image `4.4.3-bionic` utilisée en dev/prod — deux « vérités » sur la version du moteur.
- **docker-compose.test.yml** : viable et réutilise la même image, mais le reset entre suites de tests est plus grossier (redémarrage de service ou `down && up`) qu'un `deleteMany` ciblé, et l'isolation entre fichiers de test est moins fine qu'avec testcontainers piloté depuis Vitest.

> Note : un `docker-compose.test.yml` reste prévu (Session 5) — mais pour un usage différent : faire tourner la **stack complète** (front + API + Mongo) pour les tests E2E *smoke full-stack*, pas pour isoler la BDD des tests fonctionnels backend.

## Consequences

- Mise en place d'un `globalSetup`/`globalTeardown` Vitest dédié (`backend/vitest.functional.config.ts`) : démarre le conteneur, expose `DATABASE_URL` **avant** l'import du singleton `backend/utils/prismaClient.ts`, exécute `prisma db push`, puis arrête le conteneur en fin de suite.
- Un helper `resetDatabase()` (`deleteMany` sur toutes les collections) permet un reset rapide entre fichiers de test sans redémarrer le conteneur.
- **Docker doit être actif** pour lancer `pnpm test:functional` / `make test-backend-func` — à documenter dans `specifications/16-strategie-de-test.md` (Session 2) et le `README`/`CLAUDE.md` backend.
- Les tests s'exécutent en `singleThread` (un seul conteneur partagé) pour éviter de multiplier les instances MongoDB — accepté comme compromis vitesse/simplicité, réévaluable si la suite grossit significativement.
- Le choix de l'image (`4.4.3-bionic`) doit rester synchronisé avec celle du `docker-compose.yml` de développement — un changement de version dans l'un doit se refléter dans l'autre.