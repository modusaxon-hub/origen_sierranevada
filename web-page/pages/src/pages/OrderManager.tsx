import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '@/services/invoiceService';
import AdminHeader from '@/shared/components/AdminHeader';
import { authService } from '@/services/authService';
import InstitutionalModal from '@/shared/components/InstitutionalModal';
import ConfirmModal from '@/shared/components/ConfirmModal';

// Estilo compartido para selects en modo oscuro
const selectClassName = "appearance-none bg-[#0B120D] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-[#C5A065] uppercase tracking-widest outline-none focus:border-[#C5A065] transition-all cursor-pointer hover:bg-white/5";

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
    metadata?: any; // Informativo, no persiste en BD
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
    const [pendingUsersCount, setPendingUsersCount] = useState(0);

    // Estados para el Modal de Envío
    const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null);
    const [shippingNote, setShippingNote] = useState('');
    const [shippingFile, setShippingFile] = useState<File | null>(null);
    const [isShippingRunning, setIsShippingRunning] = useState(false);

    // Estado para Modales Institucionales (Sustituye a alert)
    const [institutionalModal, setInstitutionalModal] = useState<{
        title: string;
        message: string | React.ReactNode;
        type: 'success' | 'info' | 'error' | 'warning';
    } | null>(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Estado para Ventanas de Confirmación Institucionales (Sustituye a window.confirm)
    const [confirmModal, setConfirmModal] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
        type?: 'danger' | 'warning' | 'info' | 'success';
    } | null>(null);

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
                ),
                payments (
                    payment_evidence_url,
                    method,
                    status
                )
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data as any);
        }
        setLoading(false);
    };

    const fetchPendingUsers = async () => {
        const { data } = await authService.getAllProfiles();
        if (data) {
            const count = (data as any[]).filter(p => p.status === 'pending').length;
            setPendingUsersCount(count);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchPendingUsers();
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
            // Lógica de Devolución de Stock y Sincronización de Pagos ahora es AUTOMÁTICA en la Base de Datos (Trigger)
            // No se requiere código manual aquí para mantener la integridad

            // 1. Actualizar tabla orders (Sin validación de lectura inmediata para evitar bloqueos por RLS)
            const { error: orderError } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (orderError) {
                console.error("Database Error:", orderError);
                throw orderError;
            }

            // Sincronización con tabla payments ahora es AUTOMÁTICA via Trigger en DB

            // 3. Actualización local EXACTA (Unificando datos actuales con el nuevo estado)
            setOrders(prev => prev.map(o => {
                if (o.id === orderId) {
                    const updatedOrder = { ...o, status: newStatus };
                    // Si se marca como pagado, actualizar también el estado del pago localmente
                    if (newStatus === 'paid' && (o as any).payments) {
                        (updatedOrder as any).payments = (o as any).payments.map((p: any) => ({ ...p, status: 'completed' }));
                    }
                    return updatedOrder;
                }
                return o;
            }));

            // 4. NOTIFICACIÓN AL CLIENTE (Buscamos los datos en el estado actual de la función)
            const orderRef = orders.find(o => o.id === orderId);
            const customerEmail = orderRef?.shipping_address?.email || orderRef?.profiles?.email;
            const customerName = orderRef?.shipping_address?.fullName || orderRef?.profiles?.full_name;

            if (customerEmail && customerName) {
                try {
                    const { emailService } = await import('@/services/emailService');
                    await emailService.sendStatusUpdateEmail(customerEmail, customerName, orderId, newStatus);
                } catch (emailErr) {
                    console.warn("Email warning:", emailErr);
                }
            }

            // 5. Alerta de confirmación detallada
            if (newStatus === 'paid') {
                const now = new Date().toLocaleString('es-CO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                setInstitutionalModal({
                    title: "¡Pago Confirmado!",
                    message: `📅 Fecha: ${now}\n📌 Pedido: #${orderId.slice(0, 8)}\n\n💡 Sugerencia: El siguiente paso es 'EMPRENDER PREPARACIÓN' para alistar el café.`,
                    type: 'success'
                });
            }

        } catch (err: any) {
            // Solo recargar en error para limpiar estados inconsistentes
            await fetchOrders();
            setInstitutionalModal({
                title: "Error de Sistema",
                message: err.message || 'La base de datos rechazó el cambio.',
                type: 'error'
            });
            console.error("Update Error:", err);
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

            // 2. Actualizar la Orden (Usando columna específica shipping_details para persistencia atómica)
            const shippingDetails = {
                note: shippingNote,
                receipt_url: shippingReceiptUrl,
                shipped_at: new Date().toISOString()
            };

            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'shipped',
                    shipping_details: shippingDetails
                })
                .eq('id', shippingModalOrder.id);

            if (updateError) throw updateError;

            // 3. Actualización local inmediata del estado
            setOrders(prev => prev.map(o => o.id === shippingModalOrder.id
                ? { ...o, status: 'shipped', shipping_details: shippingDetails }
                : o
            ));

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

            setInstitutionalModal({
                title: "¡Despachado!",
                message: "El pedido ha sido marcado como ENVIADO y se ha notificado al cliente con los detalles de la guía.",
                type: 'success'
            });
            setShippingModalOrder(null);
            setShippingNote('');
            setShippingFile(null);

        } catch (error: any) {
            setInstitutionalModal({
                title: "Error de Despacho",
                message: error.message || "No se pudo actualizar la información de envío.",
                type: 'error'
            });
        } finally {
            setIsShippingRunning(false);
        }
    };

    const handleConfirmOrder = (orderId: string) => {
        setConfirmModal({
            title: "¿Confirmar Pago?",
            message: "He validado que el dinero ingresó a la cuenta corporativa y deseo marcar este pedido como pagado.",
            onConfirm: () => updateOrderStatus(orderId, 'paid'),
            type: 'info'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'pending_payment': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'processing': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
            case 'shipped': return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
            case 'delivered': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'cancelled': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.shipping_address?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        const orderDate = new Date(order.created_at);
        const matchesStartDate = !startDate || orderDate >= new Date(startDate);
        const matchesEndDate = !endDate || orderDate <= new Date(endDate + 'T23:59:59');

        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'pending_payment').length;

    return (
        <div className="min-h-screen bg-[#0B120D] text-white">
            {/* MODAL DE CONFIRMACIÓN INSTITUCIONAL */}
            <ConfirmModal
                isOpen={!!confirmModal}
                onClose={() => setConfirmModal(null)}
                onConfirm={confirmModal?.onConfirm || (() => { })}
                title={confirmModal?.title || ''}
                message={confirmModal?.message || ''}
                type={confirmModal?.type}
            />

            <AdminHeader
                title="BITÁCORA DE PEDIDOS"
                pendingOrdersCount={pendingOrdersCount}
                pendingUsersCount={pendingUsersCount}
            />

            <div className="pt-24 px-6 pb-20 max-w-7xl mx-auto">
                {/* MODAL INSTITUCIONAL (ALERTAS PREMIUM) */}
                <InstitutionalModal
                    isOpen={!!institutionalModal}
                    onClose={() => setInstitutionalModal(null)}
                    title={institutionalModal?.title || ''}
                    message={institutionalModal?.message || ''}
                    type={institutionalModal?.type}
                />

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
                    <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4 mb-12">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <span className="material-icons-outlined">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-3xl font-serif text-[#C5A065]">Bitácora de Pedidos</h1>
                                <p className="text-gray-400 text-sm">Registro de transacciones y procesos de compra</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative group">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm group-focus-within:text-[#C5A065]">search</span>
                                <input
                                    type="text"
                                    placeholder="ID, Cliente o Email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-[#C5A065] transition-all w-full md:w-64"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className={`${selectClassName} pr-10`}
                                >
                                    <option value="all" className="bg-[#0B120D]">Todos los Estados</option>
                                    <option value="pending_payment" className="bg-[#0B120D]">⏳ Esperando Pago</option>
                                    <option value="pending" className="bg-[#0B120D]">🧐 Por Confirmar</option>
                                    <option value="paid" className="bg-[#0B120D]">✅ Pagado</option>
                                    <option value="processing" className="bg-[#0B120D]">☕ Preparando</option>
                                    <option value="shipped" className="bg-[#0B120D]">🚚 Enviado</option>
                                    <option value="delivered" className="bg-[#0B120D]">🏠 Entregado</option>
                                    <option value="cancelled" className="bg-[#0B120D]">❌ Cancelado</option>
                                </select>
                                <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#C5A065] pointer-events-none text-sm">unfold_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Filtros de Fecha */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Desde</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none focus:border-[#C5A065] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Hasta</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none focus:border-[#C5A065] transition-all"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setStartDate('');
                                setEndDate('');
                            }}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A065] hover:bg-[#C5A065]/10 rounded-lg transition-all"
                        >
                            Limpiar Filtros
                        </button>
                        <div className="ml-auto text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mostrando</p>
                            <p className="text-[#C5A065] font-serif text-xl">{filteredOrders.length} <span className="text-sm font-sans text-gray-400 font-normal">pedidos</span></p>
                        </div>
                    </div>


                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A065]"></div>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse table-auto">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-black/20 text-[10px] uppercase tracking-[0.2em] text-[#C5A065] font-black">
                                            <th className="px-6 py-4">Pedido / Fecha</th>
                                            <th className="px-6 py-4">Cliente</th>
                                            <th className="px-6 py-4">Productos</th>
                                            <th className="px-6 py-4">Total</th>
                                            <th className="px-6 py-4">Envío</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4 text-center">Gestión</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="font-mono text-[9px] text-gray-500 mb-0.5">#{order.id.slice(0, 8)}</p>
                                                    <p className="text-[11px] text-gray-300 leading-tight">
                                                        {new Date(order.created_at).toLocaleDateString('es-CO', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white font-bold text-xs">{order.shipping_address?.fullName || order.profiles?.full_name}</p>
                                                    <p className="text-[9px] text-gray-500 uppercase tracking-tighter truncate max-w-[150px]">{order.profiles?.email || order.shipping_address?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                                                    <div className="space-y-0.5">
                                                        {order.order_items?.map((item, i) => (
                                                            <div key={i} className="whitespace-nowrap">
                                                                <span className="text-[#C5A065] font-black">{item.quantity}x</span> {typeof (item.products?.name) === 'object' ? (item.products?.name?.es || item.products?.name?.en) : (item.products?.name || 'Producto')}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-serif text-base text-[#C5A065] font-bold whitespace-nowrap">${order.total_amount.toLocaleString()}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-gray-300 text-[11px] font-bold">{order.shipping_address?.city}</p>
                                                    <p className="text-[9px] text-gray-500 truncate max-w-[120px]">{order.shipping_address?.address}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${getStatusColor(order.status)}`}>
                                                        {order.status === 'pending_payment' ? (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-orange-400">history</span>
                                                                Esperando Pago
                                                            </>
                                                        ) : order.status === 'pending' ? (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-yellow-400 animate-pulse">pending</span>
                                                                Por Confirmar
                                                            </>
                                                        ) : order.status === 'paid' ? (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-emerald-400">check_circle</span>
                                                                Pagado
                                                            </>
                                                        ) : order.status === 'processing' ? (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-cyan-400">coffee</span>
                                                                Preparando
                                                            </>
                                                        ) : order.status === 'shipped' ? (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-sky-400">local_shipping</span>
                                                                Enviado
                                                            </>
                                                        ) : order.status === 'delivered' ? (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-purple-400">home</span>
                                                                Entregado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="material-icons-outlined text-[10px] text-rose-400">cancel</span>
                                                                Cancelado
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col gap-2 min-w-[180px]">
                                                        <div className="flex items-center justify-center gap-2">
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
                                                                                    const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(`${order.id}/${data[0].name}`);
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
                                                                            message: `Esta acción es irreversible, devolverá el stock automáticamente y marcará el pago como fallido si estaba pendiente.`,
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
                                                                                window.open(`/#/invoice/${order.id}`, '_blank');
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
                                                                            window.open(`/#/invoice/${order.id}`, '_blank');
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredOrders.length === 0 && (
                                <div className="py-20 text-center">
                                    <span className="material-icons-outlined text-6xl text-white/10 mb-4">shopping_basket</span>
                                    <p className="text-gray-500 italic">No se encontraron pedidos que coincidan con los filtros.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default OrderManager;
