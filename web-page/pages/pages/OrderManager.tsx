
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
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
        // Lógica de devolución de stock: Solo si se cancela y no estaba cancelada ya
        if (newStatus === 'cancelled') {
            const currentOrder = orders.find(o => o.id === orderId);
            if (currentOrder && currentOrder.status !== 'cancelled' && currentOrder.order_items) {
                const confirmed = window.confirm(`Estás a punto de cancelar el pedido #${orderId.slice(0, 8)}. Esto devolverá los productos al inventario. ¿Continuar?`);
                if (!confirmed) return;

                console.log('Devolviendo stock para orden:', orderId);
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

        if (!error) {
            fetchOrders();
        } else {
            alert('Error actualizando estado del pedido.');
            console.error(error);
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
                                                {/* Botón Ver Comprobante */}
                                                {(order as any).metadata?.payment_proof_url && (
                                                    <a
                                                        href={(order as any).metadata.payment_proof_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 text-[10px] text-[#C5A065] hover:underline mb-1"
                                                    >
                                                        <span className="material-icons-outlined text-sm">visibility</span>
                                                        VER COMPROBANTE
                                                    </a>
                                                )}

                                                <div className="flex items-center justify-center gap-2">
                                                    {(order.status === 'pending' || order.status === 'pending_payment') && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'paid')}
                                                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                                            title="Marcar como Pagado"
                                                        >
                                                            <span className="material-icons-outlined text-sm">payments</span>
                                                        </button>
                                                    )}
                                                    <select
                                                        className="bg-black/50 border border-white/10 rounded px-2 py-1 text-[10px] focus:border-[#C5A065] outline-none"
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        value={order.status}
                                                    >
                                                        <option value="pending_payment">Esperando Pago</option>
                                                        <option value="pending">Por Confirmar</option>
                                                        <option value="processing">Preparando</option>
                                                        <option value="shipped">Enviado</option>
                                                        <option value="delivered">Entregado</option>
                                                        <option value="cancelled">Cancelado</option>
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
