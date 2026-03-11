# 🎯 PROJECT_VISION - Origen Sierra Nevada
## MODUS AXON - Acta de Constitución y Visión Estratégica

| Información General | Detalle |
|-------------------|---------|
| **Líder de Proyecto** | MODUS AXON - Agent |
| **Stakeholders** | Manuel Pertuz, Productores de Café |
| **Cliente** | Origen Sierra Nevada |
| **Fecha de Inicio** | 04/03/2026 |
| **Status Actual** | Fase 2 (Desarrollo y Optimización) |

---

## 🏔️ Declaración de Visión (The Hook)
*¿Qué problema estamos resolviendo? ¿Cuál es el impacto esperado?*

> "Transformar la experiencia de compra de café de especialidad de Origen Sierra Nevada en un flujo digital impecable bajo el concepto **Bio-Digital Futurism**, impulsando la eficiencia logística y posicionando a la marca en la vanguardia del e-commerce nacional."

---

## 🎯 Objetivos de Negocio (Business Goals)
1. **OBJ-01**: Optimización del proceso de Checkout garantizando un 100% de fiabilidad en la captura de datos y creación de órdenes.
2. **OBJ-02**: Implementación de un sistema de rastreo universal para mejorar la confianza del cliente en la logística del café.
3. **OBJ-03**: Asegurar la integridad y seguridad de los datos mediante políticas de Row Level Security (RLS) en Supabase.

---

## 🗺️ Alcance del Proyecto (Scope)

### ✅ Incluido (In-Scope)
- [x] Desarrollo de Módulo de Checkout con validación inteligente.
- [x] Motor de seguimiento de pedidos (`TrackOrderModal`).
- [x] Gestión de inventario en tiempo real durante la compra.
- [x] Infraestructura en Supabase conectada con React Frontend.
- [x] Implementación de UI de Alto Impacto (Bio-Digital Futurism).

### ❌ Excluido (Out-of-Scope)
- [ ] Mantenimiento de servidores locales (Infraestructura 100% cloud).
- [ ] Campañas de Marketing Digital fuera de la plataforma.
- [ ] Integración con sistemas de contabilidad legacy de terceros.

---

## 🛠️ Tecnologías Críticas (The DNA)
- **Framework**: React + Vite (v5.x+)
- **Base de Datos**: Supabase (Postgres)
- **Auth**: Supabase Auth (JWT)
- **Email**: Brevo API / emailService custom.
- **Styling**: Vanilla CSS (Tailwind compatible).

---

## ⚠️ Riesgos y Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Recursión en Políticas RLS | Crítico | Implementación de funciones `SECURITY DEFINER` para romper ciclos de auditoría. |
| Errores de pago silenciosos | Alto | Validación explícita en formularios con Modales de Advertencia institucionales. |
| Inconsistencia de ID en Carrito | Medio | Estandarización del formato `productId:variantId` en todo el sistema. |

---
**MODUS AXON** — Cualquier sistema, perfeccionado.
