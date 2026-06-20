# E2E — Interactive User-Flow Verification

Verify key user flows in a running app using the Playwright MCP browser tools.
Use when: "verify the app", "check user flows", "e2e check", "test in browser", "run e2e via MCP".

## Prerequisites

Determine which stack is running and set the base URL:

1. **Dev stack** (default): app at `http://localhost:5173`, backend at `http://localhost:4000`
   - Start if needed: `pnpm --filter application-material dev` (with `VITE_MOCKED_BACKEND=false` for real backend)
2. **Test stack** (Docker): app at `http://localhost:3001`, backend at `http://localhost:4001`
   - Start if needed: `make stack-test-up`

## Flows to verify

Run each flow sequentially. Report pass/fail per flow.

### 1. Auth — Login

1. Navigate to `{baseURL}/auth/signin`
2. Verify login form is visible (email + password inputs, submit button)
3. Fill credentials and submit (dev: use seed user from `scripts/seed/`)
4. Verify redirect to `/app` (dashboard)
5. Take screenshot

### 2. Auth — Protected route guard

1. Open a new page (no auth)
2. Navigate to `{baseURL}/app`
3. Verify redirect to `/auth/signin`

### 3. Navigation — Core pages load

Visit each page, verify it loads without error:

| Page        | URL                | Success indicator                  |
| ----------- | ------------------ | ---------------------------------- |
| Dashboard   | `/app`             | URL matches `/app`                 |
| Teams       | `/app/team/list`   | `[data-testid="TeamList"]` visible |
| Games       | `/app/games`       | URL matches `/app/games`           |
| Calendar    | `/app/calendar`    | URL matches `/app/calendar`        |
| Admin Users | `/app/admin/users` | URL matches `/admin/users`         |

Take screenshot after each page load.

### 4. Teams — CRUD flow

1. Navigate to `/app/team/list`
2. Verify at least one team visible (seed data: "Equipe Test")
3. Navigate to `/app/team/list/create`
4. Verify dialog/form appears
5. Fill team name with `E2E-{timestamp}`
6. Submit form
7. Navigate back to `/app/team/list`
8. Verify new team appears in list
9. Take screenshot

### 5. Auth — Logout

1. Navigate to `/auth/logout`
2. Verify redirect to `/auth/signin`

## Reporting

After all flows, output a summary table:

```
| # | Flow            | Status | Notes        |
|---|-----------------|--------|--------------|
| 1 | Login           | PASS   |              |
| 2 | Route guard     | PASS   |              |
| 3 | Navigation      | FAIL   | Calendar 404 |
| 4 | Teams CRUD      | PASS   |              |
| 5 | Logout          | PASS   |              |
```

For failures: include screenshot path, console errors, and what was expected vs actual.

## Tools to use

- `mcp__plugin_playwright_playwright__browser_navigate` — navigate pages
- `mcp__plugin_playwright_playwright__browser_snapshot` — get page accessibility tree
- `mcp__plugin_playwright_playwright__browser_take_screenshot` — capture visual state
- `mcp__plugin_playwright_playwright__browser_click` — click elements
- `mcp__plugin_playwright_playwright__browser_fill_form` — fill inputs
- `mcp__plugin_playwright_playwright__browser_console_messages` — check for JS errors
- `mcp__plugin_playwright_playwright__browser_wait_for` — wait for elements/navigation
