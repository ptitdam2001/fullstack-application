# Stratégie de test

## Objectif

Documenter la stratégie de test du projet — ce qui existe, ce qui doit être écrit, et dans quel ordre — pour servir de référence et de checklist aux sessions de mise en place des outils de vérification (cf. ADR-0001, ADR-0002, ADR-0003 dans `docs/adr/`).

Ce document est **dérivé** des sources de vérité existantes (`backend/openapi.yml`, `specifications/profiles/`) plutôt qu'inventé : la matrice de couverture API liste les 76 opérations du contrat OpenAPI, la matrice de flux E2E dérive des parcours décrits dans les specs profils.

---

## Pyramide de test

| Niveau                     | Outil              | Quoi est vérifié                                                                                                                     | Où                                             | Isolation                                                                 |
| -------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------- |
| **Unitaire**               | Vitest             | Logique métier des use cases (`backend/src/<domaine>/application/`), repositories mockés                                             | `backend/src/**/*.test.ts`                     | Aucune — dépendances mockées                                              |
| **Fonctionnel API**        | Vitest + supertest | Une requête HTTP traverse réellement la stack (handler → use case → Prisma → MongoDB) et renvoie la forme attendue par `openapi.yml` | `backend/tests/functional/<domaine>.test.ts`   | **Testcontainers** — conteneur Mongo replica dédié par run (cf. ADR-0002) |
| **E2E (mocked)**           | Playwright         | Parcours utilisateur dans un vrai navigateur : routing, guards, formulaires, état JWT — backend simulé par MSW                       | `frontend/web-application/e2e/<flux>.spec.ts`  | App buildée servie en preview, MSW actif                                  |
| **E2E (smoke full-stack)** | Playwright         | 1-2 parcours critiques bout-en-bout contre la vraie stack (frontend + backend + Mongo) — valide l'intégration réelle                 | `frontend/web-application/e2e/smoke/*.spec.ts` | `docker-compose.test.yml` (vraie stack, Mongo replica)                    |

### Storybook vs Playwright — complémentarité

Les deux ne se remplacent pas (cf. ADR-0003) :

|               | Storybook (play functions)                                               | Playwright                                                                                                       |
| ------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Granularité   | Composant isolé                                                          | Application assemblée                                                                                            |
| Couvre        | États visuels, interactions clavier/souris d'un composant, accessibilité | Routing, guards d'authentification, persistance JWT, navigation entre pages, intégration réelle frontend↔backend |
| Ne couvre pas | Navigation, auth, appels réseau réels                                    | Détail des micro-interactions d'un composant (trop coûteux à isoler dans un parcours complet)                    |

---

## Conventions de nommage et structure

### Backend — tests fonctionnels (`backend/tests/functional/`)

