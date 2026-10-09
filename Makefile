.PHONY: seed db-check-duplicates db-push help test-backend-unit test-backend-func db-test-up db-test-down test-e2e up down stack-test-up stack-test-down test-e2e-smoke test check lint gen ds-build ci ci-backend ci-backend-functional ci-frontend ci-storybook ci-markdown

TEST_MONGO_CONTAINER := fullstack-test-mongo
TEST_MONGO_PORT := 27018

help: ## Affiche les commandes disponibles
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

seed: ## Crée le jeu de données de test en base (idempotent)
	cd backend && NODE_PATH=$$(pwd)/node_modules pnpm exec tsx ../scripts/seed/index.ts

# `prisma db push` est la seule chose qui crée les index MongoDB déclarés dans schema.prisma
# (@unique, @@unique, @@index). Cible : DATABASE_URL de l'environnement, sinon celle de backend/.env.
# Jamais appelée par `make up` : démarrer la stack ne doit pas dépendre de doublons à corriger.
# Sur des doublons, un `prisma db push` seul s'arrête au premier index unique impossible (E11000) :
# un seul doublon signalé, index précédents déjà créés, index suivants absents.
# `pnpm db:push` lance donc d'abord db:check-duplicates, qui les liste tous, et s'arrête avant
# d'écrire s'il en trouve.
db-check-duplicates: ## Liste les doublons qui bloqueraient un index unique (lecture seule)
	cd backend && pnpm db:check-duplicates

db-push: ## Crée/met à jour les index MongoDB du schéma Prisma (contrôle des doublons puis prisma db push)
	@cd backend && pnpm db:push || { \
		echo ""; \
		echo "db-push a échoué : les index du schéma ne sont pas garantis en base. Causes habituelles :"; \
		echo "  - doublons sur un champ unique : listés ci-dessus, à fusionner ou supprimer avant de relancer"; \
		echo "  - Mongo injoignable, replica set pas encore prêt, ou DATABASE_URL absente (backend/.env)"; \
		exit 1; \
	}

test-backend-unit: ## Lance les tests unitaires backend (Vitest, repositories mockés)
	cd backend && pnpm test

test-backend-func: ## Lance les tests fonctionnels backend (Vitest + supertest + Mongo replica via testcontainers)
	cd backend && pnpm test:functional

# Même montage que le service `mongodb` de deployment/docker-compose.yml : replica set à un nœud,
# keyfile généré au démarrage, replica set initié par le healthcheck (prêt quand `docker ps`
# affiche "healthy").
db-test-up: ## Démarre un Mongo replica de test isolé sur le port 27018 (debug local hors testcontainers)
	docker run -d --name $(TEST_MONGO_CONTAINER) \
		-p $(TEST_MONGO_PORT):27017 \
		-e MONGO_INITDB_DATABASE=test \
		-e MONGO_INITDB_ROOT_USERNAME=test \
		-e MONGO_INITDB_ROOT_PASSWORD=test \
		--health-cmd "mongosh --quiet -u test -p test --authenticationDatabase admin --eval \"try { rs.status() } catch (e) { rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] }) } quit(db.hello().isWritablePrimary ? 0 : 1)\"" \
		--health-interval 5s --health-timeout 5s --health-retries 20 \
		--entrypoint bash \
		mongo:9.0 \
		-c 'openssl rand -base64 756 > /tmp/mongo-keyfile && chmod 400 /tmp/mongo-keyfile && chown mongodb:mongodb /tmp/mongo-keyfile && exec docker-entrypoint.sh mongod --replSet rs0 --bind_ip_all --keyFile /tmp/mongo-keyfile'

db-test-down: ## Arrête et supprime le Mongo replica de test de debug local
	docker rm -f $(TEST_MONGO_CONTAINER)

test-e2e: ## Lance les tests E2E frontend (Playwright + MSW, Vite dev server)
	cd frontend && pnpm --filter application-material test:e2e --project=chromium

# ─── Docker dev ───────────────────────────────────────────────────────────────

COMPOSE_DEV := docker compose -f deployment/docker-compose.yml

up: ## Lance la stack dev via Docker (API + Mongo + Swagger)
	$(COMPOSE_DEV) up -d --build --wait
	@echo ""
	@echo "Index MongoDB : non appliqués automatiquement. Sur une base neuve ou après un changement"
	@echo "d'index dans schema.prisma, lancer 'make db-push' (vérifie d'abord les doublons)."

down: ## Arrête la stack dev
	$(COMPOSE_DEV) down

# ─── Docker test (smoke E2E) ─────────────────────────────────────────────────

COMPOSE_TEST := docker compose -f deployment/docker-compose.test.yml
# Toujours entre quotes simples à l'usage : sans elles le shell coupe l'URL au `&`, DATABASE_URL
# n'est plus transmise et backend/.env prend le relais — la base DEV (:27017) est alors visée.
SEED_TEST_URL := mongodb://root:example@localhost:27019/app?authSource=admin&directConnection=true

