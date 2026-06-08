# ADR-0001 — Outils pour les tests fonctionnels API et E2E

## Status

Accepted — 2026-06-08

## Context

Le backend ne dispose que de tests **unitaires** sur les use cases (repositories mockés, cf. `specifications/07-technical-choices.md`). Aucun test ne vérifie qu'une route HTTP traverse réellement la stack (handler → use case → Prisma → MongoDB) et renvoie la forme de réponse attendue par `backend/openapi.yml`.

Le frontend ne dispose d'aucun test E2E malgré `playwright@1.58.2` déjà présent en dépendance.

Deux questions se posent :

1. Quel langage/outillage pour les tests fonctionnels API backend ?
2. Quel outillage pour les tests E2E frontend ?

Pour (1), deux options ont été envisagées :

- **TypeScript** (Vitest + supertest), dans le même langage et la même toolchain que le backend.
- **Go** (apprentissage), avec `net/http` + `testcontainers-go`, en boîte noire pure contre un conteneur de l'app.

Pour (2), Playwright est déjà installé ; la seule question est de savoir comment l'organiser (mode mocké MSW vs vrai backend), traitée dans l'ADR-0003.

## Decision

**Backend — TypeScript : Vitest + supertest.**

- Le contrat de l'API vit déjà dans `backend/openapi.yml`, et les schémas de validation (Zod) sont générés par `orval` côté frontend depuis ce même contrat. Rester en TypeScript permet de **réutiliser ces schémas** pour valider les réponses dans les tests, sans dupliquer les types dans un second langage.
- Vitest est déjà le test runner du backend (`pnpm test`) : un second runner JS (`vitest.functional.config.ts`, voir ADR-0002) ajoute une suite sans ajouter d'outil.
- supertest pilote l'app Express en mémoire (sans `listen()`), ce qui est rapide et ne nécessite pas de conteneuriser l'app elle-même pour les tests fonctionnels (seule la BDD l'est, cf. ADR-0002).
- Go aurait été un bon bac à sable d'apprentissage — les tests fonctionnels sont par nature des tests boîte noire HTTP, terrain neutre pour `net/http`/`testcontainers-go`. Mais le coût récurrent (deuxième toolchain, deuxième jeu de types à maintenir manuellement en miroir d'`openapi.yml`, exécution plus lente en CI faute d'image Node déjà chaude) dépasse le bénéfice pour une suite qui doit rester synchronisée avec le contrat à chaque évolution de domaine. L'apprentissage de Go reste pertinent, mais sur un projet où la boîte noire HTTP est la *seule* interface pertinente — pas ici, où le contrat TypeScript est central.

**Frontend — Playwright** (déjà en place comme dépendance, configuration à créer en Session 4/5, détails dans l'ADR-0003).

## Consequences

- Le backend gagne une seconde config Vitest (`vitest.functional.config.ts`) à côté de la config unitaire existante (`vitest.config.ts`) — voir ADR-0002 pour le détail du bootstrap.
- Les tests fonctionnels peuvent réutiliser directement les schémas Zod générés par `orval` (`frontend/web-application/src/sdk/generated/*.zod.ts`) ou s'appuyer sur la validation `openapi-backend` déjà active côté serveur — pas de nouveau système de validation à écrire.
- Toute évolution du contrat (`openapi.yml`) impacte les tests fonctionnels de la même manière que le SDK frontend : un seul cycle de propagation à connaître pour l'équipe.
- Pas de nouvelle compétence Go requise pour maintenir cette suite — accessible à quiconque connaît déjà la stack backend.