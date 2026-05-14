# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Patterns

- This is a pnpm monorepo with a design-system package; rebuild the design-system (`pnpm --filter @repo/design-system build`) before consuming apps when CSS or exports change.
- Backend uses Prisma + MongoDB; always regenerate the Prisma client (`pnpm generate:prisma`) after schema changes to avoid stale-client 500s.

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

| Scenario                              | What to update                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| New API field returned to frontend    | `openapi.yml` schema + `prisma/schema.prisma` + domain type                                            |
| Field becomes required (not nullable) | `openapi.yml` required array + `prisma/schema.prisma` nullability + domain type                        |
| New collection / model                | `prisma/schema.prisma` first, then expose via `openapi.yml`                                            |
| Rename a model or field               | `prisma/schema.prisma` + `@@map` to preserve the MongoDB collection name + `openapi.yml` + domain type |

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

## Testing

- Run the full test suite (`pnpm vitest run` in `backend/`) after any domain model or role/permission refactor.
- When scaffolding a new domain, include unit tests and ensure they pass before committing.

## Design System Workflow

- After modifying any package in the design-system, ALWAYS rebuild it (`pnpm --filter @repo/design-system build`) before testing in the web app.
- When Vite changes aren't being picked up, suspect stale dep cache first: clear `node_modules/.vite` before deeper debugging.

### Debugging checklist — "change not picked up"

Before investigating code, eliminate these in order:
1. Is the design-system built? (`pnpm --filter @repo/design-system build`)
2. Is `frontend/web-application/node_modules/.vite` stale? (delete it)
3. Was `pnpm generate:prisma` run after schema changes?

Only after all three are confirmed, investigate code.

## i18n Convention

- NEVER hardcode user-facing strings. All UI text must go through react-intl using `FormattedMessage` or `useIntl` with i18n keys.
- Test files should mock react-intl consistently with the global setup; don't add per-file `vi.mock('react-intl')` that conflicts with globals.

## Scope Discipline

- Fix only what was asked. Do NOT proactively modify adjacent code (mocks, unrelated stories, refactors) after the primary issue is resolved.
- If you notice other issues, list them and ASK before touching them.

When the user opens a session with the pattern below, treat the declared scope as a hard boundary:

> "Scope for this session: [issue]. Fix ONLY this. If you notice other issues, add them to a 'follow-ups' list at the end and ask before touching them. Do not refactor adjacent code."

Honour it literally: one scope, one fix, follow-ups listed separately.

## Commits & Workflow

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint + husky. Use `git cz` for an interactive prompt instead of `git commit`.

- Create structured, atomic commits grouped by concern (e.g., security fixes, refactor, tests) rather than single large commits.
- Push to main after the user confirms completion.

## Commit Strategy

- Make atomic commits per logical change with structured messages.
- Run tests before each commit; do not commit failing tests.
- Push to main after the user confirms the work block is complete.

## Working Style

Before writing any code:
1. Produce a numbered plan — one logical commit per step.
2. Wait for user approval before starting.

After each step:
1. Run tests.
2. Commit with a structured message.
3. Pause — wait for user to verify before continuing to the next step.

## Monorepo Layout

```text
fullstack-application/          # pnpm workspace root (pnpm@10.13.1)
├── package.json                # devDeps: commitlint, husky, commitizen
├── pnpm-workspace.yaml         # workspace: tooling/*
│
├── tooling/
│   ├── eslint-config/          # @repo/eslint-config — exports: ./base, ./node, ./react
│   └── prettier-config/        # @repo/prettier-config — singleQuote, semi:false, printWidth:120
│
├── backend/                    # openapi-express-ts (standalone, not in workspace)
│   └── package.json
│
└── frontend/                   # separate pnpm workspace root (no package.json)
    ├── design-system/          # @repo/design-system
    │   └── package.json
    └── web-application/        # application-material
        └── package.json
```

### Package registry

| Package         | Name                    | Location                    |
| --------------- | ----------------------- | --------------------------- |
| Root            | `fullstack-application` | `/`                         |
| Backend         | `openapi-express-ts`    | `backend/`                  |
| Design system   | `@repo/design-system`   | `frontend/design-system/`   |
| Web app         | `application-material`  | `frontend/web-application/` |
| ESLint config   | `@repo/eslint-config`   | `tooling/eslint-config/`    |
| Prettier config | `@repo/prettier-config` | `tooling/prettier-config/`  |

### Inter-package dependencies

```text
application-material
  ├── @repo/design-system      (workspace:*)
  ├── @repo/eslint-config      (file:../../tooling/eslint-config)
  └── @repo/prettier-config    (file:../../tooling/prettier-config)

@repo/design-system
  ├── @repo/eslint-config      (file:../../tooling/eslint-config)
  └── @repo/prettier-config    (file:../../tooling/prettier-config)

openapi-express-ts (backend)
  ├── @repo/eslint-config      (file:../tooling/eslint-config)
  └── @repo/prettier-config    (file:../tooling/prettier-config)
```

### Build and dev commands per package

