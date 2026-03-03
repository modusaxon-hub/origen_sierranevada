/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_WOMPI_SANDBOX: string
    readonly VITE_WOMPI_PUBLIC_KEY_TEST: string
    readonly VITE_WOMPI_PRIVATE_KEY_TEST: string
    readonly VITE_WOMPI_PUBLIC_KEY_PROD: string
    readonly VITE_WOMPI_PRIVATE_KEY_PROD: string
    readonly VITE_WOMPI_EVENTS_SECRET: string
    readonly GEMINI_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
