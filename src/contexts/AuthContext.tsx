'use client';

import React, { createContext, useContext, ReactNode } from 'react';
// import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client';
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

// Define the shape of the user object expected by the app
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
    const { user: clerkUser, isLoaded } = useUser();
    const clerk = useClerk();

    // Map Clerk user to our User interface
    const user: User | null = clerkUser ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        // For now default to 'free', later we can sync with Supabase or Metadata
        plan: (clerkUser.publicMetadata?.plan as 'free' | 'pro') || 'free',
        country: 'US', // default
        isIndia: false // default
    } : null;

    const isLoading = !isLoaded;

    const router = useRouter();

    const login = () => {
        router.push('/login');
    };

    const signup = () => {
        router.push('/signup');
    };

    const logout = () => {
        clerk.signOut();
    };

    const resetPassword = () => {
        // Clerk handles this in flow
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

