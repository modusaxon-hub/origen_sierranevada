
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/shared/components/Logo';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false, requiredRole }) => {
    const { user, isAdmin, userRole, userStatus, loading, roleChecked, refreshAuth, signOut } = useAuth();
    const location = useLocation();

    const handleRetry = async () => {
        await refreshAuth();
        window.location.reload();
    };

    // Siempre esperar a que el rol sea verificado antes de tomar decisiones de acceso.
    // Esto previene el race condition donde el admin es bloqueado antes de que su rol cargue.
    if (loading || !roleChecked) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806]">
                <div className="w-12 h-12 border-2 border-[#C8AA6E]/20 border-t-[#C8AA6E] rounded-full animate-spin mb-4"></div>
                <Logo className="w-[200px] h-auto opacity-40 animate-pulse" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // SI ES ADMIN O EL USUARIO TIENE EL ROL EN SUS PROPIOS METADATOS (BACKUP DE EMERGENCIA)
    const isAdminUser = isAdmin || user.user_metadata?.role_name === 'Administrador';

    // BLOQUEO POR ESTADO 'PENDING'
    // Los administradores siempre pasan (independientemente del status), los usuarios normales deben estar 'active'
    if (!isAdminUser && userStatus !== 'active') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-[#C8AA6E]/10 flex items-center justify-center mb-8 border border-[#C8AA6E]/20 animate-pulse">
                    <span className="material-icons-outlined text-4xl text-[#C8AA6E]">hourglass_empty</span>
                </div>
                <h1 className="text-3xl font-serif text-white mb-4 uppercase tracking-tight italic">Círculo de Espera</h1>
                <p className="text-white/40 max-w-sm mb-8 font-light leading-relaxed italic">
                    Tu acceso está siendo revisado por nuestros fundadores. Recibirás un correo electrónico una vez tu perfil sea <span className="text-[#C8AA6E] font-medium">autorizado</span>.
                </p>
                <div className="bg-[#C8AA6E]/5 border border-[#C8AA6E]/20 rounded-2xl p-6 mb-10 text-left max-w-sm">
                    <p className="text-white/80 text-[10px] leading-relaxed italic uppercase tracking-widest text-center">
                        Tiempo estimado de aprobación:<br />
                        <span className="text-[#C8AA6E] font-bold">24 a 48 Horas</span>
                    </p>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-[280px]">
                    <button
                        onClick={() => window.location.href = '#/'}
                        className="w-full py-4 bg-[#C8AA6E] text-black rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#C8AA6E]/20"
                    >
                        Volver al Inicio
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="w-full py-4 border border-white/10 text-white/40 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all active:scale-95"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div >
        );
    }

    const canAccess = isAdminUser;

    if (requireAdmin && !canAccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
                    <span className="material-icons-outlined text-4xl text-red-500">lock</span>
                </div>
                <h1 className="text-3xl font-serif text-white mb-4 uppercase tracking-tight">Acceso Restringido</h1>
                <p className="text-white/40 max-w-xs mb-8 font-light leading-relaxed">
                    Tu perfil de usuario no tiene las autorizaciones necesarias para entrar en esta cámara.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-[280px]">
                    <button
                        onClick={() => window.location.href = '#/'}
                        className="w-full bg-[#C8AA6E] text-black border border-[#C8AA6E] rounded-xl font-display font-medium uppercase text-[10px] tracking-[0.2em] py-4 hover:brightness-110 transition-all duration-300 active:scale-95 shadow-2xl"
                    >
                        Volver al Inicio
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="w-full py-4 border border-white/10 text-white/40 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all active:scale-95"
                    >
                        Cerrar Sesión
                    </button>
                    <button
                        onClick={handleRetry}
                        className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C8AA6E] hover:text-white transition-colors animate-pulse italic mt-2"
                    >
                        Reintentar Validación
                    </button>
                </div>
            </div >
        );
    }

    if (requiredRole && userRole !== requiredRole && !isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-500/20">
                    <span className="material-icons-outlined text-4xl text-amber-500">storefront</span>
                </div>
                <h1 className="text-3xl font-serif text-white mb-4 uppercase tracking-tight">Acceso Exclusivo</h1>
                <p className="text-white/40 max-w-xs mb-8 font-light leading-relaxed">
                    Esta sección está reservada para proveedores de la plataforma.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-[280px]">
                    <button
                        onClick={() => window.location.href = '#/'}
                        className="w-full py-4 bg-[#C8AA6E] text-black rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#C8AA6E]/20"
                    >
                        Volver al Inicio
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="w-full py-4 border border-white/10 text-white/40 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all active:scale-95"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div >
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
