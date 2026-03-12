import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '@/services/authService';
import { orderService, Order } from '@/services/orderService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '@/services/supabaseClient';
import Footer from '@/shared/components/Footer';
import { sanitizeText } from '@/shared/utils/sanitize';

// Order Timeline Component
const ORDER_STEPS = [
    { status: 'pending', label: 'Confirmado', icon: 'pending' },
    { status: 'paid', label: 'Pagado', icon: 'check_circle' },
    { status: 'shipped', label: 'En Camino', icon: 'local_shipping' },
    { status: 'delivered', label: 'Entregado', icon: 'home' },
];

const OrderTimeline: React.FC<{ status: string }> = ({ status }) => {
    const currentIdx = ORDER_STEPS.findIndex(s => s.status === status);
    const isCancelled = status === 'cancelled';

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <span className="material-icons-outlined text-rose-400 text-sm">cancel</span>
                <span className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">Pedido Cancelado</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-0 mt-4 pt-4 border-t border-white/5 w-full">
            {ORDER_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentIdx;
                const isActive = idx === currentIdx;
                return (
                    <React.Fragment key={step.status}>
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all
                                ${isCompleted
                                    ? 'bg-[#C8AA6E] border-[#C8AA6E] text-black shadow-[0_0_10px_rgba(200, 170, 110, 0.4)]'
                                    : 'bg-white/5 border-white/10 text-white/20'
                                } ${isActive ? 'ring-2 ring-[#C8AA6E]/40 ring-offset-1 ring-offset-[#050806]' : ''}`}
                            >
                                <span className="material-icons-outlined text-sm">{step.icon}</span>
                            </div>
                            <span className={`text-[8px] font-bold uppercase tracking-[0.1em] text-center leading-tight
                                ${isCompleted ? 'text-[#C8AA6E]' : 'text-white/20'}`}>
                                {step.label}
                            </span>
                        </div>
                        {idx < ORDER_STEPS.length - 1 && (
                            <div className={`flex-1 h-px mx-1 transition-all
                                ${idx < currentIdx ? 'bg-[#C8AA6E]' : 'bg-white/10'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const UserDashboard: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const { t, formatPrice, language } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings' | 'legal'>('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileForm, setProfileForm] = useState({
        nombre: user?.user_metadata?.full_name || '',
        direccion: user?.user_metadata?.address || '',
        telefono: '',
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [notifPrefs, setNotifPrefs] = useState({ orderUpdates: true, promotions: false });

    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('profiles')
            .select('full_name, phone, address, avatar_url, notification_prefs')
            .eq('id', user.id)
            .single();
        if (data) {
            setAvatarUrl(data.avatar_url || null);
            setProfileForm({
                nombre: data.full_name || user.user_metadata?.full_name || '',
                direccion: data.address || user.user_metadata?.address || '',
                telefono: data.phone || '',
            });
            setNotifPrefs(data.notification_prefs || { orderUpdates: true, promotions: false });
        }
    };

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

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSavingProfile(true);
        const { error } = await authService.updateProfile(user.id, {
            full_name: sanitizeText(profileForm.nombre),
            address: sanitizeText(profileForm.direccion),
            phone: sanitizeText(profileForm.telefono),
        });
        if (!error) {
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        }
        setSavingProfile(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
        if (!ALLOWED.includes(file.type)) return;
        if (file.size > 2 * 1024 * 1024) return;

        setUploadingAvatar(true);
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filePath = `${user.id}/avatar.${ext}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (!error) {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await supabase.from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            setAvatarUrl(publicUrl + `?t=${Date.now()}`);
        }
        setUploadingAvatar(false);
    };

    const handleNotifToggle = async (key: 'orderUpdates' | 'promotions') => {
        if (!user) return;
        const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
        setNotifPrefs(updated);
        await supabase.from('profiles').update({ notification_prefs: updated }).eq('id', user.id);
    };

    return (
        <div className="min-h-screen bg-[#050806] text-white pt-24 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="space-y-2">
                        <div className="inline-block py-1 px-3 border border-[#C8AA6E]/30 rounded-full bg-[#C8AA6E]/5">
                            <span className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-[0.2em]">Círculo de Origen</span>
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
                                className="bg-[#C8AA6E]/10 border border-[#C8AA6E]/50 px-5 py-2 rounded-xl flex items-center gap-3 hover:bg-[#C8AA6E]/20 transition-all text-[#C8AA6E]"
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
                                    ? 'bg-[#C8AA6E] text-black border-[#C8AA6E] shadow-[0_10px_30px_rgba(200, 170, 110, 0.2)]'
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
                                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A261D] to-[#0B120D] border border-[#C8AA6E]/30 p-10 group">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C8AA6E] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
                                    <div className="relative z-10 max-w-xl">
                                        <h2 className="text-3xl font-serif mb-4 text-[#C8AA6E]">{t('dash.benefit.title')}</h2>
                                        <p className="text-white/60 leading-relaxed mb-8">
                                            {t('dash.benefit.desc')}
                                        </p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="bg-[#C8AA6E] text-black px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-black/40"
                                        >
                                            {t('dash.benefit.cta')}
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Pedidos', value: orders.length, icon: 'inventory_2', color: 'text-white' },
                                        { label: 'Completados', value: orders.filter(o => o.status === 'delivered').length, icon: 'home', color: 'text-purple-400' },
                                        { label: 'En Tránsito', value: orders.filter(o => o.status === 'shipped').length, icon: 'local_shipping', color: 'text-sky-400' },
                                        { label: 'Gasto Total', value: formatPrice(orders.reduce((s, o) => s + o.total_amount, 0)), icon: 'payments', color: 'text-[#C8AA6E]' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                                            <span className={`material-icons-outlined text-2xl mb-3 block ${stat.color}`}>{stat.icon}</span>
                                            <p className={`text-xl font-serif ${stat.color}`}>{stat.value}</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-[#C8AA6E]/10 flex items-center justify-center text-[#C8AA6E] mb-6">
                                            <span className="material-icons-outlined">stars</span>
                                        </div>
                                        <h3 className="text-xl font-serif mb-2">Mi Nivel de Socio</h3>
                                        <p className="text-white/40 text-sm mb-6">Estás en el nivel <strong>Semilla</strong>. Realiza 2 pedidos más para subir a <strong>Brote</strong>.</p>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#C8AA6E] w-1/3 shadow-[0_0_10px_#C8AA6E]"></div>
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
                                            className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#C8AA6E] hover:text-white transition-colors text-left"
                                        >
                                            Actualizar Perfil
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                {orders.length > 0 && (
                                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-serif">Últimos Pedidos</h3>
                                            <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold uppercase tracking-widest text-[#C8AA6E] hover:text-white transition-colors">
                                                Ver todos
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {orders.slice(0, 3).map(order => {
                                                const st = getStatusConfig(order.status);
                                                return (
                                                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`material-icons-outlined text-lg ${st.color}`}>{st.icon}</span>
                                                            <div>
                                                                <p className="text-xs font-bold text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                                <p className="text-[10px] text-white/40">{new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-serif text-[#C8AA6E]">{formatPrice(order.total_amount)}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
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
                                        <div className="w-10 h-10 border-2 border-[#C8AA6E]/20 border-t-[#C8AA6E] rounded-full animate-spin"></div>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="grid gap-6">
                                        {orders.map(order => {
                                            const status = getStatusConfig(order.status);
                                            return (
                                                <div key={order.id} className="group bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#C8AA6E]/30 transition-all duration-500">
                                                    <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                                                        {/* Status Icon Area */}
                                                        <div className={`w-20 h-20 rounded-2xl ${status.bgColor} border border-white/5 flex flex-col items-center justify-center ${status.color}`}>
                                                            <span className="material-icons-outlined text-3xl mb-1">{status.icon}</span>
                                                            <span className="text-[8px] font-bold uppercase tracking-widest">{status.label}</span>
                                                        </div>

                                                        {/* Info Area */}
                                                        <div className="flex-1 text-center md:text-left">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8AA6E] mb-1">
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
                                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Total del Pedido</p>
                                                            <p className="text-2xl font-serif text-[#C8AA6E]">{formatPrice(order.total_amount)}</p>
                                                        </div>

                                                        {/* Action & Proof */}
                                                        <div className="flex flex-col items-center gap-3">
                                                            {order.metadata?.payment_proof_url && (
                                                                <a
                                                                    href={order.metadata.payment_proof_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] text-white/40 font-bold uppercase tracking-widest hover:bg-[#C8AA6E]/10 hover:text-[#C8AA6E] transition-all"
                                                                >
                                                                    <span className="material-icons-outlined text-xs">receipt</span>
                                                                    Comprobante
                                                                </a>
                                                            )}
                                                            {['paid', 'shipped', 'delivered'].includes(order.status) && (
                                                                <button
                                                                    onClick={() => navigate(`/invoice/${order.id}`)}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] text-[#C8AA6E] font-bold uppercase tracking-widest hover:bg-[#C8AA6E]/10 hover:border-[#C8AA6E]/30 transition-all"
                                                                >
                                                                    <span className="material-icons-outlined text-xs">receipt_long</span>
                                                                    Factura
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => navigate(`/invoice/${order.id}`)}
                                                                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#C8AA6E] hover:text-black hover:border-[#C8AA6E] transition-all"
                                                            >
                                                                <span className="material-icons-outlined">chevron_right</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Order Timeline */}
                                                    <div className="px-8 pb-6">
                                                        <OrderTimeline status={order.status} />
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
                                            className="border border-[#C8AA6E] text-[#C8AA6E] px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#C8AA6E] hover:text-black transition-all"
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

                                {/* Avatar Upload Section */}
                                <div className="flex items-center gap-8 mb-10 p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-24 h-24 rounded-full border-2 border-[#C8AA6E]/30 overflow-hidden bg-white/5 flex items-center justify-center">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-icons-outlined text-4xl text-white/20">person</span>
                                            )}
                                        </div>
                                        {uploadingAvatar && (
                                            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-[#C8AA6E]/20 border-t-[#C8AA6E] rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-sm uppercase tracking-widest text-white">Foto de Perfil</h3>
                                        <p className="text-[11px] text-white/40">JPG, PNG o WebP · máx 2MB</p>
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-[#C8AA6E]/10 hover:border-[#C8AA6E]/30 transition-all text-[10px] font-bold uppercase tracking-widest text-[#C8AA6E]">
                                            <span className="material-icons-outlined text-sm">upload</span>
                                            Cambiar Foto
                                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                                        </label>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveSettings} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E]">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={profileForm.nombre}
                                                onChange={(e) => setProfileForm(prev => ({ ...prev, nombre: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#C8AA6E] focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E]">Identidad (Email)</label>
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white/20 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E]">Teléfono</label>
                                        <input
                                            type="tel"
                                            placeholder="+57 300 000 0000"
                                            value={profileForm.telefono}
                                            onChange={(e) => setProfileForm(prev => ({ ...prev, telefono: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#C8AA6E] focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E]">Dirección de Origen</label>
                                        <input
                                            type="text"
                                            placeholder="Ciudad, Calle, Edificio..."
                                            value={profileForm.direccion}
                                            onChange={(e) => setProfileForm(prev => ({ ...prev, direccion: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#C8AA6E] focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="pt-4 flex items-center gap-4">
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="bg-[#C8AA6E] border border-[#C8AA6E] text-black px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {savingProfile ? (
                                                <>
                                                    <span className="material-icons-outlined text-sm animate-spin">refresh</span>
                                                    Guardando...
                                                </>
                                            ) : profileSaved ? (
                                                <>
                                                    <span className="material-icons-outlined text-sm">check</span>
                                                    Cambios guardados
                                                </>
                                            ) : (
                                                'Preservar Cambios'
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Notification Preferences */}
                                <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                                    <h3 className="text-lg font-serif mb-4">Preferencias de Notificación</h3>
                                    {[
                                        { key: 'orderUpdates' as const, label: 'Actualizaciones de Pedidos', desc: 'Estado de envíos y confirmaciones.' },
                                        { key: 'promotions' as const, label: 'Promociones y Novedades', desc: 'Descuentos y nuevos lanzamientos.' },
                                    ].map(({ key, label, desc }) => (
                                        <div key={key} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                                            <div>
                                                <p className="font-bold text-sm uppercase tracking-widest">{label}</p>
                                                <p className="text-[11px] text-white/40">{desc}</p>
                                            </div>
                                            <button
                                                onClick={() => handleNotifToggle(key)}
                                                className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 border ${notifPrefs[key]
                                                    ? 'bg-[#C8AA6E] border-[#C8AA6E]'
                                                    : 'bg-white/5 border-white/20'
                                                    }`}
                                            >
                                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${notifPrefs[key] ? 'left-6' : 'left-0.5'
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#C8AA6E] group-hover:bg-[#C8AA6E] group-hover:text-black transition-all">
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
