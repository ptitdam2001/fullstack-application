---
name: audit
description: Performs a backend security audit covering authentication flows, role/permission checks, input validation, Prisma query safety, secrets/env handling, and error leakage. Outputs findings grouped by severity (critical/high/medium/low) with file locations and suggested fixes. Use when the user asks to "audit", "security review", "check security", or "find vulnerabilities" in the backend.
---

# Backend Security Audit

Audit the backend at `/Users/suhard/Documents/Development/fullstack-application/backend/`.

Stack: Express v5 + openapi-backend + Prisma + MongoDB + JWT (jsonwebtoken + bcrypt).

Work through each section below. Read every file cited before drawing conclusions. After all checks, compile a single report — grouped by severity — using the template at the end.

---

## Section 1 — Authentication flows

**Files to read:**
- `src/auth/infrastructure/JwtAuthService.ts`
- `src/auth/application/AuthUseCases.ts`
- `src/auth/infrastructure/AuthHttpHandlers.ts`
- `index.ts` (the `registerSecurityHandler('jwtAuth', ...)` block)

**What to check:**

1. **JWT secret startup guard** — `JwtAuthService` reads `process.env.JWT_SECRET` with an `as string` cast. Check whether the app validates that `JWT_SECRET` is defined and non-empty at startup. If the env var is missing, `jwt.sign` and `jwt.verify` silently receive `undefined` and will throw at runtime, not at boot.

2. **JWT_EXPIRE parsing** — `Number(process.env.JWT_EXPIRE || 7200)`. If the env var is set to a string like `'2h'`, `Number('2h')` evaluates to `NaN`. The fallback only fires when the var is unset. If `NaN` is passed to `jwt.sign` as `expiresIn`, the token may never expire or throw. Verify the actual runtime behaviour.

3. **Token extraction robustness** — `authHeader.replace('Bearer ', '')` is case-sensitive. A request with `bearer <token>` (lowercase) would pass an unparsed string to `jwt.verify`. Check whether the security handler normalises the prefix.

4. **Logout is stateless** — The `logout` handler returns 200 but does not invalidate the token. Because JWT is stateless there is no server-side revocation. Confirm whether this is an accepted design decision or a gap (e.g., no token blocklist, no short expiry as compensation).

5. **Login timing** — `AuthUseCases.login` must handle both "user not found" and "wrong password" with the same error type and the same response time to prevent user enumeration. Verify that `comparePassword` is always called (not short-circuited) when the user is not found.

6. **Rate limiting scope** — Only `POST /login` has a rate limiter. Check whether `/forgot-password` (when implemented) and other credential-related endpoints are also rate-limited.

---

## Section 2 — Role and permission checks

**Files to read:**
- `src/auth/application/requireRoles.ts`
- Every `src/*/infrastructure/*HttpHandlers.ts`
- `openapi.yml` (the `security` key per operation)

**What to check:**

1. **Consistency of `requireRoles`/`requireAdmin` calls** — For every handler that mutates state (POST, PATCH, DELETE), verify that `requireAdmin(ctx)` or `requireRoles(ctx, ...)` is called as the first statement, before any async work. A missing call on a write handler is a privilege escalation vulnerability.

2. **OpenAPI `security: []` overrides** — List every operation in `openapi.yml` that carries `security: []` (public endpoint). For each one, confirm the handler does not accidentally call `getAuthPayload` or `requireAdmin` (it would always throw). Conversely, confirm that endpoints that require auth do NOT have `security: []`.

3. **No `requireRoles` function exists** — The codebase exports `requireAdmin` and `getAuthPayload`, but the `create-backend-domain` skill references `requireRoles(ctx, Role.ADMIN)`. Check whether newer domains use a different, possibly unguarded call pattern.

4. **Admin-only operations** — Confirm that all create/update/delete handlers in the following domains call `requireAdmin`: User, Team, Championship, Phase, Group, Match. List any handler that mutates data but has no role check.

