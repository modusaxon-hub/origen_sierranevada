# 🛠️ MANUAL_ENTORNO_LOCAL.md
## Manual de Despliegue y Configuración del Entorno Local

| Proyecto | Origen Sierra Nevada |
|----------|------------------|
| **MODUS AXON Hub** | [modus_axon](../../modus_axon) |
| **Repositorio** | [Git URL] |
| **Creado** | 10/03/2026 |
| **Versión** | v1.1.0 (Fix Checkout) |

---

## 🏗️ Requisitos del Sistema
- **Interprete**: Node.js (v18.0+)
- **Base de Datos**: Supabase (Remote: oawhbhoywqfgnqgdyyer)
- **Gestor de Paquetes**: npm o yarn
- **Herramientas de Túnel**: zrok (Recomendado por Modus Axon)

---

## 🚀 Flujo de Inicio (Quick Start)
Ejecutar los siguientes comandos en orden:

### 1. Clonar y Dependencias
```powershell
git clone [URL_REPOSITORIO]
cd origen_sierranevada/web-page/pages
npm install
```

### 2. Configuración de Variables (Environment)
Asegurar que el archivo `.env` en `web-page/pages` contenga:
- `VITE_SUPABASE_URL`: https://oawhbhoywqfgnqgdyyer.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [Supabase Anon Key]

### 3. Ejecución del Servidor
```powershell
npm run dev
```

---

## 🌐 Configuración de Túneles (Acceso Remoto para Pruebas)
*MODUS AXON recomienda usar **zrok** para túneles estables.*

### Comando de Reserva (Shared Reserved)
```powershell
& "C:\zrok_1.1.10\zrok.exe" share reserved origin-sierra --override-endpoint http://localhost:5173
```

---

## 📁 Estructura del Proyecto
- `/src`: Código fuente (React).
- `/src/pages`: Páginas principales (Checkout, TrackOrder, etc.).
- `/src/services`: Conexión a Supabase y servicios de negocio (orderService, shippingService).
- `/technical`: Documentación técnica (Modelos Modus Axon).
- `/htdocs`: Archivos estáticos y activos de la landing page.

---

## ⚠️ Solución de Problemas (Troubleshooting)
- **Error 500 orders**: Se ha corregido mediante la migración `fix_rls_recursion_v2`. No requiere acción adicional del desarrollador local.
- **Botón Checkout no responde**: Verificar que el servidor local esté corriendo la última versión de `CheckoutPage.tsx` con validación explícita.
- **Error CORS**: Asegurar que `localhost:5173` esté en la whitelist de Supabase Auth/Functions.

---
**MODUS AXON** — Cualquier sistema, perfeccionado.
