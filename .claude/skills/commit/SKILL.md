# Commit Skill

Group changes into atomic, concern-based commits (security, refactor, tests, docs).

## Before committing

1. Run relevant tests based on changed files:
   - Backend changes → `cd backend && pnpm vitest run`
   - Frontend changes → `cd frontend/web-application && pnpm test`
   - Both → run both
2. Run type-check on changed packages:
   - Backend → `cd backend && pnpm check:type`
   - Frontend → `cd frontend/web-application && pnpm check:types`
3. If tests or types fail, fix before committing.

## Committing

- Stage files by concern, not all at once.
- Use conventional commit format (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`).
- Use `git cz` for interactive commit or `git commit -m "type(scope): message"`.
- Keep subject ≤50 chars, body only when "why" isn't obvious.

## After committing

- Push to main only after user confirmation.
