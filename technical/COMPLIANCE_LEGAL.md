# 🛡️ COMPLIANCE_LEGAL.md
## Marco Normativo y Cumplimiento Técnico (Colombia)

| Proyecto | Origen Sierra Nevada |
|----------|------------------|
| **Firma** | MODUS AXON |
| **Fecha** | 2026-03-09 |
| **Versión** | v1.2.0 |

---

## ⚖️ 1. Protección de Datos Personales (Ley 1581 de 2012)
Cumplimiento del derecho constitucional de Habeas Data para usuarios y clientes.

### Requerimientos Técnicos Implementados:
- **Autorización Previa**: Todo formulario de registro o contacto (Checkout, Newsletter) incluye un checkbox de aceptación de términos y política de privacidad (No pre-marcado).
- **Finalidad del Tratamiento**: Los datos se recolectan exclusivamente para la gestión de pedidos, envíos y comunicaciones de marca.
- **Seguridad (Art. 19)**: 
    - Cifrado en tránsito (SSL/TLS).
    - Hashing de contraseñas mediante Supabase Auth (Argon2/bcrypt).
    - **RLS (Row Level Security)**: Aislamiento estricto de datos; los usuarios solo acceden a su propia información.
- **Canales de Ejercicio**: Se define el correo de soporte en los términos legales para que el titular pueda conocer, actualizar o suprimir sus datos.

---

## 🧾 2. Facturación Electrónica y Régimen Tributario (DIAN)
Basado en la normativa para no responsables de IVA (Anterior Régimen Simplificado).

### Estado Tributario:
- **Régimen**: No Responsable de IVA (Art. 437 ET).
- **Impacto en Software**: 
    - IVA calculado y mostrado como **0%**.
    - Leyenda obligatoria en factura/comprobante: *"No Responsable de IVA — Actividad excluida Art. 437 ET"*.

### Implementación Técnica de Facturación (F3-005):
- **Idempotencia**: Una orden genera una única factura mediante `invoiceService`.
- **CUFE (Código Único de Factura Electrónica)**: Generado mediante SHA-384 combinando `orderId`, fecha, monto y un secreto técnico vía Web Crypto API.
- **QR de Validación**: Redirige a la ruta `/track/:orderId` para verificación de autenticidad del documento.
- **Generación de PDF**: Función `window.print()` optimizada con estilos CSS `@media print` para formato legal.

---

## ☕ 3. Normativa de Comercialización de Café (Ley 126 de 1931)
Garantía de pureza y origen para el consumidor.

- **Pureza**: El sistema solo permite catalogar productos que cumplan con la denominación "Café" (100% puro).
- **INVIMA**: Los campos de producto incluyen metadatos para Registro Sanitario, lote y fecha de vencimiento (Obligatorio para eCommerce de alimentos en Colombia).
- **Transparencia**: Fichas técnicas de producto con perfil de taza, altura, origen (Sierra Nevada de Santa Marta) y proceso (Lavado, Honey, etc.).

---

## 🌐 4. Comercio Electrónico (Ley 1480 de 2011 - Estatuto del Consumidor)
Protección al comprador en entornos digitales.

- **Derecho al Retracto**: Informado en los T&C del checkout (5 días hábiles).
- **Reversión del Pago**: Procedimiento documentado para fallos en la pasarela o producto no entregado.
- **Información del Vendedor**: Identificación clara (NIT/Cédula, dirección, contacto) visible en el footer y factura.

---

## ♿ 5. Accesibilidad Web (WCAG 2.1 AA)
Cumplimiento con estándares internacionales para inclusión digital.

- **Contraste**: Paleta Modus Axon (Obsidian/Cyber Green) validada para legibilidad.
- **Semántica**: Uso de etiquetas ARIA y HTML5 semántico para lectores de pantalla.
- **Responsive**: Interfaz adaptable a cualquier dispositivo móvil o desktop.

---
**MODUS AXON** — Bio-Digital Futurism.
