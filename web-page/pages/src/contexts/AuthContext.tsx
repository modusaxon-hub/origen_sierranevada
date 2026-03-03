
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    roleChecked: boolean;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    loading: true,
    roleChecked: false,
    refreshAuth: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roleChecked, setRoleChecked] = useState(false);

    const checkUserRole = async (currentUser: User | null) => {
        if (!currentUser) {
            setIsAdmin(false);
            setRoleChecked(true);
            return;
        }

        // EMERGENCY WHITELIST: El administrador principal siempre tiene acceso por email
        if (currentUser.email === 'origensierranevadasm@gmail.com') {
            setIsAdmin(true);
            setRoleChecked(true);
            return;
        }

        try {
            const adminPromise = authService.checkIsAdmin(currentUser.id);
            const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000));

            const adminStatus = await Promise.race([adminPromise, timeoutPromise]);
            setIsAdmin(adminStatus);
        } catch (e) {
            console.error("Role check failed", e);
            setIsAdmin(false);
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
            setRoleChecked(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                await checkUserRole(session.user);
            } else {
                setUser(null);
                setIsAdmin(false);
                setRoleChecked(true);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, roleChecked, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
