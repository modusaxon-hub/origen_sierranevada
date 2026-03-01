import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = React.useState(0);

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/login');
    };

    React.useEffect(() => {
        const checkPending = async () => {
            const { data } = await authService.getAllProfiles();
            if (data) {
                const count = (data as any[]).filter(p => p.status === 'pending').length;
                setPendingCount(count);
            }
        };
        checkPending();
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
                        <img src="/logo-origen-sierra-nevada.svg" alt="Origen Sierra Nevada" className="h-10 w-auto group-hover:opacity-80 transition-opacity" />
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
