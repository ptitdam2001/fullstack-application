# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# pnpm version: the packageManager field of the root package.json
# (frontend/ is a workspace root without a package.json)
COPY package.json /tmp/root-package.json
RUN corepack enable && \
    corepack prepare "$(node -p "require('/tmp/root-package.json').packageManager")" --activate

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

# Vite env vars (inlined at build time via import.meta.env)
ARG VITE_BACKEND_BASEURL
ENV VITE_BACKEND_BASEURL=${VITE_BACKEND_BASEURL}

# Copy source
COPY frontend/design-system/ design-system/
COPY frontend/form-factory/ form-factory/
COPY frontend/web-application/ web-application/

# src/sdk is gitignored: generate it with orval from the API contract
# (orval.config.ts reads ../../backend/openapi.yml relative to web-application)
COPY backend/openapi.yml /app/backend/openapi.yml
RUN pnpm --filter application-material gen:sdk

# Build workspace packages in dependency order
RUN pnpm --filter @repo/design-system build && \
    pnpm --filter @repo/form-factory build && \
    pnpm --filter application-material build

# ── Stage 2: Nginx ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/frontend/web-application/dist /usr/share/nginx/html
COPY deployment/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
