---
name: create-backend-domain
description: Scaffolds a complete hexagonal architecture domain for the backend of this project (domain / ports / application / infrastructure layers + Vitest unit tests + OpenAPI spec). Use this skill whenever the user wants to add a new domain, entity, or feature to the backend: "create domain X", "add X domain", "scaffold X", "migrate X to hexagonal", "créer un domaine", "ajouter un domaine", "nouveau domaine", "scaffolder X". Always invoke this skill before writing any backend domain code from scratch.
---

# Create Backend Domain

This skill scaffolds a complete hexagonal architecture backend domain for the project at `/Users/suhard/Documents/Development/fullstack-application/backend/`.

Stack: Node.js + TypeScript (ESM strict), Express, openapi-backend, Prisma + MongoDB, Vitest.

---

## Sources of truth

This project has **two independent sources of truth** that must both be updated for every new domain:

| File | Owns |
|------|------|
| `backend/prisma/schema.prisma` | Database structure — models, embedded types, relations, nullability |
| `backend/openapi.yml` | API contract — routes, request/response schemas, required fields, security |

They are never derived from each other — both must be updated manually and deliberately. The domain code and Prisma client are generated **from** these two files, never the reverse.

---

## Step 1 — Ask for the domain name

Ask: **"Quel est le nom du domaine ?"** (e.g. `Match`, `Championship`, `Standing`)

Derive from the answer:
- **Folder**: lowercase (`match`, `championship`)
- **Entity**: PascalCase (`Match`, `Championship`)
- **Variable**: camelCase (`match`, `championship`) — use this everywhere, never the generic word "entity"
- **Prisma accessor**: camelCase (`prisma.match`, `prisma.championship`)

---

## Step 2 — Ask for entity fields

Offer 3 options:

**(a) Manuel** — the user describes fields inline, e.g. `name: string`, `date?: Date`, `status: string`

**(b) JSON** — the user provides a sample JSON object

**(c) Prisma schema** — read `backend/prisma/schema.prisma`, find the matching model, and parse it automatically.
- Map types: `String→string`, `Int→number`, `Float→number`, `Boolean→boolean`, `DateTime→Date`
- Nullable fields (`String?`) → `string | null` (never `?: string` — always use `Type | null` for nullable domain fields)
- Skip: relation fields (those referencing another model), the `@id` field (always added manually as `id: string`)
- Keep: all scalar fields including optional ones

Always add `id: string` as the first field regardless of source.

---

## Step 3 — Ask about authentication

Ask: **"Les endpoints de ce domaine nécessitent-ils une authentification ?"**

Context: `openapi.yml` applies `jwtAuth` globally to all endpoints. To make an endpoint public, add `security: []` on that operation.

- **Non** → all endpoints get `security: []` in the spec; no `requireRoles` in handlers
- **Oui** → ask which role(s) apply per operation type:
  - Read list + read single: often public or light guard
  - Create / update / delete: usually `Role.ADMIN` or `Role.ADMIN, Role.COACH`
  - Authenticated but no role restriction → omit `security: []` from spec, omit `requireRoles` from handler (JWT validated automatically)

Note: `requireRoles` throws `ForbiddenError`/`UnauthorizedError` — these propagate uncaught and should not be caught in try/catch blocks.

---

## Step 4 — Update `backend/prisma/schema.prisma`

`prisma/schema.prisma` is the **source of truth for the database structure**. Update it before generating code so that `pnpm generate:prisma` produces the correct typed client.

If the entity already has a matching Prisma model (option c in Step 2), verify that the fields are aligned and skip to Step 5.

Otherwise, add the model for the new domain:

```prisma
model <Entity> {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  field1 String
  optionalField String?
  // ... other scalar fields
}
```

