import React from 'react';

interface InvoiceItem {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface InvoicePrototypeProps {
    invoiceNumber?: string;
    cufe?: string;
    date?: string;
    customerName?: string;
    customerDocType?: string;
    customerDocNumber?: string;
    customerAddress?: string;
    customerCity?: string;
    customerEmail?: string;
    items: InvoiceItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    orderId?: string;
}

const InvoicePrototype: React.FC<InvoicePrototypeProps> = ({
    invoiceNumber = '000001',
    cufe = 'CUFE_PLACEHOLDER',
    date = new Date().toISOString().split('T')[0],
    customerName = 'Cliente',
    customerDocType = 'CC',
    customerDocNumber = '0000000000',
    customerAddress = 'Dirección no especificada',
    customerCity = 'Ciudad',
    customerEmail = 'cliente@example.com',
    items,
    subtotal,
    shipping,
    discount,
    total,
    orderId
}) => {
    const verificationUrl = orderId ? `${window.location.origin}/#/track/${orderId}` : 'https://origensierranevada.com';
    const verificationQr = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}&margin=2`;

    return (
        <div className="w-full bg-white text-black p-8 font-sans" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <div className="border-b-2 border-[#141E16] pb-6 mb-6 flex justify-between items-start">
                <div>
                    <div className="text-2xl font-bold text-[#141E16] mb-1">ORIGEN</div>
                    <div className="text-xs text-gray-600 font-semibold">SIERRA NEVADA</div>
                    <div className="text-[10px] text-gray-500 mt-1">Café Premium de Alta Montaña</div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-[#C8AA6E] mb-2">FACTURA ELECTRÓNICA</div>
                    <div className="text-xs text-gray-600">No. {invoiceNumber}</div>
                    <div className="text-xs text-gray-600">Fecha: {date}</div>
                </div>
            </div>

            <div className="bg-gray-100 p-3 rounded mb-6 border border-gray-300">
                <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">Código Único de Factura Electrónica</div>
                <div className="font-mono text-[10px] break-all text-gray-700">{cufe}</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <div className="text-[10px] font-bold text-[#141E16] uppercase mb-3">Emitido Por</div>
                    <div className="text-xs mb-1 font-semibold">ORIGEN SIERRA NEVADA S.A.S.</div>
                    <div className="text-[10px] text-gray-600 space-y-1">
                        <div>NIT: [NIT_EMPRESA]</div>
                        <div>Dirección: Sierra Nevada, Magdalena</div>
                        <div>Teléfono: +57 310 740 5154</div>
                        <div>Email: origensierranevadasm@gmail.com</div>
                        <div className="mt-2 pt-2 border-t border-gray-300">
                            <div className="text-[9px] text-gray-500 italic">
                                Régimen Simple de Tributación — No Responsable de IVA (Art. 437 ET)
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-[10px] font-bold text-[#141E16] uppercase mb-3">Facturado A</div>
                    <div className="text-xs mb-1 font-semibold">{customerName}</div>
                    <div className="text-[10px] text-gray-600 space-y-1">
                        <div>{customerDocType}: {customerDocNumber}</div>
                        <div>{customerAddress}</div>
                        <div>{customerCity}, Magdalena</div>
                        <div>Email: {customerEmail}</div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-t-2 border-[#141E16]">
                            <th className="text-left py-2 text-[10px] font-bold text-[#141E16] uppercase">Descripción</th>
                            <th className="text-center py-2 text-[10px] font-bold text-[#141E16] uppercase">Cantidad</th>
                            <th className="text-right py-2 text-[10px] font-bold text-[#141E16] uppercase">V. Unitario</th>
                            <th className="text-right py-2 text-[10px] font-bold text-[#141E16] uppercase">V. Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-200">
                                <td className="py-3 text-[10px] text-gray-700">{item.name}</td>
                                <td className="py-3 text-center text-[10px] text-gray-700">{item.quantity}</td>
                                <td className="py-3 text-right text-[10px] text-gray-700">${item.unitPrice.toLocaleString('es-CO')}</td>
                                <td className="py-3 text-right text-[10px] font-semibold text-[#141E16]">${item.subtotal.toLocaleString('es-CO')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mb-8">
                <div className="w-64">
                    <div className="flex justify-between text-[10px] mb-2">
                        <span>Subtotal:</span>
                        <span className="text-gray-700">${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-[10px] mb-2 text-green-600">
                            <span>Descuento:</span>
                            <span>-${discount.toLocaleString('es-CO')}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-[10px] mb-2">
                        <span>Envío:</span>
                        <span className="text-gray-700">{shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString('es-CO')}`}</span>
                    </div>
                    <div className="flex justify-between text-[9px] mb-3 text-gray-500 italic border-t border-gray-300 pt-2">
                        <span>IVA (0%):</span>
                        <span>$0 — No Responsable Art. 437 ET</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-[#141E16] pt-3">
                        <span className="font-bold text-xs">TOTAL A PAGAR:</span>
                        <span className="font-bold text-xs text-[#C8AA6E]">${total.toLocaleString('es-CO')} COP</span>
                    </div>
                </div>
            </div>

            {orderId && (
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-300">
                    <div>
                        <div className="text-[9px] text-gray-500 uppercase font-bold mb-2">Número de Orden</div>
                        <div className="text-lg font-mono font-bold text-[#141E16]">#{orderId.slice(0, 8).toUpperCase()}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">QR de Verificación</div>
                        <img src={verificationQr} alt="QR Verificación" className="w-20 h-20 border border-gray-300" />
                    </div>
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded text-[9px] text-gray-600 space-y-2 border border-gray-200">
                <div>
                    <span className="font-bold">Términos:</span> Válido como comprobante. Contacte dentro de 5 días si hay discrepancias.
                </div>
                <div>
                    <span className="font-bold">Régimen:</span> Simple — Art. 437 ET. No responsable de IVA.
                </div>
                <div className="italic pt-2 border-t border-gray-300">
                    Generado automáticamente. No requiere firma.
                </div>
            </div>
        </div>
    );
};

export default InvoicePrototype;
