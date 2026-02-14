import React, { useState } from 'react';
import { Order, orderService } from '../services/orderService';
import { useLanguage } from '../contexts/LanguageContext';

interface OrderCardProps {
    order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { language, formatPrice } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';

    const statusConfig = orderService.getStatusConfig(order.status);
    const formattedDate = new Date(order.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden backdrop-blur-xl transition-all hover:border-[#C8AA6E]/30">
            {/* HEADER */}
            <div
                className="p-4 md:p-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Side: Order Info */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig.bgColor} ${statusConfig.color}`}>
                                <span className="material-icons-outlined text-sm align-middle mr-1">{statusConfig.icon}</span>
                                {statusConfig.label}
                            </span>
                            <span className="text-white/40 text-sm">#{order.id.substring(0, 8)}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                                <span className="material-icons-outlined text-base">calendar_today</span>
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-icons-outlined text-base">shopping_bag</span>
                                <span>{order.order_items.length} {order.order_items.length === 1 ? 'producto' : 'productos'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Price & Expand Button */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Total</div>
                            <div className="text-2xl font-serif text-[#C8AA6E]">{formatPrice(order.total_amount)}</div>
                        </div>

                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <span className={`material-icons-outlined text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>
                    </div>
                </div>

                {/* Product Thumbnails Preview (always visible) */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {order.order_items.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex-shrink-0">
                            <img
                                src={item.products?.image_url || '/placeholder-product.png'}
                                alt=""
                                className="w-12 h-12 object-contain bg-white/5 rounded border border-white/10"
                            />
                        </div>
                    ))}
                    {order.order_items.length > 5 && (
                        <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-white/40 text-xs">
                            +{order.order_items.length - 5}
                        </div>
                    )}
                </div>
            </div>

            {/* EXPANDED DETAILS */}
            {isExpanded && (
                <div className="border-t border-white/10 p-4 md:p-6 space-y-4 animate-fade-in">
                    {/* Products List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">
                            Productos
                        </h3>
                        {order.order_items.map((item, idx) => {
                            const detail = order.metadata?.items_details?.find((d: any) => d.id.toString().startsWith(item.product_id.toString()));
                            return (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                    <img
                                        src={item.products?.image_url || '/placeholder-product.png'}
                                        alt=""
                                        className="w-16 h-16 object-contain bg-white/10 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">
                                            {detail?.name || item.products?.name?.[lang] || item.products?.name?.es || 'Producto'}
                                        </div>
                                        <div className="flex gap-2 items-center text-[10px]">
                                            <span className="text-white/40 uppercase tracking-widest">{lang === 'es' ? 'Cantidad' : 'Qty'}: {item.quantity}</span>
                                            {detail?.sub && (
                                                <>
                                                    <span className="text-white/10">•</span>
                                                    <span className="text-[#C5A065] font-bold uppercase tracking-widest">
                                                        {detail.sub}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white/60 text-sm">Precio unitario</div>
                                        <div className="text-[#C8AA6E] font-medium">{formatPrice(item.price_at_time)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">
                                Dirección de Envío
                            </h3>
                            <div className="p-3 bg-white/5 rounded-lg text-white/80 text-sm space-y-1">
                                <div>{order.shipping_address.fullName || order.shipping_address.address}</div>
                                {order.shipping_address.fullName && <div>{order.shipping_address.address}</div>}
                                <div>{order.shipping_address.city}, {order.shipping_address.department}</div>
                                {order.shipping_address.notes && (
                                    <div className="text-white/50 italic text-xs mt-2">
                                        Nota: {order.shipping_address.notes}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Method */}
                    {order.payment_method && (
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="material-icons-outlined text-base">payment</span>
                            <span>Método de pago: <span className="text-white/80">{order.payment_method}</span></span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