stack-test-up: ## Lance la stack test isolée (build + index + seed)
	$(COMPOSE_TEST) up -d --build --wait
	DATABASE_URL='$(SEED_TEST_URL)' $(MAKE) db-push
	DATABASE_URL='$(SEED_TEST_URL)' $(MAKE) seed

stack-test-down: ## Arrête la stack test et supprime les volumes
	$(COMPOSE_TEST) down -v

test-e2e-smoke: ## Lance les tests E2E smoke (nécessite stack-test-up)
	cd frontend/web-application && npx playwright test --project=fullstack-smoke

# ─── Vérifications ───────────────────────────────────────────────────────────

check: ## Type-check backend + frontend
	cd backend && pnpm check:type
	cd frontend/web-application && pnpm check:types

lint: ## Lint backend + frontend
	cd backend && pnpm lint
	cd frontend/web-application && pnpm lint

gen: ## Régénère Prisma client + frontend SDK
	cd backend && pnpm generate:prisma
	cd frontend/web-application && pnpm gen:sdk

ds-build: ## Rebuild design system + clear Vite cache
	cd frontend && pnpm --filter @repo/design-system build
	rm -rf frontend/web-application/node_modules/.vite

# ─── CI ───────────────────────────────────────────────────────────────────────

# Une cible par job de .github/workflows/ci.yml, mêmes commandes dans le même ordre.
# Les dépendances doivent déjà être installées (`pnpm install --frozen-lockfile` à la racine,
# dans backend/ et dans frontend/) : les cibles ne les installent pas. Même règle pour le
# Chromium de Playwright, requis par ci-storybook.

# `prisma generate` ne se connecte jamais, mais prisma.config.ts exige DATABASE_URL.
CI_DATABASE_URL := mongodb://localhost:27017/ci

ci-backend: ## Job CI « Backend » : client Prisma, types, lint, format, tests unitaires
	cd backend && DATABASE_URL=$(CI_DATABASE_URL) pnpm generate:prisma
	cd backend && pnpm check:type
	cd backend && pnpm lint
	cd backend && pnpm check:format
	cd backend && pnpm test

# Testcontainers démarre son propre replica set MongoDB et pose DATABASE_URL lui-même
# (backend/tests/support/database.ts).
ci-backend-functional: ## Job CI « Backend functional tests » : client Prisma, tests fonctionnels (Docker requis)
	cd backend && DATABASE_URL=$(CI_DATABASE_URL) pnpm generate:prisma
	cd backend && pnpm test:functional

# Ordre imposé : le SDK puis les builds du design system et de la form factory d'abord.
# src/sdk/ n'est pas versionné : sans lui le type check et le lint échouent, et knip signale
# chaque import du SDK comme dépendance non déclarée. L'application web consomme les paquets
# construits, pas leurs sources.
# `test:unit` et non `test` pour le design system : `test` lance aussi le projet storybook,
# qui exige Chromium. Les plays ont leur propre job : ci-storybook.
ci-frontend: ## Job CI « Frontend » : SDK, builds, puis types, lint, format, code mort et tests unitaires
	cd frontend && pnpm --filter application-material gen:sdk
	cd frontend && pnpm --filter @repo/design-system build
	cd frontend && pnpm --filter @repo/form-factory build
	cd frontend && pnpm --filter application-material check:types
	cd frontend && pnpm --filter application-material lint
	cd frontend && pnpm --filter application-material check:format
	cd frontend && pnpm --filter application-material check:dead-code
	cd frontend && pnpm --filter application-material test --run
	cd frontend && pnpm --filter @repo/design-system check:types
	cd frontend && pnpm --filter @repo/design-system check:format
	cd frontend && pnpm --filter @repo/design-system test:unit --run
	cd frontend && pnpm --filter @repo/form-factory check:types
	cd frontend && pnpm --filter @repo/form-factory check:format
	cd frontend && pnpm --filter @repo/form-factory test:unit --run

# Les plays importent les sources du design system : ni SDK ni build à préparer.
# Chromium manquant : `cd frontend && pnpm --filter application-material exec playwright install chromium`.
ci-storybook: ## Job CI « Storybook plays » : plays des stories du design system (Chromium requis)
	cd frontend && pnpm --filter @repo/design-system test:stories --run

ci-markdown: ## Job CI « Markdown format » : Prettier sur les Markdown hors backend/ et frontend/
	pnpm check:format

ci: ci-backend ci-backend-functional ci-frontend ci-storybook ci-markdown ## Rejoue en local les cinq jobs de la CI

# ─── Suite complète ──────────────────────────────────────────────────────────

test: test-backend-unit test-backend-func test-e2e ## Lance les tests backend (unit + func) et les E2E frontend — pas les tests unitaires frontend
