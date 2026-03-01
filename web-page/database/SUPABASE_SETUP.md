# 🔑 Cómo Obtener tus Credenciales de Supabase

## Paso 1: Acceder a Supabase Dashboard

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Si no tienes cuenta, créala (es gratis)

## Paso 2: Seleccionar o Crear Proyecto

### Si ya tienes un proyecto:
- Click en tu proyecto existente

### Si necesitas crear un nuevo proyecto:
1. Click en "New Project"
2. Completa los datos:
   - **Name**: `origen-sierra-nevada` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡GUÁRDALA!)
   - **Region**: Selecciona la más cercana a tu ubicación
3. Click en "Create new project"
4. Espera 1-2 minutos mientras se crea

## Paso 3: Obtener las Credenciales

Una vez dentro de tu proyecto:

1. En el menú lateral, click en **"Project Settings"** (⚙️ ícono de engranaje)
2. Click en **"API"** en el submenu
3. Busca la sección **"Project URL"**
   - Copia la URL completa (ejemplo: `https://abcdefghijklmnop.supabase.co`)
4. Busca la sección **"Project API keys"**
   - Copia el **"anon public"** key (comienza con `eyJhbG...`)

## Paso 4: Copiar Credenciales al Archivo .env

Abre el archivo `.env` en:
```
G:\Mi unidad\Diseño Web\origen_sierranevada\web-page\pages\.env
```

Reemplaza las líneas que dicen `YOUR_PROJECT_URL_HERE` y `YOUR_ANON_KEY_HERE`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto-real.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...tu-key-completa

# Legacy keys (mantener por compatibilidad)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-real.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...tu-key-completa
```

## ✅ Verificación

Cuando hayas completado el `.env`:

1. Guarda el archivo
2. Reinicia el servidor de desarrollo (si está corriendo)
3. Deberías ver en la consola: `✅ Supabase: Cliente inicializado correctamente`

---

## 🔒 IMPORTANTE: Seguridad

> [!WARNING]
> - **NUNCA** compartas tu `ANON_KEY` públicamente
> - **NUNCA** subas el archivo `.env` a GitHub
> - El archivo `.gitignore` ya tiene `.env` listado para protección

---

## 📋 Siguiente Paso

Una vez tengas las credenciales configuradas, necesitarás crear las tablas en Supabase.
Continúa con el archivo `database_setup.md`.
