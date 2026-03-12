Origen Sierra Nevada SM

Proyecto de una tienda de venta de Café en diferentes marcas y presentaciones, y como productos secundarios, accesorios para café y acompañantes (dulces y salados)con base de café.
Siguiendo la teoría sobre análisis y diseño de software, análisis de datos, ciber seguridad y bases de datos.
Fuente de información para normativa vigente para marco legal Colombiano e internacional usaremos los cuadernos NotebookLM en conjunto con las habilidades de "agent" e intrucciones de procedimiento y políticas de diseño de el proyecto empresarial "MODUS AXON".
Como base se tendrá n cuenta todo lo relacionado a como diseñar un software de ventas con las siguientes características:
Fase de Análisis: Requisitos Críticos.
En esta etapa se definen las funciones "qué debe hacer" el sistema.
A. Cumplimiento Normativo (Marco Legal Colombiano)Facturación Electrónica: 
    Según la Resolución 165 de 2023 y actualizaciones de la DIAN para 2026, el software debe emitir facturas electrónicas o documentos equivalentes electrónicos (tiquete POS electrónico).
    Datos del Cliente: Por norma (Comunicado 026 de 2025 de la DIAN), solo se pueden exigir 3 datos para la factura: Nombre/Razón Social, Cédula/NIT y Correo electrónico.
    Impuestos: Cálculo automático de IVA (5%, 19%), Impuesto al Consumo y manejo de productos exentos o excluidos.
B. Requisitos Funcionales.
    * Gestión de Inventarios: Control en tiempo real con alertas de stock mínimo (stock-out) y soporte para múltiples bodegas.
    * Omnicanalidad: Integración entre la tienda física y ventas por WhatsApp o E-commerce, una tendencia crítica para 2026.
    *Cierre de Caja (Arqueo): Reportes diarios detallados de entradas (efectivo, tarjetas, transferencias tipo Nequi/Daviplata) y salidas.
Fase de Diseño: Arquitectura y CalidadAquí se define "cómo" se construye, basándose en el estándar internacional ISO/IEC 25010.
A. Características del Sistema (ISO 25010)CaracterísticaAplicación en una TiendaAdecuación Funcional
    El software debe cumplir exactamente con la venta y el pesaje (si aplica).UsabilidadInterfaz intuitiva; un cajero debe poder procesar una venta en menos de 10 segundos.
    SeguridadEncriptación de datos y roles de usuario (quién puede hacer descuentos o anular facturas).FiabilidadCapacidad de operar offline (sin internet) y sincronizar datos con la DIAN y la nube posteriormente.
B. Diseño de Interfaz (UI/UX)Diseño Responsivo: Compatibilidad con tablets y dispositivos móviles para ventas en pasillo.
    Integración de Hardware: Drivers para impresoras térmicas, lectores de códigos de barras y básculas electrónicas.
    Referencias de InvestigaciónDIAN (2025/2026): Resoluciones sobre el sistema de facturación electrónica y tiquete POS electrónico (Res. 165 de 2023 y Concepto 13246 de 2025).
    ISO/IEC 25010: Modelo de calidad de software para evaluar mantenibilidad y seguridad.
    Tendencias Retail 2026: Informes sobre omnicanalidad y automatización en puntos de venta (fuente: Impacto TIC / SoftDoit).


pendiente del origen de admin/poductos
crear filtro para que administrador busque productos por proveedor, marca, peso, tipo grano o molido.
verficar presentaciones de poductos para abrir otra caja de texto o permitir agregar datos al seleccionar "otros".
establecer la barra de pedidos pendientes con la gestión de administraor.
revisar menú de brandbook.
crear modelo de limpieza de información, y backup del proyecto
realizar cruce de ventas por productos con proveedores y detalla a la hora de cierre cuanto pagar al proveedor de acuerdo a las pautas establecidas al aprovar un producto en la tienda.
replantear las acciones en la bitacora de pedidos, colocar filtro para buscar pedidor por fecha también.
~~revisa link de logo del footer.~~
cambiar lo que dicen "nuestros rituales" por"nuestros clientes".
~~revisar logo en el header en el panel de administrador~~
revisar la finalidad del catalogo - si es posible crear el catalogo de suscripción, cuando el usuario elija suscribirse.
hacer que guía y catálogo se muestren inactivos con candado al lado, mientras no tengamos 
sesiones iniciadas.
que la imágen tenga el tamaño de la tarjeta contenedora en accesorios.
panel de proovedores, que ven, si el producto es para pago por venta de inventario!
~~revisar si el logo se esta gestionando como componente en su totalidad, no es el mismo logo en web que en tablet y móbil!~~



