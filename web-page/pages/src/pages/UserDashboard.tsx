import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '@/services/authService';
import { orderService, Order } from '@/services/orderService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '@/shared/components/Footer';

const UserDashboard: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const { t, formatPrice, language } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings' | 'legal'>('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await orderService.getUserOrders(user!.id);
        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/');
    };

    const getStatusConfig = (status: string) => {
        return orderService.getStatusConfig(status);
    };

    return (
        <div className="min-h-screen bg-[#050806] text-white pt-24 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="space-y-2">
                        <div className="inline-block py-1 px-3 border border-[#C5A065]/30 rounded-full bg-[#C5A065]/5">
                            <span className="text-[9px] text-[#C5A065] font-bold uppercase tracking-[0.2em]">Círculo de Origen</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
                            {t('dash.welcome')}{user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                        </h1>
                        <p className="text-white/40 text-sm font-light">
                            {t('dash.member_since')} {new Date(user?.created_at || Date.now()).getFullYear()}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="bg-[#C5A065]/10 border border-[#C5A065]/50 px-5 py-2 rounded-xl flex items-center gap-3 hover:bg-[#C5A065]/20 transition-all text-[#C5A065]"
                            >
                                <span className="material-icons-outlined text-sm">admin_panel_settings</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Admin Panel</span>
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                            title="Cerrar Sesión"
                        >
                            <span className="material-icons-outlined">logout</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Navigation Sidebar */}
                    <nav className="lg:col-span-3 space-y-3">
                        {[
                            { id: 'overview', label: t('dash.tab.overview'), icon: 'spa' },
                            { id: 'orders', label: t('dash.tab.orders'), icon: 'inventory_2' },
                            { id: 'settings', label: t('dash.tab.settings'), icon: 'tune' },
                            { id: 'legal', label: t('dash.tab.legal'), icon: 'gavel' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
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

                    {/* Main Content Area */}
                    <main className="lg:col-span-9 min-h-[500px]">

                        {activeTab === 'overview' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                {/* Exclusive Benefit Card */}
                                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A261D] to-[#0B120D] border border-[#C5A065]/30 p-10 group">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C5A065] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
                                    <div className="relative z-10 max-w-xl">
                                        <h2 className="text-3xl font-serif mb-4 text-[#C5A065]">{t('dash.benefit.title')}</h2>
                                        <p className="text-white/60 leading-relaxed mb-8">
                                            {t('dash.benefit.desc')}
                                        </p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="bg-[#C5A065] text-black px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-black/40"
                                        >
                                            {t('dash.benefit.cta')}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-[#C5A065]/10 flex items-center justify-center text-[#C5A065] mb-6">
                                            <span className="material-icons-outlined">stars</span>
                                        </div>
                                        <h3 className="text-xl font-serif mb-2">Mi Nivel de Ritual</h3>
                                        <p className="text-white/40 text-sm mb-6">Estás en el nivel <strong>Semilla</strong>. Realiza 2 pedidos más para subir a <strong>Brote</strong>.</p>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#C5A065] w-1/3 shadow-[0_0_10px_#C5A065]"></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-6">
                                                <span className="material-icons-outlined">location_on</span>
                                            </div>
                                            <h3 className="text-xl font-serif mb-2">Dirección de Entrega</h3>
                                            <p className="text-white/40 text-sm">{user?.user_metadata?.address || 'No definida'}</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#C5A065] hover:text-white transition-colors text-left"
                                        >
                                            Actualizar Perfil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-3xl font-serif">{t('dash.orders.title')}</h2>
                                    <button onClick={fetchOrders} className="text-white/40 hover:text-white transition-colors">
                                        <span className="material-icons-outlined text-xl">refresh</span>
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <div className="w-10 h-10 border-2 border-[#C5A065]/20 border-t-[#C5A065] rounded-full animate-spin"></div>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="grid gap-6">
                                        {orders.map(order => {
                                            const status = getStatusConfig(order.status);
                                            return (
                                                <div key={order.id} className="group bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#C5A065]/30 transition-all duration-500">
                                                    <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                                                        {/* Status Icon Area */}
                                                        <div className={`w-20 h-20 rounded-2xl ${status.bgColor} border border-white/5 flex flex-col items-center justify-center ${status.color}`}>
                                                            <span className="material-icons-outlined text-3xl mb-1">{status.icon}</span>
                                                            <span className="text-[8px] font-bold uppercase tracking-widest">{status.label}</span>
                                                        </div>

                                                        {/* Info Area */}
                                                        <div className="flex-1 text-center md:text-left">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A065] mb-1">
                                                                #{order.id.slice(0, 8).toUpperCase()}
                                                            </p>
                                                            <h4 className="text-xl font-serif mb-2">
                                                                {order.order_items[0]?.products?.name[language] || 'Café Extraordinario'}
                                                                {order.order_items.length > 1 && ` + ${order.order_items.length - 1} items`}
                                                            </h4>
                                                            <p className="text-white/40 text-sm">
                                                                Realizado el {new Date(order.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </p>
                                                        </div>

                                                        {/* Total Area */}
                                                        <div className="text-center md:text-right px-8 border-l border-white/5 hidden md:block">
                                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Total del Ritual</p>
                                                            <p className="text-2xl font-serif text-[#C5A065]">{formatPrice(order.total_amount)}</p>
                                                        </div>

                                                        {/* Action & Proof */}
                                                        <div className="flex flex-col items-center gap-3">
                                                            {order.metadata?.payment_proof_url && (
                                                                <a
                                                                    href={order.metadata.payment_proof_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] text-white/40 font-bold uppercase tracking-widest hover:bg-[#C5A065]/10 hover:text-[#C5A065] transition-all"
                                                                >
                                                                    <span className="material-icons-outlined text-xs">receipt</span>
                                                                    Comprobante
                                                                </a>
                                                            )}
                                                            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#C5A065] hover:text-black hover:border-[#C5A065] transition-all">
                                                                <span className="material-icons-outlined">chevron_right</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-3xl p-20 text-center">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10">
                                            <span className="material-icons-outlined text-4xl">inventory_2</span>
                                        </div>
                                        <p className="text-white/60 mb-8 max-w-xs mx-auto">
                                            {t('dash.orders.empty')}
                                        </p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="border border-[#C5A065] text-[#C5A065] px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#C5A065] hover:text-black transition-all"
                                        >
                                            {t('dash.orders.cta')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <h2 className="text-3xl font-serif mb-8">Gestión de Perfil</h2>
                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065]">Nombre de Ritual</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.user_metadata?.full_name}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#C5A065] focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065]">Identidad (Email)</label>
                                            <input
                                                type="email"
                                                defaultValue={user?.email}
                                                disabled
                                                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white/20 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065]">Dirección de Origen</label>
                                        <input
                                            type="text"
                                            placeholder="Ciudad, Calle, Edificio..."
                                            defaultValue={user?.user_metadata?.address}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#C5A065] focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-[#C5A065] hover:text-black hover:border-[#C5A065] transition-all">
                                            Preservar Cambios
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'legal' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <h2 className="text-3xl font-serif mb-4">Acuerdos del Origen</h2>
                                <div className="grid gap-4">
                                    {[
                                        { title: 'Términos y Condiciones', icon: 'description', desc: 'Reglas de convivencia en la mística de la Sierra.' },
                                        { title: 'Habeas Data', icon: 'privacy_tip', desc: 'Cómo custodiamos tu información sagrada.' },
                                        { title: 'Políticas de Envío', icon: 'local_shipping', desc: 'Tiempos y compromisos de entrega desde la montaña.' }
                                    ].map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A065] group-hover:bg-[#C5A065] group-hover:text-black transition-all">
                                                    <span className="material-icons-outlined">{doc.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm uppercase tracking-widest">{doc.title}</h4>
                                                    <p className="text-xs text-white/30">{doc.desc}</p>
                                                </div>
                                            </div>
                                            <span className="material-icons-outlined text-white/20 group-hover:text-white transition-all">file_download</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserDashboard;
