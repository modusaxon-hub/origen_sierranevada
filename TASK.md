# TASK.md — Origen Sierra Nevada

Bitácora viva del proyecto. Actualizado: 2026-03-03

---

## 🎨 Componentes UI — Header & Footer (Premium Glassmorphism)

| # | Tarea | Estado | Commit |
|---|-------|--------|--------|
| **UI-001** | 🎯 **Refactorización Header** (Navbar → Header.tsx) | ✅ COMPLETADO | 30f8fab (3-Mar-2026) |
| **UI-001.1** | Estilos Premium Glassmorphism basados en propuesta-logo.html | ✅ COMPLETADO | Colores: #141E16, #C8AA6E, #F5F5F5 |
| **UI-001.2** | Logo con drop-shadow premium + hover effects | ✅ COMPLETADO | Blur 2xl, border dorados, scale transitions |
| **UI-001.3** | Navbar menu + Links con underline animations doradas | ✅ COMPLETADO | Navigation: Inicio, Catálogo, Guía |
| **UI-001.4** | Botón Ingresar (border dorado, glow, scale on hover) | ✅ COMPLETADO | Estilos premium con active:scale-95 |
| **UI-001.5** | Icons (search, cart, language, dark-mode) con hover backgrounds | ✅ COMPLETADO | Transitions smooth, 300ms duration |
| **UI-002** | 🎯 **Refactorización Footer** | ✅ COMPLETADO | 30f8fab (3-Mar-2026) |
| **UI-002.1** | Glassmorphic design + backdrop-blur + bordes dorados | ✅ COMPLETADO | Efecto premium con glow radial |
| **UI-002.2** | Logo mejorado + Newsletter glassmorphic card | ✅ COMPLETADO | Form styling premium, checkbox dorado |
| **UI-002.3** | Links con underline animations + Social icons scale | ✅ COMPLETADO | Smooth transitions 300ms |
| **UI-002.4** | Footer MODUS AXON seal (cumplimiento de identidad) | ✅ COMPLETADO | Sello de desarrollador en pie de página |
| **UI-003** | 🔧 **Actualizar imports & estructura** | ✅ COMPLETADO | 30f8fab (3-Mar-2026) |
| **UI-003.1** | Eliminar Navbar.tsx, crear Header.tsx | ✅ COMPLETADO | Archivo eliminado, refactorizado |
| **UI-003.2** | Actualizar App.tsx: import Header | ✅ COMPLETADO | `import Header from './shared/components/Header'` |
| **UI-003.3** | Actualizar CatalogPage.tsx: import Header | ✅ COMPLETADO | Rutas correctas para contextos/servicios |
| **UI-003.4** | Verificar compilación React (npm run dev) | ✅ COMPLETADO | Server inicia en http://127.0.0.1:3000 sin errores |

---

## 📋 Tareas Activas

