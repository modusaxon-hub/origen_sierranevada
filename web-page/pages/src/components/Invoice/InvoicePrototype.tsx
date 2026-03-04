import React from 'react';
import './InvoicePrototype.css';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface InvoiceProps {
    invoiceNumber: string;
    date: string;
    customerName: string;
    customerNIT: string;
    items: InvoiceItem[];
    cufe: string;
    qrUrl?: string;
}

const InvoicePrototype: React.FC<InvoiceProps> = ({
    invoiceNumber = "000001",
    date = new Date().toLocaleDateString('es-CO'),
    customerName = "Cliente Ejemplo",
    customerNIT = "123.456.789-0",
    items = [
        { id: '1', description: 'Café Malú - 340g', quantity: 1, unitPrice: 18000, total: 18000 },
        { id: '2', description: 'Sombra Sagrada - 340g', quantity: 1, unitPrice: 24000, total: 24000 }
    ],
    cufe = "E7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6",
    qrUrl = "https://www.dian.gov.co/fiscalizacion/paginas/facturacion-electronica.aspx"
}) => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal; // No IVA

    return (
        <div className="invoice-container">
            <div className="invoice-card glassmorphism">
                {/* Header */}
                <header className="invoice-header">
                    <div className="brand-info">
                        <h1 className="brand-name">ORIGEN</h1>
                        <p className="brand-subtitle">SIERRA NEVADA</p>
                        <div className="company-details">
                            <p>CAFÉ ORIGEN SIERRA NEVADA E.U.</p>
                            <p>NIT: 900.XXX.XXX-X</p>
                            <p>Santa Marta, Magdalena - Colombia</p>
                        </div>
                    </div>
                    <div className="invoice-meta">
                        <div className="invoice-badge">FACTURA ELECTRÓNICA DE VENTA</div>
                        <h2 className="invoice-number">No. {invoiceNumber}</h2>
                        <p className="invoice-date">Fecha: {date}</p>
                    </div>
                </header>

                {/* Legal Legend Banner */}
                <div className="legal-banner">
                    <p><strong>NO RESPONSABLE DE IVA — Art. 437 ET</strong></p>
                    <p className="legal-detail">Conforme al artículo 437 del Estatuto Tributario Colombiano, esta empresa no cumple con los requisitos para ser responsable del Impuesto al Valor Agregado.</p>
                </div>

                {/* Customer Info */}
                <section className="customer-section">
                    <div className="section-title">DETALLES DEL ADQUIRENTE</div>
                    <div className="customer-info">
                        <p><strong>NOMBRE:</strong> {customerName}</p>
                        <p><strong>NIT/CC:</strong> {customerNIT}</p>
                        <p><strong>DIRECCIÓN:</strong> Santa Marta, Magdalena</p>
                    </div>
                </section>

                {/* Items Table */}
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>DESCRIPCIÓN</th>
                            <th className="text-center">CANT.</th>
                            <th className="text-right">VALOR UNIT.</th>
                            <th className="text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.description}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-right">${item.unitPrice.toLocaleString('es-CO')}</td>
                                <td className="text-right">${item.total.toLocaleString('es-CO')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <footer className="invoice-footer">
                    <div className="footer-cols">
                        <div className="digital-verification">
                            <div className="qr-box">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`} alt="QR Code" />
                            </div>
                            <div className="cufe-container">
                                <p className="cufe-label">CUFE (CÓDIGO ÚNICO DE FACTURACIÓN ELECTRÓNICA):</p>
                                <p className="cufe-value">{cufe}</p>
                            </div>
                        </div>

                        <div className="summary-box">
                            <div className="summary-row">
                                <span>SUBTOTAL</span>
                                <span>${subtotal.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="summary-row">
                                <span>IVA (0%)</span>
                                <span>$0</span>
                            </div>
                            <div className="summary-row total">
                                <span>TOTAL A PAGAR</span>
                                <span>${total.toLocaleString('es-CO')} COP</span>
                            </div>
                            <div className="currency-note">Moneda: Pesos Colombianos</div>
                        </div>
                    </div>
                </footer>

                <div className="resolution-info">
                    <p>Resolución de Facturación DIAN No. 1876XXXXXXXX de 2026-01-01</p>
                    <p>Numeración Autorizada desde 000001 hasta 100000</p>
                </div>
            </div>

            <div className="print-controls no-print">
                <button onClick={() => window.print()} className="print-btn">
                    <span className="material-icons">print</span> Imprimir Factura
                </button>
            </div>
        </div>
    );
};

export default InvoicePrototype;
