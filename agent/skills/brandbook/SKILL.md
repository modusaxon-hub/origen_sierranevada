---
name: brandbook
description: Estándar de marca. Úsalo siempre que generes interfaz, landing, componentes, copies, textos de botones o cualquier contenido visible para el usuario.
---

# Skill: Estilo y Marca

Marca: Origen Sierra Nevada

## Cuándo usar este Skill
- Si vas a diseñar una UI o una pantalla.
- Si vas a crear una landing.
- Si vas a escribir textos: titulares, CTAs, botones, mensajes de error, descripciones.
- Si vas a generar assets "de cara al usuario".

## Regla número 1
No improvises el estilo. Si falta un dato, pregunta o usa los valores definidos en los recursos.

## Dónde mirar según el tipo de tarea
- **Estilo visual** (colores, tipografías, espaciado): `recursos/estilo-visual.json`
- **Forma de escribir** (tono, estructura, vocabulario): `recursos/guia-de-textos.md`
- **Decisiones técnicas** (framework, estilos, librerías): `recursos/reglas-tecnicas.md`

## Checklist antes de entregar
1) ¿Parece de la misma marca que lo anterior?
2) ¿Titulares y CTAs son concretos (no genéricos)?
3) ¿La jerarquía visual está clara (título, subtítulo, acciones)?
4) ¿El texto es corto y entendible a la primera?
5) ¿No se han inventado colores/estilos fuera de la guía?

## Cómo mejorar este Skill
Si algo no cuadra, no "lo arregles en el prompt": ajusta los recursos y vuelve a generar. El objetivo es que el estándar se quede guardado.

## 📁 Entrega de Manuales e Informes (A4)
Todos los manuales de identidad o informes de marca deben entregarse en **HTML Autocontenido** optimizado para impresión A4, manteniendo el rigor estético de Origen Sierra Nevada:
- CSS embebido con `@media print { size: A4; margin: 2cm; }`.
- Distribución impecable sin hojas en blanco innecesarias.
- Tipografía premium (Playfair Display / Inter).
