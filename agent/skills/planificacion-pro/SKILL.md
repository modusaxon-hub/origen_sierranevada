---
name: planificacion-pro
description: Convierte una idea en un plan ejecutable por fases, con checklist, riesgos y entregables. Úsalo cuando haya que pasar de idea a acción sin improvisar.
---

# Planificación Pro

## Cuándo usar este skill
- Cuando el usuario pida un plan paso a paso, una estrategia o una hoja de ruta.
- Cuando haya que entregar algo (landing, vídeo, proyecto, lanzamiento) con tiempos definidos.
- Cuando el usuario tenga muchas tareas sueltas y necesite orden y estructura.

## Inputs necesarios
1) **Resultado final**: Definición clara de qué significa "terminado".
2) **Fecha límite o ritmo**: Plazo de entrega o cadencia de trabajo (ej: esta semana, sin prisa).
3) **Recursos disponibles**: Herramientas, equipo, presupuesto, tiempo diario dedicado.
4) **Criterios de éxito**: Qué condiciones debe cumplir el resultado para ser considerado excelente.

## Workflow
1) **Definición de Éxito**: Define el resultado final en 1 frase y lista 3 criterios de éxito clave.
2) **Faseado**: Divide el trabajo en un máximo de 4 fases (ej: Preparación, Producción, Revisión, Entrega).
3) **Detalle de Fases**: Para cada fase, define:
    - Tareas ordenadas cronológicamente.
    - Entregable claro (qué sale de esa fase).
    - Tiempo estimado por tarea.
4) **Gestión de Riesgos**: Identifica 3-5 riesgos potenciales y sus medidas de mitigación (Si pasa X -> hago Y).
5) **Cierre**: Genera una checklist final de validación.

## Instrucciones y Reglas de Calidad
- **Priorización**: Evita planes infinitos; prioriza siempre lo que desbloquea el siguiente paso.
- **Dependencias**: Indica claramente si una tarea depende de otra ("esto depende de X").
- **Adaptabilidad**: Si el usuario es principiante, simplifica pasos; si es avanzado, incluye optimizaciones y atajos.

## Output (formato exacto)
1) **Resumen de Objetivo**: Resultado final + 3 criterios de éxito.
2) **Plan por Fases**: Tabla o lista detallada con tareas, tiempos y entregables por fase.
3) **Matriz de Riesgos**: Listado de Riesgo -> Mitigación.
4) **Checklist Final**: Lista de verificación para dar el proyecto por concluido.

## 📁 Formato de Salida e Impresión (A4)
Las entregas finales deben ser en **HTML Autocontenido** optimizado para impresión A4, siguiendo el estándar de marca:
- CSS embebido con `@media print { size: A4; }`.
- Distribución limpia sin hojas en blanco innecesarias.
- Tipografía legible (Inter/Playfair Display).
