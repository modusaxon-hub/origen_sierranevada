
import { supabase } from './supabaseClient';
import { UserRole, SecurityFlag } from '@/shared/types';

// Admin whitelist — única fuente de verdad para emails con acceso admin
export const ADMIN_EMAIL_WHITELIST = ['origensierranevadasm@gmail.com'];

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
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (data.user) {
            // Check if profile is active
            const { data: profile } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', data.user.id)
                .single();

            if (profile && profile.status !== 'active') {
                await supabase.auth.signOut(); // Block session
                let message = `Tu cuenta está en estado: ${profile.status}.`;

                if (profile.status === 'pending') {
                    message = "Tu ritual está en proceso. Tu cuenta está en espera de autorización por parte de nuestros sumilleres.";
                } else if (profile.status === 'banned') {
                    message = "Esta cuenta ha sido restringida por motivos de seguridad.";
                }

                return {
                    data: { user: null, session: null },
                    error: { message } as any
                };
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
