
import { supabase } from './supabaseClient';
import { UserRole, SecurityFlag } from '@/shared/types';

// La gestión de administradores ahora se maneja exclusivamente mediante roles en la base de datos (public.profiles).

export const authService = {
    // Sign up creates a new user. 
    // NOTE: By default, Supabase requires email confirmation. 
    // For this demo admin, we might need to disable that in Supabase dashboard 
    // or verify the email manually.
    signUp: async (email: string, password: string, fullName: string, phone: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                },
            },
        });
        return { data, error };
    },

    signIn: async (email: string, password: string) => {
        // En un entorno de producción, el conteo de intentos debería ocurrir en un Edge Function
        // o mediante un trigger para mayor seguridad, pero aquí implementamos la lógica solicitada.

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // 1. Manejo de Intentos Fallidos
        if (error && error.message === 'Invalid login credentials') {
            // Buscamos el perfil por email para actualizar los intentos
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, login_attempts, status')
                .eq('email', email)
                .single();

            if (profile && profile.status === 'active') {
                const newAttempts = (profile.login_attempts || 0) + 1;

                await supabase
                    .from('profiles')
                    .update({
                        login_attempts: newAttempts,
                        last_failed_attempt: new Date().toISOString()
                    })
                    .eq('id', profile.id);

                if (newAttempts >= 5) {
                    // Disparar protocolo de recuperación tras 5 intentos
                    await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/#/reset-password`
                    });

                    return {
                        data: { user: null, session: null },
                        error: {
                            message: "Demasiados intentos fallidos. Por seguridad, hemos enviado un enlace de recuperación a tu correo.",
                            isLocked: true
                        } as any
                    };
                }

                return {
                    data,
                    error: {
                        message: `Contraseña incorrecta. Intento ${newAttempts} de 5.`,
                        attemptsLeft: 5 - newAttempts
                    } as any
                };
            }
        }

        // 2. Manejo de Éxito y Reseteo de Intentos
        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('status, login_attempts')
                .eq('id', data.user.id)
                .single();

            if (profile) {
                // Resetear intentos en login exitoso
                if (profile.login_attempts > 0) {
                    await supabase
                        .from('profiles')
                        .update({ login_attempts: 0 })
                        .eq('id', data.user.id);
                }

                if (profile.status !== 'active') {
                    // Eliminamos el signOut forzado. 
                    // Ahora permitimos que el usuario inicie sesión pero ProtectedRoute lo bloqueará.
                    // Esto permite que el Listener de Tiempo Real funcione.
                    console.log(`[AuthService] Usuario logueado pero inactivo: ${profile.status}`);
                }
            }
        }

        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getUser: async () => {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    // Helper to check if current user is admin via the 'public.profiles' table
    checkIsAdmin: async (userId: string): Promise<boolean> => {
        // 1. Try to get role from profiles table
        const { data, error } = await supabase
            .from('profiles')
            .select('role_name')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error checking admin role:", error);
            return false;
        }

        return data?.role_name === 'Administrador';
    },

    // --- User Management (Admin Only) ---

    getAllProfiles: async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    },

    updateUserRole: async (userId: string, newRole: UserRole) => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role_name: newRole })
            .eq('id', userId)
            .select();

        return { data, error };
    },

    banUser: async (userId: string, flag: SecurityFlag, notes: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({
                status: 'banned',
                security_flag: flag,
                security_notes: notes,
                banned_at: new Date().toISOString()
            })
            .eq('id', userId);

        return { error };
    },

    deleteUserForever: async (userId: string) => {
        const { data, error } = await supabase
            .rpc('delete_user_permanently', { target_id: userId });

        return { data, error };
    },

    activateUser: async (userId: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({
                status: 'active',
                security_flag: null,
                security_notes: null,
                banned_at: null
            })
            .eq('id', userId);

        return { error };
    },

    approveUser: async (userId: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ status: 'active' })
            .eq('id', userId);

        return { error };
    },

    sendPasswordReset: async (email: string) => {
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`
        });
    },

    updatePassword: async (newPassword: string) => {
        return supabase.auth.updateUser({ password: newPassword });
    },

    updateProfile: async (userId: string, data: { full_name?: string; phone?: string; address?: string }) => {
        return supabase
            .from('profiles')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', userId);
    }
};
