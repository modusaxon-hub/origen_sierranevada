import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Logo from '../shared/components/Logo';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = React.useState(0);
    const [metrics, setMetrics] = React.useState({
        ventasHoy: 0,
        ventasMes: 0,
        stockCritico: 0,
        ordersByStatus: { pending: 0, paid: 0, shipped: 0, delivered: 0 },
        metricsLoading: true,
    });

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/login');
    };

    const fetchMetrics = async () => {
        setMetrics(prev => ({ ...prev, metricsLoading: true }));
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const mesInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

            // Ejecutar queries en paralelo para evitar timeouts
            const [ordersHoyRes, ordersMesRes, allOrdersRes, stockRes] = await Promise.all([
                supabase
                    .from('orders')
                    .select('total_amount', { count: 'estimated' })
                    .gte('created_at', hoy.toISOString())
                    .in('status', ['paid', 'shipped', 'delivered']),
                supabase
                    .from('orders')
                    .select('total_amount', { count: 'estimated' })
                    .gte('created_at', mesInicio.toISOString())
                    .in('status', ['paid', 'shipped', 'delivered']),
                supabase
                    .from('orders')
                    .select('status', { count: 'estimated' }),
                supabase
                    .from('products')
                    .select('id', { count: 'estimated' })
                    .lte('stock', 5)
                    .eq('available', true)
            ]);

            const ordersHoy = ordersHoyRes.data || [];
            const ordersMes = ordersMesRes.data || [];
            const allOrders = allOrdersRes.data || [];
            const stockCriticoData = stockRes.data || [];

            // Procesar datos
            const ventasHoyTotal = ordersHoy.reduce((sum: number, order: any) => sum + ((order.total_amount as number) || 0), 0);
            const ventasMesTotal = ordersMes.reduce((sum: number, order: any) => sum + ((order.total_amount as number) || 0), 0);

            const ordersByStatusCount: Record<string, number> = {
                pending: 0,
                paid: 0,
                shipped: 0,
                delivered: 0,
            };

            allOrders.forEach((order: any) => {
                if (order.status in ordersByStatusCount) {
                    ordersByStatusCount[order.status]++;
                }
            });

            setMetrics({
                ventasHoy: ventasHoyTotal,
                ventasMes: ventasMesTotal,
                stockCritico: stockCriticoData.length || 0,
                ordersByStatus: ordersByStatusCount,
                metricsLoading: false,
            });
        } catch (error) {
            console.error('Error fetching metrics:', error);
            setMetrics(prev => ({ ...prev, metricsLoading: false }));
        }
    };

    React.useEffect(() => {
        let mounted = true;

        const initDashboard = async () => {
            try {
                // Fetch pending users
                const { data } = await authService.getAllProfiles();
                if (mounted && data) {
                    const count = (data as any[]).filter(p => p.status === 'pending').length;
                    setPendingCount(count);
                }

                // Fetch metrics
                if (mounted) {
                    await fetchMetrics();
                }
            } catch (error) {
                console.error('Error initializing dashboard:', error);
            }
        };

        initDashboard();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0B120D] text-white font-sans selection:bg-[#C5A065] selection:text-black">
            {/* Header del Dashboard */}
            <header className="fixed top-0 w-full z-50 bg-[#0B120D]/90 backdrop-blur-md border-b border-[#C5A065]/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => navigate('/')}
                        title="Ir al Inicio"
                    >
                        <Logo className="w-[170px] h-auto group-hover:opacity-80 transition-opacity" />
                        <span className="text-[#C5A065] text-xl font-serif tracking-wide border-l border-[#C5A065]/30 pl-4 group-hover:text-white transition-colors">
                            ORIGEN ADMIN
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Botón Ir a Tienda */}
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 text-white/60 hover:text-[#C5A065] transition-colors border-r border-white/10 pr-4 mr-2"
                            title="Ver Tienda Pública"
                        >
                            <span className="material-icons-outlined text-2xl">storefront</span>
                        </button>

                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-[#C5A065] uppercase tracking-widest font-bold">Administrador</p>
                            <p className="text-sm text-gray-300">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-red-400 hover:text-red-300 underline tracking-wide transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif text-[#C5A065] mb-2 uppercase tracking-tight">
                            Bienvenido, {user?.user_metadata?.full_name?.split(' ')[0] || 'Administrador'}
                        </h1>
                        <p className="text-gray-400 max-w-2xl font-light">
                            Desde aquí puedes gestionar el inventario, autorizar nuevos miembros y custodiar la identidad de la marca.
                        </p>
                    </div>

                    {/* Alerta de Acción Inmediata (Solo si hay pendientes) */}
                    {pendingCount > 0 && (
                        <div
                            onClick={() => navigate('/admin/users')}
                            className="bg-[#C5A065]/10 border border-[#C5A065]/30 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-[#C5A065]/20 transition-all animate-pulse"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#C5A065] flex items-center justify-center text-black">
                                <span className="material-icons-outlined">person_add</span>
                            </div>
                            <div>
                                <p className="text-[#C5A065] text-[10px] font-bold uppercase tracking-widest">Ritual Pendiente</p>
                                <p className="text-white text-sm font-medium">Hay {pendingCount} {pendingCount === 1 ? 'solicitud' : 'solicitudes'} en espera de autorización</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sección de Métricas */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif text-white uppercase tracking-tight">Métricas del Ritual</h2>
                        <button
                            onClick={fetchMetrics}
                            disabled={metrics.metricsLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-[#C5A065]/30 rounded-lg text-[#C5A065] hover:bg-[#C5A065]/10 transition-all disabled:opacity-50"
                        >
                            <span className={`material-icons-outlined text-sm ${metrics.metricsLoading ? 'animate-spin' : ''}`}>
                                refresh
                            </span>
                            Actualizar
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Ventas Hoy */}
                        <div className="bg-white/5 border border-[#C5A065]/20 rounded-2xl p-6 hover:border-[#C5A065]/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#C5A065]/10 flex items-center justify-center text-[#C5A065]">
                                    <span className="material-icons-outlined text-lg">trending_up</span>
                                </div>
                            </div>
                            {metrics.metricsLoading ? (
                                <div className="h-8 bg-white/5 rounded animate-pulse mb-2"></div>
                            ) : (
                                <p className="text-3xl font-serif text-[#C5A065] mb-2">
                                    ${(metrics.ventasHoy / 1000).toFixed(1)}K
                                </p>
                            )}
                            <p className="text-xs text-white/40 font-light">Ventas Hoy</p>
                        </div>

                        {/* Ventas Mes */}
                        <div className="bg-white/5 border border-[#C5A065]/20 rounded-2xl p-6 hover:border-[#C5A065]/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#C5A065]/10 flex items-center justify-center text-[#C5A065]">
                                    <span className="material-icons-outlined text-lg">calendar_month</span>
                                </div>
                            </div>
                            {metrics.metricsLoading ? (
                                <div className="h-8 bg-white/5 rounded animate-pulse mb-2"></div>
                            ) : (
                                <p className="text-3xl font-serif text-[#C5A065] mb-2">
                                    ${(metrics.ventasMes / 1000).toFixed(1)}K
                                </p>
                            )}
                            <p className="text-xs text-white/40 font-light">Ventas Este Mes</p>
                        </div>

                        {/* Usuarios Pendientes */}
                        <div className="bg-white/5 border border-[#C5A065]/20 rounded-2xl p-6 hover:border-[#C5A065]/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#C5A065]/10 flex items-center justify-center text-[#C5A065]">
                                    <span className="material-icons-outlined text-lg">person_add</span>
                                </div>
                            </div>
                            {metrics.metricsLoading ? (
                                <div className="h-8 bg-white/5 rounded animate-pulse mb-2"></div>
                            ) : (
                                <p className="text-3xl font-serif text-[#C5A065] mb-2">
                                    {pendingCount}
                                </p>
                            )}
                            <p className="text-xs text-white/40 font-light">Usuarios Pendientes</p>
                        </div>

                        {/* Stock Crítico */}
                        <div className="bg-white/5 border border-[#C5A065]/20 rounded-2xl p-6 hover:border-[#C5A065]/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                                    <span className="material-icons-outlined text-lg">warning</span>
                                </div>
                            </div>
                            {metrics.metricsLoading ? (
                                <div className="h-8 bg-white/5 rounded animate-pulse mb-2"></div>
                            ) : (
                                <p className="text-3xl font-serif text-red-400 mb-2">
                                    {metrics.stockCritico}
                                </p>
                            )}
                            <p className="text-xs text-white/40 font-light">Productos Bajo Stock</p>
                        </div>
                    </div>

                    {/* Pedidos por Estado */}
                    <div className="bg-white/5 border border-[#C5A065]/20 rounded-2xl p-6">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 mb-6">Pedidos por Estado</h3>
                        {metrics.metricsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-6 bg-white/5 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(['pending', 'paid', 'shipped', 'delivered'] as const).map(status => {
                                    const count = metrics.ordersByStatus[status];
                                    const total = Object.values(metrics.ordersByStatus).reduce((a, b) => a + b, 0);
                                    const pct = total > 0 ? (count / total) * 100 : 0;
                                    const statusLabels: Record<string, string> = {
                                        pending: 'Pendientes',
                                        paid: 'Pagado',
                                        shipped: 'Enviado',
                                        delivered: 'Entregado'
                                    };
                                    return (
                                        <div key={status}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                                                    {statusLabels[status]}
                                                </span>
                                                <span className="text-xs text-[#C5A065] font-bold">{count}</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#C5A065] transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Grid de Accesos Directos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Tarjeta: Gestión de Productos */}
                    <div
                        onClick={() => navigate('/admin/products')}
                        className="group relative bg-white/5 border border-[#C5A065]/20 hover:border-[#C5A065] p-8 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,101,0.1)] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons-outlined text-4xl text-[#C5A065]">inventory_2</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-[#C5A065] transition-colors">Productos</h3>
                        <p className="text-gray-400 font-light mb-6 text-sm leading-relaxed">
                            Añade nuevos cafés, edita descripciones, gestiona precios y actualiza el stock disponible.
                        </p>
                        <button className="flex items-center gap-2 text-[#C5A065] text-sm font-bold tracking-widest uppercase group-hover:gap-4 transition-all">
                            Gestionar
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    {/* Tarjeta: Brandbook (Acceso Rápido) */}
                    <div
                        onClick={() => navigate('/brandbook')}
                        className="group relative bg-white/5 border border-[#C5A065]/20 hover:border-[#C5A065] p-8 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,101,0.1)] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons-outlined text-4xl text-[#C5A065]">style</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-[#C5A065] transition-colors">Brandbook</h3>
                        <p className="text-gray-400 font-light mb-6 text-sm leading-relaxed">
                            Consulta y verifica los lineamientos de marca, paleta de colores y tipografías oficiales.
                        </p>
                        <button className="flex items-center gap-2 text-[#C5A065] text-sm font-bold tracking-widest uppercase group-hover:gap-4 transition-all">
                            Ver Guías
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    {/* Tarjeta: Gestión de Usuarios */}
                    <div
                        onClick={() => navigate('/admin/users')}
                        className="group relative bg-white/5 border border-[#C5A065]/20 hover:border-[#C5A065] p-8 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,101,0.1)] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons-outlined text-4xl text-[#C5A065]">group</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-[#C5A065] transition-colors">Usuarios</h3>
                        <p className="text-gray-400 font-light mb-6 text-sm leading-relaxed">
                            Administra el personal, asigna roles de administrador y gestiona la base de clientes registrados.
                        </p>
                        <button className="flex items-center gap-2 text-[#C5A065] text-sm font-bold tracking-widest uppercase group-hover:gap-4 transition-all">
                            Ver Equipo
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    {/* Tarjeta: Gestión de Pedidos */}
                    <div
                        onClick={() => navigate('/admin/orders')}
                        className="group relative bg-white/5 border border-[#C5A065]/20 hover:border-[#C5A065] p-8 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,101,0.1)] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons-outlined text-4xl text-[#C5A065] font-bold">shopping_bag</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-[#C5A065] transition-colors">Bitácora de Pedidos</h3>
                        <p className="text-gray-400 font-light mb-6 text-sm leading-relaxed">
                            Monitorea transacciones, actualiza estados de envío y gestiona el historial de ventas del ritual.
                        </p>
                        <button className="flex items-center gap-2 text-[#C5A065] text-sm font-bold tracking-widest uppercase group-hover:gap-4 transition-all">
                            Ver Pedidos
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
