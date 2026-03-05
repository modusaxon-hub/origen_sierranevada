# 🛡️ AI LOG DE CUMPLIMIENTO (Traceability & Ethics)

Registro obligatorio de decisiones de IA para cumplimiento normativo (**Ley 1581 de 2012 - Colombia**).

## 📋 Registro de Decisiones

| Fecha | Build ID | Decisión / Acción | Justificación Técnica & Ética |
| :--- | :--- | :--- | :--- |
| 04-03-2026 | 040320262218AF01 | Apertura de Bucket 'payments' y RLS para 'public' | **Justificación**: Se requiere permitir que usuarios que realizan "Guest Checkout" (sin cuenta) puedan subir su comprobante de pago. **Mitigación**: Los archivos se nombran con UUIDs únicos para evitar enumeración y solo se permite INSERT, protegiendo la integridad de archivos existentes. |
| 04-03-2026 | - | Aplicación de RLS en tablas de órdenes | **Cumplimiento**: Asegura que la información personal de envío solo sea accesible por el propietario y administradores autorizados. |

## ⚖️ Declaración de Principios
Este sistema se desarrolla bajo principios de **Privacidad desde el Diseño** y **Seguridad por Defecto**, buscando un balance entre la experiencia de usuario (ritual de compra fluido) y la protección de datos sensibles.
