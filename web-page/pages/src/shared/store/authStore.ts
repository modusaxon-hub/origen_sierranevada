import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    role?: string;
    full_name?: string;
}

interface AuthState {
    user: User | null;
    session: any | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: any | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            loading: true,
            setUser: (user) => set({ user }),
            setSession: (session) => set({ session }),
            setLoading: (loading) => set({ loading }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
