# Régimen Tributario — Origen Sierra Nevada (NO Responsable de IVA)

**Fecha:** 04 Mar 2026
**Estado:** ACTIVO — Aplica a Origen Sierra Nevada en fase inicial
**Responsable:** Contador + Administrador Origen

---

## 📊 Diagnóstico Actual

| Item | Valor | Observación |
|------|-------|------------|
| **Ingresos anuales proyectados** | < 3.500 UVT (~$164M COP 2026) | Fase MVP — aún no alcanza umbral |
| **Estatus tributario** | NO Responsable de IVA | No cobra IVA a clientes |
| **Régimen aplicable** | Simplificado o Ordinario (a confirmar) | Depende del RUT actual |
| **Declaración** | Renta anual simplificada | No declara IVA bimensual |
| **Obligación factura** | ✅ SÍ — Res. 000042/2020 DIAN | Incluso no contribuyentes deben facturar |

---

## 🎯 Implicaciones Operacionales

### Para el Cliente (Final)
```
NO SE COBRA IVA EN LA FACTURA
├── Precio mostrado = Precio final (sin IVA adicional)
├── Leyenda obligatoria: "No Responsable de IVA — Art. 437 ET"
└── Comprador NO puede descontar IVA (es gasto no deducible)
```

### Para el Sistema de Pagos
| Escenario | Precio | IVA | Total | Comprobante |
|-----------|-------|-----|-------|-------------|
| **Café Malú** | $18.000 COP | $0 | $18.000 | Factura "NO contribuyente" |
| **Sombra Sagrada** | $24.000 COP | $0 | $24.000 | Factura "NO contribuyente" |

---

## 🧾 Configuración de Factura Electrónica — NO Contribuyente

### Opción A: Factura de Venta (Res. 000042/2020)
```xml
<!-- Campos obligatorios incluso sin IVA -->
<Factura>
  <TipoDocumento>01</TipoDocumento>
  <NumeroFactura>000001</NumeroFactura>
  <Fecha>2026-03-04T14:30:00</Fecha>

  <!-- VENDEDOR -->
  <Vendedor>
    <NIT>XXXXXXXXX-X</NIT>
    <RazonSocial>Café Origen Sierra Nevada E.U.</RazonSocial>
    <Direccion>Santa Marta, Magdalena</Direccion>
  </Vendedor>

  <!-- COMPRADOR -->
  <Comprador>
    <NIT_CC>CCXXXXXXXX</NIT_CC>  <!-- Recolectar en checkout -->
    <Nombre>Cliente</Nombre>
    <Direccion>Dirección de entrega</Direccion>
  </Comprador>

  <!-- ITEMS -->
  <Items>
    <Item>
      <Descripcion>Café Malú - 1 unidad</Descripcion>
      <Cantidad>1</Cantidad>
      <ValorUnitario>18000</ValorUnitario>
      <Subtotal>18000</Subtotal>
      <IVA>0</IVA>  <!-- NO APLICA -->
      <ValorTotal>18000</ValorTotal>
    </Item>
  </Items>

  <!-- TOTALES -->
  <Subtotal>18000</Subtotal>
  <IVA>0</IVA>
  <IVA_Porcentaje>0%</IVA_Porcentaje>
  <ValorTotal>18000</ValorTotal>

  <!-- LEYENDA OBLIGATORIA -->
  <Leyenda>"Esta empresa NO es Responsable de IVA conforme al Art. 437 del Estatuto Tributario"</Leyenda>

  <!-- CUFE y QR (requiere PTA) -->
  <CUFE>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</CUFE>
  <QR>https://www.dian.gov.co/directo/QR/...</QR>
</Factura>
```

### Leyenda Obligatoria en Documento
```
═══════════════════════════════════════════
    CAFÉ ORIGEN SIERRA NEVADA E.U.
    NIT: XXXXXXXXX-X

    NO RESPONSABLE DE IVA

    Conforme al artículo 437 del Estatuto
    Tributario Colombiano, esta empresa
    no es responsable del Impuesto al
    Valor Agregado.
═══════════════════════════════════════════

Fecha:     04 de Marzo de 2026
Hora:      14:30:00
Factura:   000001
CUFE:      [Código de validación]

Cliente debe ser mayor de edad y tener
cédula/NIT válida.
```

---

## 🔄 Flujo Actualizado — F3-005 Factura Electrónica

```
1. CLIENTE REALIZA PAGO
   └─ Cantidad: $18.000 o $24.000 (sin IVA)

2. SISTEMA VALIDA
   ├─ ¿Precio = precio sin IVA? ✅
   ├─ ¿Leyenda "NO contribuyente" será incluida? ✅
   └─ ¿Datos cliente (NIT/CC) están completos? ✅

3. LLAMADA A PTA (Alegra/Siigo)
   ├─ API recibe: {
   │    monto: 18000,
   │    iva: 0,                    // IMPORTANTE: 0, no null
   │    cliente_nit: "CCXXXXXXXX",
   │    leyenda: "NO responsable de IVA"
   │  }
   └─ PTA calcula CUFE y firma digitalmente

4. DIAN RESPONDE
   ├─ Status: ACEPTADA
   ├─ CUFE: [Código único]
   └─ URL QR válida por 5 años

5. PDF A CLIENTE
   ├─ Email: Resend + PDF con QR
   ├─ Dashboard: Descargable del historial
   └─ Leyenda visible en el documento

6. REGISTRO ADMIN
   ├─ Supabase: invoices table
   │  └─ {id, order_id, cufe, pdf_url, leyenda}
   ├─ Export Excel para contador
   └─ Totalización: $0 IVA generado
```

---

## 📋 Cambios Técnicos Necesarios — F3-005

