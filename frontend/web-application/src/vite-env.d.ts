/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MOCKED_BACKEND: string

  readonly BACKEND_BASEURL: string

  readonly VITE_CLIENT_STORAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
