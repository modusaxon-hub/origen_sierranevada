import React, { useEffect, useState } from 'react';
import { Order, orderService } from '../services/orderService';
import { OrderCard } from '../components/OrderCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error: fetchError } = await orderService.getUserOrders();

                if (fetchError) {
                    console.error('Error fetching orders:', fetchError);
                    setError(lang === 'es' ? 'Error al cargar tus pedidos' : 'Error loading your orders');
                    return;
                }

                setOrders(data || []);
            } catch (err) {
                console.error('Unexpected error:', err);
                setError(lang === 'es' ? 'Error inesperado' : 'Unexpected error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate, lang]);

    return (
        <div className="min-h-screen bg-[#050806] text-white">
            {/* Header Section */}
            <div className="relative pt-40 pb-16 px-6">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        alt="Sierra Nevada Texture"
                        className="w-full h-full object-cover opacity-10 filter blur-sm grayscale contrast-125 mix-blend-overlay"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcfAtXK3rO0DtljnnG98PWskBu0QIToFPcvB-G_wdSE1gPPoRefQj9wBEQwIF1hyVZEJIeb9EX1GyHYkuUrgDl3yDsLWABFaFGrYkdWG0MuXBAnm-uy7guEIXcwo1KUzQBE78bHQOH32lkwEQYosLe-sT-OvYBvUKE9XCyVSRjb-jsEVJAc4qcVT6dcVDtct1NHtwEezMsCd_rOzArG4Nd6VvlZ6HsfdzvFmMQ728789xZkrYQn6BZWo_kNRNpp5E6D5h2tQv6Lqep"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050806]/0 via-[#050806]/80 to-[#050806]"></div>
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white/60 hover:text-[#C8AA6E] transition-colors group"
                        >
                            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span className="text-sm uppercase tracking-wider">
                                {lang === 'es' ? 'Volver' : 'Back'}
                            </span>
                        </button>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <span className="material-icons-outlined text-[#C8AA6E] text-5xl">receipt_long</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#C8AA6E] tracking-tight">
                            {lang === 'es' ? 'Mi Historial de Pedidos' : 'My Order History'}
                        </h1>
                        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
                            {lang === 'es'
                                ? 'Consulta el estado de tus compras y revive la experiencia del café premium de la Sierra Nevada'
                                : 'Check the status of your purchases and relive the premium coffee experience from Sierra Nevada'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Orders Content */}
            <div className="container mx-auto px-6 pb-24">
                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-lg p-6 animate-pulse">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-3 flex-1">
                                        <div className="h-6 bg-white/10 rounded w-1/3"></div>
                                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-8 bg-white/10 rounded w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <span className="material-icons-outlined text-red-400 text-6xl mb-4">error_outline</span>
                        <p className="text-white/60">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-[#C8AA6E] text-black rounded-lg hover:bg-[#D4B075] transition-colors"
                        >
                            {lang === 'es' ? 'Reintentar' : 'Retry'}
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-xl">
                        <span className="material-icons-outlined text-white/20 text-8xl mb-6">shopping_bag</span>
                        <h2 className="text-2xl font-serif text-white/60 mb-4">
                            {lang === 'es' ? 'Aún no tienes pedidos' : 'You don\'t have any orders yet'}
                        </h2>
                        <p className="text-white/40 mb-8 max-w-md mx-auto">
                            {lang === 'es'
                                ? 'Explora nuestro catálogo de café premium y haz tu primer pedido para comenzar tu viaje sensorial'
                                : 'Explore our premium coffee catalog and make your first order to start your sensory journey'}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-[#C8AA6E] text-black rounded-lg hover:bg-[#D4B075] transition-all hover:scale-105 font-bold uppercase tracking-wider"
                        >
                            {lang === 'es' ? 'Explorar Catálogo' : 'Explore Catalog'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-white/60 text-sm">
                                {lang === 'es' ? 'Total de pedidos:' : 'Total orders:'} <span className="text-[#C8AA6E] font-bold">{orders.length}</span>
                            </div>
                            <div className="text-white/60 text-sm">
                                {lang === 'es' ? 'Ordenado por: Más recientes' : 'Sorted by: Most recent'}
                            </div>
                        </div>
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