Rules:
- **Always** `@id @default(auto()) @map("_id") @db.ObjectId` on the id field (MongoDB ObjectId)
- Nullable domain fields (`Type | null`) → `String?` / `Int?` / `Float?` in Prisma
- If the entity embeds a sub-object (e.g. `area`), define an embedded `type` (not a relation model) and reference it non-nullable unless the business explicitly allows absence:
  ```prisma
  type Embedded<SubEntity> {
    id     String
    field1 String
  }
  // in model:
  area Embedded<SubEntity>   // non-nullable: always present
  ```
- If the entity needs cross-collection querying (e.g. team ↔ match), add a join model with `@@map` and `@@unique`
- Use `@@map("collectionName")` when renaming an existing model to preserve the MongoDB collection name

After updating the schema, run:

```bash
pnpm generate:prisma
```

This regenerates the Prisma client and must complete before `pnpm check:type` in Step 8.

---

## Step 5 — Generate the 7 files

Use the exact entity variable name everywhere (`match`, never `item` or `entity`).

---

### 5.1 `backend/src/<domain>/domain/<Entity>.ts`

Pure TypeScript types. Zero imports — no Prisma, no Express.

```ts
export type <Entity> = {
  id: string
  fieldName: string          // required scalar
  optionalField: string | null  // nullable: always "Type | null", never "Type?"
  // ... other fields
}

export type Create<Entity>Input = Omit<<Entity>, 'id'>
export type Update<Entity>Input = Partial<Create<Entity>Input>
```

If there are auto-generated fields (`createdAt`, `updatedAt`), omit them from `Create<Entity>Input` too:
`Omit<<Entity>, 'id' | 'createdAt'>`

---

### 5.2 `backend/src/<domain>/domain/<Entity>Errors.ts`

```ts
export class <Entity>NotFoundError extends Error {
  constructor(id: string) {
    super(`<Entity> not found: ${id}`)
    this.name = '<Entity>NotFoundError'
  }
}
```

---

### 5.3 `backend/src/<domain>/ports/I<Entity>Repository.ts`

Standard CRUD interface. Pagination is mandatory for list queries.

```ts
import type { <Entity>, Create<Entity>Input, Update<Entity>Input } from '../domain/<Entity>.js'

export type PaginationOptions = { page: number; count: number }

export interface I<Entity>Repository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<<Entity>[]>
  findById(id: string): Promise<<Entity> | null>
  create(input: Create<Entity>Input): Promise<<Entity>>
  update(id: string, input: Update<Entity>Input): Promise<<Entity>>
  delete(id: string): Promise<void>
}
```

If the domain needs extra queries (e.g. filter by status), add them after `delete` with their own option types.

---

### 5.4 `backend/src/<domain>/application/<Entity>UseCases.ts`

```ts
import type { I<Entity>Repository, PaginationOptions } from '../ports/I<Entity>Repository.js'
import type { Create<Entity>Input, Update<Entity>Input } from '../domain/<Entity>.js'
import { <Entity>NotFoundError } from '../domain/<Entity>Errors.js'

export class <Entity>UseCases {
  constructor(private readonly repo: I<Entity>Repository) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions) {
    return this.repo.findAll(options)
  }

  async getById(id: string) {
    const <variable> = await this.repo.findById(id)
    if (!<variable>) throw new <Entity>NotFoundError(id)
    return <variable>
  }

  create(input: Create<Entity>Input) {
    return this.repo.create(input)
  }

  async update(id: string, input: Update<Entity>Input) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }
}
```

---

### 5.5 `backend/src/<domain>/application/<Entity>UseCases.test.ts`

One `describe` block per method. Use realistic mock values.

