/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_BASE_URL: string
  readonly VITE_JWT_SECRET: string
  readonly VITE_JWT_EXPIRY: string
  readonly VITE_PAYMENT_GATEWAY_KEY: string
  readonly VITE_PAYMENT_GATEWAY_SECRET: string
  readonly VITE_DEFAULT_CURRENCY: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_NODE_ENV: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
