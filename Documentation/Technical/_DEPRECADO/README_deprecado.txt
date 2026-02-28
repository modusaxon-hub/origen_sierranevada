📦 CARPETA _DEPRECADO
═════════════════════════════════════════════════════════════════

Esta carpeta contiene archivos cuyo contenido ha sido MIGRADO O CONSOLIDADO
a la nueva estructura de documentación técnica (28-Feb-2026).

ESTOS ARCHIVOS ESTAN PENDIENTES DE ELIMINACION DEFINITIVA
tras verificar que todo su contenido fue absorbido correctamente.

──────────────────────────────────────────────────────────────────

ARCHIVOS EN ESTA CARPETA Y SU ESTADO:

1. GITHUB_SETUP.html
   → Contenido absorbido en: 00-INICIALIZACION/AMBIENTE_LOCAL.md
   → Razón: El repo ya existe, configuración ya realizada (una sola vez)

2. ERROR_LOG.html
   → Contenido absorbido en: 05-CAMBIOS/CHANGELOG.md (Sección "Errores Históricos")
   → Razón: Todos los errores registrados ya están resueltos

3. NEXT_STEPS.html ⚠️ EXPONE CREDENCIALES
   → DEBE SER ELIMINADO INMEDIATAMENTE
   → Razón: Exposición de seguridad (password admin en HTML)

4. README.html
   → Contenido absorbido en: README.md (nuevo índice)
   → Razón: Índice visual que no aplica a nueva estructura

5. REQ_checkout_facturacion.html
   → Contenido absorbido en: 02-ESPECIFICACIONES/REQUIREMENTS.md
   → Razón: Funcionalidad ya implementada y documentada en otro lugar

6. REQ_selector_presentaciones.html
   → Contenido absorbido en: 02-ESPECIFICACIONES/REQUIREMENTS.md
   → Razón: Funcionalidad ya implementada (variantes dinámicas en Supabase)

7. REPORTE_PRUEBAS_FEEDBACK.html
   → Contenido absorbido en: 04-OPERACIONES/QA_REPORTS.md
   → Razón: Duplicado del .md (la versión .md es más completa)

8. RESPONSIVE_HIERARCHY.html
   → Contenido absorbido en: 03-GUIAS-DESARROLLO/RESPONSIVE_GUIDELINES.md
   → Razón: Duplica conceptos de responsive_guidelines.html (consolidado)

──────────────────────────────────────────────────────────────────

ACCION RECOMENDADA:

1. Esperar 1 sprint (o hasta confirmar que todo está correcto)
2. Verificar que NO queda contenido único o crítico en estos archivos
3. Eliminar toda la carpeta _DEPRECADO definitivamente
4. Hacer commit: "docs: eliminar carpeta _deprecado tras reorganización"

COMANDO PARA ELIMINAR (cuando esté listo):
  rm -rf _DEPRECADO

──────────────────────────────────────────────────────────────────

SEGURIDAD:
- El archivo NEXT_STEPS.html expone credenciales.
- ANTES de eliminar _DEPRECADO: verificar con `git log` que no queda rastro
- Usar `git filter-repo` si credenciales aparecen en historial

──────────────────────────────────────────────────────────────────

Generado: 28-Feb-2026
Reorganización completada por: Agente Documentador Técnico Pro
Proyecto: Origen Sierra Nevada