```ts
import { describe, it, expect, vi } from 'vitest'
import { <Entity>UseCases } from './<Entity>UseCases.js'
import type { I<Entity>Repository } from '../ports/I<Entity>Repository.js'
import { <Entity>NotFoundError } from '../domain/<Entity>Errors.js'

const mock<Entity> = { id: '<entity>-1', /* ... realistic field values ... */ }

const makeRepo = (overrides: Partial<I<Entity>Repository> = {}): I<Entity>Repository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mock<Entity>]),
  findById: vi.fn().mockResolvedValue(mock<Entity>),
  create: vi.fn().mockResolvedValue(mock<Entity>),
  update: vi.fn().mockResolvedValue({ ...mock<Entity>, /* one changed field */ }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('<Entity>UseCases.count', () => {
  it('returns the count', async () => {
    expect(await new <Entity>UseCases(makeRepo()).count()).toBe(1)
  })
})

describe('<Entity>UseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new <Entity>UseCases(makeRepo()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })
})

describe('<Entity>UseCases.getById', () => {
  it('returns entity when found', async () => {
    const result = await new <Entity>UseCases(makeRepo()).getById('<entity>-1')
    expect(result.id).toBe('<entity>-1')
  })
  it('throws <Entity>NotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new <Entity>UseCases(repo).getById('unknown')).rejects.toThrow(<Entity>NotFoundError)
  })
})

describe('<Entity>UseCases.create', () => {
  it('creates an entity', async () => {
    const repo = makeRepo()
    await new <Entity>UseCases(repo).create({ /* Create<Entity>Input fields */ })
    expect(repo.create).toHaveBeenCalledWith({ /* same input */ })
  })
})

describe('<Entity>UseCases.update', () => {
  it('updates entity when found', async () => { ... })
  it('throws <Entity>NotFoundError when not found', async () => { ... })
})

describe('<Entity>UseCases.delete', () => {
  it('deletes entity when found', async () => {
    const repo = makeRepo()
    await new <Entity>UseCases(repo).delete('<entity>-1')
    expect(repo.delete).toHaveBeenCalledWith('<entity>-1')
  })
  it('throws <Entity>NotFoundError when not found', async () => { ... })
})
```

---

### 5.6 `backend/src/<domain>/infrastructure/Prisma<Entity>Repository.ts`

Always use a `select` clause listing exactly the domain fields to avoid Prisma returning embedded arrays, relations, or internal fields.

```ts
import { prisma } from '../../../utils/prismaClient.js'
import type { I<Entity>Repository, PaginationOptions } from '../ports/I<Entity>Repository.js'
import type { <Entity>, Create<Entity>Input, Update<Entity>Input } from '../domain/<Entity>.js'

const select = { id: true, field1: true, field2: true /* all domain scalar fields */ } as const

export class Prisma<Entity>Repository implements I<Entity>Repository {
  count(): Promise<number> {
    return prisma.<entity>.count()
  }

  async findAll({ page, count }: PaginationOptions): Promise<<Entity>[]> {
    return prisma.<entity>.findMany({ skip: (page - 1) * count, take: count, select })
  }

  async findById(id: string): Promise<<Entity> | null> {
    return prisma.<entity>.findUnique({ where: { id }, select })
  }

  async create(input: Create<Entity>Input): Promise<<Entity>> {
    return prisma.<entity>.create({ data: input, select })
  }

  async update(id: string, input: Update<Entity>Input): Promise<<Entity>> {
    return prisma.<entity>.update({ where: { id }, data: input, select })
  }

  async delete(id: string): Promise<void> {
    await prisma.<entity>.delete({ where: { id } })
  }
}
```

The `select` object must match the `<Entity>` type exactly — same field names, no extras, no missing ones.

---

### 5.7 `backend/src/<domain>/infrastructure/<Entity>HttpHandlers.ts`

Handler function names **must match the `operationId` values that will be added to `openapi.yml`** in Step 6.

```ts
import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { <Entity>UseCases } from '../application/<Entity>UseCases.js'
import { Prisma<Entity>Repository } from './Prisma<Entity>Repository.js'
import { <Entity>NotFoundError } from '../domain/<Entity>Errors.js'
// Include only if some endpoints require role-based access:
import { requireRoles } from '../../auth/application/requireRoles.js'
import { Role } from '../../user/domain/User.js'

const useCases = new <Entity>UseCases(new Prisma<Entity>Repository())

export const count<Entity>s = async (_: Context, __: Request, res: Response) => {
  res.json(await useCases.count())
}

// No try/catch on getAll — findAll never throws a domain error
export const get<Entity>s = async (ctx: Context, _: Request, res: Response) => {
  // requireRoles(ctx, Role.XXX)  ← add if read requires a role
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  res.json(await useCases.getAll({ page, count }))
}

export const get<Entity> = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof <Entity>NotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const create<Entity> = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)  // adjust per auth choices
  res.status(201).json(await useCases.create(req.body))
}

export const update<Entity> = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof <Entity>NotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const remove<Entity> = async (ctx: Context, _: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof <Entity>NotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}
```

