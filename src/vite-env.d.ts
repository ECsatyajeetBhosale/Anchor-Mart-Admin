/// <reference types="vite/client" />

// This tells TypeScript about Vite's special import.meta.env variables.
// Add any new VITE_ env variables here so TypeScript knows about them.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
