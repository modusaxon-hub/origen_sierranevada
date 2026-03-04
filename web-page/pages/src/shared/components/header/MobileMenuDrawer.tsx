import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const { t } = useLanguage();

    return (
        <div className={`fixed inset-0 z-40 bg-background-light dark:bg-background-dark pt-[140px] px-6 transition-transform duration-500 transform lg:hidden shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full invisible'}`}>
            <div className="flex flex-col gap-6 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
                {user ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3" onClick={() => { navigate('/account'); onClose(); }}>
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
                        onClick={() => { navigate('/login'); onClose(); }}
                        className="bg-[#C5A065] text-black font-bold uppercase tracking-widest py-3 rounded-lg mb-4 hover:bg-[#D4B075]"
                    >
                        Iniciar Sesión
                    </button>
                )}

                <Link to="/" className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3" onClick={onClose}>{t('nav.home')}</Link>

                <Link to="/catalog" className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3" onClick={onClose}>Catálogo</Link>

                {user && !isAdmin && (
                    <Link to="/my-orders" onClick={onClose} className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3 flex items-center justify-between">
                        Mis Pedidos
                        <span className="material-icons-outlined text-[#C5A065]">receipt_long</span>
                    </Link>
                )}

                {isAdmin && (
                    <Link to="/admin" onClick={onClose} className="text-xl font-display font-bold text-[#C5A065] border-b border-[#C5A065]/20 pb-3 flex items-center justify-between">
                        PANEL ADMINISTRATIVO
                        <span className="material-icons-outlined">security</span>
                    </Link>
                )}

                <Link to="/guide" className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">{t('nav.guide')}</Link>
            </div>
        </div>
    );
};

export default MobileMenuDrawer;
