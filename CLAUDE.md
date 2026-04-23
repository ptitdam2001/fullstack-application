# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with a React frontend and a Node.js/Express backend sharing a single OpenAPI spec:

```text
backend/                      # Express v5 + OpenAPI-backend + Prisma + MongoDB
  openapi.yml                 # Source of truth for all API contracts and schemas
  index.ts                    # Entry point — imports handlers by domain
  controllers/                # Legacy handlers (being migrated to src/<domain>/)
  src/                        # Hexagonal architecture (domain by domain migration)
frontend/
  design-system/              # @repo/design-system — React Aria + Tailwind components
  web-application/            # application-material — SPA consuming the design system
specifications/               # Business domain specifications (source of truth for features)
tooling/
  eslint-config/              # @repo/eslint-config — shared ESLint flat config (base/node/react)
  prettier-config/            # @repo/prettier-config — shared Prettier config
```

## Business Domain Specifications

All feature work must align with the business rules defined in `specifications/`. Read the relevant spec before implementing any domain logic.

| File                                           | Domain                                                                  |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `specifications/01-domain-glossary.md`         | Glossary — canonical definitions for all domain concepts                |
| `specifications/02-championship.md`            | Championship — age categories, phases, points config, multi-phase rules |
| `specifications/03-match.md`                   | Match — structure, statuses, scoring, forfeit, auto-generation          |
| `specifications/04-team.md`                    | Team — color, venue, age category, championship enrollment              |
| `specifications/05-standings.md`               | Standings — points calculation, tiebreakers, inter-group ranking        |
| `specifications/06-user-profiles.md`           | User profiles — roles (Admin/Coach/Referee/Player), permission matrix   |
| `specifications/07-technical-choices.md`       | Technical choices — backend, design-system, application stack           |
| `specifications/08-architecture-hexagonale.md` | Architecture — hexagonal structure, port interfaces per domain          |
| `specifications/09-implementation-roadmap.md`  | Implementation roadmap — 4 phases from init to full frontend            |

> When adding a new feature or modifying existing domain logic, update the relevant spec first, then propagate to `openapi.yml`, backend, and frontend.

## Commands

### Backend (`backend/`)

```bash
pnpm start:dev       # Dev server with hot reload (tsx watch)
pnpm build           # Bundle with esbuild → dist/index.js
pnpm check:type      # TypeScript type checking
pnpm generate:prisma # Regenerate Prisma client after schema changes
pnpm lint            # ESLint (extends @repo/eslint-config/node)
```

### Frontend (`frontend/`)

> **Important**: The `frontend/` directory is the pnpm workspace root but has no `package.json`. Always run scripts using `pnpm --filter application-material <script>` from `frontend/`, or run them directly from `frontend/web-application/`. Never run `pnpm install` from `frontend/web-application/` — it will fail to resolve workspace packages like `@repo/design-system`.

```bash

# Run from frontend/ using filter, or directly from frontend/web-application/
pnpm --filter application-material dev             # Vite dev server (MSW mocks enabled in dev)
pnpm --filter application-material build           # tsc + vite build
pnpm --filter application-material test            # Vitest (jsdom environment)
pnpm --filter application-material test:ui         # Vitest with UI and coverage
pnpm --filter application-material lint            # ESLint (extends @repo/eslint-config/react)
pnpm --filter application-material check:types     # TypeScript check (no emit)
pnpm --filter application-material check:format    # Prettier check
pnpm --filter application-material check:dead-code # Knip dead code analysis
pnpm --filter application-material gen:sdk         # Regenerate SDK from openapi.yml via orval
pnpm --filter application-material storybook       # Storybook dev server on port 6006

# Design system
pnpm --filter @repo/design-system build            # Build component library
pnpm --filter @repo/design-system storybook        # Storybook dev server on port 6006
```

### Root

```bash
docker compose up    # Swagger Editor (:8081), Swagger UI (:8082), frontend (:3000)
git cz               # Commitizen for conventional commits
```

## Sources of Truth

This project has **two independent sources of truth** that must stay in sync. Never derive one from the other automatically — changes must be propagated manually and deliberately.

### 1. `backend/openapi.yml` — API contract

Defines every route, request/response schema, and validation rule exposed by the HTTP API.

- **Backend**: `openapi-backend` routes requests by `operationId` and validates payloads against the spec
- **Frontend SDK**: `orval` generates typed axios+react-query hooks into `frontend/web-application/src/sdk/generated/`
- **Zod schemas**: also generated by orval into `frontend/web-application/src/sdk/generated/*.zod.ts`

> Edit this file when the **shape of the API changes**: new route, new field, changed type, required/optional toggle.

### 2. `backend/prisma/schema.prisma` — database structure

