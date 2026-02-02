'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse, SignupResponse } from '../types/auth';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<{ hasMigration: boolean; verification_required?: boolean }>;
    logout: () => Promise<void>;
    migratePremium: (email: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (newPassword: string) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data); // { email, plan }
            }
        } catch (e) {
            console.error("Session check failed", e);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Login failed');
        }

        const data: LoginResponse = await res.json();
        setUser(data.user);
    }

    async function signup(email: string, password: string) {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Signup failed');
        }

        const data: any = await res.json();

        if (data.verification_required) {
            return { hasMigration: false, verification_required: true };
        }

        setUser(data.user);
        return { hasMigration: data.has_premium_migration };
    }

    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    }

    async function migratePremium(email: string) {
        const res = await fetch('/api/auth/migrate-premium', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            throw new Error("Migration failed");
        }

        // Refresh user to get new pro status
        checkSession();
    }

    async function forgotPassword(email: string) {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            // Even on error, don't throw - security (don't reveal if email exists)
            console.error('Password reset request failed');
        }
    }

    async function resetPassword(newPassword: string) {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Password reset failed');
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, migratePremium, forgotPassword, resetPassword, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
