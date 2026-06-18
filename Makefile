.PHONY: seed help test-backend-unit test-backend-func db-test-up db-test-down test-e2e up down stack-test-up stack-test-down test-e2e-smoke test

TEST_MONGO_CONTAINER := fullstack-test-mongo
TEST_MONGO_PORT := 27018

help: ## Affiche les commandes disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

seed: ## Crée le jeu de données de test en base (idempotent)
	cd backend && NODE_PATH=$$(pwd)/node_modules npx tsx ../scripts/seed/index.ts

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
	$(COMPOSE_DEV) up -d --build

down: ## Arrête la stack dev
	$(COMPOSE_DEV) down

# ─── Docker test (smoke E2E) ─────────────────────────────────────────────────

COMPOSE_TEST := docker compose -f deployment/docker-compose.test.yml
SEED_TEST_URL := mongodb://root:example@localhost:27019/app?authSource=admin&directConnection=true

stack-test-up: ## Lance la stack test isolée (build + seed)
	$(COMPOSE_TEST) up -d --build --wait
	DATABASE_URL=$(SEED_TEST_URL) $(MAKE) seed

stack-test-down: ## Arrête la stack test et supprime les volumes
	$(COMPOSE_TEST) down -v

test-e2e-smoke: ## Lance les tests E2E smoke (nécessite stack-test-up)
	cd frontend/web-application && pnpm exec playwright test --project=fullstack-smoke

# ─── Suite complète ──────────────────────────────────────────────────────────

test: test-backend-unit test-backend-func test-e2e ## Lance tous les tests (unit + func + e2e mocked)
