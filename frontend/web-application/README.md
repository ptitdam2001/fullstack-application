# Web Application

## Configuration

### Setup Environment

Copy `.env.sample` to `.env` in `frontend/web-application/`:

```bash
cp .env.sample .env
```

```env
# ENABLE Mock backend
VITE_MOCKED_BACKEND=false

# Base url for the backend API
VITE_BACKEND_BASEURL=http://localhost:4000/
```

#### Environment Variables Description

- `VITE_MOCKED_BACKEND`: set it to `false` to call the real backend. With any other value, or when the variable is missing, the dev server answers the API calls with the MSW mocks. A production build never starts the mocks.
- `VITE_BACKEND_BASEURL`: the base URL of the backend API. When the variable is missing, the application uses `http://localhost:4000/`, the port published by `deployment/docker-compose.yml`. A backend started with `pnpm start:dev` listens on the `PORT` of `backend/.env` (`3000` in `backend/.env.sample`): set the URL to `http://localhost:3000/` in that case.

Note: Vite only exposes the variables prefixed with `VITE_` to the client-side code. The application reads no other variable.

The e2e tests do not depend on these values: Playwright starts Vite in `e2e` mode, and `.env.e2e` overrides `.env`.

`pnpm dev:docker` does the same with the `docker` mode: `.env.docker` overrides `.env` and targets the real API of the Docker dev stack (`http://localhost:4000/`, no MSW mocks). `make front` and `make dev`, from the repository root, use this script.

### Docker build

The image is built by `deployment/frontend/Dockerfile`, from the repository root (the build context must hold `frontend/`, `tooling/` and `backend/openapi.yml`).

To check that the image still builds, run from the repository root (the CI job `Docker images` runs the same target):

```bash
make build-images
```

This target builds the images of the test stack: the frontend image targets the API on `http://localhost:4001/`. For an image that targets another API, build it by hand:

```bash
docker build -f deployment/frontend/Dockerfile --build-arg VITE_BACKEND_BASEURL=http://localhost:4000/ -t frontend:latest .
```

`VITE_BACKEND_BASEURL` is inlined at build time. The pnpm version comes from the `packageManager` field of the root `package.json`.
