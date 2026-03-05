# 🛠️ MANUAL DE ENTORNO LOCAL - ORIGEN SIERRA NEVADA

Este documento es vital para la sincronización del equipo de desarrollo y el mantenimiento del ecosistema local.

## 🚀 Repositorio y Ubicación
- **Ruta Local**: `d:\Documentos\Proyectos ADSO\origen_sierranevada`
- **Frontend**: Subcarpeta `web-page\pages` (React + Vite + TypeScript)

## 🌐 Túneles y Acceso Remoto
- **Herramienta**: zrok (v1.1.10)
- **Instancia**: Reservada (`origen2025`)
- **Puerto Local**: 5000 (Vite)
- **URL Pública Active**: `https://origen2025.share.zrok.io`
- **Script de Inicio**: `d:\Documentos\Proyectos ADSO\origen_sierranevada\scripts\COMPARTIR_PROYECTO.bat`

## 📦 Gestión de Paquetes
- **Comandos de Inicio**:
  ```powershell
  cd "d:\Documentos\Proyectos ADSO\origen_sierranevada\web-page\pages"
  npm run dev -- --port 5000
  ```

## 🗄️ Base de Datos (Supabase)
- **Project ID**: `oawhbhoywqfgnqgdyyer`
- **Tablas Críticas**:
  - `products`: Catálogo místico.
  - `orders`: Ritual de pedidos.
  - `payments`: Registro de transacciones y comprobantes.
  - `profiles`: Gestión de roles (Admin, Cliente).
- **Storage Buckets**:
  - `products`: Imágenes públicas del catálogo.
  - `payments`: Comprobantes de pago (Público habilitado para guest checkout).

## 🔑 Variables de Entorno (Vitales)
Se encuentran en `web-page\pages\.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).

---
*Generado bajo el estándar MODUS AXON - Mar 04, 2026*
