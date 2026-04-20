# Choix techniques

## Vue d'ensemble

L'application est un monorepo structuré en trois parties :

- **Backend** : API REST Node.js/TypeScript
- **Design System** : bibliothèque de composants React accessibles
- **Application** : SPA React consommant le design system et le backend

---

## Backend

| Dimension               | Choix                                 | Justification                                                                                     |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Runtime                 | Node.js + TypeScript (strict)         | Typage fort partageable avec le frontend via le contrat OpenAPI                                   |
| Framework HTTP          | Express v5                            | Léger, mature, compatible avec `openapi-backend`                                                  |
| Contrat API             | OpenAPI 3.1 (`backend/openapi.yml`)   | Source de vérité unique pour les routes, schémas, et la génération du SDK frontend                |
| Validation des requêtes | `openapi-backend`                     | Valide automatiquement les payloads entrants contre la spec OpenAPI                               |
| Base de données         | MongoDB                               | Schéma flexible adapté au domaine sportif (configurations de points variables, phases dynamiques) |
| ORM                     | Prisma                                | Typage TypeScript des requêtes, migrations, génération du client Prisma                           |
| Authentification        | JWT (access token) + bcrypt           | Stateless, compatible avec les architectures distribuées                                          |
| Tests                   | Vitest (unitaires sur use cases)      | Les use cases de la couche application peuvent être testés sans infrastructure                    |
| Linting                 | ESLint via `@repo/eslint-config/node` | Config partagée avec le frontend                                                                  |
| Formatage               | Prettier via `@repo/prettier-config`  | Config partagée avec le frontend                                                                  |

### Workflow API

```text
openapi.yml  →  openapi-backend (validation runtime)
             →  orval (génération SDK + types + zod côté frontend)
             →  Prisma schema (modèles de données)
```

> Toute modification d'un endpoint commence par `openapi.yml`. Le backend et le frontend se mettent ensuite à jour en conséquence.

---

## Frontend — deux packages distincts

### Pourquoi séparer design system et application ?

Le design system contient des composants React **sans logique métier** (boutons, formulaires, tableaux). Il est publié comme package `@repo/design-system` dans le workspace pnpm. Cette séparation permet :

- De tester et documenter les composants indépendamment (Storybook)
- D'éviter que les composants UI dépendent de TanStack Query ou d'autres libs métier
- De réutiliser les composants dans d'autres applications futures

### `@repo/design-system`

| Dimension     | Choix                                  | Justification                                                                         |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| Framework     | React 19 + TypeScript                  | Cohérence avec l'application                                                          |
| Accessibilité | `react-aria-components`                | Composants WAI-ARIA conformes, comportements natifs (focus, keyboard nav) sans effort |
| Styles        | Tailwind CSS v4                        | Utilitaires CSS, design tokens via variables CSS, pas de CSS-in-JS runtime            |
| Variants      | CVA (class-variance-authority)         | API déclarative pour les variantes de composants (size, intent, state)                |
| Documentation | Storybook                              | Stories comme source de vérité visuelle pour chaque composant                         |
| Tests         | Vitest + React Testing Library + jsdom | Tests comportementaux (interactions, accessibilité)                                   |
| Build         | Vite (library mode)                    | Génère `dist/index.js` + types pour consommation par l'application                    |

### Application (`application-material`)

| Dimension            | Choix                                  | Justification                                                                     |
| -------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| Framework            | React 19 + TypeScript + Vite           | Écosystème standard, HMR rapide                                                   |
| Routing              | React Router v7                        | File-based routing, loaders/actions, compatible SSR futur                         |
| Server state         | TanStack Query v5                      | Cache, invalidation, états de chargement/erreur gérés automatiquement             |
| SDK API              | orval                                  | Génère hooks TanStack Query + types TypeScript + schémas Zod depuis `openapi.yml` |
| Formulaires          | react-hook-form + résolveurs Zod       | Intégration native avec les schémas Zod générés par orval                         |
| Internationalisation | react-intl                             | Gestion des messages, pluriels, formats de dates                                  |
| Mocking (dev)        | MSW (Mock Service Worker)              | Intercepte les requêtes au niveau réseau, identique en dev et en test             |
| Tests unitaires      | Vitest + React Testing Library + jsdom | Cohérence avec le design system                                                   |
| Tests E2E            | Playwright                             | Tests de parcours complets en navigateur réel                                     |
| Linting              | ESLint via `@repo/eslint-config/react` | Config partagée avec le design system                                             |
| Formatage            | Prettier via `@repo/prettier-config`   | Config partagée avec le reste du projet                                           |

---

## Tooling partagé

Les configurations ESLint et Prettier sont mutualisées dans un package `tooling/` au niveau du workspace racine.

```text
tooling/
├── eslint-config/   (@repo/eslint-config)
│   ├── base.js      # TypeScript strict + règles communes
│   ├── node.js      # Étend base, globals Node.js
│   └── react.js     # Étend base, react-hooks + react-refresh + storybook
└── prettier-config/ (@repo/prettier-config)
    └── index.js     # singleQuote, semi: false, printWidth: 120, ...
```

Chaque package consomme la config via :

```json
// package.json
"prettier": "@repo/prettier-config"
```

```js
// eslint.config.js
import config from "@repo/eslint-config/node"; // ou /react
export default config;
```

---

## Résumé des dépendances inter-packages

```test
openapi.yml
    ├── backend/ (validation runtime via openapi-backend)
    └── frontend/web-application/ (SDK généré via orval)

@repo/design-system
    └── frontend/web-application/ (composants UI)

@repo/eslint-config
    ├── backend/
    ├── frontend/design-system/
    └── frontend/web-application/

@repo/prettier-config
    ├── backend/
    ├── frontend/design-system/
    └── frontend/web-application/
```
