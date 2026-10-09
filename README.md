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
make db-push # crée/met à jour les index MongoDB du schéma Prisma (contrôle des doublons d'abord)
```

Voir [`scripts/README.md`](scripts/README.md) pour le détail de chaque script et comment en ajouter.

---

## Docker

Docker configuration lives in `deployment/`. Services read `backend/.env` via `env_file`.

```bash
docker compose -f deployment/docker-compose.yml up --build
```

| Service          | URL                   | Description           |
| ---------------- | --------------------- | --------------------- |
| `api`            | http://localhost:4000 | Express REST API      |
| `mongodb`        | localhost:27017       | MongoDB (replica set) |
| `db-viewer`      | http://localhost:8083 | Mongo Express UI      |
| `swagger-ui`     | http://localhost:8082 | OpenAPI documentation |
| `swagger-editor` | http://localhost:8081 | OpenAPI editor        |

### Services

**`api`** — OpenAPI-first Express backend (Node 22, Alpine). Built with esbuild, Prisma ORM connects to MongoDB. `DATABASE_URL` is overridden to target the `mongodb` container.

**`mongodb`** — Official `mongo:9.0` image run as a single-node replica set, required by Prisma for transaction support. Its healthcheck initiates the replica set when the data has none, then passes once the node is primary; until then the port answers but a write fails with `node is not in primary or recovering state`. `api` and `db-viewer` start only after that (`depends_on` with `condition: service_healthy`). The data lives in two named volumes (`mongodb-data`, `mongodb-config`): a recreated container gets them back and starts normally.

**`db-viewer`** — Mongo Express, a web-based MongoDB admin UI. No authentication required in dev (`ME_CONFIG_BASICAUTH=false`).

`make up` runs the same stack detached with `--wait`: it returns once `mongodb` and `api` are healthy, so a command chained after it (`make up && make db-push`) finds a database that accepts writes. It fails when a container exits at start-up — for instance `api` with the `JWT_SECRET` placeholder of `.env.sample`; read the cause with `docker compose -f deployment/docker-compose.yml logs api`.

### Moving the dev data from the Mongo 4.4 container

Until October 2026 the stack ran `prismagraphql/mongo-single-replica:4.4.3-bionic`, with its data in anonymous volumes. MongoDB 9.0 cannot open data files written by 4.4, and the new container starts on the empty named volumes: without the steps below the application sees an empty database. The old volumes are not deleted, but reading them again needs the old image.

Dump the database **before** the first `make up` on the new image, while the 4.4 container is still running:

```bash
# 1. Dump from the 4.4 container (read-only). Keep the archive outside the repository.
docker compose -f deployment/docker-compose.yml exec -T mongodb \
  mongodump --quiet -u root -p example --authenticationDatabase admin --db app --archive --gzip > ~/app-mongo-4.4.archive.gz

# 2. Replace the container: Mongo 9.0, empty named volumes.
make up

# 3. Restore the documents.
docker compose -f deployment/docker-compose.yml exec -T mongodb \
  mongorestore --quiet -u root -p example --authenticationDatabase admin --archive --gzip --nsInclude 'app.*' < ~/app-mongo-4.4.archive.gz

# 4. Create the indexes of schema.prisma (see below).
make db-push
```

No data worth keeping: skip steps 1 and 3, then run `make db-push` and `make seed`.

Do not run `docker compose down -v`: it deletes the named volumes, and the database with them.

### MongoDB indexes

Starting the stack (`make up` or the `docker compose` command above) does **not** create the indexes declared in `backend/prisma/schema.prisma` (`@unique`, `@@unique`, `@@index`). With MongoDB only `prisma db push` creates them, and without them nothing in the database enforces `users.email` or `images.publicId` uniqueness.

Dev database — once on a fresh database, then after every index change in the schema:

```bash
make db-check-duplicates   # read-only: lists documents sharing a unique key
make db-push               # same check, then prisma db push (idempotent, never drops data)
```

Both target `DATABASE_URL` from `backend/.env` and need the backend dependencies installed (`cd backend && pnpm install && pnpm generate:prisma`). To target another database, pass the URL in single quotes — unquoted, the shell cuts it at `&` and `backend/.env` is used instead: `DATABASE_URL='mongodb://…?authSource=admin&directConnection=true' make db-push`.

`make up` deliberately does not push: on MongoDB 4.4, building a unique index over existing duplicates does not return an error, the build hangs on the server. `make db-push` refuses to write while duplicates remain; fix them, then run it again. A build left stuck by a bare `prisma db push` is aborted with `db.<collection>.dropIndex('<index name>')`.

The isolated test stack (`make stack-test-up`, Mongo on `:27019`) pushes the indexes before seeding.

Deployment — the `api` image does not push at start-up (the duplicate check is not in the production image, and a hung index build would block every replica). The image ships the Prisma CLI and the schema, so run the push as a one-off step of the release, after `make db-check-duplicates` has passed against that database:

```bash
docker compose -f deployment/docker-compose.yml run --rm --no-deps api \
  ./node_modules/.bin/prisma db push --skip-generate --schema=./prisma/schema.prisma
```
