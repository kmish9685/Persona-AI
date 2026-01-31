export interface User {
    email: string;
    plan: 'free' | 'pro';
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface SignupResponse {
    user: User;
    token: string;
    has_premium_migration: boolean;
}
