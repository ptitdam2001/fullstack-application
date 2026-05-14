# Friction Audit — 2026-05-14

Weekly recurring job. Diff against this file on next run to detect new patterns or regressions.

---

## Methodology

Source: Claude Code session transcripts from `.claude/projects/` (all 6 project subdirectories, ~60MB).
Signal extraction: grep for friction keywords (retry/forgot/oubli/encore/stale/again/rebuild/hover/plays/scope/hardcode/i18n) + assistant "root cause" sections + user correction messages.
Ranking: estimated minutes lost per occurrence × frequency across sessions.

---

## Top 10 Friction Patterns

| Rank | Pattern | Occurrences (30d) | Est. time lost / hit | Total |
|------|---------|--------------------|----------------------|-------|
| 1 | Stale Vite cache / DS rebuild forgotten | 4+ | 20–30 min | ~120 min |
| 2 | `userEvent.hover()` silent fail with react-aria | 3 | 15–20 min | ~52 min |
| 3 | Tailwind v4 `data-*:` vs v3 `data-[*]:` syntax | 2 | 20–30 min | ~50 min |
| 4 | Stories missing play functions | 3 | 10–15 min | ~37 min |
| 5 | Bruno collection not synced after openapi.yml | 2 | 10–15 min | ~25 min |
| 6 | Stale Prisma client after schema change | 2 | 15 min | ~30 min |
| 7 | Direct `react-aria-components` import in web-application | 2 | 10 min | ~20 min |
| 8 | `.env.sample` not updated with new vars | 2 | 5 min | ~10 min |
| 9 | Hardcoded i18n strings (no FormattedMessage) | 2 | 10 min | ~20 min |
| 10 | Frontend SDK stale after openapi.yml change | 1 | 15 min | ~15 min |

**Total estimated time lost (30d): ~379 min (~6.3h)**

---

## Per-pattern detail

### 1. Stale Vite cache / DS rebuild forgotten

**Root cause**: `node_modules/.vite/deps/@repo_design-system.js` is a pre-bundled snapshot. Vite doesn't invalidate it when `dist/` changes — only on version bump or config change. After `pnpm build`, the old bundle is still served until the cache is cleared.

**Evidence**: Multiple sessions opened with "Rebuild design-system puis vérifier" after investigation. Transcript confirms root cause was found: "cache Vite périmé (`node_modules/.vite/deps/@repo_design-system.js` = 456KB, vieux shadcn Button) vs `dist/index.js` = 729KB (react-aria Button)."

**Fixes applied**:
- Updated `.claude/skills/rebuild-ds/SKILL.md` with decision tree and root cause explanation
- Post-edit hook now fires reminder when `frontend/design-system/src/` files are edited
- CLAUDE.md Known Pitfalls #1

---

### 2. `userEvent.hover()` silent fail with react-aria

**Root cause**: react-aria's `useHover` hook checks `event.currentTarget` and bails silently in jsdom when it's null. `userEvent.hover()` dispatches the right DOM events but not the synthetic pointer events react-aria listens to. Tests pass vacuously — the hover state is never set.

**Evidence**: Tooltip migration session noted explicitly: "Stories avec plays focus-based (`userEvent.tab()`) — `userEvent.hover()` ne déclenche pas react-aria useHover en test (event.currentTarget=null)."

**Fixes applied**:
- New skill `.claude/skills/react-aria-testing/SKILL.md`
- `design-system-component/SKILL.md` updated with interaction table
- CLAUDE.md Known Pitfalls #2

---

### 3. Tailwind v4 `data-*:` vs v3 `data-[*]:` syntax

**Root cause**: Tailwind v4 changed the arbitrary-value syntax. `data-[hovered]:bg-accent` (v3) silently produces no CSS in v4. `data-hovered:bg-accent` is the correct v4 form. Dark mode and state styles appear broken with no error.

**Evidence**: List component session: "Used Tailwind v3 `data-[focused]:` syntax instead of v4 `data-focused:` — styles weren't applying at all."

**Fixes applied**:
- `design-system-component/SKILL.md` — added explicit v3/v4 comparison table with ❌/✅
- `react-aria-testing/SKILL.md` — data attribute reference table
- CLAUDE.md Known Pitfalls #3

---

### 4. Stories missing play functions

**Root cause**: Interactive components shipped with stories but no `play` function. Behavior (open/close, keyboard nav, focus) untested in Storybook.

**Evidence**: User explicitly: "je trouve que tu ne fais pas les corrections serieusement, il y a beaucoup d'oublis et les stories ne fonctionnement plus. Il faut absolument que tu ajoutes des tests dans @design-system/ et en particuliers des plays sur les stories, ça nous evitera des erreurs."

**Fixes applied**:
- `design-system-component/SKILL.md` — plays marked NON NÉGOCIABLES with explicit rule
- `react-aria-testing/SKILL.md` — play function template + interaction table
- CLAUDE.md Known Pitfalls #4

---

