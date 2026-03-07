import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Logo from '@/shared/components/Logo';
import UserDropdown from './UserDropdown';

interface DesktopNavProps {
    onSearchOpen: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ onSearchOpen }) => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const { cartItems, setIsCartOpen } = useCart();

    return (
        <div className="hidden lg:flex max-w-7xl mx-auto px-6 xl:px-8 w-full justify-between items-center py-3 border-b border-[#C8AA6E]/20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center cursor-pointer shrink-0">
                <Logo className="h-[30px] xl:h-[46px] w-auto" />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4 xl:space-x-10 font-display text-[10px] xl:text-xs tracking-[0.2em] xl:tracking-[0.3em] text-white/80 whitespace-nowrap">
                <Link to="/" className="hover:text-[#C8AA6E] transition-colors duration-300 hover:border-b-2 hover:border-[#C8AA6E]/50 pb-1 uppercase">Inicio</Link>
                <Link to="/subscription" className="hover:text-[#C8AA6E] transition-colors duration-300 hover:border-b-2 hover:border-[#C8AA6E]/50 pb-1 uppercase">Catálogo</Link>
                <Link to="/guide" className="hover:text-[#C8AA6E] transition-colors duration-300 hover:border-b-2 hover:border-[#C8AA6E]/50 pb-1 uppercase">Guía</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 xl:space-x-6 text-white shrink-0">
                {isAdmin && (
                    <Link to="/admin" className="text-[#C8AA6E] border-2 border-[#C8AA6E]/50 px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg bg-[#C8AA6E]/10 flex items-center gap-1 xl:gap-2 hover:bg-[#C8AA6E]/20 hover:border-[#C8AA6E] shadow-[0_0_15px_rgba(200,170,110,0.2)] transition-all duration-300 uppercase font-bold text-[8px] xl:text-[9px]">
                        <span className="material-icons-outlined text-xs">admin_panel_settings</span>
                        <span className="hidden xl:inline">Admin</span>
                    </Link>
                )}

                {user ? (
                    <UserDropdown />
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg border-2 border-[#C8AA6E]/50 text-[#C8AA6E] font-bold text-[10px] xl:text-xs uppercase tracking-widest hover:border-[#C8AA6E] hover:bg-[#C8AA6E]/20 transition-all duration-300 shadow-[0_0_15px_rgba(200,170,110,0.15)] hover:shadow-[0_0_25px_rgba(200,170,110,0.3)] flex items-center gap-2 active:scale-95"
                        title="Iniciar Sesión"
                    >
                        <span className="material-icons-outlined text-base">login</span>
                        <span className="hidden xl:inline">Ingresar</span>
                    </button>
                )}

                <button
                    onClick={onSearchOpen}
                    className="p-2.5 rounded-lg hover:bg-[#C8AA6E]/15 hover:text-[#C8AA6E] text-white/70 transition-all duration-300 hover:shadow-[0_0_10px_rgba(200,170,110,0.2)]"
                    title="Buscar"
                >
                    <span className="material-icons-outlined">search</span>
                </button>

                <div
                    className="relative cursor-pointer p-2.5 rounded-lg hover:bg-[#C8AA6E]/15 hover:text-[#C8AA6E] text-white/70 transition-all duration-300 hover:shadow-[0_0_10px_rgba(200,170,110,0.2)]"
                    onClick={() => setIsCartOpen(true)}
                    title="Carrito"
                >
                    <span className="material-icons-outlined">shopping_bag</span>
                    {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#C8AA6E] text-[#141E16] text-[9px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#141E16] shadow-lg">
                            {cartItems.length}
                        </span>
                    )}
                </div>

                <button
                    onClick={toggleLanguage}
                    className="px-2 xl:px-3 py-2 rounded-lg border border-[#C8AA6E]/30 text-[#C8AA6E] text-[9px] font-bold uppercase tracking-widest hover:border-[#C8AA6E]/60 hover:bg-[#C8AA6E]/10 transition-all duration-300"
                    title="Cambiar Idioma"
                >
                    {language.toUpperCase()}
                </button>

                <button
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="p-2.5 rounded-lg hover:bg-[#C8AA6E]/15 text-white/70 hover:text-[#C8AA6E] transition-all duration-300 hover:shadow-[0_0_10px_rgba(200,170,110,0.2)]"
                    title="Cambiar Tema"
                >
                    <span className="material-icons-outlined block dark:hidden">dark_mode</span>
                    <span className="material-icons-outlined hidden dark:block text-[#C8AA6E]">light_mode</span>
                </button>
            </div>
        </div>
    );
};

export default DesktopNav;
