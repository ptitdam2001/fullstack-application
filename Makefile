.PHONY: seed help

help: ## Affiche les commandes disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

seed: ## Crée le jeu de données de test en base (idempotent)
	cd backend && NODE_PATH=$$(pwd)/node_modules npx tsx ../scripts/seed/index.ts

# ─── Futurs scripts ───────────────────────────────────────────────────────────
# Ajouter les targets ici en suivant le pattern : target: ## Description
# Exemple :
#   up: ## Lance la stack complète via Docker
#     docker compose up -d
#
#   install: ## Configure la stack pour la première installation
#     ./scripts/install/setup.sh
