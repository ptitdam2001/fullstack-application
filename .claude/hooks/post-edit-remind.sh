#!/bin/bash
# Post-edit reminder hook — surfaces forgotten follow-up steps after file edits.
# Receives tool use JSON on stdin. Outputs reminders to stdout (shown to Claude).
# Exit 0 always — this hook informs, never blocks.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    ti = d.get('tool_input', {})
    print(ti.get('file_path', ''))
except Exception:
    pass
" 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

REMINDERS=()

# Design system source → rebuild required
if echo "$FILE_PATH" | grep -q "frontend/design-system/src/"; then
  REMINDERS+=("REMINDER: design-system file modified. Rebuild before testing in web app: pnpm --filter @repo/design-system build (then restart Vite). If change still not visible: rm -rf frontend/web-application/node_modules/.vite")
fi

# Prisma schema → generate:prisma required
if echo "$FILE_PATH" | grep -q "prisma/schema.prisma"; then
  REMINDERS+=("REMINDER: prisma/schema.prisma modified. Regenerate the Prisma client now: pnpm generate:prisma (from backend/). Skip this and you'll get 500s or stale type errors.")
fi

# openapi.yml → gen:sdk + Bruno sync required
if echo "$FILE_PATH" | grep -q "openapi.yml"; then
  REMINDERS+=("REMINDER: openapi.yml modified. Two follow-ups required: (1) pnpm --filter application-material gen:sdk — regenerates frontend SDK types. (2) Update Bruno collection in backend/bruno/ — add/remove/edit .bru files to match route changes.")
fi

# .env (not .env.sample) → update .env.sample
if echo "$FILE_PATH" | grep -qE "\.env$" && ! echo "$FILE_PATH" | grep -q "sample"; then
  REMINDERS+=("REMINDER: .env modified. If you added or removed variables, update .env.sample to match (keep placeholders, no real secrets).")
fi

# web-application file with direct react-aria import (check new_string)
if echo "$FILE_PATH" | grep -q "frontend/web-application/src/"; then
  NEW_CONTENT=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('new_string', ''))
except Exception:
    pass
" 2>/dev/null)
  if echo "$NEW_CONTENT" | grep -q "from 'react-aria-components'"; then
    REMINDERS+=("WARNING: web-application must NEVER import from 'react-aria-components' directly. Import from '@repo/design-system' instead. The design system re-exports all react-aria primitives needed.")
  fi
fi

if [ ${#REMINDERS[@]} -gt 0 ]; then
  echo ""
  for r in "${REMINDERS[@]}"; do
    echo "⚠️  $r"
  done
  echo ""
fi

exit 0