### 1. Backend — Endpoint `/invoices/create`
```ts
// Parámetro: NO FORZAR 19% de IVA
const createInvoice = async (orderId: string, clienteNIT: string) => {
  const order = await getOrder(orderId);

  const payload = {
    vendedor_nit: process.env.ORIGEN_NIT,
    comprador_nit: clienteNIT,           // REQUERIDO
    items: order.items.map(item => ({
      descripcion: item.name,
      cantidad: item.quantity,
      valor_unitario: item.price,
      iva: 0                               // IMPORTANTE: 0
    })),
    subtotal: order.total_amount,
    iva_total: 0,                          // NO CONTRIBUYENTE
    valor_total: order.total_amount,
    leyenda: "NO responsable de IVA - Art. 437 ET"
  };

  // Llamar API del PTA
  const response = await ptaAPI.crearFactura(payload);

  // Almacenar en Supabase
  await supabase.from('invoices').insert({
    order_id: orderId,
    invoice_number: response.numero,
    cufe: response.cufe,
    leyenda: "NO responsable de IVA",
    pdf_url: response.pdf_url,
    status: 'sent'
  });
};
```

### 2. Frontend — Checkout Display
```tsx
// NO mostrar "IVA +$0" (confunde)
// Mostrar simplemente:

<div className="pricing-summary">
  <div className="line-item">
    <span>Café Malú x1</span>
    <span className="price">$18.000 COP</span>
  </div>

  {/* NO mostrar fila de IVA si es 0 */}

  <div className="divider"></div>

  <div className="total">
    <span>Total</span>
    <span className="price large">$18.000 COP</span>
  </div>

  <p className="notice">
    Precio final incluye todos los impuestos aplicables.
  </p>
</div>
```

### 3. Database — Tabla `invoices`
```sql
ALTER TABLE invoices ADD COLUMN (
  leyenda TEXT,                    -- "NO responsable de IVA"
  iva_porcentaje NUMERIC DEFAULT 0, -- Siempre 0
  contribuyente_status VARCHAR(50)  -- 'no_responsable' | 'responsable'
);
```

### 4. Admin Dashboard — Reportes Financieros
```
📊 REPORTE MENSUAL — ORIGEN SIERRA NEVADA

Período: Marzo 2026

VENTAS TOTALES:        $450.000 COP
├─ Café Malú (25 x $18k)      $450.000
├─ Sombra Sagrada (0 x $24k)  $0
└─ SUBTOTAL:                  $450.000

IVA GENERADO:          $0 (No Responsable)
RETENCIONES:           $0
───────────────────────────────
NETO A DEPOSITAR:      $450.000

DECLARACIÓN TRIBUTARIA:
└─ Forma: Renta Anual Simplificada
└─ Período: Enero - Diciembre 2026
└─ Ingresos netos: $450.000 (ejemplo)
└─ Status: CUMPLIDO ✅
```

---

## ⚠️ Situaciones Especiales

### ¿Qué pasa si el cliente pide factura CON IVA?
```
Respuesta: NO se puede. La empresa NO es responsable de IVA.
Si el cliente es empresa y necesita IVA descontable:
└─ Remitir a asesor tributario para alternativas legales
└─ Posible: cambio de régimen voluntario a Responsable
```

### ¿Qué pasa si superamos $164M anuales?
```
Acción: TRANSICIÓN a Responsable de IVA
├─ Mes 1: Comunicar cambio a DIAN
├─ Mes 2: Actualizar sistema (agregar 19% en cálculos)
├─ Mes 3: Primera declaración bimensual de IVA
└─ Clientes nuevos: Ven precios + IVA
└─ Clientes antiguos: Transparencia (precio cambió por ley)
```

### ¿Quién verifica que somos "No Responsable"?
```
Válido mientras:
├─ RUT esté registrado como No Responsable ante DIAN
├─ Ingresos < 3.500 UVT ($164M COP aprox.)
└─ Declaración anual lo confirme

Verificación: Contador + Revisoría Fiscal (si aplica)
```

---

## 🗂️ Documentación Asociada

| Documento | Ruta | Descripción |
|-----------|------|------------|
| **COMPLIANCE_LEGAL.html** | `00-estrategia-lanzamiento/` | Marco general de regulación (incluye los 3 escenarios) |
| **Este archivo** | `00-estrategia-lanzamiento/` | Guía específica para NO Responsable de IVA |
| **PRESUPUESTO_CONTRATO.html** | `00-estrategia-lanzamiento/` | Contrato de servicios con sello MODUS AXON |
| **INIT_DATABASE.sql** | `web-page/database/` | Schema que almacena facturas |

---

## ✅ Checklist de Implementación

- [ ] Confirmar con contador: NIT está registrado como "No Responsable" ante DIAN
- [ ] Configurar PTA (Alegra/Siigo): API key + test de factura
- [ ] Backend: Endpoint `/invoices/create` con `iva = 0`
- [ ] Frontend: Checkout sin mostrar "IVA $0"
- [ ] Database: Columna `leyenda` agregada a `invoices`
- [ ] Factura PDF: Incluir leyenda obligatoria
- [ ] Dashboard admin: Reportes de IVA = 0
- [ ] Test E2E: Flujo completo pago → factura → PDF
- [ ] Comunicar a clientes: Precios ya incluyen impuestos aplicables

---

## 📞 Contactos Clave

- **Contador:** [Nombre + Email]
- **PTA (Alegra):** [API contact]
- **DIAN Consulta:** https://www.dian.gov.co/
- **SIC (Datos):** https://www.sic.gov.co/

---

**Última actualización:** 04 Mar 2026
**Firmado por:** MODUS AXON — Asesoría Técnica
