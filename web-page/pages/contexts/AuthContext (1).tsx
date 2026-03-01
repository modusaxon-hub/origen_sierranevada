import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, UserProfile } from '../services/authService';
import { AuthState, LoginCredentials, SignUpData } from '../types';

interface AuthContextType extends AuthState {
    signIn: (credentials: LoginCredentials) => Promise<{ error: string | null }>;
    signUp: (data: SignUpData) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticación
 * Maneja el estado global de autenticación y provee funciones para login/logout
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        profile: null,
        isLoading: true,
        isAuthenticated: false,
        isAdmin: false,
    });

    /**
     * Cargar perfil del usuario
     */
    const loadProfile = async (user: User): Promise<UserProfile | null> => {
        try {
            const profile = await authService.getUserProfile(user.id);
            return profile;
        } catch (error) {
            console.error('Error cargando perfil:', error);
            return null;
        }
    };

    /**
     * Refrescar perfil del usuario actual
     */
    const refreshProfile = async () => {
        const user = await authService.getCurrentUser();
        if (user) {
            const profile = await loadProfile(user);
            setAuthState(prev => ({
                ...prev,
                profile,
                isAdmin: profile?.role === 'admin',
            }));
        }
    };

    /**
     * Iniciar sesión
     */
    const signIn = async (credentials: LoginCredentials): Promise<{ error: string | null }> => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        const { user, error } = await authService.signIn(credentials.email, credentials.password);

        if (error || !user) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
            return { error: error?.message || 'Error al iniciar sesión' };
        }

        const profile = await loadProfile(user);

        setAuthState({
            user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.role === 'admin',
        });

        return { error: null };
    };

    /**
     * Registrar nuevo usuario
     */
    const signUp = async (data: SignUpData): Promise<{ error: string | null }> => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        const { user, error } = await authService.signUp(data.email, data.password, data.fullName);

        if (error || !user) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
            return { error: error?.message || 'Error al registrar usuario' };
        }

        // Esperar un momento para que se cree el perfil vía trigger
        await new Promise(resolve => setTimeout(resolve, 1000));

        const profile = await loadProfile(user);

        setAuthState({
            user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.role === 'admin',
        });

        return { error: null };
    };

    /**
     * Cerrar sesión
     */
    const signOut = async () => {
        await authService.signOut();
        setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
        });
    };

    /**
     * Verificar sesión al cargar la app
     */
    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await authService.getSession();

                if (session?.user) {
                    const profile = await loadProfile(session.user);

                    setAuthState({
                        user: session.user,
                        profile,
                        isLoading: false,
                        isAuthenticated: true,
                        isAdmin: profile?.role === 'admin',
                    });
                } else {
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Error verificando sesión:', error);
                setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        };

        checkSession();

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
            if (user) {
                const profile = await loadProfile(user);
                setAuthState({
                    user,
                    profile,
                    isLoading: false,
                    isAuthenticated: true,
                    isAdmin: profile?.role === 'admin',
                });
            } else {
                setAuthState({
                    user: null,
                    profile: null,
                    isLoading: false,
                    isAuthenticated: false,
                    isAdmin: false,
                });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value: AuthContextType = {
        ...authState,
        signIn,
        signUp,
        signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return context;
}
