# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app/backend
# pnpm-workspace.yaml holds allowBuilds: without it pnpm skips native builds (bcrypt)
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml ./

# pnpm version: the packageManager field of backend/package.json
RUN corepack enable && \
    corepack prepare "$(node -p "require('./package.json').packageManager")" --activate

# Tooling packages referenced via file: in devDependencies
COPY tooling/eslint-config/ /app/tooling/eslint-config/
COPY tooling/prettier-config/ /app/tooling/prettier-config/

RUN apk add --no-cache python3 make g++ && \
    pnpm install --frozen-lockfile && \
    apk del --purge python3 make g++ && \
    rm -rf /var/cache/apk/*

COPY backend/ .

RUN DATABASE_URL="mongodb://placeholder" pnpm exec prisma generate --schema=./prisma/schema.prisma

RUN pnpm build

# ── Stage 2: Production dependencies ─────────────────────────────────────────
# Installs the runtime node_modules with pnpm, so that the production stage needs neither pnpm nor
# corepack: an activation by root is invisible to the node user, which would download pnpm again.
FROM node:22-alpine AS prod-deps

WORKDIR /app/backend
# pnpm-workspace.yaml holds allowBuilds: without it pnpm skips native builds (bcrypt)
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml ./

# pnpm version: the packageManager field of backend/package.json
RUN corepack enable && \
    corepack prepare "$(node -p "require('./package.json').packageManager")" --activate

COPY tooling/eslint-config/ /app/tooling/eslint-config/
COPY tooling/prettier-config/ /app/tooling/prettier-config/

RUN apk add --no-cache python3 make g++ && \
    pnpm install --frozen-lockfile --prod

COPY backend/prisma ./prisma
RUN DATABASE_URL="mongodb://placeholder" pnpm exec prisma generate --schema=./prisma/schema.prisma

# ── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app/backend
# WORKDIR creates the directory as root: give it to node, like every file copied below
RUN chown node:node /app/backend

# node_modules keeps the relative symlinks of pnpm: copy the whole directory, never one package
COPY --from=prod-deps --chown=node:node /app/backend/package.json ./package.json
COPY --from=prod-deps --chown=node:node /app/backend/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /app/backend/prisma ./prisma

COPY --from=builder --chown=node:node /app/backend/dist ./dist

COPY --chown=node:node backend/openapi.yml ./openapi.yml

# Runtime only: gates the logs that must not leak in production (NoopEmailService tokens, spec 10)
ENV NODE_ENV=production

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/index.js"]
