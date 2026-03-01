import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const DarkModeToggle = () => {
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors text-gray-800 dark:text-white"
            title="Toggle Theme"
        >
            <span className="material-icons-outlined block dark:hidden">dark_mode</span>
            <span className="material-icons-outlined hidden dark:block text-primary">light_mode</span>
        </button>
    );
};

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { language, toggleLanguage, t, formatPrice } = useLanguage();
    const { cartItems, removeFromCart, updateQty, cartTotal, isCartOpen, setIsCartOpen } = useCart();

    // State for interactions
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Close menus on route change
    useEffect(() => {
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
    }, [navigate]);

    // Scroll state for transparency
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ... (rest of search/cart logic)

    return (
        <>
            <nav className={`fixed w-full z-50 top-0 transition-all duration-500 ${isScrolled
                ? 'bg-background-dark/95 backdrop-blur-md py-3 shadow-lg border-b border-primary/20'
                : 'bg-gradient-to-b from-black/80 to-transparent py-6 border-b border-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? 'text-white hover:bg-white/10' : 'text-white hover:text-primary'}`}
                    >
                        <span className="material-icons-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>

                    {/* Logo (Centered in Mobile, Left in Desktop) */}
                    <div
                        className="flex items-center gap-3 group cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="public/favicon-light.svg"
                            alt="Origen Sierra Nevada"
                            className={`transition-all duration-500 ${isScrolled ? 'h-10' : 'h-12'} w-auto drop-shadow-md`}
                        />
                        <div className="flex flex-col hidden sm:flex">
                            <div className="font-display font-bold text-white tracking-[0.1em] text-lg leading-none mb-1">
                                ORIGEN
                            </div>
                            <div className="font-accent text-primary tracking-[0.2em] text-[0.6rem] leading-none">
                                SIERRA NEVADA
                            </div>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="flex items-center space-x-4 text-white">
                        <button
                            onClick={() => navigate('/ai-lab')}
                            className={`hidden lg:flex items-center gap-2 transition-all font-accent text-xs tracking-widest px-4 py-2 rounded-sm border ${isScrolled ? 'border-primary/50 text-white hover:bg-primary hover:border-primary' : 'border-white/30 text-white hover:bg-white/10'
                                }`}
                        >
                            <span className="material-icons-outlined text-sm">science</span>
                            {t('nav.ai')}
                        </button>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden lg:block p-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors"
                        >
                            <span className="material-icons-outlined">search</span>
                        </button>

                        <div
                            className="relative cursor-pointer p-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <span className="material-icons-outlined">shopping_bag</span>
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-background-dark text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors group"
                            title="Cambiar Idioma"
                        >
                            <span className="font-accent text-xs text-white group-hover:text-primary">{language.toUpperCase()}</span>
                        </button>

                        <DarkModeToggle />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-30 bg-background-light dark:bg-background-dark pt-24 px-6 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} lg:hidden`}>
                <div className="flex flex-col gap-6">
                    <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">{t('nav.home')}</Link>
                    <Link to="/subscription" className="text-2xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">{t('nav.sub')}</Link>
                    <Link to="/guide" className="text-2xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">{t('nav.guide')}</Link>
                    <Link to="/ai-lab" className="text-2xl font-display font-bold text-primary border-b border-primary/30 pb-4 flex items-center justify-between">
                        {t('nav.ai')} <span className="material-icons-outlined">science</span>
                    </Link>
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-left text-lg font-body text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-4"
                    >
                        <span className="material-icons-outlined">search</span> {t('nav.search_placeholder')}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="text-left text-lg font-body text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-4 border-t border-gray-200 dark:border-gray-800 pt-4"
                    >
                        <span className="material-icons-outlined">language</span> {language === 'es' ? 'Cambiar a English' : 'Switch to Español'}
                    </button>
                </div>
            </div>

            {/* Cart Drawer */}
            <div className={`fixed inset-0 z-50 pointer-events-none overflow-hidden ${isCartOpen ? 'pointer-events-auto' : ''}`}>
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
                                <div key={item.id} className="flex gap-4 items-start animate-fade-in border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-black/20 rounded-md p-2 flex-shrink-0">
                                        <img src={item.img} className="w-full h-full object-contain filter sepia-[.2]" alt={item.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-gray-900 dark:text-white text-sm truncate">{item.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.sub}</p>

                                        {/* Selector de Cantidad */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <span className="material-icons-outlined text-sm">remove</span>
                                                </button>
                                                <span className="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <span className="material-icons-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                            <span className="text-xs text-gray-400">×</span>
                                            <span className="text-xs text-gray-500">{formatPrice(item.price)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {/* Subtotal por línea */}
                                        <span className="font-bold text-primary text-sm">
                                            {formatPrice(item.price * item.qty)}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                            title={language === 'es' ? 'Eliminar' : 'Remove'}
                                        >
                                            <span className="material-icons-outlined text-lg">delete_outline</span>
                                        </button>
                                    </div>
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
                            <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-primary/20">
                                {t('nav.checkout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Search Overlay */}
            <div className={`fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-xl transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
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

export default Navbar;
