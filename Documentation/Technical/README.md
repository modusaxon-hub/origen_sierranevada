# 📚 Documentación Técnica — Origen Sierra Nevada

**Última actualización:** 28 de Febrero, 2026
**Versión:** 2.0 — Estructura reorganizada
**Estado del proyecto:** Fase 12 — En desarrollo activo

---

## 🗂️ Estructura de Carpetas

### `00-INICIALIZACION/`
Setup del entorno de desarrollo local.
- **AMBIENTE_LOCAL.md** — Clonar repo, npm install, Supabase .env, Vite dev, Zrok tunnel
- **INSTALACION.md** — Prerequisitos, pasos iniciales

### `01-ARQUITECTURA/`
Decisiones técnicas que definen cómo funciona el sistema.
- **DECISIONES_TECNICAS.md** — Moneda COP, IVA incluido, campos DIAN, logística
- **TECH_STACK.md** — React 19 + Vite + TypeScript + Supabase
- **Diagrams/** — Esquemas visuales (ERD, flowcharts)

### `02-ESPECIFICACIONES/`
QUÉ debe hacer el sistema.
- **REQUIREMENTS.md** — Requisitos funcionales (RF-01 a RF-0N), casos de uso, módulos

### `03-GUIAS-DESARROLLO/`
CÓMO contribuir y construir.
- **RESPONSIVE_GUIDELINES.md** — Breakpoints, touch targets, jerarquía visual mobile/desktop
- **ESTILO_CODIGO.md** — Estándares React, PascalCase, camelCase, conventions

### `04-OPERACIONES/`
Estado actual y mantenimiento del sistema.
- **QA_REPORTS.md** — Smoke tests, score de cumplimiento, gaps críticos
- **SEO_COMPLIANCE.md** — Auditoría legal (Ley 1581, Ley 1480), hallazgos SEO
- **WOMPI_SETUP.md** — Integración pasarela de pagos (pendiente producción)
- **TROUBLESHOOTING.md** — Errores históricos resueltos

### `05-CAMBIOS/`
Historial y futuro del proyecto.
- **CHANGELOG.md** — Registro de cambios por fecha y fase
- **ROADMAP.md** — Próximos pasos y fases futuras

### `06-EVIDENCIAS-ACADEMICAS/`
Documentación oficial para entregas SENA (NO modificar).
- **Reporte_Calidad_GA11.html** — Evidencia formal (GA11-220501098-AA1-EV02)

### `_DEPRECADO/`
Archivos en transición (pendientes de eliminación tras verificación).
- Contiene documentos migrados/consolidados cuyo contenido ya fue absorbido
- Mantener 1 sprint antes de eliminar definitivamente

---

## 📌 Documentos Maestros (en raíz)

- **MASTER_PLAN.md** — Gobernanza histórica, timeline de fases, infraestructura Supabase
- **AUDITORIA_DOCUMENTACION.html** — Análisis completo de reorganización (referencia)

---

## 🔍 Cómo Navegar Esta Documentación

**Si necesitas...**
- ✅ Empezar desarrollo → Lee `00-INICIALIZACION/AMBIENTE_LOCAL.md`
- ✅ Entender decisiones arquitectónicas → Lee `01-ARQUITECTURA/DECISIONES_TECNICAS.md`
- ✅ Implementar una feature → Lee `02-ESPECIFICACIONES/REQUIREMENTS.md`
- ✅ Escribir código limpio → Lee `03-GUIAS-DESARROLLO/RESPONSIVE_GUIDELINES.md`
- ✅ Ver estado QA → Lee `04-OPERACIONES/QA_REPORTS.md`
- ✅ Entender gaps legales → Lee `04-OPERACIONES/SEO_COMPLIANCE.md`
- ✅ Ver qué cambió → Lee `05-CAMBIOS/CHANGELOG.md`
- ✅ Saber qué viene → Lee `05-CAMBIOS/ROADMAP.md`

---

## 🔐 Seguridad

- **Conditions.txt** — Recordatorios locales personales. NO versionar (ignorado en .gitignore).
- **Credenciales:** Usar exclusivamente variables `.env` — NUNCA en archivos versionados.
- **Búsqueda de seguridad:** `grep -r "password\|token\|secret" Documentation/Technical/ --include="*.md"`

---

## 📊 Estadísticas

- **Documentos activos:** 12 archivos Markdown + Diagrams
- **Archivos deprecated:** 8 (en `_DEPRECADO/`, pendientes eliminación)
- **Consolidaciones completadas:** 6 (QA, Requirements, Ambiente, Responsive, Changelog, Roadmap)
- **Última reorganización:** 28-Feb-2026

---

## 🚀 Próximos Pasos

1. **Leer MASTER_PLAN.md** para entender gobernanza del proyecto
2. **Ejecutar AMBIENTE_LOCAL.md** para tener dev local funcionando
3. **Revisar SEO_COMPLIANCE.md** — Hay gaps críticos sin resolver
4. **Preparar WOMPI_SETUP.md** — Siguiente fase requiere integración de pagos

---

**Generado por:** Agente Documentador Técnico Pro
**Proyecto:** Origen Sierra Nevada — E-commerce Café Premium
**Repositorio:** https://github.com/manuelpertuz624-eng/origen-sierra-nevada
