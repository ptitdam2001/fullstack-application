---
name: backend-functional-test
description: Scaffolds a functional API test file for a backend domain in this project (Vitest + supertest + Testcontainers Mongo). Use this skill whenever the user wants to write, add, or create functional/integration tests for a backend domain or route: "écrire les tests fonctionnels pour X", "ajouter des tests fonctionnels", "tester les routes de X", "write functional tests for X", "add backend tests for X", "test the X API", "tester l'API X". Always invoke this skill before writing any backend functional test file from scratch.
---

# Backend Functional Test

Scaffolds `backend/tests/functional/<domaine>.test.ts` for this project.

Stack: Vitest + supertest + Testcontainers (Mongo replica set) + TypeScript ESM strict.
Project root: `/Users/suhard/Documents/Development/fullstack-application/`

---

## Context — what already exists

The harness is fully wired (Session 1 of the testing initiative):

| File | Role |
|------|------|
| `backend/tests/support/database.ts` | globalSetup: starts Testcontainers Mongo replica, exposes `DATABASE_URL`, runs `prisma db push`. Also exports `resetDatabase()` — `deleteMany` on all collections between tests. |
| `backend/tests/support/client.ts` | `createTestAgent()` — returns a supertest agent mounted on `createApp()` (no port binding). |
| `backend/tests/support/authenticate.ts` | `authHeaderFor(userId, isAdmin?)` — forges a valid JWT header for a given user. |
| `backend/tests/support/fixtures.ts` | Entity factories: `createAdmin()`, `createUser()`, `createTeam()`, etc. Extend when the domain needs new fixtures. |
| `backend/vitest.functional.config.ts` | Vitest config: includes `tests/functional/**/*.test.ts`, `globalSetup`, `testTimeout: 30000`, `singleThread: true`. |

Run with: `pnpm --filter openapi-express-ts test:functional` or `make test-backend-func`

---

## Step 1 — Gather domain info

