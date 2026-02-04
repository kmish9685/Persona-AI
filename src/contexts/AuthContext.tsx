'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client';

// Define the shape of the user object expected by the app
// We map Auth0 user to this.
interface User {
    id: string;
    email: string;
    plan: 'free' | 'pro';
    country?: string;
    isIndia?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    signup: () => void;
    logout: () => void;
    resetPassword: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user: auth0User, isLoading } = useAuth0User();

    // Map Auth0 user to our User interface
    const user: User | null = auth0User ? {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        plan: 'free',
        country: (auth0User['country_code'] as string) || 'US',
        isIndia: (auth0User['country_code'] === 'IN')
    } : null;

    const login = () => {
        window.location.href = '/api/auth/login';
    };

    const signup = () => {
        window.location.href = '/api/auth/login?screen_hint=signup';
    };

    const logout = () => {
        window.location.href = '/api/auth/logout';
    };

    const resetPassword = () => {
        // Auth0 handles this via their Universal Login usually, 
        // or we redirect to a specific connection reset url.
        // For standard Auth0, usually clicking "Don't remember your password?" on login screen is enough.
        // But if we need a direct link:
        // window.location.href = ...
        console.log("Reset password via Auth0 Login screen");
    };


    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, resetPassword }}>
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
