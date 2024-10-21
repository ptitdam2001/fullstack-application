# nodejs-express

## Configuration

At the root of `nodejs-express` project, pluease create a new file `.env` which looks like:

```
# Server configuration
PORT=3000
BASE_PATH='/'

# Database configuration
DATABASE_PORT=27017
DATABASE_USERNAME=root
DATABASE_PASSWORD=admin
DATABASE_NAME=myApplication
```

## Commands

### To Run locally

To install dependencies:

```bash
bun install
```

To run in dev mode:

```bash
bun run dev
```

To Build (typescript compilation):

```bash
bun run build
```

To Run production code (after building):

```bash
bun run start
```

### Docker compose

It is possible to run the full backend with docker-compose, the dedicated command is :

`docker-compose  -f "docker-compose.yml" up -d`

## Todo

- Implement api validator
- Tests
- Database connexion

## Inspiration

- https://expressjs.com/
- https://dev.to/wizdomtek/typescript-express-building-robust-apis-with-nodejs-1fln
- https://express-validator.github.io/docs/guides/validation-chain/

This project was created using `bun init` in bun v1.1.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