### 5. Bruno collection not synced after openapi.yml

**Root cause**: openapi.yml edited (new routes, param changes), but `.bru` files in `backend/bruno/` not updated. Manual API testing breaks silently.

**Evidence**: Memory `feedback_bruno_sync.md` exists but no enforcement. Backend session showed `.bru` files created as a formal step in the domain scaffold skill.

**Fixes applied**:
- New skill `.claude/skills/openapi-sync/SKILL.md` with explicit Bruno table
- Post-edit hook fires reminder when `openapi.yml` is edited
- CLAUDE.md Known Pitfalls #5

---

### 6. Stale Prisma client after schema change

**Root cause**: `prisma/schema.prisma` updated but `pnpm generate:prisma` not run. Prisma client still typed against old schema → runtime 500s or TS errors.

**Evidence**: CLAUDE.md already documents this. Memory `feedback_debug_checklist.md` item #3. Still recurs.

**Fixes applied**:
- Post-edit hook fires `REMINDER: prisma/schema.prisma modified. Run pnpm generate:prisma.` on every schema edit
- CLAUDE.md Known Pitfalls #6

---

### 7. Direct `react-aria-components` import in web-application

**Root cause**: Reflex to import primitives directly from `react-aria-components` in web-application code. Breaks the abstraction layer and risks version drift.

**Evidence**: User correction: "attention web-application n'utilise JAMAIS react-aria-components juste design-system." Occurred at least twice in DS migration sessions.

**Fixes applied**:
- Post-edit hook checks `new_string` for `from 'react-aria-components'` in web-application files → warning
- CLAUDE.md Known Pitfalls #7

---

### 8. `.env.sample` not updated with new vars

**Root cause**: `.env` gets a new variable for a feature, but `.env.sample` is not updated. New developers (or fresh installs) miss the variable.

**Evidence**: Memory `feedback_env_sample.md` (referenced in MEMORY.md but file was missing). Backend transcript shows `.env.sample` was modified in a security session alongside a new `FRONTEND_URL` var.

**Fixes applied**:
- Post-edit hook fires reminder when `.env` (not `.env.sample`) is edited
- CLAUDE.md Known Pitfalls #8
- Recreated missing `feedback_env_sample.md` memory

---

### 9. Hardcoded i18n strings

**Root cause**: User-visible text written as string literals in JSX instead of going through react-intl. Caught during code review.

**Evidence**: CLAUDE.md has the rule but violations still occur. `en.json` / `fr.json` referenced in web-application sessions.

**Fixes applied**:
- CLAUDE.md Known Pitfalls #9 (reinforces existing rule with explicit call-out)
- Note: a pre-edit ESLint rule enforcing `no-literal-string` would eliminate this entirely — tracked as follow-up

---

### 10. Frontend SDK stale after openapi.yml

**Root cause**: openapi.yml changed, `pnpm --filter application-material gen:sdk` not run. Frontend TS types and react-query hooks don't reflect new API shape.

**Evidence**: orval/SDK references in web-application sessions; gen:sdk appears as a manual step in dashboard coach session.

**Fixes applied**:
- New skill `openapi-sync/SKILL.md` — step 1 is gen:sdk
- Post-edit hook reminds about gen:sdk when openapi.yml is edited
- CLAUDE.md Known Pitfalls #10

---

## Files changed in this PR

| File | Change |
|------|--------|
| `CLAUDE.md` | Added `## Known Pitfalls` table (10 rules) + 3 new skills in Project Skills table |
| `.claude/skills/rebuild-ds/SKILL.md` | Expanded with root cause, decision tree, dev-mode alias |
| `.claude/skills/react-aria-testing/SKILL.md` | NEW — react-aria test patterns, userEvent.hover warning, plays template |
| `.claude/skills/openapi-sync/SKILL.md` | NEW — gen:sdk + Bruno + nullability sync checklist |
| `.claude/skills/design-system-component/SKILL.md` | Removed asChild/Slot (deleted from DS), added v4 data syntax table, play function rules, interaction table |
| `.claude/hooks/post-edit-remind.sh` | NEW — post-edit hook covering pitfalls 1, 5, 6, 7, 8 |
| `.claude/settings.json` | Wired post-edit hook, consolidated from fragmented inline commands |

---

## Follow-ups (not in this PR)

- ESLint `no-literal-string` rule to catch pitfall #9 statically
- Storybook CI step that runs `play` functions and fails on error
- `pnpm --filter application-material gen:sdk` in the openapi.yml post-edit hook (currently reminder only)

---

## Next run instructions

On next weekly run (week of 2026-05-21):
1. Check if any pitfall from this list recurred → increment occurrence count
2. Check if new patterns emerged from new transcripts
3. Diff this file against current state to measure regression
4. Update occurrence counts + add new patterns if rank > 10 min/week

```bash
# Find new transcripts since last audit
find /Users/suhard/.claude/projects/ -name "*.jsonl" -newer .claude/friction-audit-2026-05-14.md
```
