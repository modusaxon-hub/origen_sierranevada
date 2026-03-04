import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const UserDropdown: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div ref={dropdownRef} className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="hidden xl:flex items-center gap-3 cursor-pointer hover:bg-[#C8AA6E]/10 transition-all duration-300 px-4 py-2 rounded-lg border border-[#C8AA6E]/20 hover:border-[#C8AA6E]/50"
                title="Mi cuenta"
            >
                <div className="text-right">
                    <p className="text-[9px] text-[#C8AA6E] uppercase tracking-widest font-bold">{isAdmin ? 'ADMIN' : 'USUARIO'}</p>
                    <p className="text-xs text-white max-w-[100px] truncate">{isAdmin ? 'Panel' : user.email?.split('@')[0]}</p>
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
                            onClick={async () => {
                                setIsOpen(false);
                                await import('@/services/authService').then(m => m.authService.signOut());
                                window.location.href = '/';
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors rounded-lg group/item"
                        >
                            <span className="material-icons-outlined text-red-400 group-hover/item:scale-110 transition-transform">logout</span>
                            <p className="text-sm text-red-400 font-medium">Cerrar Sesión</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
