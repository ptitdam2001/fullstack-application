# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app/backend/openapi-express-ts
COPY backend/openapi-express-ts/package.json backend/openapi-express-ts/pnpm-lock.yaml ./

# Build tools needed to compile bcrypt (native addon)
RUN apk add --no-cache python3 make g++ && \
    pnpm install --frozen-lockfile && \
    apk del --purge python3 make g++ && \
    rm -rf /var/cache/apk/*

# Copy source and openapi spec
COPY backend/openapi-express-ts/ .
COPY backend/openapi.yml /app/backend/openapi.yml

# Generate Prisma client for linux (config/prisma/ is excluded from build context via .dockerignore)
RUN DATABASE_URL="mongodb://placeholder" pnpm exec prisma generate --schema=./prisma/schema.prisma

# Bundle
RUN pnpm build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app/backend/openapi-express-ts
COPY backend/openapi-express-ts/package.json backend/openapi-express-ts/pnpm-lock.yaml ./

# Build tools needed to compile bcrypt, removed after install
RUN apk add --no-cache python3 make g++ && \
    pnpm install --frozen-lockfile --prod && \
    apk del --purge python3 make g++ && \
    rm -rf /var/cache/apk/*

# Copy prisma schema and generate the client for linux (production target)
# Use --schema directly to bypass prisma.config.ts (which requires DATABASE_URL at build time)
COPY backend/openapi-express-ts/prisma ./prisma
RUN DATABASE_URL="mongodb://placeholder" pnpm exec prisma generate --schema=./prisma/schema.prisma

# Copy the bundled app
COPY --from=builder /app/backend/openapi-express-ts/dist ./dist

# Copy openapi spec one level up (read at runtime as '../openapi.yml')
COPY --from=builder /app/backend/openapi.yml /app/backend/openapi.yml

EXPOSE 3000

CMD ["node", "dist/index.js"]