| # | Tarea | Estado | Nota |
|---|-------|--------|------|
| **DOCS-001** | 📚 **Reorganización Documentación Técnica** | ✅ COMPLETADO | Commit: da5a64f (28-Feb-2026) |
| **DOCS-002** | 💎 **Branding: MODUS AXON Power** | ⏳ EN PROCESO | Migración de identidad visual de docs a Modus Axon |
| **DOCS-002.1** | Actualizar Skill `documentador-tecnico` con estilos Modus Axon | ✅ COMPLETADO | Colores: #1A1A2E, #8A2BE2, #00FFFF |
| **DOCS-002.2** | Actualizar README.md y Master Plan con sello Modus Axon | ✅ COMPLETADO | Pie de página y encabezados actualizados |
| **DOCS-001.1** | Crear estructura 7-carpetas (00-06 temáticas) | ✅ COMPLETADO | 00-INICIALIZACION, 01-ARQUITECTURA, etc. |
| **DOCS-001.2** | Consolidar documentos duplicados (6 grupos) | ✅ COMPLETADO | QA, Requirements, Ambiente, Responsive, Changelog, Roadmap |
| **DOCS-001.3** | Mover archivos caducados a _DEPRECADO | ✅ COMPLETADO | 8 archivos en staging para eliminación (1 sprint) |
| **DOCS-001.4** | Proteger Conditions.txt en .gitignore | ✅ COMPLETADO | Recordatorios locales personales |
| **DOCS-001.5** | Crear README.md como índice central | ✅ COMPLETADO | Guía de navegación por carpetas |
| **PROP-001** | 🎯 **Coffee DNA™** — Quiz gamificado para perfilación emocional | ⏳ Planificación | V1 en Fase 1-2 (Sem 1-3) |
| **PROP-001.1** | Diseñar wireframes del quiz (5-7 preguntas visuales) | ⏳ TODO | Início Sem 1 |
| **PROP-001.2** | Mapeo de Coffee DNA types (20-25 combinaciones café) | ⏳ TODO | Inicio Sem 1 |
| **PROP-001.3** | Desarrollar componente Quiz React (animaciones + interactividad) | ⏳ TODO | Sem 2-3, 4 días estimados |
| **PROP-001.4** | Integrar lógica: Respuestas → DNA + Recomendación + CTA | ⏳ TODO | Sem 2, 2 días |
| **PROP-001.5** | Crear "Certificado DNA" descargable (PDF + visual) | ⏳ TODO | Sem 2, 1 día |
| **PROP-001.6** | Email post-compra con DNA + Guía Preparación | ⏳ TODO | Sem 2, 1 día |
| **PROP-001.7** | Testing QA multi-navegador (Chrome, Safari, Firefox, Mobile) | ⏳ TODO | Sem 3, 2 días |
| **PROP-002** | 🔓 **Garantía de Obsesión™** — Promesa audaz de riesgo inverso | ⏳ Planificación | V1 en Fase 2 (Sem 2-3) |
| **PROP-002.1** | Finalizar T&C legales. Review asesor legal. | ⏳ TODO | Sem 1, 2 días |
| **PROP-002.2** | Diseñar badge visual "Garantía de Obsesión" | ⏳ TODO | Sem 2, 1 día |
| **PROP-002.3** | Integrar badge en PDP, Homepage, Checkout | ⏳ TODO | Sem 2, 1 día |
| **PROP-002.4** | Crear form de reclamo en admin panel | ⏳ TODO | Sem 2, 1 día |
| **PROP-002.5** | Email flujo: Confirmación + Día 25 rescate + Reembolso | ⏳ TODO | Sem 2, 2 días |
| **PROP-002.6** | Testing: Flujo completo de reclamo hasta reembolso | ⏳ TODO | Sem 3, 1 día |
| **PROP-003** | 🎮 **Experience Unlock™** — Gamificación comunidad + retención | ⏳ Planificación | V1 en Fase 3 (Sem 3-4) |
| **PROP-003.1** | Desarrollar Dashboard privado (/dashboard ruta protegida) | ⏳ TODO | Sem 3, 4 días |
| **PROP-003.2** | Sistema de puntos XP: +10 por compra, BD + lógica auto | ⏳ TODO | Sem 3, 2 días |
| **PROP-003.3** | Leaderboard comunitario (Top 10 usuarios) | ⏳ TODO | Sem 3, 2 días |
| **PROP-003.4** | Filmar 3-5 vídeos "Diario del Productor" | ⏳ TODO | Sem 3, 3 días |
| **PROP-003.5** | Setup Discord/WhatsApp privado + Bot de invites | ⏳ TODO | Sem 3, 1 día |
| **PROP-003.6** | Crear guías de preparación (PDF + templates) | ⏳ TODO | Sem 3, 2 días |
| **PROP-004** | 🚀 **Deploy + Optimización** — Fase 4 Lanzamiento | ⏳ Planificación | Sem 4 (7 días) |
| **PROP-004.1** | Deploy Coffee DNA a producción + A/B test setup | ⏳ TODO | Sem 4, Día 1 |
| **PROP-004.2** | Deploy Garantía + Monitoreo % reclamos | ⏳ TODO | Sem 4, Día 1 |
| **PROP-004.3** | Deploy Experience Unlock + Email invites a clientes previos | ⏳ TODO | Sem 4, Día 2 |
| **PROP-004.4** | Google Analytics + Hotjar setup. Eventos personalizados | ⏳ TODO | Sem 4, Día 3 |
| **PROP-004.5** | Comunicación: Email + Social + Blog sobre cambios | ⏳ TODO | Sem 4, Día 4 |
| **PROP-004.6** | Monitoreo diario: Bugs, feedback, ajustes urgentes | ⏳ TODO | Sem 4, Días 5-7 |