| Package                | Build                                      | Dev / watch                                                               | Test                                      |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------- |
| `@repo/design-system`  | `pnpm --filter @repo/design-system build`  | `pnpm --filter @repo/design-system dev` (vite --watch)                    | `pnpm --filter @repo/design-system test`  |
| `application-material` | `pnpm --filter application-material build` | `pnpm --filter application-material dev` _(rebuilds design-system first)_ | `pnpm --filter application-material test` |
| `openapi-express-ts`   | `pnpm --filter openapi-express-ts build`   | `pnpm --filter openapi-express-ts start:dev` (tsx watch)                  | `pnpm --filter openapi-express-ts test`   |

> `application-material`'s `dev` script runs `(cd ../design-system && pnpm build) && vite` — it always rebuilds the design system before starting Vite. For faster iteration when only touching the app, skip the prefix rebuild by running `vite` directly inside `frontend/web-application/`.

### Install rules

- Always install from `frontend/` (workspace root), **never** from `frontend/web-application/` — workspace packages (`@repo/design-system`) won't resolve otherwise.
- Root installs (`/`) cover `tooling/*` only; backend and frontend are independent install roots.

## Known Pitfalls

Recurring mistakes confirmed by session history — check these before debugging or writing code.

| # | Pitfall | Rule |
|---|---------|------|
| 1 | **Stale Vite / DS cache** | After any edit to `frontend/design-system/src/`, run `pnpm --filter @repo/design-system build`. If change still not visible: `rm -rf frontend/web-application/node_modules/.vite` then restart Vite. Never debug code before eliminating this. |
| 2 | **`userEvent.hover()` silent fail** | react-aria `useHover` ignores jsdom hover events (currentTarget=null). Use `userEvent.tab()` to test focus/tooltip triggers. `userEvent.click()` works fine for press/open. |
| 3 | **Tailwind v4 data attributes** | Use `data-hovered:`, `data-focused:`, `data-selected:`, `data-disabled:` (no brackets). v3 `data-[hovered]:` syntax silently fails in v4 — dark mode and state styles won't apply. |
| 4 | **Stories missing play functions** | Every interactive design system component needs a `play` function in at least one story. No play = untested open/close/keyboard behavior. Non-negotiable. |
| 5 | **Bruno not synced after openapi.yml** | After every openapi.yml change, update `backend/bruno/`: add `.bru` for new routes, remove for deleted, update body/params for changed schemas. |
| 6 | **Stale Prisma client** | After any change to `backend/prisma/schema.prisma`, run `pnpm generate:prisma` immediately. Skip this and you get 500s or TS errors on the next request. |
| 7 | **Direct react-aria import in web-application** | `web-application` must NEVER import from `react-aria-components` directly. Import from `@repo/design-system` only. The design system re-exports all primitives needed. |
| 8 | **.env.sample out of sync** | Any time a variable is added or removed from `.env`, update `.env.sample` in the same commit (use placeholder values, no real secrets). |
| 9 | **Hardcoded i18n strings** | NEVER write user-visible text as string literals in JSX. All UI text goes through `<FormattedMessage id="..." />` or `useIntl().formatMessage(...)`. |
| 10 | **SDK stale after openapi.yml** | After editing `openapi.yml`, run `pnpm --filter application-material gen:sdk`. Frontend type errors and missing hooks are a symptom of a stale SDK. |

> The post-edit hook in `.claude/hooks/post-edit-remind.sh` surfaces reminders for pitfalls 1, 5, 6, 7, 8 automatically.

## Skill Authoring Standards

- When creating or refining skills that generate Prisma code, always include: correct nullable syntax, required `select` clauses, and domain-consistent naming conventions.

## Project Skills

| Skill | Trigger | Description |
| --- | --- | --- |
| `create-backend-domain` | "créer un domaine", "scaffolder X" | Scaffolds a hexagonal backend domain (domain/ports/application/infrastructure + tests + OpenAPI) |
| `design-system-component` | "créer un composant", "ajouter au design system" | Creates a component in `@repo/design-system` (react-aria + Tailwind + Storybook + co-located tests) |
| `frontend-feature-module` | "créer le module X", "ajouter une feature" | Scaffolds a frontend feature module following hexagonal architecture (domain/infrastructure/application/ui) |
| `react-component` | "créer un composant", "nouveau composant React", "implémenter la vue" | Creates a React component in the web app: ESLint/Prettier rules, i18n (FormattedMessage), Design System priority, sub-components, co-located tests |
| `react-aria-testing` | "tester un composant react-aria", "play function", "test tooltip/hover" | Testing patterns for react-aria: no userEvent.hover, correct interaction APIs, Tailwind v4 data attributes |
| `rebuild-ds` | "rebuild design system", "change not showing", "vite cache" | Steps to rebuild @repo/design-system and clear stale Vite cache |
| `openapi-sync` | "updated openapi", "after openapi change", "sync sdk", "sync bruno" | Checklist after openapi.yml changes: gen:sdk + Bruno update + nullability sync |

> Frontend component and module guidance is also available in package-level CLAUDE.md files:
>
> - `frontend/design-system/CLAUDE.md` — design system conventions (react-aria, CVA, stories, tests)
