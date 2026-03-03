import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Logo from './Logo';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { language, toggleLanguage, t, formatPrice } = useLanguage();
    const { user, isAdmin } = useAuth();
    const { cartItems, removeFromCart, updateQty, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const location = useLocation();
    const isHome = location.pathname === '/';

    // State for interactions
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    // Close menus on route change
    useEffect(() => {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
    }, [navigate]);

    // Scroll state for premium glassmorphism effect
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isUserDropdownOpen && !target.closest('.user-dropdown')) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isUserDropdownOpen]);


    // ... (rest of search/cart logic)
    const searchResults: any[] = [];

    return (
        <>
            <nav className={`fixed w-full z-50 top-0 transition-all duration-700 flex flex-col items-center ${isScrolled
                ? 'bg-[#141E16]/70 backdrop-blur-2xl shadow-2xl shadow-[#C8AA6E]/10 border-b border-[#C8AA6E]/30'
                : 'bg-gradient-to-b from-[#141E16]/50 to-transparent backdrop-blur-lg border-b border-[#C8AA6E]/10'
                }`}>

                {/* 1. MOBILE LAYOUT (Two-Tier) - As requested: Logo on top, icons below */}
                <div className="w-full lg:hidden flex flex-col bg-background-dark/95 backdrop-blur-md border-b border-white/10 shadow-xl overflow-hidden">

                    {/* Tier 1: Logo Throne (Centered) - Premium */}
                    <div className="w-full flex justify-center py-6 border-b border-[#C8AA6E]/20 cursor-pointer hover:bg-[#C8AA6E]/5 transition-all duration-300 active:scale-95" onClick={() => navigate('/')}>
                        <Logo
                            className="h-[28px] sm:h-[36px] md:h-[46px] w-auto object-contain drop-shadow-[0_0_20px_rgba(200,170,110,0.3)] brightness-110 hover:brightness-125 transition-all"
                        />
                    </div>

                    {/* Tier 2: Icons & Actions (Balanced Row) */}
                    <div className="w-full flex justify-between items-center px-4 py-2 bg-white/[0.02]">
                        {/* Left: Menu & Search */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-white hover:text-primary transition-colors p-2"
                            >
                                <span className="material-icons-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-white hover:text-primary transition-colors p-2"
                            >
                                <span className="material-icons-outlined text-xl">search</span>
                            </button>
                        </div>

                        {/* Right: Language & Cart */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleLanguage}
                                className="text-white text-[10px] font-accent border border-white/10 rounded-full px-2.5 py-1 hover:border-primary hover:text-primary transition-colors mr-1"
                            >
                                {language.toUpperCase()}
                            </button>

                            <div
                                className="relative cursor-pointer text-white hover:text-primary transition-colors p-2"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <span className="material-icons-outlined text-2xl">shopping_bag</span>
                                {cartItems.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-primary text-background-dark text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-black">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* 2. DESKTOP LAYOUT (Premium Glassmorphic) - Visible only on LG+ */}
                <div className="hidden lg:flex max-w-7xl mx-auto px-8 w-full justify-between items-center py-5 border-b border-[#C8AA6E]/20">
                    {/* Logo - Premium Shrine */}
                    <div
                        className="flex items-center gap-3 group cursor-pointer hover:scale-110 transition-transform duration-300 active:scale-100"
                        onClick={() => navigate('/')}
                    >
                        <Logo
                            className={`transition-all duration-700 ${isScrolled ? 'h-[32px] xl:h-[40px]' : 'h-[48px] xl:h-[56px]'} w-auto drop-shadow-[0_0_25px_rgba(200,170,110,0.4)] brightness-110 group-hover:drop-shadow-[0_0_35px_rgba(200,170,110,0.6)]`}
                        />
                    </div>


                    {/* Desktop Menu - Premium Navigation */}
                    <div className="flex items-center space-x-12 font-display text-xs tracking-[0.3em] text-white/80">
                        <Link to="/" className="hover:text-[#C8AA6E] transition-colors duration-300 hover:border-b-2 hover:border-[#C8AA6E]/50 pb-1 uppercase">
                            Inicio
                        </Link>
                        <Link to="/subscription" className="hover:text-[#C8AA6E] transition-colors duration-300 hover:border-b-2 hover:border-[#C8AA6E]/50 pb-1 uppercase">
                            Catálogo
                        </Link>
                        <Link to="/guide" className="hover:text-[#C8AA6E] transition-colors duration-300 hover:border-b-2 hover:border-[#C8AA6E]/50 pb-1 uppercase">
                            Guía
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className="text-[#C8AA6E] border-2 border-[#C8AA6E]/50 px-4 py-2 rounded-lg bg-[#C8AA6E]/10 flex items-center gap-2 hover:bg-[#C8AA6E]/20 hover:border-[#C8AA6E] shadow-[0_0_15px_rgba(200,170,110,0.2)] transition-all duration-300 uppercase font-bold text-[10px]">
                                <span className="material-icons-outlined text-sm">admin_panel_settings</span>
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Desktop Actions - Premium Icons */}
                    <div className="flex items-center space-x-6 text-white">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* User Dropdown - Premium */}
                                <div className="relative user-dropdown">
                                    <div
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="hidden xl:flex items-center gap-3 cursor-pointer hover:bg-[#C8AA6E]/10 transition-all duration-300 px-4 py-2 rounded-lg border border-[#C8AA6E]/20 hover:border-[#C8AA6E]/50"
                                        title="Mi cuenta"
                                    >
                                        <div className="text-right">
                                            <p className="text-[9px] text-[#C8AA6E] uppercase tracking-widest font-bold">{isAdmin ? 'ADMIN' : 'USUARIO'}</p>
                                            <p className="text-xs text-white max-w-[100px] truncate">{isAdmin ? 'Panel' : user.email?.split('@')[0]}</p>
                                        </div>
                                        <span className={`material-icons-outlined text-[#C8AA6E] text-sm transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A0C0B] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-fade-in">
                                            <div className="p-2 border-b border-white/10">
                                                <p className="text-xs text-white/40 uppercase tracking-wider px-3 py-2">Mi Cuenta</p>
                                            </div>

                                            {!isAdmin && (
                                                <Link
                                                    to="/my-orders"
                                                    onClick={() => setIsUserDropdownOpen(false)}
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
                                                onClick={() => setIsUserDropdownOpen(false)}
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
                                                        setIsUserDropdownOpen(false);
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
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2.5 rounded-lg border-2 border-[#C8AA6E]/50 text-[#C8AA6E] font-bold text-xs uppercase tracking-widest hover:border-[#C8AA6E] hover:bg-[#C8AA6E]/20 transition-all duration-300 shadow-[0_0_15px_rgba(200,170,110,0.15)] hover:shadow-[0_0_25px_rgba(200,170,110,0.3)] flex items-center gap-2 active:scale-95"
                                title="Iniciar Sesión"
                            >
                                <span className="material-icons-outlined text-base">login</span>
                                Ingresar
                            </button>
                        )}
                        {/* Search Button - Premium */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2.5 rounded-lg hover:bg-[#C8AA6E]/15 hover:text-[#C8AA6E] text-white/70 transition-all duration-300 hover:shadow-[0_0_10px_rgba(200,170,110,0.2)]"
                            title="Buscar"
                        >
                            <span className="material-icons-outlined">search</span>
                        </button>

                        {/* Cart Button - Premium */}
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

                        {/* Language Toggle - Premium */}
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-2 rounded-lg border border-[#C8AA6E]/30 text-[#C8AA6E] text-[9px] font-bold uppercase tracking-widest hover:border-[#C8AA6E]/60 hover:bg-[#C8AA6E]/10 transition-all duration-300"
                            title="Cambiar Idioma"
                        >
                            {language.toUpperCase()}
                        </button>

                        {/* Dark Mode Toggle - Premium */}
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
            </nav>

            {/* Mobile Menu Drawer - SLIDE FROM LEFT */}
            <div className={`fixed inset-0 z-40 bg-background-light dark:bg-background-dark pt-[140px] px-6 transition-transform duration-500 transform lg:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full invisible'}`}>
                <div className="flex flex-col gap-6 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>

                    {/* Mobile User Profile Section */}
                    {user ? (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-3" onClick={() => { navigate('/account'); setIsMobileMenuOpen(false); }}>
                                <div className="w-10 h-10 rounded-full bg-[#C5A065]/20 flex items-center justify-center text-[#C5A065] font-bold">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-white font-bold text-sm truncate w-32">{user.user_metadata?.full_name || 'Usuario'}</p>
                                    <p className="text-gray-400 text-xs truncate w-32">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    await import('@/services/authService').then(m => m.authService.signOut());
                                    window.location.href = '/';
                                }}
                                className="p-2 text-red-400 hover:bg-white/5 rounded-full"
                            >
                                <span className="material-icons-outlined">logout</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                            className="bg-[#C5A065] text-black font-bold uppercase tracking-widest py-3 rounded-lg mb-4 hover:bg-[#D4B075]"
                        >
                            Iniciar Sesión
                        </button>
                    )}

                    <Link to="/" className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>

                    {user && !isAdmin && (
                        <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3 flex items-center justify-between">
                            Mis Pedidos
                            <span className="material-icons-outlined text-[#C5A065]">receipt_long</span>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold text-[#C5A065] border-b border-[#C5A065]/20 pb-3 flex items-center justify-between">
                            PANEL ADMINISTRATIVO
                            <span className="material-icons-outlined">security</span>
                        </Link>
                    )}

                    <Link to="/guide" className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">{t('nav.guide')}</Link>


                </div>
            </div>

            {/* Cart Drawer */}
            <div className={`fixed inset-0 z-50 overflow-hidden ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsCartOpen(false)}
                ></div>
                <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-surface-light dark:bg-surface-dark shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="font-display text-2xl text-gray-900 dark:text-white">{t('nav.cart_title')}</h2>
                        <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                            <span className="material-icons-outlined text-2xl">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <span className="material-icons-outlined text-6xl mb-4 opacity-30">shopping_basket</span>
                                <p className="font-display text-lg">{t('nav.cart_empty')}</p>
                                <button onClick={() => { setIsCartOpen(false); navigate('/subscription'); }} className="mt-4 text-primary font-bold text-xs uppercase tracking-widest hover:underline">{t('nav.cart_start')}</button>
                            </div>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-center animate-fade-in group">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-black/20 rounded-lg p-2 flex-shrink-0 border border-gray-200 dark:border-white/5 group-hover:border-primary/30 transition-colors">
                                        <img src={item.img} className="w-full h-full object-contain filter sepia-[.2]" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-display text-gray-900 dark:text-white text-sm leading-tight">{item.name}</h3>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-tight">{item.sub}</p>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10">
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-icons-outlined text-sm">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-icons-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                            <span className="font-bold text-primary text-sm">{formatPrice(item.price * item.qty)}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                                        <span className="material-icons-outlined">delete_outline</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="p-6 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-accent text-xs font-bold text-gray-500 uppercase tracking-widest">{t('nav.subtotal')}</span>
                                <span className="font-display text-2xl text-gray-900 dark:text-white">{formatPrice(cartTotal)}</span>
                            </div>
                            <button
                                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-primary/20"
                            >
                                {t('nav.checkout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Search Overlay */}
            <div className={`fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-xl transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="max-w-4xl mx-auto px-6 pt-32 h-full flex flex-col">
                    <div className="relative border-b-2 border-primary/50 focus-within:border-primary transition-colors">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
                            <span className="material-icons-outlined text-3xl">search</span>
                        </span>
                        <input
                            autoFocus={isSearchOpen}
                            type="text"
                            placeholder={t('nav.search_placeholder')}
                            className="w-full bg-transparent border-none text-4xl font-display text-white placeholder-gray-600 pl-14 py-6 focus:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2"
                        >
                            <span className="material-icons-outlined text-2xl">close</span>
                        </button>
                    </div>

                    <div className="mt-12 overflow-y-auto">
                        {searchQuery && (
                            <div className="space-y-2">
                                <p className="text-primary font-accent text-xs tracking-widest uppercase mb-6">{t('nav.search_results')}</p>
                                {searchResults.length > 0 ? (
                                    searchResults.map((result, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => { navigate(result.path); setIsSearchOpen(false); }}
                                            className="group flex items-center justify-between p-4 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all animate-fade-in"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`material-icons-outlined ${result.type === 'Tool' ? 'text-primary' : 'text-gray-500'}`}>
                                                    {result.type === 'Page' ? 'article' : result.type === 'Tool' ? 'smart_toy' : 'local_cafe'}
                                                </span>
                                                <span className="text-xl text-gray-300 group-hover:text-white font-display">{result.title}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 group-hover:text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{t('nav.jump')}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">{t('nav.no_results')} "{searchQuery}"</p>
                                )}
                            </div>
                        )}
                        {!searchQuery && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
                                {['Pour Over', 'Beans', 'Espresso', 'AI Tools'].map(tag => (
                                    <button key={tag} onClick={() => setSearchQuery(tag)} className="p-4 border border-white/10 rounded hover:bg-white/5 text-gray-400 hover:text-primary transition-colors text-left">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
