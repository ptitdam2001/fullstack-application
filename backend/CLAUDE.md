# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start:dev       # Run dev server with hot reload (tsx watch)
pnpm build           # Bundle with esbuild → dist/index.js
pnpm start:prod      # Run production build
pnpm check:type      # TypeScript type checking (no emit) — every .ts file: src, scripts, tests, config files
pnpm vitest run      # Run all unit tests
pnpm generate:prisma # Regenerate Prisma client after schema changes
pnpm format:prisma   # Format prisma/schema.prisma
pnpm db:push         # Create/update the MongoDB indexes of schema.prisma on DATABASE_URL (runs db:check-duplicates first)
pnpm db:check-duplicates # Read-only: list documents that would block a unique index
pnpm check:sync-schema # Flag nullability drift between openapi.yml and prisma/schema.prisma
```

## Database indexes

With MongoDB there are no migrations: the indexes declared in `prisma/schema.prisma` (`@unique`, `@@unique`, `@@index`) are created only by `prisma db push`, per database. `generate:prisma` does not touch the database.

- **When**: on a fresh database, and after adding or changing an index in the schema. `pnpm db:push` (or `make db-push` from the root) targets `DATABASE_URL` — the environment variable if set, otherwise `backend/.env`. It is idempotent and never drops data.
- **Duplicates first**: `db:push` starts with `db:check-duplicates` (`scripts/check-unique-duplicates.ts`, read-only, unique sets read from the generated Prisma client) and stops before any write if two documents share a unique key. A missing field counts as `null`, as in the index. Do not bypass it with a bare `prisma db push` on a database that has data: on Mongo 4.4 a unique index built over duplicates does not fail, the build stays stuck server-side and the command never returns. To abort a stuck build: `db.<collection>.dropIndex('<index name>')`.
- **Where it is wired**: functional tests (`tests/support/database.ts`) and `make stack-test-up` push automatically. `make up` does not — run `make db-push` yourself. The Docker image does not push at start-up either (see the root `README.md` › Docker).
- **Verify**: `db.users.getIndexes()` in a Mongo shell must list `users_email_key`, not just `_id_`.

## Architecture

**OpenAPI-first**: Routes, validation, and request/response schemas are defined in `openapi.yml`. The [openapi-backend](https://github.com/anttiviljami/openapi-backend) library validates all incoming requests against the spec and routes them by `operationId`.

**Hexagonal architecture** (Ports & Adapters) — one folder per domain under `src/`:

```text
src/<domain>/
├── domain/         # Pure types, value objects, errors (no Prisma, no Express)
├── ports/          # TypeScript interfaces (output ports = repositories)
├── application/    # Use cases + Vitest unit tests
└── infrastructure/ # PrismaRepository + HttpHandlers (adapters)
```

**Domains**: `auth`, `user`, `team`, `player` (inside team), `match`, `championship`, `image` (file storage behind the `IImageStorage` port — MongoDB today, replaceable by S3)

**Request flow**: `index.ts` → OpenAPI Backend (validates + routes by operationId) → HttpHandler → UseCases → Repository → Prisma

**Handler signature**:

```typescript
export const operationName = async (ctx: Context, req: Request, res: Response) => { ... }
```

**Auth**: JWT Bearer token. `requireAdmin(ctx)` / `requireAdminOrCoach(ctx)` (`src/auth/application/requireRoles.ts`) enforce role-based access, `getAuthUserId(ctx)` / `getAuthPayload(ctx)` read the caller — they throw `ForbiddenError`/`UnauthorizedError`, never caught in try/catch. Public endpoints have `security: []` in the spec.

**ESM strict**: all TypeScript imports must use `.js` extensions.

## Environment

Copy `.env.sample` → `.env` and configure:

- `DATABASE_URL` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — defaults to 3000. **Note**: the frontend `config/axios-instance.ts` hardcodes port `4000` — align your `.env` or update the axios instance if you change this.
- `JWT_EXPIRE` — defaults to `'2h'`
- `LOGIN_RATE_LIMIT`, `REGISTER_RATE_LIMIT`, `EMAIL_RATE_LIMIT`, `TOKEN_RATE_LIMIT`, `MAX_LOGIN_ATTEMPTS`, `LOGIN_LOCKOUT_MINUTES` — abuse limits on the public auth routes; `LOGIN_RATE_LIMIT` also caps the authenticated `PUT /me/password`, with its own counter (keys, defaults and windows: `specifications/10-inscription-et-authentification.md` › Limitation de débit). Rate limits live in `config/rateLimits.ts`; the functional test config and the smoke stack raise them to 1000

## Key Files

| File                    | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `index.ts`              | App entry: middleware, OpenAPI init, handler registration |
| `openapi.yml`           | Source of truth for all routes and schemas                |
| `prisma/schema.prisma`  | Source of truth for database structure                    |
| `utils/prismaClient.ts` | Singleton Prisma client                                   |
| `config/logger.ts`      | Winston logger setup                                      |
