import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { detail: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { detail: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Create Supabase admin client
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Sign up user with Supabase Auth (Client method allows redirectTo)
        // This forces the verification email to point to Production, overriding Dashboard defaults.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'https://personai.fun/chat?verified=true',
                data: {
                    plan: 'free',
                    email_verified: false
                }
            }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                return NextResponse.json(
                    { detail: 'User already exists' },
                    { status: 400 }
                );
            }
            throw authError;
        }

        // Create user record in public.users table
        if (authData.user) {
            const { error: dbError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    plan: 'free',
                    created_at: new Date().toISOString()
                });

            if (dbError && !dbError.message.includes('duplicate')) {
                console.error('Failed to create user record:', dbError);
            }

            // CHECK: Did Supabase return a session? (Means Email Confirm is OFF)
            if (authData.session) {
                // Auto-login (Verification is OFF in Dashboard)
                const response = NextResponse.json({
                    user: {
                        email: authData.user.email,
                        plan: 'free'
                    },
                    token: authData.session.access_token,
                    verification_required: false
                });

                // Set cookies
                response.cookies.set('sb-access-token', authData.session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7 // 7 days
                });

                response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7
                });

                return response;
            } else {
                // No session = Verification Required (Confirm Email is ON)
                return NextResponse.json({
                    message: "Account created. Please verify your email.",
                    verification_required: true
                });
            }
        }

        return NextResponse.json({ detail: 'Signup failed' }, { status: 500 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { detail: error.message || 'Signup failed' },
            { status: 500 }
        );
    }
}
