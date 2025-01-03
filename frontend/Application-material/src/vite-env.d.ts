/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BACKEND_BASEURL: string
  readonly VITE_SPOTIFY_CLIENTID: string
  readonly VITE_SPOTIFY_SECRET: string

  readonly VITE_CLIENT_STORAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