Remove `requireRoles` and its imports entirely if no auth is required.

---

## Step 6 — Update `backend/openapi.yml`

`openapi.yml` is the **source of truth for the API contract** — the backend routes and validates every request against it.

Fields declared `required` here must be non-nullable in `prisma/schema.prisma` and in the domain type. Keep the two sources in sync: if a field is optional in one, it must be optional in both.

### 6a — Add schemas in `components/schemas`

Add two schemas at the end of the `components/schemas` section:

```yaml
<Entity>Input:
  type: object
  properties:
    field1:
      type: string        # map TS types: string→string, number→integer or number, Date→string+format:date-time
    optionalField:
      type: string
      nullable: true
  required:
    - field1              # list all non-nullable fields; must match Prisma schema non-nullable fields

<Entity>:
  allOf:
    - $ref: "#/components/schemas/<Entity>Input"
    - type: object
      required:
        - id
      properties:
        id:
          type: string
          format: uuid
```

> **Nullability rule**: a field is in `required` in the OpenAPI schema if and only if it is non-nullable (`String`, not `String?`) in `prisma/schema.prisma` and non-nullable (`string`, not `string | null`) in the domain type.

### 6b — Add paths

Add the path entries before `security:`. Use the same `operationId` names as the exported handler functions.

Security rules:
- `openapi.yml` applies `jwtAuth` globally (all endpoints need auth by default)
- To make an endpoint **public**: add `security: []` on that operation
- To keep JWT validation **without role restriction**: omit `security` key entirely (global applies)

```yaml
  /<entities>:              # plural, lowercase, e.g. /matches
    get:
      operationId: get<Entity>s
      description: "Get list of <entities>"
      tags:
        - <Entity>
      # security: []        ← uncomment to make public
      parameters:
        - in: query
          name: page
          schema:
            type: integer
        - in: query
          name: count
          schema:
            type: integer
      responses:
        200:
          description: ""
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/<Entity>"

  /<entities>/count:
    get:
      operationId: count<Entity>s
      description: "Count <entities>"
      tags:
        - <Entity>
      responses:
        200:
          description: ""
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Count"

  /<entity>:               # singular, lowercase, e.g. /match
    post:
      operationId: create<Entity>
      description: "Create a <entity>"
      tags:
        - <Entity>
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/<Entity>Input"
      responses:
        201:
          description: ""
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/<Entity>"

  /<entity>/{id}:
    get:
      operationId: get<Entity>
      description: "Get a <entity>"
      tags:
        - <Entity>
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        200:
          description: ""
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/<Entity>"
        404:
          description: "Not found"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorOutput"
    patch:
      operationId: update<Entity>
      description: "Update a <entity>"
      tags:
        - <Entity>
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/<Entity>Input"
      responses:
        200:
          description: ""
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/<Entity>"
        404:
          description: "Not found"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorOutput"
    delete:
      operationId: remove<Entity>
      description: "Delete a <entity>"
      tags:
        - <Entity>
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        204:
          description: "Deleted"
        404:
          description: "Not found"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorOutput"
```

---

## Step 7 — Update `backend/index.ts`

Add alongside the other domain imports:
```ts
import * as <domain>Handlers from './src/<domain>/infrastructure/<Entity>HttpHandlers'
```

Spread in the handlers object:
```ts
...<domain>Handlers,
```

---

## Step 8 — Add Bruno requests

The Bruno collection lives in `backend/bruno/`. Create a folder for the new domain and add one `.bru` file per route.

