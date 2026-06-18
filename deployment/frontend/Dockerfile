# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:lts-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app/frontend

# Copy workspace root lockfile + all package.json files
COPY frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
COPY frontend/design-system/package.json design-system/package.json
COPY frontend/form-factory/package.json form-factory/package.json
COPY frontend/web-application/package.json web-application/package.json

# Tooling packages referenced via file: in devDependencies
COPY tooling/eslint-config/ /app/tooling/eslint-config/
COPY tooling/prettier-config/ /app/tooling/prettier-config/

RUN pnpm install --frozen-lockfile

# Copy source
COPY frontend/design-system/ design-system/
COPY frontend/form-factory/ form-factory/
COPY frontend/web-application/ web-application/

# Build workspace packages in dependency order
RUN pnpm --filter @repo/design-system build && \
    pnpm --filter @repo/form-factory build && \
    pnpm --filter application-material build

# ── Stage 2: Nginx ────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY --from=builder /app/frontend/web-application/dist /usr/share/nginx/html
COPY deployment/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