5. **Self-only access** — Some read operations (e.g., `GET /me`, `GET /user/{userId}/...`) should only be accessible by the owner or an admin. Verify that user-scoped reads compare `getAuthUserId(ctx)` against the path param, not just check for a valid JWT.

---

## Section 3 — Input validation

**Files to read:**
- `index.ts` (the `customizeAjv` and `validationFail` handler)
- `openapi.yml` (schema definitions in `components/schemas`)
- Each `*HttpHandlers.ts` that reads `req.body` or `ctx.request.params`

**What to check:**

1. **Schema coverage** — For every `POST` and `PATCH` operation, confirm that `openapi.yml` defines a `requestBody` with a `$ref` pointing to a schema. An operation with no `requestBody` schema means openapi-backend passes the body unvalidated to the handler.

2. **Required fields** — For each `*Input` schema, check that every non-nullable field in the Prisma model appears in the `required` array. A field missing from `required` is optional in the OpenAPI schema even if it is mandatory in the DB, causing a possible null write.

3. **Path parameter types** — Every `{id}` parameter should be `type: string`. Untyped path params are not validated by openapi-backend and could allow empty strings or malformed IDs to reach Prisma.

4. **`validationFail` error verbosity** — `res.status(400).json({ err: c.validation.errors })` returns the raw Ajv error array. This reveals schema internals (field names, patterns, formats) to the caller. Assess whether this is acceptable for your threat model.

5. **Unhandled `req.body` reads** — Search for any handler that reads directly from `req.body` without relying on validated fields from `ctx.request.body`. openapi-backend populates `ctx.request.body` after validation; handlers that read `req.body` bypass this.

   ```bash
   grep -rn "req\.body" backend/src --include="*.ts"
   ```

---

## Section 4 — Prisma query safety

**Files to read:**
- Every `src/*/infrastructure/Prisma*Repository.ts`
- `utils/prismaClient.ts`

**What to check:**

1. **Explicit `select` clauses** — Every `findMany`, `findUnique`, `create`, and `update` call should include a `select` object listing only domain fields. Without `select`, Prisma returns all columns including any added later — and for users, potentially the password hash. Run:

   ```bash
   grep -rn "prisma\." backend/src --include="*.ts" -A3 | grep -v "select"
   ```

   Flag any query that omits `select`.

2. **Password hash exposure** — `PrismaUserRepository` likely has a `findByEmailWithPassword` method that intentionally returns the password hash. Verify it is only called from `AuthUseCases.login` and nowhere else (search for callers).

   ```bash
   grep -rn "findByEmailWithPassword\|password" backend/src --include="*.ts"
   ```

3. **Raw queries** — Check for `prisma.$queryRaw`, `prisma.$executeRaw`, or template literals used with Prisma. If present, verify parameterisation — raw string interpolation is a NoSQL injection vector.

   ```bash
   grep -rn "\$queryRaw\|\$executeRaw" backend/src --include="*.ts"
   ```

4. **ObjectId validation** — Prisma with MongoDB requires a 24-hex-character ObjectId for `@db.ObjectId` fields. Passing an arbitrary string (e.g., `"../../etc/passwd"`) to `findUnique` will cause a Prisma validation error, not a security breach, but the error message may leak schema details. Verify that 404 handlers catch `PrismaClientKnownRequestError` alongside domain errors.

5. **Unbounded queries** — Any `findMany` without `take` could return the entire collection. Verify all list queries use `PaginationOptions`.

---

## Section 5 — Secrets and environment handling

**Files to read:**
- `backend/.env.sample`
- `backend/.env` (if readable — do not print its contents; note any weak values)
- `JwtAuthService.ts`
- `index.ts`
- `backend/.gitignore`

**What to check:**

1. **`.env` in `.gitignore`** — Confirm `backend/.env` is excluded from version control.

   ```bash
   grep "\.env" backend/.gitignore
   ```

