
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/shared/components/Logo';

interface SalesReport {
    provider_id: string;
    provider_name: string;
    total_sales: number;
    total_items: number;
    payout_amount: number; // Amount to pay to provider
    commission: number;    // Platform commission
}

const SalesReports: React.FC = () => {
    const [reports, setReports] = useState<SalesReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
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
                        price_at_time,
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
                            commission: 0
                        };
                    }

                    const saleAmount = item.quantity * item.price_at_time;
                    providerMap[providerId].total_sales += saleAmount;
                    providerMap[providerId].total_items += item.quantity;
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

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B120D] text-white pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <span className="material-icons-outlined">arrow_back</span>
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
                        <p className="text-[#C5A065] text-[10px] font-bold uppercase tracking-[.3em] animate-pulse">Calculando rituales financieros...</p>
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
                                                    <button className="h-8 px-3 bg-white/5 text-[#C5A065] text-[10px] uppercase tracking-widest font-bold rounded-lg border border-white/10 hover:bg-[#C5A065] hover:text-black transition-all">
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
                                    <p className="text-gray-500 italic">No hay rituales de venta registrados para este periodo.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesReports;
