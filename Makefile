.PHONY: seed help test-backend-unit test-backend-func db-test-up db-test-down test-e2e

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

# ─── Futurs scripts ───────────────────────────────────────────────────────────
# Ajouter les targets ici en suivant le pattern : target: ## Description
# Exemple :
#   up: ## Lance la stack complète via Docker
#     docker compose up -d
#
#   install: ## Configure la stack pour la première installation
#     ./scripts/install/setup.sh