- **Par défaut, un fichier par domaine** : `<domaine>.test.ts` (ex. `team.test.ts`, `auth.test.ts`).
- **Seuil de split** : si le domaine dépasse ~10 opérations et/ou cumule des règles métier complexes (ex. `match` avec forfait + auto-génération, `championship`/`phase`/`group`/`standings`), découper par sous-ressource ou concern : `<domaine>.<sous-ressource>.test.ts` (ex. `team.crud.test.ts` + `team.roster.test.ts`, ou `match.crud.test.ts` + `match.forfeit.test.ts`). Chaque fichier garde son propre `describe` racine — la cohérence du domaine reste lisible malgré le split. `team.test.ts` (428 lignes pour 15 opérations) sert de repère du seuil au-delà duquel scinder.
- `describe('<domaine> domain — functional API', ...)` (ou `'<domaine>/<sous-ressource> — functional API'` si scindé), `it` décrit le scénario en langage métier (cas nominal, erreur, règle métier).
- Pour chaque route : cas nominal (statut + forme du body validée contre les schémas Zod générés ou `openapi.yml`), cas d'erreur (`404`/`401`/`403`/validation `400`), règles métier spécifiques au domaine.
- Helpers partagés dans `backend/tests/support/` : `database` (bootstrap/reset Testcontainers), `client` (agent supertest sur `createApp()`), `authenticate` (JWT de test), `fixtures` (factories d'entités).
- Pitfalls connus à respecter : IDs MongoDB valides mais inconnus (`unknownObjectId()`), `notDeleted` pour le soft-delete, `INIT_WAIT_SEC=10` pour le replica set sous émulation amd64-on-arm64.

### Frontend — E2E (`frontend/web-application/e2e/`)

- Un fichier par flux : `<flux>.spec.ts` (ex. `auth.spec.ts`, `team-creation.spec.ts`).
- Page objects sous `e2e/pages/`.
- Projet `setup` : login une fois, `storageState` sauvegardé (JWT en **localStorage**, pas cookie) et réutilisé par les specs authentifiées.
- Pitfalls connus : `userEvent.hover()` proscrit côté design-system (jsdom) mais Playwright pilote un vrai navigateur — pas de restriction ; attendre les requêtes réseau plutôt que des délais fixes.

---

## Commandes

| Commande                                                        | Cible Makefile                                       | Action                                                                             |
| --------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm --filter openapi-express-ts test`                         | `make test-backend-unit`                             | Tests unitaires backend (Vitest, repositories mockés)                              |
| `pnpm --filter openapi-express-ts test:functional`              | `make test-backend-func`                             | Tests fonctionnels backend (Vitest + supertest + Mongo replica via Testcontainers) |
| —                                                               | `make db-test-up` / `make db-test-down`              | Démarre/arrête un Mongo replica de test isolé (debug local hors Testcontainers)    |
| `pnpm --filter application-material test`                       | —                                                    | Tests unitaires frontend (Vitest, jsdom)                                           |
| `pnpm --filter application-material test:e2e` _(à créer en S4)_ | `make test-e2e`                                      | Playwright, projet `mocked` (MSW + `vite preview`)                                 |
| _(à créer en S5)_                                               | `make test-e2e-smoke`                                | `docker-compose.test.yml up` → Playwright projet `fullstack-smoke` → `down`        |
| _(à créer en S5)_                                               | `make test`                                          | Suite complète : backend (unit + func) + E2E mocké                                 |
| —                                                               | `make stack-test-up` / `make stack-test-down` _(S5)_ | Up/down de la stack complète de test (front + API + Mongo)                         |

---

## Matrice de couverture API

Dérivée des **76 opérations** (58 paths) de `backend/openapi.yml`. Sert de checklist pour la Session 3 (un fichier de test fonctionnel par domaine, cf. convention de nommage et seuil de split ci-dessus).

Légende : ✅ couvert · ❌ test fonctionnel à écrire (S3) · 🚫 route définie dans le contrat mais **sans handler enregistré** côté backend (répond `404` avec `{ status: 501, err: 'No handler registered for operation' }` — cf. `notImplemented` dans `backend/createApp.ts`)

#### Auth (3 opérations)

| Méthode | Path      | operationId | Statut           |
| ------- | --------- | ----------- | ---------------- |
| GET     | `/me`     | `me`        | ❌ à écrire (S3) |
| POST    | `/login`  | `login`     | ❌ à écrire (S3) |
| POST    | `/logout` | `logout`    | ❌ à écrire (S3) |

#### Registration (8 opérations)

| Méthode | Path                       | operationId         | Statut           |
| ------- | -------------------------- | ------------------- | ---------------- |
| POST    | `/register`                | `register`          | ❌ à écrire (S3) |
| POST    | `/forgot-password`         | `forgotPassword`    | ❌ à écrire (S3) |
| POST    | `/activate`                | `activateAccount`   | ❌ à écrire (S3) |
| POST    | `/resend-activation`       | `resendActivation`  | ❌ à écrire (S3) |
| POST    | `/reset-password`          | `resetPassword`     | ❌ à écrire (S3) |
| PATCH   | `/users/{userId}/activate` | `adminActivateUser` | ❌ à écrire (S3) |
| PATCH   | `/users/{userId}/unblock`  | `adminUnblockUser`  | ❌ à écrire (S3) |
| POST    | `/me/referee`              | `declareReferee`    | ❌ à écrire (S3) |

#### User (5 opérations)

| Méthode | Path          | operationId  | Statut                     |
| ------- | ------------- | ------------ | --------------------------- |
| GET     | `/users`      | `getUsers`   | ✅ couvert (`user.test.ts`)  |
| POST    | `/user`       | `createUser` | ✅ couvert (`user.test.ts`)  |
| DELETE  | `/user/{id}`  | `removeUser` | ✅ couvert (`user.test.ts`)  |
| PATCH   | `/user/{id}`  | `updateUser` | ✅ couvert (`user.test.ts`)  |
| GET     | `/users/{id}` | `getUser`    | ✅ couvert (`user.test.ts`)  |

#### Team (12 opérations) — pilote S1

| Méthode | Path                             | operationId           | Statut                      |
| ------- | -------------------------------- | --------------------- | --------------------------- |
| POST    | `/user/{userId}/player`          | `createPlayer`        | ❌ à écrire (S3)            |
| GET     | `/teams`                         | `getTeams`            | ✅ couvert (`team.test.ts`) |
| GET     | `/teams/count`                   | `countTeams`          | ✅ couvert (`team.test.ts`) |
| POST    | `/team`                          | `createTeam`          | ✅ couvert (`team.test.ts`) |
| DELETE  | `/team/{id}`                     | `removeTeam`          | ✅ couvert (`team.test.ts`) |
| GET     | `/team/{id}`                     | `getTeam`             | ✅ couvert (`team.test.ts`) |
| PATCH   | `/team/{id}`                     | `updateTeam`          | ✅ couvert (`team.test.ts`) |
| GET     | `/team/{teamId}/players`         | `getTeamPlayers`      | ✅ couvert (`team.test.ts`) |
| GET     | `/team/{teamId}/calendar`        | `getTeamCalendar`     | ✅ couvert (`team.test.ts`) |
| POST    | `/team/{teamId}/player/{userId}` | `putUserToTeam`       | ✅ couvert (`team.test.ts`) |
| POST    | `/teams/with-coach`              | `createTeamWithCoach` | ✅ couvert (`team.test.ts`) |
| GET     | `/teams/{teamId}/current-group`  | `getTeamCurrentGroup` | ✅ couvert (`team.test.ts`) |

#### UserTeam (5 opérations)

| Méthode | Path                            | operationId      | Statut                      |
| ------- | ------------------------------- | ---------------- | --------------------------- |
| GET     | `/me/teams`                     | `getMyTeams`     | ❌ à écrire (S3)            |
| GET     | `/team/{teamId}/coaches`        | `getTeamCoaches` | ✅ couvert (`team.test.ts`) |
| POST    | `/team/{teamId}/coach/{userId}` | `assignCoach`    | ✅ couvert (`team.test.ts`) |
| DELETE  | `/team/{teamId}/coach/{userId}` | `removeCoach`    | ✅ couvert (`team.test.ts`) |
| GET     | `/user/{userId}/coach-teams`    | `getCoachTeams`  | ✅ couvert (`team.test.ts`) |

#### UserMatch (4 opérations)

| Méthode | Path                                | operationId        | Statut           |
| ------- | ----------------------------------- | ------------------ | ---------------- |
| GET     | `/match/{matchId}/referees`         | `getMatchReferees` | ❌ à écrire (S3) |
| POST    | `/match/{matchId}/referee/{userId}` | `assignReferee`    | ❌ à écrire (S3) |
| DELETE  | `/match/{matchId}/referee/{userId}` | `removeReferee`    | ❌ à écrire (S3) |
| GET     | `/user/{userId}/referee-matches`    | `getUserMatches`   | ❌ à écrire (S3) |

#### Championship (6 opérations)

| Méthode | Path                   | operationId          | Statut                              |
| ------- | ---------------------- | -------------------- | ----------------------------------- |
| GET     | `/championships`       | `getChampionships`   | ✅ couvert (`championship.test.ts`) |
| GET     | `/championships/count` | `countChampionships` | ✅ couvert (`championship.test.ts`) |
| POST    | `/championship`        | `createChampionship` | ✅ couvert (`championship.test.ts`) |
| GET     | `/championship/{id}`   | `getChampionship`    | ✅ couvert (`championship.test.ts`) |
| PATCH   | `/championship/{id}`   | `updateChampionship` | ✅ couvert (`championship.test.ts`) |
| DELETE  | `/championship/{id}`   | `removeChampionship` | ✅ couvert (`championship.test.ts`) |

#### Phase (5 opérations)

| Méthode | Path                                    | operationId             | Statut                       |
| ------- | --------------------------------------- | ----------------------- | ----------------------------- |
| GET     | `/championship/{championshipId}/phases` | `getChampionshipPhases` | ✅ couvert (`phase.test.ts`) |
| POST    | `/phase`                                | `createPhase`           | ✅ couvert (`phase.test.ts`) |
| GET     | `/phase/{id}`                           | `getPhase`              | ✅ couvert (`phase.test.ts`) |
| PATCH   | `/phase/{id}`                           | `updatePhase`           | ✅ couvert (`phase.test.ts`) |
| DELETE  | `/phase/{id}`                           | `removePhase`           | ✅ couvert (`phase.test.ts`) |

#### Group (5 opérations)

| Méthode | Path                      | operationId      | Statut                    |
| ------- | ------------------------- | ---------------- | --------------------------- |
| GET     | `/phase/{phaseId}/groups` | `getPhaseGroups` | ✅ couvert (`group.test.ts`) |
| POST    | `/group`                  | `createGroup`    | ✅ couvert (`group.test.ts`) |
| GET     | `/group/{id}`             | `getGroup`       | ✅ couvert (`group.test.ts`) |
| PATCH   | `/group/{id}`             | `updateGroup`    | ✅ couvert (`group.test.ts`) |
| DELETE  | `/group/{id}`             | `removeGroup`    | ✅ couvert (`group.test.ts`) |

#### Standings (1 opération)

| Méthode | Path                         | operationId         | Statut                                                                                                                 |
| ------- | ---------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| GET     | `/group/{groupId}/standings` | `getGroupStandings` | ✅ couvert (`standings.test.ts`)                                                                                        |

#### Match (6 opérations)

| Méthode | Path             | operationId    | Statut                                                                              |
| ------- | ---------------- | -------------- | ----------------------------------------------------------------------------------- |
| GET     | `/matches`       | `getMatches`   | ❌ à écrire (S3)                                                                    |
| GET     | `/matches/count` | `countMatches` | ❌ à écrire (S3)                                                                    |
| POST    | `/match`         | `addMatch`     | ❌ à écrire (S3)                                                                    |
| GET     | `/match/{id}`    | `getMatch`     | ❌ à écrire (S3)                                                                    |
| PATCH   | `/match/{id}`    | `editMatch`    | ❌ à écrire (S3) — inclut forfait et auto-génération (`specifications/03-match.md`) |
| DELETE  | `/match/{id}`    | `removeMatch`  | ❌ à écrire (S3)                                                                    |

#### TeamJoinRequest (3 opérations)

| Méthode | Path                                        | operationId             | Statut           |
| ------- | ------------------------------------------- | ----------------------- | ---------------- |
| POST    | `/teams/{teamId}/join-requests`             | `createTeamJoinRequest` | ❌ à écrire (S3) |
| GET     | `/teams/{teamId}/join-requests`             | `getTeamJoinRequests`   | ❌ à écrire (S3) |
| PATCH   | `/teams/{teamId}/join-requests/{requestId}` | `updateTeamJoinRequest` | ❌ à écrire (S3) |

#### Area (6 opérations) — ⚠️ non implémenté

| Méthode | Path           | operationId     | Statut            |
| ------- | -------------- | --------------- | ----------------- |
| GET     | `/areas`       | `getAreaList`   | 🚫 handler absent |
| POST    | `/areas`       | `createArea`    | 🚫 handler absent |
| GET     | `/areas/count` | `countAllAreas` | 🚫 handler absent |
| GET     | `/areas/{id}`  | `getArea`       | 🚫 handler absent |
| DELETE  | `/areas/{id}`  | `deleteArea`    | 🚫 handler absent |
| PATCH   | `/areas/{id}`  | `updateArea`    | 🚫 handler absent |

#### Games (7 opérations) — ⚠️ non implémenté, legacy

| Méthode | Path                    | operationId       | Statut            |
| ------- | ----------------------- | ----------------- | ----------------- |
| GET     | `/games/{year}/{month}` | `getGamesByMonth` | 🚫 handler absent |
| GET     | `/games`                | `getGames`        | 🚫 handler absent |
| GET     | `/games/count`          | `countAllGames`   | 🚫 handler absent |
| GET     | `/team/{teamId}/games`  | `getTeamGames`    | 🚫 handler absent |
| POST    | `/game`                 | `createMatch`     | 🚫 handler absent |
| PATCH   | `/game/{id}`            | `updateMatch`     | 🚫 handler absent |
| DELETE  | `/game/{id}`            | `removeGame`      | 🚫 handler absent |

> **Constat** : les 13 opérations des tags `Area` et `Games` sont définies dans `openapi.yml` mais **aucun handler n'est enregistré** dans `backend/createApp.ts` (ni dans `src/`, ni en legacy) — elles tombent dans `notImplemented` et répondent `404` / `{ status: 501, ... }`. Probablement des routes legacy jamais migrées (doublons fonctionnels de `Match`/`Team` modernes). Avant d'écrire des tests fonctionnels dessus en S3, statuer : implémenter, ou retirer du contrat (`openapi.yml`).

**Bilan S1** : 16 / 76 opérations couvertes (`team` + `userTeam` partiel) · 13 / 76 sans handler · 47 / 76 restent à couvrir en S3.

---

## Matrice de flux E2E

Dérivée des parcours décrits dans `specifications/profiles/{admin,coach,arbitre,joueur}/`. Sert de backlog pour les Sessions 4 (mocked) et 5 (smoke full-stack).

Légende — Type prévu : **mocked** (Playwright + MSW, Session 4) · **smoke** (vraie stack, Session 5, réservé aux 1-2 parcours les plus critiques).

| Parcours                                                                | Profil(s) concerné(s)            | Pages / routes                                                                 | Type prévu         | Statut                                                                      |
| ----------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------- |
| Connexion + redirection post-login                                      | Tous                             | `/login` → `/dashboard`, guard `CheckAuthentication`                           | mocked             | ❌ à écrire (S4)                                                            |
| Inscription + activation de compte                                      | Visiteur → Joueur/Coach          | `/register` → email → `/activate`                                              | mocked             | ❌ à écrire (S4)                                                            |
| Mot de passe oublié / réinitialisation                                  | Tous                             | `/forgot-password` → `/reset-password`                                         | mocked             | ❌ à écrire (S4)                                                            |
| Tableau de bord (contenu par profil)                                    | Admin / Coach / Arbitre / Joueur | `/dashboard` (KPI admin, agenda coach, mes matchs arbitre, mes équipes joueur) | mocked             | ❌ à écrire (S4)                                                            |
| Liste + détail championnats                                             | Tous (lecture)                   | `/championships`, `/championships/{id}`                                        | mocked             | ❌ à écrire (S4)                                                            |
| Création / modification / suppression championnat                       | Admin (exclusif)                 | `/championships` → formulaire création/édition                                 | mocked             | ❌ à écrire                                                                 |
| Liste + détail équipes                                                  | Tous (lecture)                   | `/teams`, `/teams/{id}`                                                        | mocked             | ❌ à écrire (S4)                                                            |
| Création d'équipe (auto-affectation coach)                              | Tout utilisateur authentifié     | `/teams` → formulaire création → `UserTeam(COACH)` créé                        | **smoke** + mocked | ❌ à écrire — flux critique S4 (premiers flux) puis S5 (persistance réelle) |
| Gestion des joueurs d'une équipe (ajout/retrait, édition infos)         | Coach (sa propre équipe), Admin  | `/teams/{id}` → joueurs, formulaire édition                                    | mocked             | ❌ à écrire                                                                 |
| Demande pour rejoindre une équipe                                       | Joueur / Coach                   | `/teams/{teamId}/join-requests`                                                | mocked             | ❌ à écrire                                                                 |
| Liste + détail matchs                                                   | Tous (lecture)                   | `/matches`, `/matches/{id}`                                                    | mocked             | ❌ à écrire (S4)                                                            |
| Saisie / validation de score                                            | Arbitre (ses matchs assignés)    | `/my-matches/{id}` → formulaire score                                          | mocked             | ❌ à écrire                                                                 |
| Déclaration de forfait (avant match)                                    | Coach (son équipe) / Admin       | `/matches/{id}` → formulaire forfait                                           | mocked             | ❌ à écrire                                                                 |
| Déclaration de forfait (pendant match)                                  | Arbitre (match `IN_PROGRESS`)    | `/my-matches/{id}` → formulaire forfait                                        | mocked             | ❌ à écrire                                                                 |
| Mes matchs (vue arbitre)                                                | Arbitre (exclusif)               | `/my-matches`                                                                  | mocked             | ❌ à écrire                                                                 |
| Consultation des classements                                            | Tous (lecture)                   | `/championships/{id}` → classements de groupe                                  | mocked             | ❌ à écrire                                                                 |
| Gestion des utilisateurs (CRUD, activation, déblocage, promotion admin) | Admin (exclusif)                 | `/users`, `/users/{id}` → formulaires                                          | mocked             | ❌ à écrire                                                                 |
| Assignation coach / arbitre                                             | Admin (exclusif)                 | `/teams/{id}` (coach), `/matches/{id}` (arbitre)                               | mocked             | ❌ à écrire                                                                 |
| Consultation / édition du profil                                        | Tous                             | `/profile`                                                                     | mocked             | ❌ à écrire                                                                 |

**Bilan S1** : 0 / 19 parcours couverts — backlog complet pour S4/S5. Les flux marqués **smoke** sont les candidats du parcours bout-en-bout « création équipe → persistance Mongo → réaffichage » mentionné en S5 (vérifiable via Mongo Express `:8083`).
