# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start:dev       # Run dev server with hot reload (tsx watch)
pnpm build           # Bundle with esbuild → dist/index.js
pnpm start:prod      # Run production build
pnpm check:type      # TypeScript type checking (no emit)
pnpm vitest run      # Run all unit tests
pnpm generate:prisma # Regenerate Prisma client after schema changes
pnpm format:prisma   # Format prisma/schema.prisma
```

## Architecture

**OpenAPI-first**: Routes, validation, and request/response schemas are defined in `openapi.yml`. The [openapi-backend](https://github.com/anttiviljami/openapi-backend) library validates all incoming requests against the spec and routes them by `operationId`.

**Hexagonal architecture** (Ports & Adapters) — one folder per domain under `src/`:

```
src/<domain>/
├── domain/         # Pure types, value objects, errors (no Prisma, no Express)
├── ports/          # TypeScript interfaces (output ports = repositories)
├── application/    # Use cases + Vitest unit tests
└── infrastructure/ # PrismaRepository + HttpHandlers (adapters)
```

**Domains**: `auth`, `user`, `team`, `player` (inside team), `match`, `championship`

**Request flow**: `index.ts` → OpenAPI Backend (validates + routes by operationId) → HttpHandler → UseCases → Repository → Prisma

**Handler signature**:

```typescript
export const operationName = async (ctx: Context, req: Request, res: Response) => { ... }
```

**Auth**: JWT Bearer token. `requireRoles(ctx, Role.X)` enforces role-based access — throws `ForbiddenError`/`UnauthorizedError`, never caught in try/catch. Public endpoints have `security: []` in the spec.

**ESM strict**: all TypeScript imports must use `.js` extensions.

## Environment

Copy `.env.sample` → `.env` and configure:

- `DATABASE_URL` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — defaults to 3000. **Note**: the frontend `config/axios-instance.ts` hardcodes port `4000` — align your `.env` or update the axios instance if you change this.
- `JWT_EXPIRE` — defaults to `'2h'`

## Key Files

| File                   | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `index.ts`             | App entry: middleware, OpenAPI init, handler registration |
| `openapi.yml`          | Source of truth for all routes and schemas                |
| `prisma/schema.prisma` | Source of truth for database structure                    |
| `utils/prismaClient.ts`| Singleton Prisma client                                   |
| `config/logger.ts`     | Winston logger setup                                      |
