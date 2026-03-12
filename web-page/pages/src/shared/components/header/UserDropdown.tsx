import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TrackOrderModal from './TrackOrderModal';

const UserDropdown: React.FC = () => {
    const { user, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (!user) return null;

    const handleLogout = async () => {
        setIsOpen(false);
        await signOut();
        navigate('/');
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Profile Trigger - Compact for lg, Labeled for xl+ */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 lg:gap-3 cursor-pointer hover:bg-[#C8AA6E]/10 transition-all duration-300 px-3 xl:px-4 py-2 rounded-lg border border-[#C8AA6E]/20 hover:border-[#C8AA6E]/50"
                title="Mi cuenta"
            >
                <div className="hidden xl:block text-right">
                    <p className="text-[9px] text-[#C8AA6E] uppercase tracking-widest font-bold">{isAdmin ? 'ADMIN' : 'USUARIO'}</p>
                    <p className="text-xs text-white max-w-[100px] truncate">{isAdmin ? 'Panel' : user.email?.split('@')[0]}</p>
                </div>
                {/* Fallback avatar/icon for lg screens */}
                <div className="w-8 h-8 rounded-full border border-[#C8AA6E]/30 flex items-center justify-center bg-[#C8AA6E]/10 xl:hidden">
                    <span className="material-icons-outlined text-[#C8AA6E] text-base">{isAdmin ? 'admin_panel_settings' : 'person'}</span>
                </div>
                <span className={`material-icons-outlined text-[#C8AA6E] text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A0C0B] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-fade-in">
                    <div className="p-2 border-b border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-wider px-3 py-2">Mi Cuenta</p>
                    </div>

                    {!isAdmin && (
                        <Link
                            to="/my-orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/item"
                        >
                            <span className="material-icons-outlined text-[#C8AA6E] group-hover/item:scale-110 transition-transform">receipt_long</span>
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">Mis Pedidos</p>
                                <p className="text-xs text-white/40">Historial de compras</p>
                            </div>
                        </Link>
                    )}

                    <button
                        onClick={() => { setIsTrackModalOpen(true); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/item text-left"
                    >
                        <span className="material-icons-outlined text-[#C8AA6E] group-hover/item:scale-110 transition-transform">radar</span>
                        <div className="flex-1">
                            <p className="text-sm text-white font-medium">Rastrear Pedido</p>
                            <p className="text-xs text-white/40">Estado en tiempo real</p>
                        </div>
                    </button>

                    <Link
                        to={isAdmin ? '/admin' : '/account'}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/item"
                    >
                        <span className="material-icons-outlined text-[#C8AA6E] group-hover/item:scale-110 transition-transform">
                            {isAdmin ? 'admin_panel_settings' : 'person'}
                        </span>
                        <div className="flex-1">
                            <p className="text-sm text-white font-medium">{isAdmin ? 'Panel Admin' : 'Mi Perfil'}</p>
                            <p className="text-xs text-white/40">{isAdmin ? 'Gestión total' : 'Configuración'}</p>
                        </div>
                    </Link>

                    <div className="border-t border-white/10 p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors rounded-lg group/item"
                        >
                            <span className="material-icons-outlined text-red-400 group-hover/item:scale-110 transition-transform">logout</span>
                            <p className="text-sm text-red-400 font-medium">Cerrar Sesión</p>
                        </button>
                    </div>
                </div>
            )}
            <TrackOrderModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} />
        </div>
    );
};

export default UserDropdown;
