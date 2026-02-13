# Plan de Implementación SEO & Cumplimiento - Origen Sierra Nevada

Este plan aborda los hallazgos críticos detectados en la auditoría realizada el 2026-02-08.

## Fase 1: Cumplimiento Legal & Errores Críticos (Prioridad 1)
- [ ] **L01: Privacidad en Newsletter.** Modificar `Footer.tsx` para incluir el checkbox de consentimiento de la Ley 1581.
- [ ] **L02: Enlaces Legales.** Crear placeholders o rutas funcionales para las políticas legales en el Router y Footer.
- [ ] **L03: Idioma Base.** Corregir `index.html` lang="es".
- [ ] **T02: Robots.txt.** Crear archivo de configuración para rastreadores.
- [ ] **T03: Activación SEO.** Integrar el componente `<SEO />` en las páginas principales (`HomePage`, `SubscriptionPage`, etc.).

## Fase 2: SEO Técnico & Estructura (Prioridad 2)
- [ ] **T01: Rutas de Navegación.** Migrar de `HashRouter` a `BrowserRouter` para mejorar la indexabilidad.
- [ ] **A01: Jerarquía H1/H2.** Reordenar semánticamente los encabezados en el Hero de la `HomePage`.
- [ ] **T06: Datos Estructurados.** Implementar JSON-LD (Schema.org) para el producto principal y la organización.

## Fase 3: Rendimiento & Core Web Vitals (Prioridad 3)
- [ ] **T04: Optimización de Imágenes.** Convertir activos pesados (PNG > 1MB) a formato WebP.
- [ ] **T05: Prioridad LCP.** Aplicar `fetchpriority="high"` y `preload` a la imagen principal del café.
- [ ] **A02: Accesibilidad Alt.** Revisar y limpiar atributos `alt` según su función (informativa vs decorativa).

---

## Verificación
Tras cada fase, se realizará un escaneo de:
1. Puntuación Lighthouse (Pre vs Post).
2. Validación de Schema (Rich Results Test).
3. Prueba de accesibilidad (Contraste y Navegación por teclado).

---
**¿Deseas que proceda con la Fase 1 inmediatamente?**