2. **Weak sample values** — `.env.sample` uses `JWT_SECRET=mySecret`. If a developer copies it as-is, the production secret is known. The sample should use a placeholder like `JWT_SECRET=REPLACE_ME_WITH_A_64_CHAR_RANDOM_STRING`.

3. **Missing startup validation** — `process.env.JWT_SECRET as string` and `process.env.DATABASE_URL` are used without checking for `undefined`. If either is missing, the app starts and fails on the first request. A startup guard (`if (!process.env.JWT_SECRET) throw new Error(...)`) should run before `api.init()`.

4. **`CRYPT_SALT` env var** — `.env.sample` defines `CRYPT_SALT=8`. Verify whether it is actually read anywhere; if not, it is dead config. If it is read, confirm the salt rounds are adequate (minimum 10 for bcrypt).

5. **CORS wildcard fallback** — `process.env.FRONTEND_URL ?? '*'` allows all origins when the env var is unset. In production, an unset `FRONTEND_URL` would make CORS fully permissive.

6. **`dotenv.config()` placement** — `dotenv.config()` is called after several imports. If any module reads `process.env` at import time (e.g., a singleton that runs in module scope), it may read `undefined`. Verify the call order relative to `JwtAuthService` and `prismaClient` instantiation.

---

## Section 6 — Error leakage

**Files to read:**
- `index.ts` (the global error handler and `notFound`/`validationFail` handlers)
- Every `*HttpHandlers.ts`

**What to check:**

1. **Global error handler** — The catch-all middleware returns `{ status: 500, message: 'Internal server error' }` for unexpected errors, which is correct. Verify that `logger.error(err)` is the only place the raw error is output, and that it is never serialised into the response.

2. **`notFound` response leakage** — The 404 handler returns `{ err, operation, status, path, method }`. `operation`, `path`, and `method` are internal routing details. Evaluate whether exposing them aids attackers in mapping the API surface.

3. **`validationFail` Ajv errors** — Raw Ajv errors include `instancePath`, `schemaPath`, `params`, and `message`. This is equivalent to returning an internal schema dump on every bad request. Consider mapping to a user-facing message instead.

4. **Domain error messages** — Error constructors like `new MatchNotFoundError(id)` embed the `id` in `err.message`. If a handler accidentally does `res.json({ message: err.message })` instead of a generic message, it confirms resource IDs to the caller. Audit all 404 handlers in `*HttpHandlers.ts` for this pattern.

5. **Stack traces** — Search for any handler or middleware that returns `err.stack` in the response body.

   ```bash
   grep -rn "err\.stack\|error\.stack" backend/src backend/index.ts --include="*.ts"
   ```

6. **Morgan combined format** — The `combined` preset logs the `Authorization` header value (the Bearer token) in the request line. This is a token exposure in log files. Consider using the `common` or a custom format that strips the `Authorization` header.

---

## Reporting template

After completing all six sections, output the following report. Include only findings that actually exist — do not fabricate issues that were not found.

```
## Security Audit Report — backend/

### CRITICAL
Issues that allow unauthenticated access to privileged operations, credential exposure,
or direct secret compromise in production.

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| C1 | ... | ... | ... | ... |

### HIGH
Issues that allow privilege escalation, significant information disclosure,
or foreseeable bypass of security controls.

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| H1 | ... | ... | ... | ... |

### MEDIUM
Issues that leak implementation details, have weak defaults, or create conditions
for future vulnerabilities if not addressed.

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| M1 | ... | ... | ... | ... |

### LOW
Hardening gaps, best-practice deviations, or findings that only matter under
specific threat models.

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| L1 | ... | ... | ... | ... |

### No issues found
Sections where no problems were identified:
- ...

### Suggested next steps
Ordered by impact. List at most 5 actions.
```

**Rules for the report:**
- Every row must cite a real file path and a line number (or range).
- "Fix" must be a concrete code change, not generic advice like "add validation".
- If a section is clean, list it under "No issues found" rather than omitting it.
- Do not report theoretical issues that require attacker control of the codebase itself.
