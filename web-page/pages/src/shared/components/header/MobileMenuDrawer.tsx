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
    const { user, isAdmin, signOut } = useAuth();
    const { t } = useLanguage();

    const handleLogout = async () => {
        onClose();
        await signOut();
        navigate('/');
    };

    return (
        <div className={`fixed inset-0 z-40 bg-background-light dark:bg-background-dark pt-[64px] sm:pt-[68px] px-6 transition-transform duration-500 transform lg:hidden shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full invisible'}`}>
            <div className="flex flex-col gap-6 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
                {user ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3" onClick={() => { navigate('/account'); onClose(); }}>
                            <div className="w-10 h-10 rounded-full bg-[#C8AA6E]/20 flex items-center justify-center text-[#C8AA6E] font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white font-bold text-sm truncate w-32">{user.user_metadata?.full_name || 'Usuario'}</p>
                                <p className="text-gray-400 text-xs truncate w-32">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-red-400 hover:bg-white/5 rounded-full transition-all active:scale-95"
                        >
                            <span className="material-icons-outlined">logout</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { navigate('/login'); onClose(); }}
                        className="bg-[#C8AA6E] text-black font-bold uppercase tracking-widest py-3 rounded-lg mb-4 hover:brightness-110 transition-all active:scale-95"
                    >
                        Iniciar Sesión
                    </button>
                )}


                {user && !isAdmin && (
                    <Link to="/my-orders" onClick={onClose} className="text-xl font-display font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3 flex items-center justify-between">
                        Mis Pedidos
                        <span className="material-icons-outlined text-[#C8AA6E]">receipt_long</span>
                    </Link>
                )}

                {isAdmin && (
                    <Link to="/admin" onClick={onClose} className="text-xl font-display font-bold text-[#C8AA6E] border-b border-[#C8AA6E]/20 pb-3 flex items-center justify-between">
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
