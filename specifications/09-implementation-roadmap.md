# Feuille de route d'implémentation

## Vue d'ensemble

| Phase | Objectif                  | Livrable                                      |
| ----- | ------------------------- | --------------------------------------------- |
| 1     | Initialisation du projet  | Monorepo fonctionnel, CI de base              |
| 2     | Authentification et rôles | Login, JWT, guards par rôle                   |
| 3     | Backend hexagonal         | API complète en architecture Ports & Adapters |
| 4     | Frontend                  | Design system + application SPA               |

Chaque phase livre un système fonctionnel et testable. Les phases 3 et 4 peuvent démarrer en parallèle une fois la phase 2 terminée.

---

## Phase 1 — Initialisation du projet

### Objectif

Mettre en place la structure du monorepo, les outils de qualité et l'infrastructure de développement local.

### Tâches

**Monorepo**

- [ ] Créer `pnpm-workspace.yaml` à la racine incluant `backend`, `frontend/design-system`, `frontend/web-application`, `tooling/*`
- [ ] Configurer TypeScript strict (shared `tsconfig.base.json`)
- [ ] Créer `tooling/eslint-config` (`@repo/eslint-config`) avec variantes `base`, `node`, `react`
- [ ] Créer `tooling/prettier-config` (`@repo/prettier-config`)
- [ ] Appliquer les configs à `backend/`, `frontend/design-system/`, `frontend/web-application/`

**Infrastructure**

- [ ] `docker-compose.yml` : MongoDB + Mongo Express + backend + frontend
- [ ] `.env.sample` documentant toutes les variables nécessaires
- [ ] Script `pnpm dev` à la racine lançant backend + frontend en parallèle

**Qualité**

- [ ] Commitlint + husky (déjà en place, vérifier)
- [ ] Script CI : `check:types` + `lint` sur tous les packages

### Critères de validation

- `pnpm install` depuis la racine résout tous les packages workspace
- `pnpm lint` passe sans erreur sur les trois packages
- `docker compose up` démarre MongoDB, le backend et le frontend

---

## Phase 2 — Authentification et rôles

### Objectif

Mettre en place le système d'authentification JWT et les guards de rôles. Prérequis pour toutes les features protégées.

### Tâches

**Backend**

- [ ] Modèle Prisma `User` avec champ `role: Role` (`ADMIN | COACH | REFEREE | PLAYER`)
- [ ] Domaine `auth` (hexagonal) :
  - `domain/User.ts` : types purs
  - `ports/IAuthService.ts` : interface JWT + bcrypt
  - `ports/IUserRepository.ts` : interface CRUD
  - `application/AuthUseCases.ts` : login, logout, me
  - `infrastructure/JwtAuthService.ts` : implémentation JWT + bcrypt
  - `infrastructure/PrismaUserRepository.ts`
  - `infrastructure/AuthHttpHandlers.ts`
- [ ] Endpoints : `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- [ ] Middleware `requireAuth(roles: Role[])` appliqué sur toutes les routes protégées
- [ ] OpenAPI spec : documenter les schémas `LoginRequest`, `AuthResponse`, `UserProfile`

**Frontend**

- [ ] Régénérer le SDK orval après mise à jour `openapi.yml`
- [ ] Flux login : formulaire → mutation → stockage JWT → redirect
- [ ] Guard de route `<RequireAuth>` vérifiant le JWT en localStorage
- [ ] Intercepteur axios 401 → redirect vers login (déjà en place, vérifier)
- [ ] `useCurrentUser()` : hook application exposant le profil utilisateur connecté

### Critères de validation

- `POST /auth/login` retourne un JWT valide
- Une route protégée sans token retourne `401`
- Une route protégée avec un rôle insuffisant retourne `403`
- Le frontend redirige vers `/login` si le token est absent ou expiré
- `GET /auth/me` retourne le profil de l'utilisateur connecté

---

## Phase 3 — Backend hexagonal

### Objectif

Migrer (ou écrire de zéro) chaque domaine métier en architecture Ports & Adapters. Chaque domaine est indépendant et activé par un unique changement d'import dans `index.ts`.

### Ordre de migration

Pour chaque domaine, appliquer les étapes suivantes :

1. **Domain** : types purs + erreurs (sans Prisma)
2. **Ports** : interfaces repository (et service si besoin)
3. **Application** : use cases injectés via interfaces
4. **Infrastructure** : `PrismaXxxRepository` + `XxxHttpHandlers`
5. **Activation** : changer l'import dans `index.ts`
6. **Vérification** : `pnpm check:type` + test manuel des endpoints

| Domaine         | Endpoints principaux               | Dépendances            |
| --------------- | ---------------------------------- | ---------------------- |
| `teams`         | CRUD + joueurs + calendrier        | —                      |
| `player`        | CRUD joueur                        | teams                  |
| `users`         | CRUD utilisateur + assignations    | auth                   |
| `matches`       | CRUD + score + assignation arbitre | teams, users           |
| `championships` | CRUD + phases + qualifications     | teams, matches         |
| `standings`     | Lecture + recalcul                 | matches, championships |

### Critères de validation par domaine

- `pnpm check:type` : zéro erreur TypeScript
- Tous les endpoints du domaine répondent correctement (200/201/204/404)
- Les guards de rôle sont effectifs sur les routes sensibles

---

## Phase 4 — Frontend

### Sous-phase 4a — Design System

**Objectif** : Constituer la bibliothèque de composants de base avant de construire l'application.

- [ ] Tokens Tailwind (couleurs, typographie, espacement) dans `frontend/design-system/src/styles/`
- [ ] Composants de base (si non existants) : Button, Input, Label, Form, Card, Badge, Pagination, Dialog, Toast
- [ ] Chaque composant a une story Storybook + un test Vitest/RTL
- [ ] `pnpm --filter @repo/design-system build` produit `dist/` sans erreur

### Sous-phase 4b — Application

**Objectif** : Construire la SPA par feature module en architecture hexagonale frontend.

**Initialisation**

- [ ] Routing React Router v7 avec layouts
- [ ] Auth guard `<RequireAuth>` branché sur `useCurrentUser()`
- [ ] Layout principal (sidebar/navigation selon les mocks)

**Feature modules** (dans l'ordre des domaines backend)

Pour chaque feature :

1. `domain/` : re-export types SDK + types dérivés
2. `infrastructure/` : alias stables des hooks orval
3. `application/` : hooks métier (liste, détail, formulaire)
4. `ui/` : composants purs connectés aux hooks application

| Feature       | Pages principales                     |
| ------------- | ------------------------------------- |
| Teams         | Liste, Détail, Créer, Modifier        |
| Players       | Liste par équipe, Créer, Modifier     |
| Matches       | Liste, Détail, Saisie score (Arbitre) |
| Championships | Liste, Détail, Phases                 |
| Standings     | Tableau par poule                     |

### Critères de validation

- `pnpm --filter application-material check:types` : zéro erreur
- `pnpm --filter application-material test` : tous les tests passent
- Parcours complets testés manuellement : login → navigation → CRUD équipe → saisie score

---

## Règles transversales

- **OpenAPI first** : toute nouvelle route commence par une modification de `openapi.yml`, suivie de `pnpm gen:sdk` côté frontend.
- **Pas de mock DB** : les tests d'intégration backend utilisent une vraie instance MongoDB (Docker).
- **Strangler fig** : le code legacy reste jusqu'à validation du nouveau domaine.
- **Commits conventionnels** : utiliser `git cz` pour tous les commits.