Defines every collection, embedded type, relation, and index stored in MongoDB.

- **Prisma client**: `pnpm generate:prisma` regenerates the typed client from this schema
- **Domain types** in `src/<domain>/domain/` must mirror the fields defined here
- **Infrastructure repositories** in `src/<domain>/infrastructure/Prisma*Repository.ts` depend on the generated client

> Edit this file when the **shape of the database changes**: new model, new field, renamed relation, nullable toggle.

### Rules for keeping them in sync

| Scenario | What to update |
| --- | --- |
| New API field returned to frontend | `openapi.yml` schema + `prisma/schema.prisma` + domain type |
| Field becomes required (not nullable) | `openapi.yml` required array + `prisma/schema.prisma` nullability + domain type |
| New collection / model | `prisma/schema.prisma` first, then expose via `openapi.yml` |
| Rename a model or field | `prisma/schema.prisma` + `@@map` to preserve the MongoDB collection name + `openapi.yml` + domain type |

### Propagation workflow

```text
specifications/ (business rules)
  └─▶ openapi.yml (API contract)   &   prisma/schema.prisma (DB structure)
        ├─▶ pnpm gen:sdk           →  frontend/web-application/src/sdk/generated/
        └─▶ pnpm generate:prisma  →  Prisma client (node_modules/.prisma)
```

> `pnpm generate:prisma` regenerates the Prisma **client** from `schema.prisma`. It does **not** read `openapi.yml` — the two sources must be kept in sync manually.

## Backend Architecture

The backend follows hexagonal architecture (Ports & Adapters), migrated domain by domain from legacy controllers.

```text
backend/src/<domain>/
├── domain/         # Pure types, value objects (no Prisma, no Express)
├── ports/          # TypeScript interfaces (output ports = repositories)
├── application/    # Use cases injected via interfaces
└── infrastructure/ # PrismaRepository + HttpHandlers (adapters)
```

Activation: changing **one import** in `index.ts` per domain activates the new hexagonal implementation. Legacy `controllers/` remain until validation. See `specifications/08-architecture-hexagonale.md` for port contracts.

## Frontend Architecture

**Path aliases** (defined in `vite.config.ts`):

| Alias                                                  | Path                                                 |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `@Auth`                                                | `src/Auth` — auth context, login pages, JWT handling |
| `@Sdk`                                                 | `src/sdk/generated` — orval-generated API client     |
| `@Common`                                              | `src/Common` — shared utilities, context factory     |
| `@Teams`, `@Player`, `@Game`, `@Calendar`, `@Settings` | Feature modules                                      |
| `@Layouts`                                             | `src/Layouts` — route layout shells                  |
| `@I18n`                                                | `src/I18n` — react-intl setup and locale files       |
| `@Config`                                              | `config/` — axios instance, react-query client       |

**Feature module structure** (hexagonal frontend):

```text
src/<Feature>/
├── domain/         # Re-export SDK types + derived business types
├── infrastructure/ # Stable aliases over orval hooks (insulates UI from SDK regen)
├── application/    # Business hooks (useXxxList, useXxxForm, useXxxDetail)
└── ui/             # Pure components (receive data via props, no SDK hooks)
```

**Key patterns**:

- **State management**: React context via `createContextWithWrite` (`@Common/Context/`)
- **Server state**: TanStack Query v5 with orval-generated hooks from `@Sdk`
- **Auth**: JWT stored in localStorage under key `'user'`. `CheckAuthentication` guard wraps protected routes. Axios interceptor on `AXIOS_INSTANCE` handles 401s: clears storage + redirects to login.
- **Mocking**: MSW enabled in non-production builds. To hit the real backend: `VITE_MOCKED_BACKEND=false pnpm --filter application-material dev`.
- **Routing**: React Router v7. All routes defined in `AppRouting.tsx`.
- **Forms**: react-hook-form + zod resolvers using generated zod schemas.
- **i18n**: react-intl with locale files under `src/I18n/locales/`.

> **Gotcha — port**: `config/axios-instance.ts` hardcodes `http://localhost:4000/` as the backend URL. If you change `PORT` in the backend `.env`, update the axios instance accordingly.

## Tooling

ESLint and Prettier configs are shared via `tooling/` packages:

- `@repo/eslint-config/base` — TypeScript strict + common rules
- `@repo/eslint-config/node` — extends base, Node.js globals (backend)
- `@repo/eslint-config/react` — extends base, react-hooks + react-refresh (frontend)
- `@repo/prettier-config` — shared Prettier config (singleQuote, semi: false, printWidth: 120)

Backend references tooling via `workspace:*`. Frontend packages use `file:../../tooling/<pkg>`.

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint + husky. Use `git cz` for an interactive prompt instead of `git commit`.
