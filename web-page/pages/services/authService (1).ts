import { supabase } from './supabaseClient';
import { User, AuthError, Session } from '@supabase/supabase-js';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role: 'user' | 'admin';
    created_at: string;
}

/**
 * Servicio de autenticación centralizado
 */
export const authService = {
    /**
     * Iniciar sesión con email y contraseña
     */
    async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error en login:', error.message);
            return { user: null, error };
        }

        return { user: data.user, error: null };
    },

    /**
     * Registrar nuevo usuario
     */
    async signUp(email: string, password: string, fullName?: string): Promise<{ user: User | null; error: AuthError | null }> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            console.error('Error en registro:', error.message);
            return { user: null, error };
        }

        return { user: data.user, error: null };
    },

    /**
     * Cerrar sesión
     */
    async signOut(): Promise<{ error: AuthError | null }> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error al cerrar sesión:', error.message);
        }

        return { error };
    },

    /**
     * Obtener sesión actual
     */
    async getSession(): Promise<Session | null> {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    /**
     * Obtener usuario actual
     */
    async getCurrentUser(): Promise<User | null> {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    /**
     * Obtener perfil del usuario con rol
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error obteniendo perfil:', error.message);
            return null;
        }

        return data as UserProfile;
    },

    /**
     * Verificar si el usuario actual es admin
     */
    async isAdmin(): Promise<boolean> {
        const user = await this.getCurrentUser();

        if (!user) {
            return false;
        }

        const profile = await this.getUserProfile(user.id);
        return profile?.role === 'admin';
    },

    /**
     * Suscribirse a cambios en la autenticación
     */
    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(session?.user ?? null);
        });
    },
};
