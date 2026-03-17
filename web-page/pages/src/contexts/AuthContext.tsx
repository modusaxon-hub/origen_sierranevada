
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
    const profileSubscriptionRef = useRef<any>(null);
    const authListenerRef = useRef<any>(null);

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

            const dbRole = data?.role_name;
            const metaRole = currentUser.user_metadata?.role_name;
            const role = dbRole || metaRole || 'Usuario';

            const status = data?.status || 'pending';

            console.log(`[Auth] Perfil detectado: Role=${role} (DB:${dbRole}, Meta:${metaRole}), Status=${status}`);

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
        console.log("[Auth] ⚠️ INICIANDO CIERRE DE SESIÓN COMPLETO...");

        // PASO 1: Marcar que estamos desconectando para prevenir que se restaure la sesión
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.__signingOut = true;
            console.log("[Auth] ✓ Flag de desconexión establecida");
        }

        setLoading(true);
        try {
            // PASO 2: PARAR INMEDIATAMENTE TODOS LOS LISTENERS
            console.log("[Auth] PAUSANDO listeners de Supabase...");

            if (profileSubscriptionRef.current) {
                console.log("[Auth] ✓ Removiendo suscripción de perfil...");
                supabase.removeChannel(profileSubscriptionRef.current);
                profileSubscriptionRef.current = null;
            }

            if (authListenerRef.current) {
                console.log("[Auth] ✓ Deteniendo listener de sesión de auth...");
                // Unsubscribe del listener para PARAR su ejecución
                authListenerRef.current.subscription?.unsubscribe();
                authListenerRef.current = null;
            }

            console.log("[Auth] ✓ Todos los listeners pausados");

            // PASO 3: Esperar un poco para que los listeners se detengan
            await new Promise(resolve => setTimeout(resolve, 50));

            // PASO 4: LIMPIAR LA SESIÓN
            console.log("[Auth] Limpiando sesión en Supabase y almacenamiento...");
            await authService.signOut();

            // PASO 5: Esperar a que se complete la limpieza
            await new Promise(resolve => setTimeout(resolve, 100));

            // PASO 6: LIMPIAR EL ESTADO REACT DEFINITIVAMENTE
            console.log("[Auth] Limpiando estado React...");
            setUser(null);
            setIsAdmin(false);
            setUserRole(null);
            setUserStatus(null);
            setRoleChecked(true);

            console.log("[Auth] ✅ CIERRE DE SESIÓN COMPLETADO - Usuario completamente desconectado");
        } catch (err) {
            console.error("[Auth] ❌ Error al cerrar sesión:", err);
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
        // Fail-safe: Asegurar que el spinner desaparezca pase lo que pase tras 2s
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setRoleChecked(true);
                console.warn("[Auth] Fail-safe de carga ACTIVADO tras timeout.");
            }
        }, 2000);

        const setupProfileSubscription = (userId: string) => {
            if (profileSubscriptionRef.current) {
                supabase.removeChannel(profileSubscriptionRef.current);
            }

            console.log('[Auth] Configurando canal de tiempo real para perfil:', userId);
            profileSubscriptionRef.current = supabase
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

        // 1. Verificación inicial explícita para evitar depender solo del listener que puede tardar
        const initAuth = async () => {
            try {
                // Verificar si estamos en proceso de desconexión
                // @ts-ignore
                if (window.__signingOut) {
                    console.log("[Auth] ⚠️ En proceso de desconexión - saltando initAuth");
                    return;
                }

                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    await checkUserRole(session.user);
                    setupProfileSubscription(session.user.id);
                } else {
                    console.log("[Auth] No hay sesión inicial.");
                    setLoading(false);
                    setRoleChecked(true);
                }
            } catch (err) {
                console.error("[Auth] Error en verificación inicial:", err);
                setLoading(false);
                setRoleChecked(true);
            }
        };

        initAuth();

        // 2. Escuchar cambios futuros en la sesión de Auth
        authListenerRef.current = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[Auth] Evento de Sesión: ${event}`);

            // Verificar si estamos desconectando - si es así, ignorar el evento
            // @ts-ignore
            if (window.__signingOut) {
                console.log("[Auth] ⚠️ En proceso de desconexión - ignorando evento de sesión:", event);
                return;
            }

            if (event === 'INITIAL_SESSION') return; // Ya manejado por initAuth

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsAdmin(false);
                setUserRole(null);
                setUserStatus(null);
                setRoleChecked(true);
                setLoading(false);
                if (profileSubscriptionRef.current) {
                    supabase.removeChannel(profileSubscriptionRef.current);
                    profileSubscriptionRef.current = null;
                }
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
                    setLoading(false);
                }
            } catch (err) {
                console.error("[Auth] Error en listener de sesión:", err);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(loadingTimeout);
            authListenerRef.current?.subscription?.unsubscribe();
            if (profileSubscriptionRef.current) supabase.removeChannel(profileSubscriptionRef.current);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, userRole, userStatus, loading, roleChecked, refreshAuth, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