------------------------------------- // -----------------------------------------

09/03/2026 pule

LANDING PAGE!
~~1  Quitar del menú "catálogo" y guia de preparación y eliminar página de "suscription" y sus enlaces.~~
~~2  revisar proceso de suscripción mediante formulario de footer y que se guarde en la base de datos, por el momento arroja un error "Suscripción registrada en el sistema. Nota: El correo de bienvenida fallo (posible reestricción de modo de pruba del proveedor de correo).~~
~~3  la página esta danso un flasheo bastante inusual, mientras no se encuentra realizando ninguna acción muestra una recarga del contenido y da un pantallazo blanco por unos segundos.~~
~~4  Al hacer clicl en el manú "Guía" sin haber iniciado sesión aparece un modal de resrticción informando que solo es para usuarios registrados, no tiene botón para cierre y no cierra al realizar clic por fuera del moda,aunqye tiene el loco en gota de agua en la parte baja del modal, al hacer clic debería enviar  al usuario al inicio.~~
~~5  Revisar logo de footer (react-component) que no redirige al inicio o  home.~~
~~6  Cuando cliente realice scroll hacia abajo en la página de inicio, debe aparecer un elemento al lado izquierdo del fab de chat también redondo con la flecha indicando de volver al inicio.~~
~~7  El logo header en la sección de antojitos no redirige al inicio o  home.~~
~~8  revisar el componente de logo en el header y footer, que sea el react-component, y si existen logos en otras páginas que correspondan al react-component eliminarlos y aplicar el react-component.~~
~~9  El logo en accesorios tampoco encia al inicio o  home, que en este caso es "cafetal".~~
10  recuperación de contraseña despues de 5 intentos fallidos debe enviar un correo con un enlace para restablecer la contraseña, si el correo no se envia debe mostrar un mensaje de error.
~~11  Retirar del proyecto la palabra ritual!~~
12  Recibir el correo al registrarse (PENDIENTE: Configurar Site URL a puerto 5000 y añadir BREVO_API_KEY en Supabase).
~~13  sacar la palabra gremio, que diga simplemente "unete a nosotros"~~
~~14  verificar si la llave está llegando a la función (DIAGNÓSTICO: Migrado a Brevo para mayor facilidad).~~

    

------------------------------------- // -----------------------------------------
                             ## 10/03/2026 pule
------------------------------------- // -----------------------------------------

1̶ ̶-̶ ̶C̶o̶n̶f̶i̶g̶u̶r̶a̶r̶ ̶B̶R̶E̶V̶O̶ ̶(̶C̶l̶a̶v̶e̶ ̶A̶P̶I̶ ̶o̶b̶t̶e̶n̶i̶d̶a̶,̶ ̶f̶a̶l̶t̶a̶ ̶g̶u̶a̶r̶d̶a̶r̶ ̶e̶n̶ ̶S̶u̶p̶a̶b̶a̶s̶e̶)̶.̶
2̶ ̶-̶ ̶M̶o̶d̶i̶f̶i̶c̶a̶c̶i̶ó̶n̶ ̶d̶e̶l̶ ̶f̶l̶u̶j̶o̶ ̶d̶e̶ ̶u̶s̶u̶a̶r̶i̶o̶s̶ ̶e̶l̶i̶m̶i̶n̶a̶d̶o̶s̶ ̶o̶ ̶b̶a̶n̶ - e̶a̶d̶o̶s̶.̶
3 - Se ha implementado el borrado absoluto (Hard Delete) del sistema (Auth y Perfil) cuando se elimina sin notas de seguridad.
4 - Revisar acciones en bitácora de pedidos, adecuar las acciones para que se ejecuten y permitan un flujo real de acciones secuenciales concernientes al proceso de venta y post-venta.
5 - Revisión de los colores en los botónes, colorimetría al hacer hover sobre botones y contraste de las listas de acciones sobre el proceso de la venta de un  producto!
6 - Distribución adecuada en la fila bitácora de los lementos que componen la bitácora, para que se vean de manera ordenada y clara.
7 - Eleiminar todas las notificaciones pop-up a modales estilizados con los mismos colores y diseño que el resto de la aplicación.
8 - Se elimina el selector de Ajuste Manual (el que decía "POR VALIDAR" con el icono de flecha).
9 - Corregidos los errores en la sección de seguimiento de pedido para que reflejen con precisión el flujo real del negocio y se han solucionado los problemas de visualización de precios.
10 - corregido el problema de persistencia y he añadido la funcionalidad de cancelación para el administrador.
11 - regresar al panel principal (Dashboard), he realizado un par de mejoras en la navegación de la página de productos:
    - Barra de Navegación Superior: He añadido el AdminHeader a la parte superior. Ahora puedes simplemente hacer clic en el logo de Origen o en el texto que dice "DESPENSA CENTRAL" para volver al panel principal instantáneamente.
    - Botón de "Volver" dedicado: Justo al lado del título "Maestro de Productos", ahora verás un botón redondo con una flecha (arrow_back). Este botón también te llevará de regreso al Dashboard.

