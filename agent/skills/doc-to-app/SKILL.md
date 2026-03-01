---
name: doc-to-app
description: Convierte un documento (PDF o texto) en una mini-app web interactiva funcional (HTML/JS) con buscador y filtros. Úsalo para transformar contenido denso en un producto usable y navegable.
---

# Doc-to-App (Documento a Mini-App)

## Cuándo usar este skill
- Cuando tengas información en un PDF, texto largo o notas y quieras transformarla en una mini web navegable.
- Cuando necesites convertir un catálogo, guía, checklist o itinerario en una herramienta interactiva.
- Cuando quieras presentar contenido de forma profesional, lista para enseñar o compartir.

## Inputs necesarios
1) **Fuente**: Contenido del PDF o texto pegado.
2) **Tipo de app**: Definir si será una guía, catálogo, checklist, itinerario, etc.
3) **Prioridad**: "Más visual" o "más práctica/funcional".
4) **Idioma y estilo**: Estilo de redacción (ej: claro, sencillo, sin jerga).

## Workflow
1) **Extracción**: Leer el documento y extraer la estructura (secciones, listas, tablas, puntos clave).
2) **Estructuración**: Convertir la información a un archivo `data.json` ordenado.
3) **Generación**: Crear un archivo `index.html` (interfaz) que consuma los datos de `data.json` (usar Vanilla HTML/JS, sin frameworks pesados).
4) **Pulido y QA**: Validar que la búsqueda funcione, los filtros operen correctamente y el diseño sea *mobile-first*.
5) **Entrega**: Informar al usuario la carpeta creada y los archivos generados.

## Instrucciones y Reglas Críticas
- **Prohibido el Solo Texto**: No devuelvas solo el texto formateado. Debes crear archivos funcionales y una vista previa real.
- **Gestión de Carpetas**: No sobrescribas nada. Cada ejecución debe crear una carpeta nueva dentro del proyecto con el nombre: `miniapp_<tema>_<YYYYMMDD_HHMM>`.
- **Funcionalidades Obligatorias**:
    - Buscador por texto.
    - Filtros por categorías o etiquetas (cuando tenga sentido).
    - Navegación clara por secciones (índice lateral o superior).
    - Diseño limpio, legible y responsive (mobile-first).
    - Botones útiles según contexto: "copiar", "marcar como hecho", "expandir/contraer".

## Output (Formato de Respuesta)
### Archivos a Crear
- `miniapp_<tema>_<timestamp>/index.html`
- `miniapp_<tema>_<timestamp>/data.json`
- `miniapp_<tema>_<timestamp>/README.txt` (cómo abrirla y qué incluye).

### Respuesta en Chat
- **Carpeta creada**: [Ruta absoluta]
- **Archivo principal**: [Enlace al index.html]
- **Resumen**: Breve descripción de las secciones y funcionalidades implementadas.
