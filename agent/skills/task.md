# Flujo Maestro: Del Análisis al Lanzamiento

Este documento define el proceso estándar para ejecutar proyectos utilizando la biblioteca de Skills de Antigravity. Sigue este flujo para asegurar consistencia, calidad y rapidez en el despliegue.

## FASE 1: ADN y Cimientos (Branding)
**Skill Principal:** `brandbook`
1.  **Auditoría de Identidad**: Antes de escribir una sola línea de código, revisa los activos de marca del proyecto.
2.  **Configuración de Recursos**: Ajusta `recursos/estilo-visual.json` y `recursos/guia-de-textos.md` con los valores específicos del proyecto actual.
3.  **Validación**: Confirma que el tono de voz y la paleta de colores están claros para el agente.

## FASE 2: Ideación y Concepto
**Skill Principal:** `brainstorming-pro`
1.  **Definición de Ángulos**: Genera las 4 tandas de ideas (rápidas, diferentes, low effort, high impact).
2.  **Filtrado Estricto**: Puntuación 1-5 según impacto y viabilidad.
3.  **Selección del TOP 5**: Elige el concepto ganador que pasará a planificación.

## FASE 3: Hoja de Ruta (Roadmap)
**Skill Principal:** `planificacion-pro`
1.  **Faseado Técnico**: Divide el proyecto en máximo 4 fases (Prep, Prod, QA, Lanzamiento).
2.  **Definición de Entregables**: Qué debe existir al final de cada fase.
3.  **Matriz de Riesgos**: Identifica qué puede fallar y define la mitigación.

## FASE 4: Construcción (Doc to App)
**Skill Principal:** `doc-to-app`
1.  **Transformación**: Si el proyecto nace de un documento denso, usa este skill para generar la primera versión funcional (HTML/JS + JSON).
2.  **Iteración**: Si es un desarrollo manual, asegura que cada componente respete el `brandbook`.

## FASE 5: Pulido de Excelencia (QA)
**Skill Principal:** `modo-produccion`
1.  **Limpieza de Placeholders**: Eliminar todo rastro de *Lorem Ipsum*.
2.  **Auditoría Mobile-First**: Verificar que el diseño no se rompa en ninguna pantalla.
3.  **Checklist Técnico**: Validar rutas de imágenes, accesibilidad y rendimiento.

## FASE 6: Despliegue y Lanzamiento
1.  **Preparación de Artefactos**: Consolidar todos los archivos finales en la carpeta de distribución.
2.  **Verificación de Producción**: Estado final "OK para publicar".
3.  **Lanzamiento**: Ejecución de comandos de despliegue según el framework utilizado.

---

### Notas de Reutilización
- Cada vez que inicies un proyecto (ej: `coljet_va`), copia o referencia este archivo para mantener el orden.
- Si un paso falla, vuelve al skill anterior para re-ajustar instrucciones antes de avanzar.
