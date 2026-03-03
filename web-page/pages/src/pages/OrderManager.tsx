
import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface Order {
    id: string;
    user_id: string;
    status: string;
    total_amount: number;
    shipping_address: any;
    created_at: string;
    profiles: {
        full_name: string;
        email: string;
    };
    metadata?: {
        payment_proof_url?: string;
        proof_uploaded_at?: string;
        items_details?: any[];
        notes?: string;
    };
    order_items?: {
        product_id: number;
        quantity: number;
        products: {
            name: any;
        };
    }[];
}

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    // Estados para el Modal de Envío
    const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null);
    const [shippingNote, setShippingNote] = useState('');
    const [shippingFile, setShippingFile] = useState<File | null>(null);
    const [isShippingRunning, setIsShippingRunning] = useState(false);

    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles (
                    full_name,
                    email
                ),
                order_items (
                    product_id,
                    quantity,
                    products (
                        name
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        // DISPARADOR DE ENVÍO: Si es 'shipped', abrimos el modal en lugar de actualizar directo
        if (newStatus === 'shipped') {
            const order = orders.find(o => o.id === orderId);
            if (order) {
                setShippingModalOrder(order);
                return;
            }
        }

        try {
            // Lógica de devolución de stock: Solo si se cancela y no estaba cancelada ya
            if (newStatus === 'cancelled') {
                const currentOrder = orders.find(o => o.id === orderId);
                if (currentOrder && currentOrder.status !== 'cancelled' && currentOrder.order_items) {
                    const confirmed = window.confirm(`Estás a punto de cancelar el pedido #${orderId.slice(0, 8)}. Esto devolverá los productos al inventario. ¿Continuar?`);
                    if (!confirmed) return;

                    for (const item of currentOrder.order_items) {
                        if (item.product_id) {
                            await supabase.rpc('return_stock', {
                                p_id: item.product_id,
                                amount: item.quantity
                            });
                        }
                    }
                    alert('Inventario actualizado: Productos devueltos al stock.');
                }
            }

            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                console.error('Error Supabase:', error);
                throw error;
            }

            // Actualización local inmediata para feedback instantáneo
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

            // NOTIFICACIÓN AL CLIENTE: Enviar correo de actualización de estado
            const updatedOrder = orders.find(o => o.id === orderId);
            if (updatedOrder) {
                const customerEmail = updatedOrder.shipping_address?.email || updatedOrder.profiles?.email;
                const customerName = updatedOrder.shipping_address?.fullName || updatedOrder.profiles?.full_name;

                if (customerEmail && customerName) {
                    const { emailService } = await import('@/services/emailService');
                    await emailService.sendStatusUpdateEmail(customerEmail, customerName, orderId, newStatus);
                }
            }

            await fetchOrders();

        } catch (err: any) {
            alert(`No se pudo actualizar el estado: ${err.message || 'Error desconocido'}. Asegúrate de tener permisos de administrador en Supabase.`);
            console.error(err);
        }
    };

    const handleShippingSubmit = async () => {
        if (!shippingModalOrder) return;
        setIsShippingRunning(true);

        try {
            let shippingReceiptUrl = '';

            // 1. Subir comprobante si existe
            if (shippingFile) {
                const fileExt = shippingFile.name.split('.').pop();
                const fileName = `shipping_${shippingModalOrder.id}_${Date.now()}.${fileExt}`;
                const filePath = `shipping-proofs/${shippingModalOrder.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('payments')
                    .upload(filePath, shippingFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('payments')
                    .getPublicUrl(filePath);

                shippingReceiptUrl = publicUrl;
            }

            // 2. Actualizar Metadata de la Orden
            const currentMetadata = typeof shippingModalOrder.metadata === 'string'
                ? JSON.parse(shippingModalOrder.metadata)
                : (shippingModalOrder.metadata || {});

            const updatedMetadata = {
                ...currentMetadata,
                shipping_details: {
                    note: shippingNote,
                    receipt_url: shippingReceiptUrl,
                    shipped_at: new Date().toISOString()
                }
            };

            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'shipped',
                    metadata: updatedMetadata
                })
                .eq('id', shippingModalOrder.id);

            if (updateError) throw updateError;

            // 3. Notificar al Cliente con los detalles específicos
            const customerEmail = shippingModalOrder.shipping_address?.email || shippingModalOrder.profiles?.email;
            const customerName = shippingModalOrder.shipping_address?.fullName || shippingModalOrder.profiles?.full_name;

            if (customerEmail && customerName) {
                const { emailService } = await import('@/services/emailService');
                await emailService.sendStatusUpdateEmail(
                    customerEmail,
                    customerName,
                    shippingModalOrder.id,
                    'shipped',
                    { note: shippingNote, receiptUrl: shippingReceiptUrl }
                );
            }

            alert("Pedido marcado como ENVIADO exitosamente.");
            setShippingModalOrder(null);
            setShippingNote('');
            setShippingFile(null);
            await fetchOrders();

        } catch (error: any) {
            alert("Error al procesar el despacho: " + error.message);
        } finally {
            setIsShippingRunning(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-400 bg-green-400/10';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'pending_payment': return 'text-orange-400 bg-orange-400/10';
            case 'shipped': return 'text-blue-400 bg-blue-400/10';
            case 'delivered': return 'text-purple-400 bg-purple-400/10';
            case 'cancelled': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="min-h-screen bg-[#0B120D] text-white pt-24 px-6 pb-20">
            {/* MODAL DE DESPACHO (DETALLES DE ENVÍO) */}
            {shippingModalOrder && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
                    <div className="bg-[#0B120D] border border-[#C5A065]/30 w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(197,160,101,0.1)]">
                        <h2 className="text-2xl font-serif text-[#C5A065] mb-2 italic">Evidencia de Despacho</h2>
                        <p className="text-gray-400 text-xs mb-8 uppercase tracking-widest">Pedido #{shippingModalOrder.id.slice(0, 8)}</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Número de Guía / Nota de Envío</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-[#C5A065] outline-none transition-all resize-none"
                                    rows={3}
                                    placeholder="Ej: Transportadora X - Guía 123456789"
                                    value={shippingNote}
                                    onChange={(e) => setShippingNote(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Foto de la Colilla (Opcional)</label>
                                <div className="relative group h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#42A5F5]/40 transition-all">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setShippingFile(e.target.files?.[0] || null)}
                                    />
                                    {shippingFile ? (
                                        <div className="flex flex-col items-center">
                                            <span className="material-icons-outlined text-green-400">check_circle</span>
                                            <span className="text-[10px] text-white font-bold max-w-[150px] truncate">{shippingFile.name}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-icons-outlined text-gray-500 group-hover:text-[#42A5F5]">add_photo_alternate</span>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Adjuntar Imagen</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button
                                onClick={() => setShippingModalOrder(null)}
                                className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                disabled={isShippingRunning}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleShippingSubmit}
                                className="flex-[2] py-4 bg-[#C5A065] text-black rounded-xl font-black uppercase text-[10px] tracking-[.2em] shadow-lg shadow-[#C5A065]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isShippingRunning}
                            >
                                {isShippingRunning ? 'Procesando...' : 'Enviar y Notificar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE PREVISUALIZACIÓN DE COMPROBANTE */}
            {selectedProof && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
                    onClick={() => setSelectedProof(null)}
                >
                    <div className="absolute top-6 right-6 flex gap-3">
                        <a
                            href={selectedProof}
                            download
                            className="bg-white/10 hover:bg-[#C5A065] text-white hover:text-black p-3 rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="material-icons-outlined">download</span>
                            Descargar
                        </a>
                        <button
                            className="bg-white/10 hover:bg-red-500 text-white p-3 rounded-xl transition-all"
                            onClick={() => setSelectedProof(null)}
                        >
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </div>

                    <img
                        src={selectedProof}
                        alt="Comprobante de Pago"
                        className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(197,160,101,0.2)] border border-white/10 animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <span className="material-icons-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif text-[#C5A065]">Bitácora de Pedidos</h1>
                        <p className="text-gray-400 text-sm">Registro de transacciones y rituales de compra</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A065]"></div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#C5A065]/10 text-[#C5A065] text-[10px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">ID / Fecha</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Productos</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Envío</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-6">
                                            <p className="font-mono text-[10px] text-gray-500 mb-1">#{order.id.slice(0, 8)}</p>
                                            <p className="text-xs text-gray-300">
                                                {new Date(order.created_at).toLocaleDateString('es-CO', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-white font-medium">{order.shipping_address?.fullName || order.profiles?.full_name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase">{order.profiles?.email || order.shipping_address?.email}</p>
                                        </td>
                                        <td className="px-6 py-6 font-mono text-xs text-gray-400">
                                            <div className="space-y-1">
                                                {order.order_items?.map((item, i) => (
                                                    <div key={i}>
                                                        {item.quantity}x {typeof (item.products?.name) === 'object' ? (item.products?.name?.es || item.products?.name?.en) : (item.products?.name || 'Producto')}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-serif text-lg text-[#C5A065]">${order.total_amount.toFixed(2)}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-gray-300 text-xs">{order.shipping_address?.city}, {order.shipping_address?.department}</p>
                                            <p className="text-[10px] text-gray-500">{order.shipping_address?.address}</p>
                                        </td>
                                        <td className="px-6 py-6 font-bold">
                                            <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                                                {order.status === 'pending_payment' ? '⏳ Esperando Pago' :
                                                    order.status === 'pending' ? '🧐 Por Confirmar' :
                                                        order.status === 'paid' ? '✅ Pagado' :
                                                            order.status === 'processing' ? '☕ Preparando' :
                                                                order.status === 'shipped' ? '🚚 Enviado' :
                                                                    order.status === 'delivered' ? '🏠 Entregado' : '❌ Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                {(() => {
                                                    const metadata = typeof order.metadata === 'string' ? JSON.parse(order.metadata) : order.metadata;
                                                    let proofUrl = metadata?.payment_proof_url;

                                                    if (proofUrl) {
                                                        return (
                                                            <div className="flex flex-col items-center mb-1">
                                                                <span className="text-[7px] text-green-400 font-bold uppercase mb-1 flex items-center gap-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                                                                    Pago Validable
                                                                </span>
                                                                <button
                                                                    onClick={() => setSelectedProof(proofUrl || null)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-[#C5A065] text-black rounded-lg text-xs font-bold hover:bg-white transition-all shadow-lg hover:scale-105"
                                                                >
                                                                    <span className="material-icons-outlined text-sm">receipt_long</span>
                                                                    VER COMPROBANTE
                                                                </button>
                                                            </div>
                                                        );
                                                    }

                                                    // AUTO-DESCUBRIMIENTO: Si está pendiente, ofrecemos escanear el storage directamente
                                                    if (order.status === 'pending' || order.status === 'pending_payment') {
                                                        return (
                                                            <div className="flex flex-col items-center mb-1">
                                                                <button
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        // Buscamos archivos en la carpeta del pedido
                                                                        const { data } = await supabase.storage.from('payments').list(order.id);
                                                                        if (data && data.length > 0) {
                                                                            const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(`${order.id}/${data[0].name}`);
                                                                            setSelectedProof(publicUrl);
                                                                        } else {
                                                                            alert("Aún no hay archivos cargados para este pedido.");
                                                                        }
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-[#C5A065]/50 text-[#C5A065] rounded-lg text-[10px] font-bold hover:bg-[#C5A065] hover:text-black transition-all shadow-md group"
                                                                >
                                                                    <span className="material-icons-outlined text-sm group-hover:rotate-12 transition-transform">search_check</span>
                                                                    ESCANEAR PAGO
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}

                                                <div className="flex items-center justify-center gap-1.5">
                                                    {(order.status === 'pending' || order.status === 'pending_payment') && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'paid')}
                                                            className="h-8 w-8 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                                            title="Confirmar como Pagado"
                                                        >
                                                            <span className="material-icons-outlined text-sm">check_circle</span>
                                                        </button>
                                                    )}
                                                    <select
                                                        className="h-8 bg-black/60 border border-white/10 rounded-lg px-2 py-0 text-[10px] text-white/80 focus:border-[#C5A065] outline-none cursor-pointer hover:bg-black/80 transition-colors"
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        value={order.status}
                                                    >
                                                        <option value="pending_payment">⏳ Esperando Pago</option>
                                                        <option value="pending">🧐 Por Confirmar</option>
                                                        <option value="paid">✅ Pagado</option>
                                                        <option value="processing">☕ Preparando</option>
                                                        <option value="shipped">🚚 Enviado</option>
                                                        <option value="delivered">🏠 Entregado</option>
                                                        <option value="cancelled">❌ Cancelado</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <div className="py-20 text-center">
                                <span className="material-icons-outlined text-6xl text-white/10 mb-4">shopping_basket</span>
                                <p className="text-gray-500 italic">Aún no se han registrado rituales de compra.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManager;
