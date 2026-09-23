---
name: ship-feature
description: Opens a PR against main for a completed feature branch — generates the description from the API/frontend diff (routes added in openapi.yml, new frontend modules/files) and creates it via gh pr create. Trigger on "créer une PR", "ouvrir une PR", "ship la feature", "terminer la feature", "open a PR", "ship this feature".
---

# Ship Feature

Standard flow for this repo: feature branch → PR against `main` (no direct pushes to `main`).

## Step 0 — Branch check

```bash
git branch --show-current
```

- If on `main`: stop. Tell the user to create a branch first: `git checkout -b <type>/<description>`, where `<type>` is one of `feature`, `fix`, `chore`, `refactor`, `docs`, `test` (e.g. `feature/coach-dashboard`, `fix/login-redirect`).
- If already on a properly named branch, continue.

## Step 1 — Pre-flight checks

Before opening the PR, verify the branch is shippable:

1. `git status --short` — no uncommitted changes. If there are any, stop and ask whether to commit them (use the `commit` skill).
2. Tests pass on touched packages:
   - Backend touched → `cd backend && pnpm vitest run`
   - Frontend touched → `cd frontend/web-application && pnpm test`
3. Type-check on touched packages:
   - Backend → `cd backend && pnpm check:type`
   - Frontend → `cd frontend/web-application && pnpm check:types`
4. If `backend/openapi.yml` changed, confirm the `openapi-sync` skill checklist was already run (SDK regen, Bruno, nullability). If not, run it first.

Do not proceed to Step 2 if any check fails — fix or ask the user first.

## Step 2 — Diff against main

```bash
git fetch origin main
git diff origin/main...HEAD --stat
```

Use this to scope what changed. Then gather the two PR sections below.

### API routes (only if `backend/openapi.yml` changed)

```bash
git diff origin/main...HEAD -- backend/openapi.yml
```

Read the diff and extract every **added or modified** operation: HTTP method, path, `operationId`, and a one-line description (from the spec's `summary`/`description` field, or infer from the operationId). Build a table:

```markdown
## API Routes

| Method | Path                  | operationId        | Description                 |
| ------ | --------------------- | ------------------ | --------------------------- |
| POST   | /championships/{id}/… | resumeChampionship | Resume a draft championship |
```

Skip this section entirely if `openapi.yml` didn't change.

### Frontend changes (only if `frontend/` changed)

```bash
git diff origin/main...HEAD --stat -- frontend/web-application/src frontend/design-system/src
```

Group changed/added files by feature module (`src/<Feature>/...`) or design-system component. Summarize per module, not file-by-file:

```markdown
## Frontend

- **Championship**: new wizard step 5 (`ui/WizardStepReview.tsx`), `useChampionshipReview` application hook
- **Design system**: new `Stepper` component
```

Skip this section entirely if nothing under `frontend/` changed.

## Step 3 — Build the PR description

Template (omit any section with nothing to report):

```markdown
## Summary

- <1-3 bullets, business-level, why not just what>

## API Routes

<table from Step 2, or omit>

## Frontend

<list from Step 2, or omit>

## Test plan

- [ ] <manual verification steps, or "pnpm vitest run" / "pnpm test" if that's sufficient>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Title: short, imperative, Conventional-Commits-flavored (e.g. `feat(championship): add wizard review step`) — under 70 chars.

## Step 4 — Pick labels

```bash
gh label list --repo <owner>/<repo>
```

Match the PR content against the repo's **existing** labels only (e.g. `backend`, `frontend`, `documentation`, `devops`, `bug`, `enhancement`). Never invent or create a new label — if nothing fits, skip labeling.

## Step 5 — Confirm, then create

Show the title + description + chosen labels to the user. Once confirmed:

```bash
git push -u origin <branch>
gh pr create --base main --title "<title>" --body "$(cat <<'EOF'
<description>
EOF
)" --assignee "@me" --label "<label1>" --label "<label2>"
```

Return the PR URL.
