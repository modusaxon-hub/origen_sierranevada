import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import Logo from '@/shared/components/Logo';

interface AdminHeaderProps {
    title: string;
    pendingOrdersCount?: number;
    pendingUsersCount?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, pendingOrdersCount = 0, pendingUsersCount = 0 }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 w-full z-[100] bg-[#0B120D]/95 backdrop-blur-xl border-b border-[#C5A065]/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                <div className="flex items-center gap-4 group">
                    <Logo className="w-[140px] md:w-[170px] h-auto group-hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0" />
                    <span
                        onClick={() => navigate('/admin')}
                        className="cursor-pointer text-[#C5A065] text-lg md:text-xl font-serif tracking-wide border-l border-[#C5A065]/30 pl-4 group-hover:text-white transition-colors uppercase"
                    >
                        {title}
                    </span>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    {/* Barra de Notificaciones Rápidas */}
                    {(pendingOrdersCount > 0 || pendingUsersCount > 0) && (
                        <div className="flex items-center gap-2 pr-4 md:pr-6 border-r border-white/10">
                            {pendingOrdersCount > 0 && (
                                <button
                                    onClick={() => navigate('/admin/orders')}
                                    className="relative p-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-all group"
                                    title={`${pendingOrdersCount} pedidos pendientes`}
                                >
                                    <span className="material-icons-outlined text-xl">shopping_cart</span>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-black text-[10px] font-black rounded-full flex items-center justify-center">
                                        {pendingOrdersCount}
                                    </span>
                                </button>
                            )}
                            {pendingUsersCount > 0 && (
                                <button
                                    onClick={() => navigate('/admin/users')}
                                    className="relative p-2 bg-[#C5A065]/10 text-[#C5A065] rounded-lg hover:bg-[#C5A065]/20 transition-all"
                                    title={`${pendingUsersCount} usuarios pendientes`}
                                >
                                    <span className="material-icons-outlined text-xl">person_add</span>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A065] text-black text-[10px] font-black rounded-full flex items-center justify-center">
                                        {pendingUsersCount}
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-white/40 hover:text-[#C5A065] transition-colors"
                        title="Ver Tienda"
                    >
                        <span className="material-icons-outlined text-2xl">storefront</span>
                    </button>

                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-[#C5A065] uppercase tracking-widest font-black">ADMINISTRADOR</p>
                        <p className="text-xs text-white/60 font-medium truncate max-w-[120px]">{user?.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <span className="material-icons-outlined">logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
