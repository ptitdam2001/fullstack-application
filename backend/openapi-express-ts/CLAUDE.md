# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start:dev       # Run dev server with hot reload (tsx watch)
pnpm build           # Bundle with esbuild → dist/index.js
pnpm start:prod      # Run production build
pnpm check:type      # TypeScript type checking (no emit)
pnpm generate:prisma # Regenerate Prisma client after schema changes
pnpm format:prisma   # Format prisma/schema.prisma
```

No test runner is configured.

## Architecture

**OpenAPI-first**: Routes, validation, and request/response schemas are defined in `../openapi.yml` (one level up). The [openapi-backend](https://github.com/anttiviljami/openapi-backend) library validates all incoming requests against the spec and routes them by `operationId`.

**Request flow**: `index.ts` → OpenAPI Backend middleware (validates + matches operationId) → controller handler

**Handler signature** (all handlers follow this pattern):
```typescript
export const operationName = async (ctx: Context, req: Request, res: Response) => { ... }
```

Handlers are registered in `index.ts` via `api.register({ operationId: handlerFn, ... })`.

**Auth**: JWT Bearer token. The security handler in `index.ts` verifies the token and attaches `ctx.security.jwt`. Token payload: `{ data: userId }`. Public endpoints are marked `security: []` in the spec.

**Data model source of truth**: `../openapi.yml` defines the canonical schemas (User, Player, Team, Game, GameTeam, Area, etc.). `prisma/schema.prisma` is the MongoDB persistence layer — it must stay in sync with the OpenAPI schemas, but the OpenAPI spec is what drives the API contract and TypeScript types used in controllers.

**Database**: Prisma ORM + MongoDB. Singleton client in `utils/prismaClient.ts`. When adding or changing a model, update `openapi.yml` first, then `prisma/schema.prisma`, then run `pnpm generate:prisma`.

**Not yet implemented**: Many endpoints exist in `openapi.yml` but have no handler (logout, forgotPassword, areas CRUD, games CRUD, team players, team calendar). These return a 501 error.

## Environment

Copy `.env.sample` → `.env` and configure:
- `DATABASE_URL` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — defaults to 3000
- `JWT_EXPIRE` — defaults to `'2h'`

## Key Files

| File | Purpose |
|------|---------|
| `index.ts` | App entry: middleware, OpenAPI init, handler registration |
| `../openapi.yml` | Source of truth for all routes and schemas |
| `prisma/schema.prisma` | Database models |
| `controllers/types.ts` | Shared TypeScript types for controllers |
| `config/logger.ts` | Winston logger setup |
