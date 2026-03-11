import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminHeader from '@/shared/components/AdminHeader';
import { Package, X } from 'lucide-react';

interface SalesReportDetail {
    product_name: any;
    quantity: number;
    unit_price: number;
    total: number;
    order_id: string;
    date: string;
}

interface SalesReport {
    provider_id: string;
    provider_name: string;
    total_sales: number;
    total_items: number;
    payout_amount: number; // Amount to pay to provider
    commission: number;    // Platform commission
    details: SalesReportDetail[];
}

const SalesReports: React.FC = () => {
    const [reports, setReports] = useState<SalesReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedReport, setSelectedReport] = useState<SalesReport | null>(null);
    const [pendingUsersCount, setPendingUsersCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const { formatPrice } = useLanguage();
    const navigate = useNavigate();

    const COMMISSION_RATE = 0.15; // 15% commission for the platform

    const fetchReports = async () => {
        setLoading(true);
        try {
            // 1. Fetch all paid/shipped/delivered orders
            let query = supabase
                .from('orders')
                .select(`
                    id,
                    created_at,
                    status,
                    order_items (
                        quantity,
                        unit_price,
                        products (
                            id,
                            name,
                            origin,
                            brand,
                            provider_id
                        )
                    )
                `)
                .in('status', ['paid', 'shipped', 'delivered']);

            if (dateRange.start) query = query.gte('created_at', dateRange.start);
            if (dateRange.end) query = query.lte('created_at', `${dateRange.end}T23:59:59`);

            const { data: orders, error } = await query;

            if (error) throw error;

            // 2. Aggregate data by provider
            const providerMap: Record<string, SalesReport> = {};

            orders?.forEach(order => {
                order.order_items?.forEach((item: any) => {
                    const product = item.products;
                    // Fallback provider name if provider_id is missing or name is unknown
                    const providerId = product?.provider_id || 'unassigned';
                    const providerName = product?.brand || product?.origin || 'Sin Proveedor';

                    if (!providerMap[providerId]) {
                        providerMap[providerId] = {
                            provider_id: providerId,
                            provider_name: providerName,
                            total_sales: 0,
                            total_items: 0,
                            payout_amount: 0,
                            commission: 0,
                            details: []
                        };
                    }

                    const saleAmount = item.quantity * item.unit_price;
                    providerMap[providerId].total_sales += saleAmount;
                    providerMap[providerId].total_items += item.quantity;
                    providerMap[providerId].details.push({
                        product_name: product?.name || 'Producto Desconocido',
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total: saleAmount,
                        order_id: order.id,
                        date: order.created_at
                    });
                });
            });

            // Calculate commissions and payouts
            const finalReports = Object.values(providerMap).map(report => {
                const commission = report.total_sales * COMMISSION_RATE;
                return {
                    ...report,
                    commission: commission,
                    payout_amount: report.total_sales - commission
                };
            });

            setReports(finalReports.sort((a, b) => b.total_sales - a.total_sales));
        } catch (err) {
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCounts = async () => {
        try {
            const { data: profiles } = await supabase.from('profiles').select('status');
            if (profiles) setPendingUsersCount(profiles.filter(p => p.status === 'pending').length);
            const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'pending_payment']);
            setPendingOrdersCount(count || 0);
        } catch (e) { }
    };

    useEffect(() => {
        fetchReports();
        fetchCounts();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B120D] text-white">
            <AdminHeader
                title="REPORTE DE VENTAS"
                pendingOrdersCount={pendingOrdersCount}
                pendingUsersCount={pendingUsersCount}
            />

            <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#C5A065] hover:text-black transition-all group"
                        >
                            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-3xl font-serif text-[#C5A065]">Cruce de Ventas</h1>
                            <p className="text-gray-400 text-sm">Cálculo de pagos y comisiones por proveedor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="bg-transparent px-3 py-1.5 text-xs outline-none border-none focus:ring-0 text-white/70"
                            />
                            <span className="text-white/20 self-center px-2">-</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="bg-transparent px-3 py-1.5 text-xs outline-none border-none focus:ring-0 text-white/70"
                            />
                        </div>
                        <button
                            onClick={fetchReports}
                            className="bg-[#C5A065] text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(197,160,101,0.3)]"
                        >
                            Filtrar
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="w-12 h-12 border-2 border-[#C5A065]/20 border-t-[#C5A065] rounded-full animate-spin"></div>
                        <p className="text-[#C5A065] text-[10px] font-bold uppercase tracking-[.3em] animate-pulse">Calculando métricas financieras...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary Cards */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                <span className="material-icons-outlined absolute -right-4 -bottom-4 text-8xl text-white/[0.03] group-hover:text-white/[0.07] transition-all">payments</span>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[.2em] font-bold mb-2">Ventas Totales (Bruto)</p>
                                <p className="text-3xl font-serif text-white">
                                    {formatPrice(reports.reduce((acc, r) => acc + r.total_sales, 0))}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                <span className="material-icons-outlined absolute -right-4 -bottom-4 text-8xl text-white/[0.03] group-hover:text-white/[0.07] transition-all">percent</span>
                                <p className="text-[10px] text-[#C5A065] uppercase tracking-[.2em] font-bold mb-2">Comisión Plataforma (15%)</p>
                                <p className="text-3xl font-serif text-[#C5A065]">
                                    {formatPrice(reports.reduce((acc, r) => acc + r.commission, 0))}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                <span className="material-icons-outlined absolute -right-4 -bottom-4 text-8xl text-white/[0.03] group-hover:text-white/[0.07] transition-all">account_balance_wallet</span>
                                <p className="text-[10px] text-green-400 uppercase tracking-[.2em] font-bold mb-2">Total a Dispersar (Neto)</p>
                                <p className="text-3xl font-serif text-green-400">
                                    {formatPrice(reports.reduce((acc, r) => acc + r.payout_amount, 0))}
                                </p>
                            </div>
                        </div>

                        {/* Reports Table */}
                        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#C5A065]/10 text-[#C5A065] text-[10px] uppercase tracking-widest font-bold">
                                            <th className="px-6 py-4">Proveedor / Marca</th>
                                            <th className="px-6 py-4 text-center">Items Vendidos</th>
                                            <th className="px-6 py-4">Total Bruto</th>
                                            <th className="px-6 py-4">Comisión (15%)</th>
                                            <th className="px-6 py-4">A Pagar (Neto)</th>
                                            <th className="px-6 py-4 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {reports.map((report) => (
                                            <tr key={report.provider_id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-6 text-white font-medium">{report.provider_name}</td>
                                                <td className="px-6 py-6 text-center text-gray-400">{report.total_items}</td>
                                                <td className="px-6 py-6 font-mono text-gray-300">{formatPrice(report.total_sales)}</td>
                                                <td className="px-6 py-6 font-mono text-red-400/70">-{formatPrice(report.commission)}</td>
                                                <td className="px-6 py-6 font-mono text-green-400 font-bold">{formatPrice(report.payout_amount)}</td>
                                                <td className="px-6 py-6 text-center">
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="h-8 px-3 bg-white/5 text-[#C5A065] text-[10px] uppercase tracking-widest font-bold rounded-lg border border-white/10 hover:bg-[#C5A065] hover:text-black transition-all"
                                                    >
                                                        Detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {reports.length === 0 && (
                                <div className="py-20 text-center">
                                    <span className="material-icons-outlined text-6xl text-white/10 mb-4">analytics</span>
                                    <p className="text-gray-500 italic">No hay registros de venta registrados para este periodo.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE DETALLES POR PROVEEDOR */}
            {selectedReport && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-hidden">
                    <div className="bg-[#0B120D] border border-[#C5A065]/20 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(197,160,101,0.1)] flex flex-col animate-scale-up">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-white/10 bg-[#C5A065]/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif text-[#C5A065] italic">{selectedReport.provider_name}</h3>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">Desglose detallado de ventas</p>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable area */}
                        <div className="flex-1 overflow-y-auto p-8 bg-black/20">
                            {/* Charts Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Sales Over Time Chart (Line Chart) */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h4 className="text-[10px] text-[#C5A065] font-black uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                                        <span className="material-icons-outlined text-sm">trending_up</span>
                                        Comportamiento de Ventas (Tiempo)
                                    </h4>
                                    <div className="h-48 w-full relative group/chart">
                                        {(() => {
                                            const sortedDetails = [...selectedReport.details].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                            const groupedByDate: Record<string, number> = {};
                                            sortedDetails.forEach(d => {
                                                const date = new Date(d.date).toLocaleDateString();
                                                groupedByDate[date] = (groupedByDate[date] || 0) + d.total;
                                            });
                                            const dates = Object.keys(groupedByDate);
                                            const values = Object.values(groupedByDate);
                                            const max = Math.max(...values, 1);

                                            if (dates.length < 2) return (
                                                <div className="h-full flex items-center justify-center text-white/20 text-[10px] uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
                                                    Datos insuficientes para tendencia
                                                </div>
                                            );

                                            const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');

                                            return (
                                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                    <defs>
                                                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                            <stop offset="0%" style={{ stopColor: '#C5A065', stopOpacity: 0.3 }} />
                                                            <stop offset="100%" style={{ stopColor: '#C5A065', stopOpacity: 0 }} />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#grad)" />
                                                    <polyline
                                                        fill="none"
                                                        stroke="#C5A065"
                                                        strokeWidth="1.5"
                                                        points={points}
                                                        className="drop-shadow-[0_0_8px_rgba(197,160,101,0.5)]"
                                                    />
                                                    {values.map((v, i) => (
                                                        <circle
                                                            key={i}
                                                            cx={(i / (values.length - 1)) * 100}
                                                            cy={100 - (v / max) * 100}
                                                            r="1.5"
                                                            fill="#0B120D"
                                                            stroke="#C5A065"
                                                            strokeWidth="1"
                                                        />
                                                    ))}
                                                </svg>
                                            );
                                        })()}
                                        <div className="flex justify-between mt-2 text-[8px] text-white/30 uppercase tracking-tighter">
                                            <span>Inicio</span>
                                            <span>Tiempo</span>
                                            <span>Actual</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Products Chart (Horizontal Bar Chart) */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                                        <span className="material-icons-outlined text-sm">inventory_2</span>
                                        Mix de Productos (Unidades)
                                    </h4>
                                    <div className="space-y-4 max-h-[192px] overflow-y-auto pr-2 custom-scrollbar">
                                        {(() => {
                                            const productMix: Record<string, number> = {};
                                            selectedReport.details.forEach(d => {
                                                const name = typeof d.product_name === 'object' ? d.product_name.es : d.product_name;
                                                productMix[name] = (productMix[name] || 0) + d.quantity;
                                            });
                                            const sorted = Object.entries(productMix).sort((a, b) => b[1] - a[1]);
                                            const max = Math.max(...Object.values(productMix), 1);

                                            return sorted.map(([name, qty], i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-white/60 truncate max-w-[150px]">{name}</span>
                                                        <span className="text-white font-mono">{qty} und.</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500/50 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                            style={{ width: `${(qty / max) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-[#C5A065] font-black uppercase tracking-widest mb-1">Ventas</p>
                                    <p className="text-xl font-serif">{formatPrice(selectedReport.total_sales)}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-red-400 font-black uppercase tracking-widest mb-1">Comisión</p>
                                    <p className="text-xl font-serif">{formatPrice(selectedReport.commission)}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-green-400 font-black uppercase tracking-widest mb-1">Neto</p>
                                    <p className="text-xl font-serif font-bold">{formatPrice(selectedReport.payout_amount)}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Items</p>
                                    <p className="text-xl font-serif">{selectedReport.total_items}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40">
                                <table className="w-full text-left">
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
                                        {selectedReport.details.map((detail, idx) => (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-4 text-white/60">
                                                    {new Date(detail.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-4 font-mono text-[10px] text-[#C5A065]">
                                                    #{detail.order_id.slice(0, 8)}
                                                </td>
                                                <td className="px-5 py-4 text-white font-medium">
                                                    {typeof detail.product_name === 'object' ? detail.product_name.es : detail.product_name}
                                                </td>
                                                <td className="px-5 py-4 text-center text-gray-400">
                                                    {detail.quantity}
                                                </td>
                                                <td className="px-5 py-4 text-right font-mono text-gray-300">
                                                    {formatPrice(detail.total)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-white/10 bg-black/40 text-center">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-8 py-3 bg-white/5 text-[#C5A065] border border-[#C5A065]/30 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#C5A065] hover:text-black transition-all shadow-xl shadow-[#C5A065]/5"
                            >
                                CERRAR DETALLES
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesReports;
