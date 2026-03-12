
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    userRole: string | null;
    userStatus: string | null;
    loading: boolean;
    roleChecked: boolean;
    refreshAuth: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    userRole: null,
    userStatus: null,
    loading: true,
    roleChecked: false,
    refreshAuth: async () => { },
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userStatus, setUserStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [roleChecked, setRoleChecked] = useState(false);

    const checkUserRole = async (currentUser: User | null) => {
        if (!currentUser) {
            console.log("[Auth] No hay usuario, limpiando estados.");
            setIsAdmin(false);
            setUserRole(null);
            setUserStatus(null);
            setRoleChecked(true);
            setLoading(false);
            return;
        }


        try {
            console.log(`[Auth] Verificando perfil para: ${currentUser.email}`);
            const { data, error } = await supabase
                .from('profiles')
                .select('role_name, status')
                .eq('id', currentUser.id)
                .single();

            if (error) {
                console.warn("[Auth] Error obteniendo perfil:", error.message);
                // Si hay error (ej. tabla no existe aún), asumimos valores por defecto
                setUserRole('Usuario');
                setUserStatus('pending');
                setRoleChecked(true);
                setLoading(false);
                return;
            }

            const role = data?.role_name || 'Usuario';
            const status = data?.status || 'pending';

            console.log(`[Auth] Perfil detectado: Role=${role}, Status=${status}`);

            setUserRole(role);
            setUserStatus(status);
            setIsAdmin(role === 'Administrador');
        } catch (e) {
            console.error("[Auth] Error crítico revisando rol:", e);
            setUserRole('Usuario');
            setUserStatus('pending');
            setIsAdmin(false);
        } finally {
            setRoleChecked(true);
            setLoading(false);
        }
    };

    const signOut = async () => {
        console.log("[Auth] Iniciando cierre de sesión...");
        setLoading(true);
        try {
            await authService.signOut();
            setUser(null);
            setIsAdmin(false);
            setUserRole(null);
            setUserStatus(null);
            setRoleChecked(true);
        } catch (err) {
            console.error("[Auth] Error al cerrar sesión:", err);
        } finally {
            setLoading(false);
        }
    };

    const refreshAuth = async () => {
        setLoading(true);
        try {
            const currentUser = await authService.getUser();
            setUser(currentUser);
            await checkUserRole(currentUser);
        } catch (error) {
            console.error("Error refreshing auth:", error);
            setUser(null);
            setIsAdmin(false);
            setUserRole(null);
            setUserStatus(null);
            setRoleChecked(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fail-safe: Asegurar que el spinner desaparezca pase lo que pase tras 6s
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setRoleChecked(true);
                console.warn("[Auth] Fail-safe de carga ACTIVADO tras timeout.");
            }
        }, 6000);

        let profileSubscription: any = null;

        // 1. Escuchar cambios en la sesión de Auth
        const setupProfileSubscription = (userId: string) => {
            if (profileSubscription) {
                supabase.removeChannel(profileSubscription);
            }

            console.log('[Auth] Configurando canal de tiempo real para perfil:', userId);
            profileSubscription = supabase
                .channel(`public:profiles:${userId}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`
                }, (payload) => {
                    const newStatus = payload.new.status;
                    const newRole = payload.new.role_name;
                    console.log(`[Auth] ¡CAMBIO DETECTADO EN PERFIL! Nuevo Status:${newStatus}, Rol:${newRole}`);
                    setUserStatus(newStatus);
                    setUserRole(newRole);
                    setIsAdmin(newRole === 'Administrador');
                })
                .subscribe((status) => {
                    console.log(`[Auth] Estado de suscripción tiempo real: ${status}`);
                });
        };

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[Auth] Evento de Sesión: ${event}`);

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsAdmin(false);
                setUserRole(null);
                setUserStatus(null);
                setRoleChecked(true);
                setLoading(false);
                return;
            }

            try {
                if (session?.user) {
                    setUser(session.user);
                    await checkUserRole(session.user);
                    setupProfileSubscription(session.user.id);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setUserRole(null);
                    setUserStatus(null);
                    setRoleChecked(true);
                    if (profileSubscription) {
                        supabase.removeChannel(profileSubscription);
                        profileSubscription = null;
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error("[Auth] Error en listener de sesión:", err);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(loadingTimeout);
            authListener?.subscription?.unsubscribe();
            if (profileSubscription) supabase.removeChannel(profileSubscription);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, userRole, userStatus, loading, roleChecked, refreshAuth, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
