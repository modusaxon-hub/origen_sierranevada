
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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

    // Refs para evitar setState después de desmontaje
    const isMountedRef = useRef(true);
    const profileSubscriptionRef = useRef<any>(null);
    const authListenerRef = useRef<any>(null);

    const safeSetState = useCallback((fn: () => void) => {
        if (isMountedRef.current) fn();
    }, []);

    const checkUserRole = useCallback(async (currentUser: User | null) => {
        if (!currentUser) {
            safeSetState(() => {
                setIsAdmin(false);
                setUserRole(null);
                setUserStatus(null);
                setRoleChecked(true);
                setLoading(false);
            });
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role_name, status')
                .eq('id', currentUser.id)
                .single();

            if (error) {
                safeSetState(() => {
                    setUserRole('Usuario');
                    setUserStatus('pending');
                    setRoleChecked(true);
                    setLoading(false);
                });
                return;
            }

            const role = data?.role_name || 'Usuario';
            const status = data?.status || 'pending';

            safeSetState(() => {
                setUserRole(role);
                setUserStatus(status);
                setIsAdmin(role === 'Administrador');
                setRoleChecked(true);
                setLoading(false);
            });
        } catch (e) {
            console.error("[Auth] Error en checkUserRole:", e);
            safeSetState(() => {
                setUserRole('Usuario');
                setUserStatus('pending');
                setIsAdmin(false);
                setRoleChecked(true);
                setLoading(false);
            });
        }
    }, [safeSetState]);

    const signOut = useCallback(async () => {
        try {
            if (authListenerRef.current?.unsubscribe) {
                authListenerRef.current.unsubscribe();
                authListenerRef.current = null;
            }
            if (profileSubscriptionRef.current) {
                supabase.removeChannel(profileSubscriptionRef.current);
                profileSubscriptionRef.current = null;
            }

            await authService.signOut();

            safeSetState(() => {
                setUser(null);
                setIsAdmin(false);
                setUserRole(null);
                setUserStatus(null);
                setRoleChecked(true);
                setLoading(false);
            });
        } catch (err) {
            console.error("[Auth] Error en signOut:", err);
            safeSetState(() => {
                setUser(null);
                setIsAdmin(false);
                setUserRole(null);
                setUserStatus(null);
                setRoleChecked(true);
                setLoading(false);
            });
        }
    }, [safeSetState]);

    const refreshAuth = useCallback(async () => {
        safeSetState(() => setLoading(true));
        try {
            const currentUser = await authService.getUser();
            safeSetState(() => setUser(currentUser));
            await checkUserRole(currentUser);
        } catch (error) {
            console.error("[Auth] Error en refreshAuth:", error);
            safeSetState(() => {
                setUser(null);
                setIsAdmin(false);
                setUserRole(null);
                setUserStatus(null);
                setRoleChecked(true);
                setLoading(false);
            });
        }
    }, [checkUserRole, safeSetState]);

    // Inicialización única
    useEffect(() => {
        let authUnsubscribe: any = null;
        let timeoutId: NodeJS.Timeout | null = null;
        let isCancelled = false;

        const initAuth = async () => {
            try {
                // Timeout de 3 segundos para toda la inicialización
                timeoutId = setTimeout(() => {
                    if (isCancelled) return;
                    isCancelled = true;
                    console.warn("[Auth] Timeout en inicialización - forzando completado");
                    safeSetState(() => {
                        setLoading(false);
                        setRoleChecked(true);
                    });
                }, 3000);

                // Obtener sesión
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (isCancelled) return;
                if (timeoutId) clearTimeout(timeoutId);

                if (sessionError) {
                    console.error("[Auth] Error obteniendo sesión:", sessionError);
                    safeSetState(() => {
                        setLoading(false);
                        setRoleChecked(true);
                    });
                    return;
                }

                if (session?.user) {
                    safeSetState(() => setUser(session.user));
                    await checkUserRole(session.user);
                } else {
                    safeSetState(() => {
                        setLoading(false);
                        setRoleChecked(true);
                    });
                }
            } catch (err) {
                console.error("[Auth] Error en initAuth:", err);
                if (!isCancelled && timeoutId) clearTimeout(timeoutId);
                safeSetState(() => {
                    setLoading(false);
                    setRoleChecked(true);
                });
            }
        };

        // Iniciar
        initAuth();

        // Listener de sesión (solo para cambios después de la inicialización)
        authUnsubscribe = supabase.auth.onAuthStateChange((event, session) => {
            if (isCancelled) return;

            console.log(`[Auth] Evento: ${event}`);

            if (event === 'SIGNED_OUT') {
                safeSetState(() => {
                    setUser(null);
                    setIsAdmin(false);
                    setUserRole(null);
                    setUserStatus(null);
                    setRoleChecked(false);
                    setLoading(false);
                });
            } else if (event === 'SIGNED_IN' && session?.user) {
                safeSetState(() => setUser(session.user));
                checkUserRole(session.user);
            }
        });

        // Cleanup
        return () => {
            isCancelled = true;
            if (timeoutId) clearTimeout(timeoutId);
            if (authUnsubscribe) authUnsubscribe.data?.subscription?.unsubscribe?.();
            if (profileSubscriptionRef.current) {
                supabase.removeChannel(profileSubscriptionRef.current);
                profileSubscriptionRef.current = null;
            }
        };
    }, [checkUserRole, safeSetState]);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, userRole, userStatus, loading, roleChecked, refreshAuth, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
