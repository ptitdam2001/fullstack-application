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

### Docker build & run

You must create a docker image before using it, to make it, tape the next command:

```bash
docker build --pull --rm -f 'Dockerfile' -t 'frontend:latest' '.'
```

This command builds a Docker image for the frontend application using the specified `Dockerfile`. The `--pull` flag ensures the latest base images are used, `--rm` removes intermediate containers after a successful build, `-f 'Dockerfile'` specifies the Dockerfile to use, `-t 'frontend:latest'` tags the resulting image as `frontend:latest`, and `'.'` sets the build context to the current directory.
