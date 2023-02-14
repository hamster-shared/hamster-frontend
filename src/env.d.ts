/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_NODE_ENV: string
  readonly VITE_BASE_API: string
  readonly VITE_APP_CLIENTID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}