### 8a — Create `backend/bruno/<entities>/` and add the 6 files

**get-<entities>.bru** (seq: 1)
```
meta {
  name: Get <Entity>s
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/<entities>
  body: none
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

params:query {
  page: 1
  count: 20
}
```

**count-<entities>.bru** (seq: 2)
```
meta {
  name: Count <Entity>s
  type: http
  seq: 2
}

get {
  url: {{baseUrl}}/<entities>/count
  body: none
  auth: bearer
}

auth:bearer {
  token: {{token}}
}
```

**create-<entity>.bru** (seq: 3) — body fields derived from `Create<Entity>Input`
```
meta {
  name: Create <Entity>
  type: http
  seq: 3
}

post {
  url: {{baseUrl}}/<entity>
  body: json
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

body:json {
  {
    // all Create<Entity>Input fields with realistic sample values
  }
}

script:post-response {
  if (res.status === 201 && res.body.id) {
    bru.setVar("<entity>Id", res.body.id);
  }
}
```

**get-<entity>.bru** (seq: 4)
```
meta {
  name: Get <Entity>
  type: http
  seq: 4
}

get {
  url: {{baseUrl}}/<entity>/{{<entity>Id}}
  body: none
  auth: bearer
}

auth:bearer {
  token: {{token}}
}
```

**edit-<entity>.bru** (seq: 5) — partial body, one or two fields only
```
meta {
  name: Edit <Entity>
  type: http
  seq: 5
}

patch {
  url: {{baseUrl}}/<entity>/{{<entity>Id}}
  body: json
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

body:json {
  {
    // subset of Update<Entity>Input fields
  }
}
```

**remove-<entity>.bru** (seq: 6)
```
meta {
  name: Remove <Entity>
  type: http
  seq: 6
}

delete {
  url: {{baseUrl}}/<entity>/{{<entity>Id}}
  body: none
  auth: bearer
}

auth:bearer {
  token: {{token}}
}
```

### 8b — Add the `<entity>Id` variable to the environment

In `backend/bruno/environments/local.bru`, add a line inside `vars {}`:
```
  <entity>Id:
```

### Rules

- `auth: none` only for public endpoints (those with `security: []` in OpenAPI)
- The `script:post-response` on create uses `res.body.id` — adjust if the API returns the id under a different key
- Use the exact plural/singular forms matching the OpenAPI paths (`/<entities>`, `/<entity>/{id}`)
- If an endpoint requires a role (ADMIN only), leave `auth: bearer` — the token variable already carries the right role from login

---

## Step 9 — Verify

Run from `backend/` and report results:

```bash
pnpm check:type
pnpm vitest run src/<domain>/application/<Entity>UseCases.test.ts
```

Fix any TypeScript errors or failing tests before reporting completion. Common issues:
- Missing `.js` extension on imports → add it
- `select` object mismatch with domain type → align field names
- `operationId` in spec doesn't match handler export name → rename one to match
- `prisma.<entity>` not found → `pnpm generate:prisma` was not run after updating the schema
- Bruno `{{<entity>Id}}` not resolving → verify the `script:post-response` key matches the actual response field

---

## Conventions (never deviate)

| Rule | Value |
|------|-------|
| Import extensions | Always `.js` (ESM strict) |
| prismaClient path | `'../../../utils/prismaClient.js'` |
| requireRoles path | `'../../auth/application/requireRoles.js'` |
| Role enum path | `'../../user/domain/User.js'` |
| Nullable domain fields | `Type \| null` — never `Type?` |
| Tests | `vi.fn().mockResolvedValue(...)` — no real DB, no real Express |
| Pagination | Always `PaginationOptions = { page: number; count: number }` in every `findAll` |
| Prisma select | Always explicit — never let Prisma return relation or embedded fields |
| OpenAPI security | Global JWT by default; `security: []` to make public; no key = JWT validated, no role check |
| Nullability sync | A field non-nullable in Prisma → non-nullable in domain type → in `required` in OpenAPI |