---

## 🎯 Criterios de Éxito

- ✅ **Conversión:** +40-50% vs baseline actual
- ✅ **Retención:** +30-50% repeat purchase rate
- ✅ **LTV:** 3-5x mayor lifetime value por cliente
- ✅ **NPS:** +5-10 puntos post-cambios
- ✅ **Quiz Engagement:** >60% inician, >40% completan
- ✅ **Garantía:** <10% tasa de reclamación
- ✅ **Dashboard Adoption:** >50% clientes entran a Experience Unlock

---

## 📊 Recursos Asignados

| Rol | Dedicación | Responsable | Status |
|-----|-----------|------------|--------|
| Frontend React | 100% (4 sem) | — | ⏳ Pendiente asignación |
| Backend Supabase | 50% (2 sem) | — | ⏳ Pendiente asignación |
| Copywriter | 30% (3 sem) | — | ⏳ Pendiente asignación |
| Designer UI/UX | 60% (3 sem) | — | ⏳ Pendiente asignación |
| QA Testing | 40% (2 sem) | — | ⏳ Pendiente asignación |
| Community Manager | 50% (ongoing) | — | ⏳ Pendiente asignación |
| Videógrafo | 1 proyecto | — | ⏳ Pendiente contratación |

---

## 📁 Documentos Asociados