12 -  añadido una sección de Gráficos de Comportamiento dentro de los detalles de cada proveedor.
13 - Revisión y adecuación de la sección de brandbook.
        1 - Activación de Enlaces Huérfanos: He implementado las secciones que faltaban en el código pero que estaban listadas en el menú lateral:
            - Tono de Voz (#voice): Añadido con pautas de comunicación y ejemplos comparativos (Correcto vs. Incorrecto).
            - Elementos UI (#ui): Una vitrina visual con botones, tarjetas de producto y estilos de inputs para asegurar la consistencia digital.
            - Fotografía (#photography): Definición del estilo visual (luz natural, texturas orgánicas y composiciones editoriales).
        2 - Corrección de Navegación:
            - El botón de "Explorar Manual" ahora lleva correctamente a la primera sección.
            - Se restauraron los iconos faltantes y se corrigieron errores de sintaxis en los componentes de UI.
            - El acceso al Panel Admin y el Cierre de Sesión están totalmente operativos.
        3 - Verificación de Recursos: He confirmado que los logotipos y archivos SVG corporativos están en sus carpetas correspondientes para que no haya imágenes rotas.

14 - Sincronización de precios y presentaciones en los productos.
15 - creación de productos para que los precios se gestionen exclusivamente a través de las presentaciones.
16 - Limpieza de interfaz: Se eliminó el Perfil Sensorial, el enlace "Conoce más" y la opción de peso manual "OTROS" para simplificar la experiencia de compra.
17 - Inteligencia de Variantes: Se agregaron campos específicos por categoría (Molienda para café, Unidades/Peso para Antojitos) dentro de cada presentación en el panel administrador.
18 - Sincronización de Disponibilidad: El sistema ahora automatiza el cálculo de stock total y marca productos como "No Disponibles" si no tienen presentaciones válidas con existencia, evitando pedidos fallidos.
19 - causa del problema que te impedía guardar el producto en la sección de "Antojitos" (y potencialmente en otras) con esa imagen!
20 - Reordenar la posición del elemento, "selecciona la despensa" primero que las características del producto.
21 - Revisión de productos que no existen en stock sin embargo se pueden comprar!
22 - Ajustar la vista de los antojos igual que los accesorios!
23 - Crear las cards de control de las secciones de la landing page desde el panel de administrador.
24 - implementado una barrera de seguridad en CheckoutPage que consulta el stock fresco de la base de datos justo antes de cerrar la venta, impidiendo discrepancias entre el carrito y la existencia real.

        🛡️ Nivel Base de Datos (Trigger): El sistema ahora REVIERTE la transacción si el stock es insuficiente. No hay manera de crear un pedido si no hay unidades disponibles.
        ⚡ Nivel Contexto (Auto-sincronización): Al abrir la página, el carrito consulta a Supabase y ajusta automáticamente las cantidades al stock actual (ej: de 13 a 3).
        ⚠️ Nivel UI (Checkout): He agregado advertencias visuales en rojo en el resumen y el botón de pago ahora se bloquea y cambia a "Corregir Stock" si detecta una discrepancia.

25 - Consulta a la base de datos CADA vez que presionas el botón + del carrito, impidiendo subir la cantidad más allá del stock real en milisegundos.
26 - Ajusta automáticamente el carrito al abrirlo: Si un producto se agota mientras el usuario navega, al abrir el carrito la cantidad bajará de 61 a 10 (o lo que haya) automáticamente.
27 - Trigger Blindado: He reescrito la función de base de datos para que Falle y Revierta cualquier pedido si los IDs son inválidos o el stock es insuficiente, manejando de forma segura los valores nulos o registros faltantes.


Resumen de hoy:
    01 - Checkout Blindado: Resolvimos el error técnico de recursión en Supabase y mejoramos la validación visual para el usuario.
    02 - Rastreo Universal: Todo cliente, tenga cuenta o no, ya puede seguir su pedido de café con el nuevo sistema de radar.
    03 - Estándar MODUS AXON: El proyecto ya cuenta con su secuencia documental oficial (Cumplimiento, Visión, Tech Specs).
    04 - Sincronización Total: Todos tus repositorios están ahora al día y respaldados en la nube.
    


------------------------------------- // -----------------------------------------
                                11/03/2026 pule
------------------------------------- // -----------------------------------------

01 - Revisión del dashboard de usuarios y proveedores.
02 - Revisión de version UI-UX de dispositivos móviles.
03 - Migración total y definitiva de Resnd a BREVO.
04 - Configuración de SMTP de supabase para Brevo.
05 - Automatización de aprobación de cuentas.
06 - Revisión de rendimiento de la web.

------------------------------------- // -----------------------------------------
                                11/03/2026 - Segunda sesión
------------------------------------- // -----------------------------------------

🚀 OPTIMIZACIÓN CRÍTICA DE RENDIMIENTO - Despensas:

Problema Identificado: Las despensas (Cafetal, Accesorios, Antojitos) no cargaban productos. El spinner giraba indefinidamente.

Causas Raíz:
    1. getAllProducts() cargaba TODOS los productos + TODAS las variantes de una sola vez (sin límites)
    2. Errores de compilación TypeScript que ralentizaban el dev server
    3. Imports inválidos impidiendo resolución de tipos

Soluciones Implementadas:

01 - Optimización de Queries a Supabase:
    ✓ Implementada paginación en getAllProducts() (límite: 100 productos)
    ✓ Lazy loading de variantes (se cargan bajo demanda, no al inicio)
    ✓ Nueva función getProductsByCategory() para filtrado server-side
    ✓ Reducción de ~80% en datos cargados inicialmente

02 - UI Mejorada en ProductManager:
    ✓ Agregada barra de filtrado por categoría (Cafetal, Accesorios, Antojitos)
    ✓ Cambios de categoría sin recargar toda la página
    ✓ Mejor experiencia UX con botones responsivos

03 - Correcciones de Compilación (errores TypeScript):
    ✓ Fixed imports: '../shared/types' → '@/shared/types'
      - catalogPdfService.ts
      - products.ts
    ✓ Fixed React types en useIntersectionObserver.ts
    ✓ Eliminados archivos de error compilación previos

04 - Correcciones de Navegación (Logos):
    ✓ Logo Footer → redirige a home (/)
    ✓ Logo Header Desktop → redirige a home (/)
    ✓ Logo Header Mobile → redirige a home (/)
    ✓ Logo AdminHeader → redirige a admin dashboard (/admin)

Resultado:
    ⚡ Carga de productos ahora es instantánea por categoría
    ✅ Compilación limpia sin errores
    🔗 Navegación completa vía logos.

    

------------------------------------- // -----------------------------------------
                                11/03/2026 - Tercera sesión
------------------------------------- // -----------------------------------------

~~01 - Las secciones de "nuestra historia" y "trazabilidad" que solo sean visibles si el usuario selecciona la despensa de "cafetal" y éstas mostrarán información deacuerdo al café que se encuentre activo en el viwer. por lo tanto, la información de "nuestra historia" y "trazabilidad", debe integrarse en la sección donde el administrador maneja la información de dicho producto~~

02 - Recuperación de contraseña tras 5 intentos fallidos debe enviar correo de restablecimiento (ver ítem 10 del 09/03).
03 - Correo de bienvenida al registrarse (pendiente: configurar Site URL a puerto 5000 + BREVO_API_KEY en Supabase).
04 - Filtro en ProductManager por proveedor, marca, peso, tipo de grano / molido.
05 - Catálogo de suscripción activo solo para usuarios registrados (candado para no autenticados).
06 - Panel de proveedores: indicador de tipo de pago (inventario vs. comisión por venta).
07 - Imagen de accesorios con tamaño ajustado a su tarjeta contenedora.

------------------------------------- // -----------------------------------------
                            SESIÓN III — Resumen de Implementación
------------------------------------- // -----------------------------------------

✅ Historia & Trazabilidad dinámicas por café activo:
   - Nueva columna `traceability JSONB` en tabla `products` (Supabase MCP).
   - `HistoriaSection` y `MapaOrigenSection` ahora reciben el producto activo vía props.
   - Solo se renderizan cuando la categoría activa en el viewer es "Cafetal".
   - El contenido cambia automáticamente al navegar entre cafés.
   - ProductManager: nuevos campos Historia y Trazabilidad solo visibles para categoría `cafetal`.
   - Eliminada la opción "Todas" del selector de despensa en el formulario de creación de productos.

✅ Documentación técnica MODUS AXON:
   - Project Vision v2.0 · Technical Spec v2.1 · AI Compliance v3.2 · Manual Local v2.0
   - Bitácora actualizada con entradas 012–020 (sesiones II y III del 11-03-2026).


