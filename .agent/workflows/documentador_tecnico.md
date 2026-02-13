---
description: Generación de documentación técnica completa (diagramas, requisitos y evaluaciones)
---

# 🏗️ Flujo de Documentación Técnica

Este workflow guía al agente para crear o actualizar toda la documentación técnica del proyecto **Origen Sierra Nevada**.

## 📋 Pasos a seguir

### 1. Fase de Descubrimiento y Análisis
- Revisar `Documentation/Technical/MASTER_PLAN.md` y `CHANGELOG.md` para entender el estado actual.
- Analizar el esquema de la base de datos en Supabase (si es posible) o revisar `web-page/database/setup.sql`.
- Explorar los servicios principales en `web-page/src/services/` y las páginas en `web-page/src/pages/`.

### 2. Generación de Diagramas (Uso de Mermaid)
Crea o actualiza los siguientes diagramas dentro de la carpeta `Documentation/Technical/Diagrams/`:

- **Diagrama de Entidad-Relación (ERD)**: Reflejar la estructura de `profiles`, `products`, `orders`, `order_items`, etc.
- **Diagramas de Flujo**: Mapear el "Ritual de Compra" (Checkout) y el "Flujo de Autorización de Miembros".
- **Diagramas de Secuencia**: Detallar la interacción entre el Frontend, Supabase Edge Functions y Resend API.
- **Mapas de Proceso**: Describir los procesos de negocio (Logística, Actualización de Inventario, Gestión de Usuarios).

### 3. Especificación de Requerimientos
Crea o actualiza `Documentation/Technical/REQUIREMENTS.md`:

- **Requisitos Funcionales**: Listar lo que el sistema HACE (ej: "El sistema debe permitir compras como invitado").
- **Requisitos No Funcionales**: Listar criterios de calidad (Seguridad RLS, Performance, SEO, Responsive).
- **Casos de Uso**: Documentar las interacciones principales Actor-Sistema.

### 4. Evaluación y Auditoría
Crea `Documentation/Technical/REQUIREMENTS_EVALUATION.md`:

- Evaluar si los requerimientos actuales se cumplen.
- Identificar brechas (Gaps) entre la visión del Master Plan y la implementación real.
- Proponer mejoras técnicas o funcionales.

### 5. Consolidación
- Actualizar el `index` de la documentación en `Documentation/Technical/README.md`.
- Sincronizar todos los cambios con el `MASTER_PLAN.md`.

## 🛠️ Herramientas sugeridas
- **Mermaid.js**: Para todos los diagramas (ERD, Flow, Sequence).
- **Markdown**: Para toda la documentación textual.
- **Estructura de Carpetas**: Asegurar que todo esté bajo `Documentation/Technical/`.
