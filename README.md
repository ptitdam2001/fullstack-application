## Fullstack Application

This github repository is a multiple representation to configure backend and frontend environments.

### Backend

This folder contains some backend API implementation ways. The backend will be used in frontend application

You can read more information [here](/backend/README.md)

### Frontend

All the frontend is developed in ReactJs + Typescript. We split the content in two parts:

- Library of Base Components
- Application using that library of components

---

## Scripts utilitaires

Des scripts Make sont disponibles pour les opérations courantes.

```bash
make help   # liste toutes les commandes
make seed   # crée un jeu de données de test en base
```

Voir [`scripts/README.md`](scripts/README.md) pour le détail de chaque script et comment en ajouter.

---

## Docker

Docker configuration lives in `deployment/`. Services read `backend/.env` via `env_file`.

```bash
docker compose -f deployment/docker-compose.yml up --build
```

| Service | URL | Description |
|---------|-----|-------------|
| `api` | http://localhost:4000 | Express REST API |
| `mongodb` | localhost:27017 | MongoDB (replica set) |
| `db-viewer` | http://localhost:8083 | Mongo Express UI |
| `swagger-ui` | http://localhost:8082 | OpenAPI documentation |
| `swagger-editor` | http://localhost:8081 | OpenAPI editor |

### Services

**`api`** — OpenAPI-first Express backend (Node 22, Alpine). Built with esbuild, Prisma ORM connects to MongoDB. `DATABASE_URL` is overridden to target the `mongodb` container.

**`mongodb`** — Single-node replica set (`prismagraphql/mongo-single-replica`), required by Prisma for transaction support.

**`db-viewer`** — Mongo Express, a web-based MongoDB admin UI. No authentication required in dev (`ME_CONFIG_BASICAUTH=false`).
