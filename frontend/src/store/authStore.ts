import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,

            setAuth: (user, token) => {
                set({ user, token });
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                }
            },

            logout: () => {
                set({ user: null, token: null });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
            },

            isAuthenticated: () => {
                return !!get().token;
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
