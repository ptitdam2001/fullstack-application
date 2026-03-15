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

## Docker

The full stack can be run locally with Docker Compose. All services share a single env file.

**Prerequisites:** copy `.env.sample` → `.env` in `backend/openapi-express-ts/`.

```bash
docker compose up --build
```

| Service | URL | Description |
|---------|-----|-------------|
| `front` | http://localhost:3000 | React frontend |
| `api` | http://localhost:4000 | Express REST API |
| `mongodb` | localhost:27017 | MongoDB (replica set) |
| `db-viewer` | http://localhost:8083 | Mongo Express UI |
| `swagger-ui` | http://localhost:8082 | OpenAPI documentation |
| `swagger-editor` | http://localhost:8081 | OpenAPI editor |

### Services

**`api`** — OpenAPI-first Express backend (Node 22, Alpine). Built with esbuild, Prisma ORM connects to MongoDB. Reads all env vars from `backend/openapi-express-ts/.env`; `DATABASE_URL` is automatically overridden to target the `mongodb` container.

**`mongodb`** — Single-node replica set (`prismagraphql/mongo-single-replica`), required by Prisma for transaction support.

**`db-viewer`** — Mongo Express, a web-based MongoDB admin UI. No authentication required in dev (`ME_CONFIG_BASICAUTH=false`).

### Environment

All configuration lives in `backend/openapi-express-ts/.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string (overridden to `mongodb` host inside Docker) |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | MongoDB credentials |
| `DATABASE_NAME` | Database name |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRE` | Token expiry (seconds or string, e.g. `7200`) |
