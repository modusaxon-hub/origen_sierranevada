const fs = require('fs');
const path = 'd:\\Documentos\\Proyectos ADSO\\origen_sierranevada\\web-page\\pages\\src\\pages\\OrderManager.tsx';
let content = fs.readFileSync(path, 'utf8');

// Use a regex to find the start of the action container
// It's the div inside a td with gap-2
const startRegex = /<div className="flex items-center justify-center gap-2">/;
const match = content.match(startRegex);

if (match) {
    const startIdx = match.index;
    // We need the matching </div> or the parent's structure.
    // Given the previous view_file, the </td> is at the end of the block.
    const endTdIdx = content.indexOf('</td>', startIdx);

    if (endTdIdx !== -1) {
        const prefix = content.substring(0, startIdx);
        const suffix = content.substring(endTdIdx);

        const cleanBlock = `<div className="flex items-center justify-center gap-2">
                                                            {/* 1. Comprobante de Pago */}
                                                            {(() => {
                                                                const paymentsArr = (order as any).payments as Array<{ payment_evidence_url?: string }> | undefined;
                                                                const proofUrl = paymentsArr?.find(p => p.payment_evidence_url)?.payment_evidence_url || null;

                                                                if (proofUrl) {
                                                                    return (
                                                                        <button
                                                                            onClick={() => setSelectedProof(proofUrl)}
                                                                            className="h-8 w-8 flex items-center justify-center bg-[#C5A065]/10 text-[#C5A065] rounded-lg border border-[#C5A065]/20 hover:bg-[#C5A065] hover:text-black transition-all"
                                                                            title="Ver Recibo"
                                                                        >
                                                                            <span className="material-icons-outlined text-sm">receipt_long</span>
                                                                        </button>
                                                                    );
                                                                }

                                                                if (order.status === 'pending' || order.status === 'pending_payment') {
                                                                    return (
                                                                        <button
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation();
                                                                                const { data } = await supabase.storage.from('payments').list(order.id);
                                                                                if (data && data.length > 0) {
                                                                                    const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(\`\${order.id}/\${data[0].name}\`);
                                                                                    setSelectedProof(publicUrl);
                                                                                } else {
                                                                                    setInstitutionalModal({
                                                                                        title: "Sin Comprobante",
                                                                                        message: "No se encontró un archivo adjunto para este pedido en el almacenamiento.",
                                                                                        type: 'info'
                                                                                    });
                                                                                }
                                                                            }}
                                                                            className="h-8 w-8 flex items-center justify-center bg-white/5 text-gray-500 rounded-lg border border-white/10 hover:text-[#C5A065] transition-all"
                                                                            title="Ver Documento de Pago"
                                                                        >
                                                                            <span className="material-icons-outlined text-sm">description</span>
                                                                        </button>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}

                                                            {/* 2. Acción Principal */}
                                                            {order.status === 'pending' || order.status === 'pending_payment' ? (
                                                                <button
                                                                    onClick={() => handleConfirmOrder(order.id)}
                                                                    className="flex-1 px-3 py-2 bg-[#C5A065] text-black rounded-lg hover:bg-[#D4B483] transform active:scale-95 transition-all font-black text-[9px] uppercase shadow-lg shadow-[#C5A065]/20 flex items-center justify-center gap-1.5"
                                                                >
                                                                    {(() => {
                                                                        const paymentsArr = (order as any).payments as any[] | undefined;
                                                                        const isPaid = paymentsArr?.some(p => p.status === 'completed');
                                                                        return isPaid ? (
                                                                            <span className="material-icons-outlined text-xs text-emerald-600">check_circle</span>
                                                                        ) : (
                                                                            <span className="material-icons-outlined text-xs text-amber-600 animate-pulse">pending</span>
                                                                        );
                                                                    })()}
                                                                    Confirmar
                                                                </button>
                                                            ) : order.status === 'paid' ? (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, 'processing')}
                                                                    className="flex-1 px-3 py-2 bg-[#C5A065] text-black rounded-lg hover:bg-[#D4B483] transform active:scale-95 transition-all font-black text-[9px] uppercase shadow-lg shadow-[#C5A065]/20 flex items-center justify-center gap-1.5"
                                                                >
                                                                    <span className="material-icons-outlined text-xs">inventory_2</span>
                                                                    Preparar
                                                                </button>
                                                            ) : order.status === 'processing' ? (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                                    className="flex-1 px-3 py-2 bg-[#C5A065] text-black rounded-lg hover:bg-[#D4B483] transform active:scale-95 transition-all font-black text-[9px] uppercase shadow-lg shadow-[#C5A065]/20 flex items-center justify-center gap-1.5"
                                                                >
                                                                    <span className="material-icons-outlined text-xs">local_shipping</span>
                                                                    Despachar
                                                                </button>
                                                            ) : order.status === 'shipped' ? (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                                    className="flex-1 px-3 py-2 bg-[#C5A065] text-black rounded-lg hover:bg-[#D4B483] transform active:scale-95 transition-all font-black text-[9px] uppercase shadow-lg shadow-[#C5A065]/20 flex items-center justify-center gap-1.5"
                                                                >
                                                                    <span className="material-icons-outlined text-xs">task_alt</span>
                                                                    Entregar
                                                                </button>
                                                            ) : (
                                                                <div className="flex-1 text-[9px] text-gray-500 font-black uppercase tracking-widest py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                                                    {order.status === 'delivered' ? '✓ Listo' : order.status === 'cancelled' ? '✕ Anulado' : '✕ OFF'}
                                                                </div>
                                                            )}

                                                            {/* 3. Botón de Cancelación (Disponible hasta que se entregue o ya esté cancelado) */}
                                                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setConfirmModal({
                                                                            title: "¿Deseas anular este pedido?",
                                                                            message: \`Esta acción es irreversible, devolverá el stock automáticamente y marcará el pago como fallido si estaba pendiente.\`,
                                                                            onConfirm: () => updateOrderStatus(order.id, 'cancelled'),
                                                                            type: 'danger'
                                                                        });
                                                                    }}
                                                                    className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                                                                    title="Anular Pedido"
                                                                >
                                                                    <span className="material-icons-outlined text-sm">block</span>
                                                                </button>
                                                            )}

                                                            {/* 4. Factura */}
                                                            {(order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            const { data: existingInvoice } = await invoiceService.getInvoiceByOrderId(order.id);
                                                                            if (existingInvoice) {
                                                                                window.open(\`/#/invoice/\${order.id}\`, '_blank');
                                                                                return;
                                                                            }
                                                                            const { data: orderData } = await supabase.from('orders').select('*, order_items(*), profiles(full_name, email)').eq('id', order.id).single();
                                                                            if (!orderData) throw new Error('No se encontraron los datos del pedido para la factura.');

                                                                            const customer = {
                                                                                name: orderData.shipping_address?.fullName || orderData.profiles?.full_name || 'Cliente',
                                                                                docType: orderData.shipping_address?.docType || 'CC',
                                                                                docNumber: orderData.shipping_address?.docNumber || '0',
                                                                                address: orderData.shipping_address?.address || '',
                                                                                city: orderData.shipping_address?.city || '',
                                                                                department: orderData.shipping_address?.department || '',
                                                                                email: orderData.shipping_address?.email || orderData.profiles?.email || '',
                                                                                phone: orderData.shipping_address?.phone || ''
                                                                            };

                                                                            await invoiceService.generateInvoice(order.id, orderData as any, customer);
                                                                            window.open(\`/#/invoice/\${order.id}\`, '_blank');
                                                                        } catch (err: any) {
                                                                            setInstitutionalModal({
                                                                                title: "Error de Facturación",
                                                                                message: err.message || "Hubo un problema al generar o abrir la factura.",
                                                                                type: 'error'
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="h-8 w-8 flex items-center justify-center bg-white/5 text-[#C5A065] rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                                                                    title="Factura"
                                                                >
                                                                    <span className="material-icons-outlined text-sm">receipt_long</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                `;

        fs.writeFileSync(path, prefix + cleanBlock + suffix);
        console.log('Success: OrderManager ACTIONS block rewritten completely via Regex.');
    } else {
        console.log('Error: Could not find endTdIdx.');
    }
} else {
    console.log('Error: Could not match startRegex.');
}
