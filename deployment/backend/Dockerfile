# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./

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

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./

COPY tooling/eslint-config/ /app/tooling/eslint-config/
COPY tooling/prettier-config/ /app/tooling/prettier-config/

RUN apk add --no-cache python3 make g++ && \
    pnpm install --frozen-lockfile --prod && \
    apk del --purge python3 make g++ && \
    rm -rf /var/cache/apk/*

COPY backend/prisma ./prisma
RUN DATABASE_URL="mongodb://placeholder" pnpm exec prisma generate --schema=./prisma/schema.prisma

COPY --from=builder /app/backend/dist ./dist

COPY backend/openapi.yml ./openapi.yml

EXPOSE 3000

CMD ["node", "dist/index.js"]
