import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * @param requireAdmin - Si es true, solo usuarios admin pueden acceder
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isLoading, isAuthenticated, isAdmin } = useAuth();

    // Mostrar loading mientras se verifica la sesión
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
                    <p className="text-white/60 font-sans">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si requiere admin y el usuario no es admin, mostrar acceso denegado
    if (requireAdmin && !isAdmin) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <div className="mb-6">
                        <span className="material-symbols-outlined text-gold text-6xl">lock</span>
                    </div>
                    <h1 className="text-3xl font-serif text-gold mb-4">Acceso Denegado</h1>
                    <p className="text-white/60 font-sans mb-8">
                        Esta sección está disponible solo para administradores.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gold text-primary px-8 py-3 rounded-lg font-sans font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    // Usuario autenticado y con permisos, mostrar contenido
    return <>{children}</>;
}
