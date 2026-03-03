import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, Order } from '@/services/orderService';
import { useLanguage } from '@/shared/store/LanguageContext';

const TrackOrderPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { lang, formatPrice } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            const { data, error } = await orderService.getOrderDetails(orderId);
            if (!error && data) {
                setOrder(data);
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050806] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#C5A065]/20 border-t-[#C5A065] rounded-full animate-spin mb-4"></div>
                <p className="text-[#C5A065] font-accent text-[10px] uppercase tracking-[0.3em] animate-pulse">Sintonizando el Origen...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#050806] flex flex-col items-center justify-center p-6 text-center">
                <span className="material-icons-outlined text-6xl text-red-500/20 mb-6">error_outline</span>
                <h1 className="text-3xl font-serif text-white mb-4 uppercase tracking-tighter">Vínculo Perdido</h1>
                <p className="text-white/40 max-w-xs mb-8 font-light">
                    No hemos podido encontrar el ritual asociado a este código. Por favor verifica tu enlace.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-[#C5A065] text-black rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const config = orderService.getStatusConfig(order.status);
    const steps = [
        { id: 'pending_payment', label: 'Esperando Pago', icon: 'payments' },
        { id: 'paid', label: 'Pago Confirmado', icon: 'check_circle' },
        { id: 'processing', label: 'En Preparación', icon: 'inventory_2' },
        { id: 'shipped', label: 'En Camino', icon: 'local_shipping' },
        { id: 'delivered', label: 'Entregado', icon: 'task_alt' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === order.status);
    // Fallback if status is 'pending' or others
    const effectiveStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
        <div className="min-h-screen bg-[#050806] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-16 animate-fade-in">
                    <div className="inline-block px-4 py-1 rounded-full bg-[#C5A065]/10 border border-[#C5A065]/20 mb-4">
                        <span className="text-[10px] font-bold text-[#C5A065] uppercase tracking-widest">Seguimiento de Ritual</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 italic">Pedido #{order.id.slice(0, 8)}</h1>
                    <p className="text-white/40 font-light uppercase tracking-[0.2em] text-[10px]">Iniciado el {new Date(order.created_at).toLocaleDateString()}</p>
                </header>

                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A065]/5 blur-[100px] pointer-events-none"></div>

                    {/* PROGRESS BAR */}
                    <div className="relative mb-16">
                        <div className="absolute top-6 left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#C5A065] to-[#D4B075] transition-all duration-1000 ease-out"
                                style={{ width: `${(effectiveStepIndex / (steps.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        <div className="relative flex justify-between">
                            {steps.map((step, idx) => {
                                const isCompleted = idx <= effectiveStepIndex;
                                const isCurrent = idx === effectiveStepIndex;

                                return (
                                    <div key={idx} className="flex flex-col items-center gap-4 z-10">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isCompleted
                                                ? 'bg-[#C5A065] border-[#C5A065] text-black shadow-[0_0_20px_rgba(197,160,101,0.4)]'
                                                : 'bg-[#050806] border-white/10 text-white/20'
                                            }`}>
                                            <span className="material-icons-outlined text-xl">{step.icon}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest text-center max-w-[80px] ${isCurrent ? 'text-[#C5A065]' : isCompleted ? 'text-white/60' : 'text-white/20'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                        <section>
                            <h3 className="text-xs font-bold text-[#C5A065] uppercase tracking-widest mb-6 border-b border-[#C5A065]/20 pb-2">Destino del Aroma</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Entregar a</p>
                                    <p className="text-white font-medium">{order.shipping_address?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dirección</p>
                                    <p className="text-white font-light text-sm">{order.shipping_address?.address}</p>
                                    <p className="text-white/60 text-xs">{order.shipping_address?.city}, {order.shipping_address?.department}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold text-[#C5A065] uppercase tracking-widest mb-6 border-b border-[#C5A065]/20 pb-2">Resumen</h3>
                            <div className="space-y-3">
                                {order.order_items?.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-white/60 font-light">{item.quantity}x {typeof item.products?.name === 'object' ? (item.products?.name[lang] || item.products?.name.es) : (item.products?.name || 'Producto')}</span>
                                        <span className="text-white font-mono">{formatPrice(item.price_at_time * item.quantity)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-4 border-t border-white/5 text-lg font-serif">
                                    <span className="text-white italic">Total Ritual</span>
                                    <span className="text-[#C5A065] font-bold">{formatPrice(order.total_amount)}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-6 leading-relaxed">
                        Cualquier inquietud, nuestro equipo está a tu disposición en <br />
                        <span className="text-[#C5A065]">origensierranevadasm@gmail.com</span>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all group"
                    >
                        Volver a la Tienda
                        <span className="material-icons-outlined text-xs inline-block translate-y-0.5 ml-2 group-hover:translate-x-2 transition-transform">east</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;
