---
name: rebuild-ds
description: Reminds when to rebuild @repo/design-system and clear Vite cache after modifying design system source files. Trigger when design-system files were edited and the consuming app needs to reflect changes, or when debugging "my change isn't showing up" in the web app.
---

# Rebuild Design System

Use when you've modified any file under `frontend/design-system/src/` and need the web app (`application-material`) to pick up the change.

---

## Quick rebuild (normal mode)

```bash
pnpm --filter @repo/design-system build
```

Then restart the Vite dev server. No cache clear needed unless symptoms persist.

---

## Full reset (change still not picked up)

```bash
pnpm --filter @repo/design-system build
rm -rf frontend/web-application/node_modules/.vite
```

Then restart the Vite dev server. This forces Vite to re-bundle `@repo/design-system` from the new dist.

---

## Root cause of stale cache

`node_modules/.vite/deps/@repo_design-system.js` is a pre-bundled snapshot. Vite invalidates it on version bump or config change — not on dist file change. So even after a clean `build`, Vite may serve the old bundle. Deleting the dep cache forces a fresh pre-bundle on next server start.

---

## Dev mode shortcut (heavy design-system iteration)

If you're actively iterating on the design system, add this alias to `frontend/web-application/vite.config.ts` so Vite compiles TS source directly (no rebuild, HMR works):

```ts
resolve: {
  alias: {
    '@repo/design-system': path.resolve(__dirname, '../design-system/src/index.ts'),
  },
}
```

Remove the alias before committing — production always uses the built dist.

---

## Decision tree

```
Modified design-system file?
  └─ YES → pnpm --filter @repo/design-system build
       └─ Change still not visible?
            └─ YES → rm -rf frontend/web-application/node_modules/.vite → restart Vite
                 └─ Still broken? → Investigate code
```