Ask:
1. **Domaine** — which domain to test? (e.g. `match`, `championship`, `auth`)
2. **Routes** — all routes, or a specific subset? (default: all routes in the domain's matrix from `specifications/16-strategie-de-test.md`)
3. **Split?** — if the domain has more than ~10 operations or complex business rules (forfeit, standings calculation, transactions), propose splitting into `<domaine>.crud.test.ts` + `<domaine>.<concern>.test.ts`. Ask the user to confirm.

> **Scope rule**: the target domain = **only** the operations tagged with that exact tag in `openapi.yml`. Related tags (e.g. `phase`, `group`, `standings` are siblings of `championship`) define their own separate domains — cover them only if the user explicitly asks. When in doubt, stay narrow.

---

## Step 2 — Read the sources of truth

Read these in parallel before generating anything:

1. **`backend/openapi.yml`** — extract every operation for the domain (method + path + operationId + security + request/response schemas). Security determines auth fixtures needed; schemas drive what to assert on response bodies.
2. **`specifications/16-strategie-de-test.md`** — check current coverage status for the domain (✅ / ❌ / 🚫).
3. **`specifications/0X-<domaine>.md`** if it exists — extract business rules (RBAC, soft-delete scope, forfeit conditions, standings tiebreakers, transaction requirements, etc.). These become the `it('règle métier: ...')` test cases.
4. **`backend/src/<domaine>/`** — scan domain types, use cases, and errors to understand what side effects to verify (e.g. `UserTeam` created on team creation, `deletedAt` set on soft-delete).

---

## Step 3 — Generate the test file

Create `backend/tests/functional/<domaine>.test.ts` (or split files if agreed in Step 1).

### File structure

```typescript
import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createUser /* + domain fixtures */ } from '../support/fixtures.js'
// Zod schemas from the generated SDK — for response shape validation
// import { XxxResponse, XxxListResponse } from '../../../../frontend/web-application/src/sdk/generated/<tag>/<tag>.zod.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('<domaine> domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── OPERATION_ID ─────────────────────────────────────────────────────────
  describe('OPERATION_ID — METHOD /path', () => {
    it('nominal: <happy path description>', async () => {
      // arrange: create fixtures
      // act: call the route
      // assert: status + body shape + side effects
    })

    it('401 — unauthenticated request', async () => { /* omit auth header */ })

    it('403 — insufficient role', async () => { /* use wrong role fixture */ })

    it('400 — validation: missing required field', async () => { /* bad body */ })

    it('404 — unknown id', async () => { /* unknownObjectId() */ })

    // business rules from spec (one it() per rule)
    it('règle métier: <rule from specifications/>', async () => { /* ... */ })
  })
})
```

### What to assert on every nominal response

- **Status code** — exact match (`expect(res.status).toBe(200)`)
- **Body shape** — parse with the relevant Zod schema from `frontend/web-application/src/sdk/generated/<tag>/<tag>.zod.ts`. If the domain has no SDK module yet, assert on key fields directly (`expect(res.body).toMatchObject({ id: expect.any(String), ... })`).
- **Side effects via Prisma** — for write operations, query `prisma.<model>.findFirst(...)` after the HTTP call and assert the DB state matches expectations. This is what makes functional tests valuable over unit tests.

### One `describe` per operationId

Group by operationId, not by HTTP method. Order: list, count, get-single, create, update, delete — then sub-resources, then special operations.

### Auth patterns

- **Public route** (`security: []` in openapi.yml) → no auth header needed in nominal case; add `it('works unauthenticated')`.
- **JWT required, no role** → `authHeaderFor(user.id)` (any user).
- **Role required** → `authHeaderFor(admin.id, true)` for admin; create specific-role users via fixtures for coach/referee/player.

### Soft-delete

If the domain uses soft-delete (`deletedAt` field in Prisma model), verify:
- DELETE sets `deletedAt` (not hard-deletes) — query via `prisma` after the HTTP call.
- GET list excludes soft-deleted records.
- GET by id on soft-deleted record returns 404.

---

## Step 4 — Extend fixtures if needed

If the domain needs entity factories not yet in `backend/tests/support/fixtures.ts`, add them there — following the same pattern as `createTeam`, `createUser`, etc. Add only what's needed for the new test file.

---

## Pitfalls — include these in every generated file

| Pitfall | Rule |
|---------|------|
| Unknown ObjectId | Use `randomBytes(12).toString('hex')` — 24-char hex string, valid ObjectId format, absent from DB. Never use `randomUUID()` for Mongo `@db.ObjectId` fields — UUID format causes a Prisma 500. |
| Soft-delete filter | In Prisma queries inside tests, use `{ ...notDeleted }` from `backend/utils/softDelete.ts`. Never `{ deletedAt: null }` — Prisma v6+MongoDB only matches documents where the field is explicitly `null`, not missing. |
| ESM imports | All TypeScript imports inside `backend/` must end in `.js` — even when importing `.ts` files. |
| Apple Silicon wait | `INIT_WAIT_SEC=10` is set in the Testcontainers globalSetup for amd64-on-arm64 emulation. Tests that run faster don't need to do anything — just don't lower this value. |
| Zod SDK import path | The Zod schemas live in the **frontend** tree: `../../../../frontend/web-application/src/sdk/generated/<tag>/<tag>.zod.js`. Use the generated types for response assertions — they are the ground truth for what the frontend expects. |
| ajv / openapi-backend validation | `openapi-backend` validates all **requests** against the spec. If a PATCH/POST test body doesn't pass the spec schema, the route returns 400 even if the handler would accept it. Match the request body exactly to what the spec requires. |

---

## Step 5 — Remind

After generating, always remind:

```
pnpm --filter openapi-express-ts test:functional   # run the new tests
pnpm --filter openapi-express-ts check:type        # verify TypeScript
```

If any test fails with a Prisma error or 500: check the `unknownObjectId` pitfall and the soft-delete filter pitfall first — these cause the majority of unexpected 500s.