---
name: openapi-sync
description: Checklist to run after modifying backend/openapi.yml. Covers regenerating the frontend SDK (orval), updating the Bruno collection, and verifying nullability sync between openapi.yml and prisma/schema.prisma. Trigger after any openapi.yml change: new route, new field, changed schema, security change.
---

# OpenAPI Sync Checklist

After every change to `backend/openapi.yml`, run through this checklist. Skipping steps causes stale types, missing Bruno requests, and subtle nullability bugs.

---

## Step 1 — Regenerate frontend SDK

```bash
pnpm --filter application-material gen:sdk
```

This runs `orval` and regenerates:
- `frontend/web-application/src/sdk/generated/` — typed axios+react-query hooks
- `frontend/web-application/src/sdk/generated/*.zod.ts` — Zod schemas

**When to skip**: you only changed a description or example (no schema change). If in doubt, regenerate.

---

## Step 2 — Update Bruno collection

The Bruno collection at `backend/bruno/` must mirror the OpenAPI spec.

| Change in openapi.yml | Bruno action |
|-----------------------|--------------|
| New route added | Create `backend/bruno/<domain>/<operation>.bru` |
| Route removed | Delete the corresponding `.bru` file |
| New path parameter | Update `{{paramName}}` in the `.bru` file |
| New body field | Update the `body:json` block in the `.bru` file |
| New env variable needed | Add to `backend/bruno/environments/local.bru` inside `vars {}` |

---

## Step 3 — Nullability sync check

OpenAPI `required` arrays and Prisma `schema.prisma` nullability must agree. Check the changed schema against the rule:

| Field nullable? | Prisma | OpenAPI |
|-----------------|--------|---------|
| Yes | `Type?` | NOT in `required` |
| No | `Type` | IN `required` |

A mismatch causes runtime validation errors (`400` from openapi-backend) or missing required fields in the Prisma create/update.

---

## Step 4 — Security decoration

- Global rule: `jwtAuth` applies to all routes unless overridden
- Public endpoint (no auth): add `security: []` explicitly on the operation
- No `security` key = JWT validated, no role check

---

## Quick reference

```bash
# Regenerate SDK
pnpm --filter application-material gen:sdk

# Type-check frontend after SDK regen
pnpm --filter application-material check:types

# Start Bruno to test new routes
# (Bruno is a desktop app — open bruno/ folder from Bruno GUI)
```
