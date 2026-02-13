---
name: modo-produccion
description: Experto en QA y pulido final de aplicaciones/landings. Detecta problemas típicos, asegura la excelencia visual y técnica, y elimina placeholders para dejar el proyecto listo para entrega o publicación.
---

# Modo Producción (QA + Fix)

## Cuándo usar este skill
- Cuando ya tienes algo generado (landing/app) y quieres dejarlo "presentable".
- Cuando algo funciona "a medias" (móvil raro, imágenes rotas, botones sin acción, espaciados feos).
- Antes de enseñarlo a un cliente, grabarlo para una demo o publicarlo oficialmente.

## Inputs necesarios
1) **Archivo o Ruta**: Qué archivo es el principal (ej: `index.html`) o ruta del proyecto.
2) **Objetivo de la revisión**: "Listo para enseñar" o "Listo para publicar".
3) **Restricciones**: Qué NO tocar (ej: no cambiar branding, no cambiar copy, no tocar estructura).

## Workflow
1) **Diagnóstico Rápido**: Generar una lista de problemas en 5-10 bullets priorizados.
2) **Plan de Arreglos**: Definir "qué cambio y por qué" (máximo 8 cambios de alto impacto).
3) **Ejecución**: Aplicar los cambios modificando los archivos necesarios.
4) **Validación**: Volver a abrir la preview/localhost y confirmar el cumplimiento del checklist.
5) **Resumen Final**: Listar cambios hechos y qué queda opcional para mejorar en el futuro.

## Checklist de Calidad (Orden Fijo)
### A) Funciona y se ve
- La preview/localhost carga sin errores.
- Las imágenes cargan correctamente (sin rutas rotas).
- Tipografías y estilos se aplican según lo esperado.

### B) Responsive (Móvil Primero)
- Se ve bien en móvil (sin cortes, sin scroll horizontal).
- Botones y textos tienen tamaños legibles en pantallas táctiles.
- Las secciones tienen un espaciado (padding/margin) coherente.

### C) Copy y UX Básica
- Titular claro y coherente con la propuesta de valor.
- CTAs consistentes (mismo verbo, misma intención).
- **CRÍTICO: No hay texto "placeholder" tipo lorem ipsum.**

### D) Accesibilidad Mínima
- Contraste razonable en todos los textos.
- Imágenes con atributo `alt` descriptivo.
- Estructura de headings (H1, H2, etc.) jerárquicamente lógica.

## Instrucciones y Reglas
- **Respeto a la Marca**: No cambies el estilo de marca si existe un skill de marca activo.
- **Enfoque Quirúrgico**: No rehagas todo; corrige lo mínimo necesario para ganar calidad rápidamente.
- **Claridad > Estética**: Si hay un conflicto entre algo "bonito" y algo "claro", prioriza siempre la claridad.

## Output (Formato Exacto)
1) **Diagnóstico** (listado priorizado).
2) **Cambios Aplicados** (lista corta de impactos).
3) **Resultado Final**: "OK para enseñar" o "OK para publicar" + notas adicionales.
