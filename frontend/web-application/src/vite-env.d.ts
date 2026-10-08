/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MOCKED_BACKEND: string

  readonly VITE_BACKEND_BASEURL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