- **PROPUESTAS_VALOR_CONVERSION.html** — Detalles de las 3 propuestas con puntuación (Impacto, Viabilidad, Novedad, Esfuerzo, ROI)
- **PLAN_IMPLEMENTACION_PROPUESTAS.html** — Timeline completo, fases, riesgos, checklist, métricas
- **agent/skills/** — Librería de skills aplicados: brainstorming-pro, planificacion-pro, brandbook

---

## 🚀 Próximos Pasos Inmediatos

1. **Lunes próximo:** Kickoff con equipo. Revisar ambos documentos HTML.
2. **Martes-Jueves:** Fase 1 — Wireframes + Copys + BD setup.
3. **Semana 2-3:** Desarrollo paralelo Coffee DNA + Garantía.
4. **Semana 3-4:** Experience Unlock + Testing.
5. **Semana 4:** Deploy + Monitoreo.

---

## 📈 Impacto Esperado

Si todo se ejecuta correctamente:
- **Conversión:** 20 visitantes/día → 25-30 órdenes/día (vs. 12-15 hoy)
- **Retención:** 10% repeat → 15-20% repeat
- **Ingresos adicionales Q1:** +$50-100K (suponiendo baseline $200K/mes)

---

---

## 🚀 RECONSTRUCCIÓN — Sesión 03 Mar 2026

| # | Tarea | Estado | Nota |
|---|-------|--------|------|
| **RECON-000** | 📁 **Organización de Documentación** | ✅ COMPLETADO | Carpeta `00-estrategia-lanzamiento` creada. 4 HTML sueltos movidos desde raíz |
| **RECON-001** | 🧠 **Brainstorming Pro — Ideas de Reconstrucción** | ✅ COMPLETADO | `BRAINSTORMING_RECONSTRUCCION.html` generado. 23 ideas, TOP 5 seleccionado |
| **RECON-002** | ⚖️ **Compliance Legal + Factura Electrónica** | ✅ COMPLETADO | `COMPLIANCE_LEGAL.html` generado. Res.000042/2020 DIAN + Ley 1581 + WCAG 2.1 |
| **RECON-003** | 🗺️ **Roadmap de Construcción — 4 Fases** | ✅ COMPLETADO | `ROADMAP_CONSTRUCCION.html` generado. 6 semanas, 12 módulos, 5 riesgos, checklist 16 items |
| **F1-001** | 🏗️ **Arquitectura React Modular** | ⏳ EN PROCESO | Feature-folders + Zustand + Refactor src/ |
| **F1-002** | 🗄️ **Supabase DB Schema** | ⏳ TODO | 10 tablas: users, orders, payments, invoices, financial_records, audit_logs... |
| **F1-003** | 🔐 **RLS + Auth por roles** | ⏳ TODO | Admin / Cliente / Proveedor |
| **F1-004** | 🎨 **Design Tokens (Brandbook → CSS)** | ⏳ TODO | Paleta #141E16/#C8AA6E + Playfair Display + Montserrat |
| **F1-005** | 📱 **PWA App Shell + Manifest** | ⏳ TODO | manifest.json + service worker + offline fallback |
| **F1-006** | 📋 **AI_LOG_CUMPLIMIENTO.md** | ⏳ TODO | Bitácora de cumplimiento en raíz del proyecto |
| **F2-001** | ✨ **Hero Carrusel Glassmorphism** | ⏳ TODO | Embla Carousel + parallax + glass cards flotantes |
| **F2-002** | 🌐 **Secciones Landing** | ⏳ TODO | Despensa · Productos · Historia · Mapa origen · Testimonios |
| **F2-003** | 🔀 **Bifurcación B2C + B2B** | ⏳ TODO | 2 CTAs: Comprador vs Proveedor |
| **F2-004** | 📝 **Formulario Proveedores** | ⏳ TODO | Supabase + Resend notificación admin |
| **F2-005** | 🍪 **CookieBanner + Compliance UI** | ⏳ TODO | Ley 1581 + logs consentimiento en Supabase |
| **F3-001** | 🔑 **Auth Completo** | ⏳ TODO | Registro / Login / Recuperación / Redirección por rol |
| **F3-002** | ⚙️ **Dashboard Admin** | ⏳ TODO | Métricas RT · Inventario · Pedidos · Usuarios |
| **F3-003** | 👤 **Dashboard Cliente** | ⏳ TODO | Perfil · Historial · Facturas PDF · Solicitud datos |
| **F3-004** | 💳 **Zona de Pagos** | ⏳ TODO | QR dinámico + Nequi/Daviplata/PSE/Llave + confirmación WhatsApp |
| **F3-005** | 🧾 **Factura Electrónica DIAN** | ⏳ TODO | PTA Alegra API · XML UBL 2.1 · CUFE · PDF via Resend |
| **F3-006** | 💬 **WhatsApp + Email Flows** | ⏳ TODO | wa.me links + Resend: welcome → compra → factura |
| **F3-007** | 🛡️ **Seguridad OWASP** | ⏳ TODO | CSP · Rate limiting · Inputs sanitizados · Audit logs |
| **F4-001** | 📊 **Sistema Financiero** | ⏳ TODO | Recharts · Flujo de caja · IVA · Export PDF/Excel |
| **F4-002** | 📈 **Proyección de Crecimiento** | ⏳ TODO | 3/6/12 meses · 3 escenarios · Alerta stock crítico |
| **F4-003** | 📉 **Big Data — GA4 + Patrones** | ⏳ TODO | Eventos personalizados + dashboard patrones de compra |
| **F4-004** | 🤖 **AI Sommelier (Gemini)** | ⏳ TODO | @google/genai instalado. Paladar → recomendación café |
| **F4-005** | 🔍 **QA Integral** | ⏳ TODO | Lighthouse ≥ 90 · WCAG 2.1 AA · E2E · Mobile real |
| **F4-006** | 🚀 **Deploy Producción** | ⏳ TODO | Supabase prod · Vite build · Dominio · Sentry · Go-live |

---

## 📁 Documentos de Referencia — Reconstrucción

| Documento | Ruta | Descripción |
|-----------|------|-------------|
| `BRAINSTORMING_RECONSTRUCCION.html` | `Documentation/00-estrategia-lanzamiento/` | 23 ideas, TOP 5, mapa de módulos |
| `COMPLIANCE_LEGAL.html` | `Documentation/00-estrategia-lanzamiento/` | Factura DIAN + Ley 1581 + WCAG + Tributación |
| `ROADMAP_CONSTRUCCION.html` | `Documentation/00-estrategia-lanzamiento/` | 4 fases, riesgos, checklist 16 items |
| `PRESUPUESTO_CONTRATO.html` | `Documentation/00-estrategia-lanzamiento/` | Propuesta comercial + contrato 10 cláusulas · Sello MODUS AXON |

---

## 🖼️ INFRAESTRUCTURA DE LOGO — Sesión 03 Mar 2026

| # | Tarea | Estado | Nota |
|---|-------|--------|------|
| **LOGO-001** | 🔍 **Auditoría completa de logo** | ✅ COMPLETADO | Encontradas 5 instancias con `<img>` en vez de `<Logo />` |
| **LOGO-002** | 🔗 **Fuente única de verdad** | ✅ COMPLETADO | `assets/logo/svg/origen-logo-completo.svg` → import directo via SVGR |
| **LOGO-003** | 📦 **Instalar vite-plugin-svgr** | ✅ COMPLETADO | v4.5.0 — convierte SVG a React component automáticamente |
| **LOGO-004** | ⚙️ **Configurar vite.config.ts** | ✅ COMPLETADO | alias `@assets`, `fs.allow`, plugin `watch-assets`, `strictPort: true` |
| **LOGO-005** | ♻️ **Refactorizar Logo.tsx** | ✅ COMPLETADO | 79 líneas inline → 4 líneas con import. CSS `class` → `className` auto |
| **LOGO-006** | 🔄 **HMR activo para SVG externo** | ✅ COMPLETADO | `server.watcher.add(assetsPath)` — cambios en SVG reflejan en ~1-2 seg |
| **LOGO-007** | 📐 **Corrección proporciones Header** | ✅ COMPLETADO | Logo fijo `h-[32px] xl:h-[40px]` — sin resize en scroll |
| **LOGO-008** | 📐 **Corrección proporciones Footer** | ✅ COMPLETADO | `max-w-[220px] h-auto` — elimina desbordamiento y "SIERRA NEVADA" ×2 |
| **LOGO-009** | 🛑 **Puerto fijo del servidor** | ✅ COMPLETADO | `port: 5000, strictPort: true` — URL permanente: http://127.0.0.1:5000 |
| **LOGO-010** | 📄 **BUILD_PROJECT.html** | ✅ COMPLETADO | Bitácora técnica en `technical/BUILD_PROJECT.html` |

**Última actualización:** 03 Mar 2026

---

## 🏢 MODUS AXON — Identidad de Marca (Permanente)

| # | Tarea | Estado | Nota |
|---|-------|--------|------|
| **AXON-001** | 💎 **Sello MODUS AXON en PRESUPUESTO_CONTRATO.html** | ✅ COMPLETADO | Paleta #1A1A2E/#8A2BE2/#00FFFF aplicada |
| **AXON-002** | 📋 **Actualizar skill documentador-tecnico con estilos MODUS AXON** | ✅ COMPLETADO | Colores axon en templates HTML del skill |
| **AXON-003** | 📂 **Portafolio MODUS AXON — registrar origen_sierranevada** | ⏳ TODO | Agregar como caso de estudio al portafolio |
| **AXON-004** | 🌐 **Sitio web MODUS AXON** | ⏳ PLANIFICACIÓN | Nueva empresa — requiere brainstorming propio |

---

**Última actualización:** 03 Mar 2026
**Próxima acción:** Iniciar F1-001 — Arquitectura React Modular
