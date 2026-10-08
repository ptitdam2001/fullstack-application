# Web Application

## Configuration

### Setup Environment

Create a `.env` file in the root directory with the following variables:

```env
# Backend API URL
BACKEND_BASEURL=http://localhost:3000

# Client Storage Configuration
VITE_CLIENT_STORAGE=default_application_database
```

#### Environment Variables Description

- `BACKEND_BASEURL`: The base URL for the backend API. Default is `http://localhost:3000`
- `VITE_CLIENT_STORAGE`: The name of the IndexedDB database used for client-side storage. Default is `default_application_database`

Note: All environment variables must be prefixed with `VITE_` to be exposed to the client-side code in Vite applications.

### Docker build

The image is built by `deployment/frontend/Dockerfile`, from the repository root (the build context must hold `frontend/`, `tooling/` and `backend/openapi.yml`):

```bash
docker build -f deployment/frontend/Dockerfile --build-arg VITE_BACKEND_BASEURL=http://localhost:4000/ -t frontend:latest .
```

`VITE_BACKEND_BASEURL` is inlined at build time. The pnpm version comes from the `packageManager` field of the root `package.json`.
