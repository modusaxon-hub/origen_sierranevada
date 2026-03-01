# SEO & Compliance Audit Report - Origen Sierra Nevada

**Fecha:** 2026-02-08
**Estado:** Global Audit Completed
**Prioridad:** Crítica (Debido a vulnerabilidades legales)

---

## 1. Hallazgos Críticos (Legales & Accesibilidad)

| ID | Hallazgo | Norma | Gravedad | Recomendación |
|:---|:---|:---|:---|:---|
| L01 | **Violación de Habeas Data** | Ley 1581 (2012) | 🚨 Crítica | Añadir checkbox obligatorio de "Acepto Política de Tratamiento de Datos" en el formulario del Newsletter. |
| L02 | **Enlaces Legales Rotos** | Ley 1480 (2011) | 🚨 Crítica | Configurar rutas reales para "Política de Privacidad" y "Términos y Condiciones". Actualmente apuntan a `#`. |
| L03 | **Idioma Incorrecto** | NTC 5854 | 🟡 Media | Cambiar `<html lang="en">` a `<html lang="es">` en `index.html`. |
| A01 | **Jerarquía de Encabezados** | WCAG 2.1 | 🔴 Alta | El `H2` aparece antes que el `H1` en `HomePage.tsx`. Cambiar el orden semántico. |
| A02 | **Alt Text Inadecuado** | NTC 5854 | 🟡 Media | Imágenes decorativas tienen descripciones innecesarias o faltantes. Usar `alt=""` para decorativas. |

---

## 2. Hallazgos Técnicos (SEO & Rendimiento)

| ID | Hallazgo | Categoría | Impacto | Recomendación |
|:---|:---|:---|:---|:---|
| T01 | **Uso de HashRouter** | Arquitectura | 🔴 Alto | Cambiar `HashRouter` por `BrowserRouter` para que Google indexe rutas limpias (sin `/#/`). |
| T02 | **Falta de Robots.txt** | Indexación | 🔴 Alto | Crear `public/robots.txt` para guiar a los rastreadores. |
| T03 | **SEO Component no Renderizado** | Metadatos | 🔴 Alto | El componente `SEO.tsx` está importado en `HomePage.tsx` pero no se utiliza. Metatags no se actualizan dinámicamente. |
| T04 | **Imágenes Pesadas (Non-WebP)** | Core Web Vitals | 🔴 Alto | `cafe_malu_full_composition.png` (2.1MB) y similares deben convertirse a WebP/AVIF. |
| T05 | **Falta de LCP Priority** | Performance | 🟡 Medio | Añadir `fetchpriority="high"` a la imagen principal del Hero. |
| T06 | **Falta de Schema.org** | Semántica | 🟡 Medio | Implementar `SoftwareApplication` o `Product` JSON-LD para mejor visibilidad en fragmentos enriquecidos. |

---

## 3. Hallazgos Semánticos (Contenido & GEO)

| ID | Hallazgo | Contexto | Recomendación |
|:---|:---|:---|:---|
| S01 | **Estructura BLUF Ausente** | Google/AI Search | Refactorizar introducciones para responder preguntas directas (e.g., "¿Qué es el café de especialidad de la Sierra Nevada?"). |
| S02 | **Falta de Entidades** | Conocimiento | Vincular menciones de "SCA Score" o "Sierra Nevada" a fuentes externas de autoridad. |

---

## 4. Próximos Pasos (Hoja de Ruta)

1. **Inmediato:** Arreglar Checkbox de Privacidad y Canonical Tags.
2. **SEO Técnico:** Migrar a `BrowserRouter` y crear `robots.txt`.
3. **Performance:** Optimización de imágenes y precarga de LCP.
4. **Semántica:** Implementar Schema JSON-LD.
