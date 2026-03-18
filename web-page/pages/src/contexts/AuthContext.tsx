
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
        // 1. Desuscribir listener PRIMERO para que no restaure la sesión
        if (authListenerRef.current) {
            authListenerRef.current.unsubscribe();
            authListenerRef.current = null;
        }

        // 2. Detener suscripción de perfil
        if (profileSubscriptionRef.current) {
            supabase.removeChannel(profileSubscriptionRef.current);
            profileSubscriptionRef.current = null;
        }

        // 3. Llamar signOut con timeout de 2s (puede colgarse por Web Lock)
        try {
            await Promise.race([
                supabase.auth.signOut({ scope: 'local' }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
            ]);
        } catch (_) {
            // Timeout o AbortError - continuamos con limpieza manual
        }

        // 4. Limpiar storage manualmente (siempre, como safety net)
        try {
            localStorage.removeItem('osn-auth'); // Limpieza explícita de la clave principal
            Object.keys(localStorage)
                .filter(k => k.includes('sb-') || k.includes('supabase') || k.includes('auth'))
                .forEach(k => localStorage.removeItem(k));
            Object.keys(sessionStorage)
                .filter(k => k.includes('sb-') || k.includes('supabase') || k.includes('auth'))
                .forEach(k => sessionStorage.removeItem(k));
        } catch (_) { }

        // 5. Limpiar estado React
        setUser(null);
        setIsAdmin(false);
        setUserRole(null);
        setUserStatus(null);
        setRoleChecked(true);
        setLoading(false);
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
        // Fail-safe: Asegurar que el spinner desaparezca pase lo que pase tras 5s
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
            setRoleChecked(true);
            console.warn("[Auth] Fail-safe timeout - forzando completado");
        }, 5000);

        const setupProfileSubscription = (userId: string) => {
            if (profileSubscriptionRef.current) {
                supabase.removeChannel(profileSubscriptionRef.current);
            }

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
                    setUserStatus(newStatus);
                    setUserRole(newRole);
                    setIsAdmin(newRole === 'Administrador');
                })
                .subscribe();
        };

        // ÚNICA fuente de verdad para auth: onAuthStateChange
        // NO usamos getSession() por separado para evitar AbortError por Web Lock contention
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[Auth] Evento: ${event}`);

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

            // INITIAL_SESSION es el primer evento - equivale a getSession()
            // SIGNED_IN ocurre después de login
            // TOKEN_REFRESHED ocurre al renovar token
            if (session?.user) {
                setUser(session.user);
                await checkUserRole(session.user);
                setupProfileSubscription(session.user.id);
            } else if (event === 'INITIAL_SESSION') {
                // No hay sesión activa
                setUser(null);
                setLoading(false);
                setRoleChecked(true);
            }
        });

        authListenerRef.current = authSubscription;

        return () => {
            clearTimeout(loadingTimeout);
            authListenerRef.current?.unsubscribe();
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
