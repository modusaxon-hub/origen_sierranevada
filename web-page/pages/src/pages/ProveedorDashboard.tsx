import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabaseClient';
import Logo from '@/shared/components/Logo';

interface ProveedorProduct {
    id: string;
    name: any;
    category: string;
    stock: number;
    price: number;
    available: boolean;
    brand?: string;
}

interface SaleDetail {
    date: string;
    order_id: string;
    product_name: any;
    quantity: number;
    unit_price: number;
    total: number;
}

interface ProveedorStats {
    totalSales: number;
    totalItems: number;
    commission: number;
    payout: number;
    activeProducts: number;
    lowStockProducts: number;
}

const COMMISSION_RATE = 0.15;

type TabId = 'resumen' | 'productos' | 'ventas' | 'pagos';

const ProveedorDashboard: React.FC = () => {
    const { user } = useAuth();
    const { formatPrice } = useLanguage();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabId>('resumen');
    const [stats, setStats] = useState<ProveedorStats | null>(null);
    const [products, setProducts] = useState<ProveedorProduct[]>([]);
    const [salesDetails, setSalesDetails] = useState<SaleDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [providerName, setProviderName] = useState('');

    useEffect(() => {
        if (user) fetchProveedorData();
    }, [user]);

    const fetchProveedorData = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Profile name
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();
            setProviderName(profileData?.full_name || '');

            // 2. Products owned by this provider
            const { data: productsData } = await supabase
                .from('products')
                .select('id, name, category, stock, price, available, brand')
                .eq('provider_id', user.id);
            setProducts(productsData || []);

            // 3. Sales: orders with items where products.provider_id = user.id
            const { data: ordersData } = await supabase
                .from('orders')
                .select(`
                    id, created_at, status,
                    order_items (
                        quantity, unit_price,
                        products ( id, name, provider_id )
                    )
                `)
                .in('status', ['paid', 'shipped', 'delivered']);

            const myDetails: SaleDetail[] = [];
            let totalSales = 0;
            let totalItems = 0;

            ordersData?.forEach((order: any) => {
                order.order_items?.forEach((item: any) => {
                    if (item.products?.provider_id === user.id) {
                        const saleAmount = item.quantity * item.unit_price;
                        myDetails.push({
                            date: order.created_at,
                            order_id: order.id,
                            product_name: item.products.name,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            total: saleAmount
                        });
                        totalSales += saleAmount;
                        totalItems += item.quantity;
                    }
                });
            });

            setSalesDetails(myDetails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

            const commission = totalSales * COMMISSION_RATE;
            const activeCount = (productsData || []).filter(p => p.available).length;
            const lowStockCount = (productsData || []).filter(p => p.stock <= 5 && p.available).length;

            setStats({
                totalSales,
                totalItems,
                commission,
                payout: totalSales - commission,
                activeProducts: activeCount,
                lowStockProducts: lowStockCount
            });
        } catch (err) {
            console.error('Error fetching provider data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/');
    };

    // Chart data: group sales by date
    const chartData = useMemo(() => {
        const map = new Map<string, number>();
        salesDetails.forEach(d => {
            const key = new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            map.set(key, (map.get(key) || 0) + d.total);
        });
        return Array.from(map.entries()).slice(-12);
    }, [salesDetails]);

    const chartMax = useMemo(() => Math.max(...chartData.map(d => d[1]), 1), [chartData]);

    const tabs: { id: TabId; label: string; icon: string }[] = [
        { id: 'resumen', label: 'Resumen', icon: 'dashboard' },
        { id: 'productos', label: 'Mis Productos', icon: 'inventory_2' },
        { id: 'ventas', label: 'Ventas', icon: 'trending_up' },
        { id: 'pagos', label: 'Liquidaciones', icon: 'account_balance_wallet' },
    ];

    const getProductName = (name: any): string => {
        if (typeof name === 'object' && name !== null) return name.es || name.en || '';
        return String(name || '');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B120D]">
                <div className="w-12 h-12 border-2 border-[#C5A065]/20 border-t-[#C5A065] rounded-full animate-spin mb-4"></div>
                <p className="text-white/40 text-sm">Cargando portal de proveedor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B120D] text-white font-sans">
            {/* Fixed Proveedor Header */}
            <header className="fixed top-0 w-full z-[100] bg-[#0B120D]/95 backdrop-blur-xl border-b border-[#C5A065]/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Logo className="w-[140px] h-auto" to="/" />
                        <span className="text-[#C5A065] text-xl font-serif tracking-wide border-l border-[#C5A065]/30 pl-4 uppercase hidden sm:inline">
                            Portal Proveedor
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 text-white/40 hover:text-[#C5A065] transition-colors" title="Ir a la tienda">
                            <span className="material-icons-outlined text-2xl">storefront</span>
                        </button>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-[#C5A065] uppercase tracking-widest font-black">PROVEEDOR</p>
                            <p className="text-xs text-white/60">{providerName}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Cerrar sesión">
                            <span className="material-icons-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Nav */}
                    <nav className="lg:col-span-3 space-y-3">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-500 border ${activeTab === tab.id
                                    ? 'bg-[#C5A065] text-black border-[#C5A065] shadow-[0_10px_30px_rgba(197,160,101,0.2)]'
                                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                <span className="material-icons-outlined text-xl">{tab.icon}</span>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Main Content */}
                    <main className="lg:col-span-9 min-h-[500px]">

                        {/* TAB: RESUMEN */}
                        {activeTab === 'resumen' && stats && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <h2 className="text-3xl font-serif">Bienvenido, {providerName}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Ventas Totales (Bruto)', value: formatPrice(stats.totalSales), icon: 'payments', color: 'text-white' },
                                        { label: 'Tu Pago Neto (85%)', value: formatPrice(stats.payout), icon: 'account_balance_wallet', color: 'text-emerald-400' },
                                        { label: 'Productos Activos', value: stats.activeProducts, icon: 'inventory_2', color: 'text-[#C5A065]' },
                                        { label: 'Stock Crítico', value: stats.lowStockProducts, icon: 'warning_amber', color: stats.lowStockProducts > 0 ? 'text-orange-400' : 'text-white/30' },
                                    ].map((kpi, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                            <span className="material-icons-outlined absolute -right-4 -bottom-4 text-8xl text-white/[0.03] group-hover:text-white/[0.07] transition-all">
                                                {kpi.icon}
                                            </span>
                                            <p className={`text-[10px] uppercase tracking-[.2em] font-bold mb-2 ${kpi.color}`}>{kpi.label}</p>
                                            <p className={`text-3xl font-serif ${kpi.color}`}>{kpi.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#C5A065]/5 border border-[#C5A065]/20 rounded-2xl p-6 text-sm text-white/60 flex items-start gap-4">
                                    <span className="material-icons-outlined text-[#C5A065] text-2xl flex-shrink-0">info</span>
                                    <p>La plataforma retiene una comisión del <strong className="text-[#C5A065]">15%</strong> sobre las ventas brutas. El <strong className="text-emerald-400">85%</strong> restante es tu pago neto.</p>
                                </div>

                                {/* Low stock alerts */}
                                {stats.lowStockProducts > 0 && (
                                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 flex items-start gap-4">
                                        <span className="material-icons-outlined text-orange-400 text-2xl flex-shrink-0">warning_amber</span>
                                        <div>
                                            <p className="text-orange-400 font-bold text-sm mb-1">Alerta de Stock</p>
                                            <p className="text-white/50 text-sm">
                                                Tienes {stats.lowStockProducts} producto(s) con stock crítico (≤5 unidades). Contacta al administrador para reabastecer.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: MIS PRODUCTOS */}
                        {activeTab === 'productos' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-serif">Mis Productos</h2>
                                    <p className="text-xs text-white/40">Gestión de productos a cargo del administrador</p>
                                </div>

                                {products.length === 0 ? (
                                    <div className="text-center py-20 bg-white/[0.02] border border-white/5 border-dashed rounded-3xl">
                                        <span className="material-icons-outlined text-4xl text-white/10 mb-4 block">inventory_2</span>
                                        <p className="text-white/40">No tienes productos asignados aún.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left min-w-[600px]">
                                                <thead>
                                                    <tr className="bg-[#C5A065]/10 text-[#C5A065] text-[10px] uppercase tracking-widest font-bold">
                                                        <th className="px-6 py-4">Producto</th>
                                                        <th className="px-6 py-4">Categoría</th>
                                                        <th className="px-6 py-4 text-center">Stock</th>
                                                        <th className="px-6 py-4">Precio</th>
                                                        <th className="px-6 py-4 text-center">Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 text-sm">
                                                    {products.map(p => (
                                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-5 font-medium text-white">
                                                                {getProductName(p.name)}
                                                            </td>
                                                            <td className="px-6 py-5 text-white/60 capitalize">{p.category}</td>
                                                            <td className={`px-6 py-5 text-center font-mono font-bold ${p.stock <= 5 ? 'text-orange-400' : 'text-white/80'}`}>
                                                                {p.stock}
                                                                {p.stock <= 5 && <span className="material-icons-outlined text-xs ml-1">warning</span>}
                                                            </td>
                                                            <td className="px-6 py-5 font-mono text-[#C5A065]">{formatPrice(p.price)}</td>
                                                            <td className="px-6 py-5 text-center">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.available
                                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                                    : 'bg-white/10 text-white/30 border border-white/10'
                                                                    }`}>
                                                                    {p.available ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: VENTAS */}
                        {activeTab === 'ventas' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <h2 className="text-3xl font-serif">Mis Ventas</h2>

                                {salesDetails.length === 0 ? (
                                    <div className="text-center py-20 bg-white/[0.02] border border-white/5 border-dashed rounded-3xl">
                                        <span className="material-icons-outlined text-4xl text-white/10 mb-4 block">trending_up</span>
                                        <p className="text-white/40">Aún no tienes ventas registradas.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Chart */}
                                        {chartData.length > 1 && (
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                <h4 className="text-[10px] text-[#C5A065] font-black uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                                                    <span className="material-icons-outlined text-sm">trending_up</span>
                                                    Comportamiento de Ventas
                                                </h4>
                                                <div className="h-48 w-full relative">
                                                    <svg viewBox={`0 0 ${chartData.length * 80} 200`} className="w-full h-full" preserveAspectRatio="none">
                                                        {/* Grid lines */}
                                                        {[0, 50, 100, 150].map(y => (
                                                            <line key={y} x1="0" y1={y} x2={chartData.length * 80} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                                        ))}
                                                        {/* Area fill */}
                                                        <polygon
                                                            points={`0,200 ${chartData.map((d, i) => `${i * 80 + 40},${200 - (d[1] / chartMax) * 170}`).join(' ')} ${(chartData.length - 1) * 80 + 40},200`}
                                                            fill="url(#provGradient)"
                                                        />
                                                        {/* Line */}
                                                        <polyline
                                                            points={chartData.map((d, i) => `${i * 80 + 40},${200 - (d[1] / chartMax) * 170}`).join(' ')}
                                                            fill="none"
                                                            stroke="#C5A065"
                                                            strokeWidth="2.5"
                                                            strokeLinejoin="round"
                                                        />
                                                        {/* Dots */}
                                                        {chartData.map((d, i) => (
                                                            <circle key={i} cx={i * 80 + 40} cy={200 - (d[1] / chartMax) * 170} r="4" fill="#C5A065" />
                                                        ))}
                                                        <defs>
                                                            <linearGradient id="provGradient" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#C5A065" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#C5A065" stopOpacity="0" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                <div className="flex justify-between mt-3 text-[9px] text-white/30 uppercase tracking-widest">
                                                    {chartData.map((d, i) => (
                                                        <span key={i}>{d[0]}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Sales table */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left min-w-[600px]">
                                                    <thead>
                                                        <tr className="bg-white/5 text-[9px] uppercase tracking-widest text-white/40 font-black">
                                                            <th className="px-5 py-4">Fecha</th>
                                                            <th className="px-5 py-4">Pedido</th>
                                                            <th className="px-5 py-4">Producto</th>
                                                            <th className="px-5 py-4 text-center">Cant.</th>
                                                            <th className="px-5 py-4 text-right">Total Bruto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 text-xs">
                                                        {salesDetails.map((d, i) => (
                                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                                <td className="px-5 py-4 text-white/60">{new Date(d.date).toLocaleDateString('es-ES')}</td>
                                                                <td className="px-5 py-4 font-mono text-[10px] text-[#C5A065]">#{d.order_id.slice(0, 8)}</td>
                                                                <td className="px-5 py-4 text-white">{getProductName(d.product_name)}</td>
                                                                <td className="px-5 py-4 text-center text-white/60">{d.quantity}</td>
                                                                <td className="px-5 py-4 text-right font-mono text-white/80">{formatPrice(d.total)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* TAB: LIQUIDACIONES */}
                        {activeTab === 'pagos' && stats && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <h2 className="text-3xl font-serif">Liquidaciones</h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Ventas Brutas', value: formatPrice(stats.totalSales), color: 'text-[#C5A065]' },
                                        { label: 'Comisión (15%)', value: `-${formatPrice(stats.commission)}`, color: 'text-red-400' },
                                        { label: 'Tu Pago Neto', value: formatPrice(stats.payout), color: 'text-emerald-400' },
                                        { label: 'Items Vendidos', value: stats.totalItems, color: 'text-white' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                                            <p className={`text-[9px] uppercase tracking-widest font-black mb-1 ${item.color}`}>{item.label}</p>
                                            <p className={`text-2xl font-serif ${item.color}`}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center">
                                    <span className="material-icons-outlined text-emerald-400 text-4xl mb-4 block">account_balance_wallet</span>
                                    <p className="text-emerald-400 text-2xl font-serif mb-2">{formatPrice(stats.payout)}</p>
                                    <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Pago Pendiente de Dispersión</p>
                                    <p className="text-white/30 text-xs mt-4 max-w-sm mx-auto">
                                        El equipo de Origen Sierra Nevada procesa liquidaciones mensualmente. Contacta al administrador para más detalles.
                                    </p>
                                </div>

                                {/* Breakdown per product */}
                                {salesDetails.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h4 className="text-[10px] text-[#C5A065] font-black uppercase tracking-[.2em] mb-4 flex items-center gap-2">
                                            <span className="material-icons-outlined text-sm">receipt_long</span>
                                            Desglose por Producto
                                        </h4>
                                        <div className="space-y-3">
                                            {(() => {
                                                const productMap = new Map<string, { name: string; total: number; items: number }>();
                                                salesDetails.forEach(d => {
                                                    const name = getProductName(d.product_name);
                                                    const existing = productMap.get(name) || { name, total: 0, items: 0 };
                                                    existing.total += d.total;
                                                    existing.items += d.quantity;
                                                    productMap.set(name, existing);
                                                });
                                                return Array.from(productMap.values()).map((prod, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{prod.name}</p>
                                                            <p className="text-[10px] text-white/40">{prod.items} unidades vendidas</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-mono text-[#C5A065]">{formatPrice(prod.total)}</p>
                                                            <p className="text-[10px] text-emerald-400">Neto: {formatPrice(prod.total * (1 - COMMISSION_RATE))}</p>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProveedorDashboard;
