.PHONY: seed db-check-duplicates db-push help test-backend-unit test-backend-func db-test-up db-test-down test-e2e up down stack-test-up stack-test-down test-e2e-smoke test check lint gen ds-build

TEST_MONGO_CONTAINER := fullstack-test-mongo
TEST_MONGO_PORT := 27018

help: ## Affiche les commandes disponibles
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

seed: ## Crée le jeu de données de test en base (idempotent)
	cd backend && NODE_PATH=$$(pwd)/node_modules pnpm exec tsx ../scripts/seed/index.ts

# `prisma db push` est la seule chose qui crée les index MongoDB déclarés dans schema.prisma
# (@unique, @@unique, @@index). Cible : DATABASE_URL de l'environnement, sinon celle de backend/.env.
# Jamais appelée par `make up` : sur Mongo 4.4, créer un index unique sur une collection qui
# contient des doublons ne renvoie pas d'erreur, la construction reste bloquée côté serveur.
# `pnpm db:push` lance donc d'abord db:check-duplicates et s'arrête avant d'écrire s'il en trouve.
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

db-test-up: ## Démarre un Mongo replica de test isolé sur le port 27018 (debug local hors testcontainers)
	docker run -d --name $(TEST_MONGO_CONTAINER) \
		-p $(TEST_MONGO_PORT):27017 \
		-e MONGO_INITDB_DATABASE=test \
		-e MONGO_INITDB_ROOT_USERNAME=test \
		-e MONGO_INITDB_ROOT_PASSWORD=test \
		-e INIT_WAIT_SEC=10 \
		prismagraphql/mongo-single-replica:4.4.3-bionic

db-test-down: ## Arrête et supprime le Mongo replica de test de debug local
	docker rm -f $(TEST_MONGO_CONTAINER)

test-e2e: ## Lance les tests E2E frontend (Playwright + MSW, Vite dev server)
	cd frontend/web-application && pnpm test:e2e

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
	pnpm --filter @repo/design-system build
	rm -rf frontend/web-application/node_modules/.vite

# ─── Suite complète ──────────────────────────────────────────────────────────

test: test-backend-unit test-backend-func test-e2e ## Lance tous les tests (unit + func + e2e mocked)
