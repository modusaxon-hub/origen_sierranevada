# 🛡️ AI Compliance & Decision Log (AI_LOG_CUMPLIMIENTO)
## MODUS AXON - Protocolo de Trazabilidad Ética y Legal

| Información General | Detalle |
|-------------------|---------|
| **Proyecto** | Origen Sierra Nevada (E-commerce) |
| **Versión de Protocolo** | v3.1.0 |
| **Jurisdicción Principal** | Colombia (Ley 1581 de 2012) |
| **Cumplimiento Global** | GDPR (UE), MinTIC Res. 1519 |

---

## 📝 Registro de Decisiones de Arquitectura e IA
Este log registra el origen de cada instrucción y su ejecución por la IA para asegurar la transparencia en el desarrollo del sistema de Origen Sierra Nevada.

### Historial de Trazabilidad (Leader Prompts & Builds)

| Build ID | Fecha | Origen (Prompt/Instrucción) | Decisión / Acción de la IA | Justificación Técnica |
|----------|-------|----------------------------|----------------------------|-----------------------|
| `2026031020310001` | 10/03/2026 | "Fix Checkout Flow" | Implementación de validación explícita y modal de advertencia. | Mejora de UX y prevención de envíos fallidos silenciosos. |
| `2026031020370002` | 10/03/2026 | "Rastreo Universal de Pedidos" | Creación de `TrackOrderModal` accesible sin login. | Democratización del acceso a información de envío para clientes invitados. |
| `2026031020380003` | 10/03/2026 | "Error infinite recursion orders" | Creación de funciones `SECURITY DEFINER` en Supabase. | Resolución de bucles infinitos en políticas RLS (Row Level Security). |
| `2026031020440004` | 10/03/2026 | "Secuencia Documental" | Generación de modelos técnicos estándar MODUS AXON. | Cumplimiento con la regla de organización y trazabilidad del proyecto. |

---

## ⚖️ Marco de Cumplimiento Logrado

### 1. Protección de Datos (Ley 1581 de 2012 - Colombia / GDPR)
- [x] **Anonimización**: Se han evitado logs de datos sensibles en consola de producción.
- [x] **Enmascaramiento**: Documentos de identidad y teléfonos son sanitizados antes de guardarse.
- [x] **Consentimiento**: El checkout requiere validación implícita de datos de envío.

### 2. Facturación e Impuestos (Res. 000042/2020 DIAN)
- [x] **Integración**: Los cálculos de envío se basan en destino (Ciudad/Departamento).
- [x] **Trazabilidad**: Cada orden genera un UUID único y auditable en `orders`.

### 3. Accesibilidad (Res. 1519/2020 MinTIC / WCAG 2.1)
- [x] **Contraste**: Diseño basado en paleta Origen (Oro/Negro) optimizada para legibilidad.
- [x] **Semántica**: Uso de componentes React semánticos y modales accesibles.

---

## 🔒 Auditoría de Seguridad Reciente
- **10/03/2026**: Mitigada recursión infinita en RLS de `orders` mediante funciones intermedias que rompen el ciclo de consulta entre `orders` y `order_items`.
- **10/03/2026**: Implementada sanitización de inputs en el frontend para evitar inyecciones básicas en campos de texto.

---
**MODUS AXON** — Cualquier sistema, perfeccionado.
