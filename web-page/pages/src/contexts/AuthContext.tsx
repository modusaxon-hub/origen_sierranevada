
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    userRole: string | null;
    loading: boolean;
    roleChecked: boolean;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    userRole: null,
    loading: true,
    roleChecked: false,
    refreshAuth: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [roleChecked, setRoleChecked] = useState(false);

    const checkUserRole = async (currentUser: User | null) => {
        if (!currentUser) {
            setIsAdmin(false);
            setUserRole(null);
            setRoleChecked(true);
            return;
        }


        try {
            const rolePromise = supabase
                .from('profiles')
                .select('role_name')
                .eq('id', currentUser.id)
                .single();
            const timeoutPromise = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3000));

            const { data } = await Promise.race([rolePromise, timeoutPromise]);
            const role = data?.role_name || 'Usuario';
            setUserRole(role);
            setIsAdmin(role === 'Administrador');
        } catch (e) {
            console.error("Role check failed", e);
            setIsAdmin(false);
            setUserRole(null);
        } finally {
            setRoleChecked(true);
        }
    };

    const refreshAuth = async () => {
        try {
            const currentUser = await authService.getUser();
            setUser(currentUser);
            await checkUserRole(currentUser);
        } catch (error) {
            console.error("Error refreshing auth:", error);
            setUser(null);
            setIsAdmin(false);
            setUserRole(null);
            setRoleChecked(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAuth();

        try {
            const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    await checkUserRole(session.user);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setUserRole(null);
                    setRoleChecked(true);
                }
                setLoading(false);
            });

            return () => {
                authListener?.subscription?.unsubscribe();
            };
        } catch (error) {
            console.warn("Auth listener initialization failed (Supabase not configured):", error);
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, userRole, loading, roleChecked, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
