
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_EMAIL_WHITELIST } from '@/services/authService';
import Logo from '@/shared/components/Logo';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { user, isAdmin, loading, roleChecked } = useAuth();
    const location = useLocation();

    if (loading || (requireAdmin && !roleChecked)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806]">
                <div className="w-12 h-12 border-2 border-[#C5A065]/20 border-t-[#C5A065] rounded-full animate-spin mb-4"></div>
                <Logo className="w-[200px] h-auto opacity-40 animate-pulse" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // SI ES ADMIN O EL USUARIO TIENE EL ROL EN SUS PROPIOS METADATOS (BACKUP DE EMERGENCIA)
    const canAccess = isAdmin || user.user_metadata?.role === 'admin' || ADMIN_EMAIL_WHITELIST.includes(user.email || '');

    if (requireAdmin && !canAccess) {
        // Solo mostramos esta pantalla si estamos COMPLETAMENTE SEGUROS de que no es admin
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
                    <span className="material-icons-outlined text-4xl text-red-500">lock</span>
                </div>
                <h1 className="text-3xl font-serif text-white mb-4 uppercase tracking-tight">Acceso Restringido</h1>
                <p className="text-white/40 max-w-xs mb-8 font-light leading-relaxed">
                    Tu ritual de usuario no tiene las autorizaciones necesarias para entrar en esta cámara.
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.href = '#/'}
                        className="px-8 py-3 bg-[#C5A065] text-black rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl"
                    >
                        Volver al Inicio
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                    >
                        Reintentar Validación
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
