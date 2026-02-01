import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { detail: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Sign in with Supabase Auth
        const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            return NextResponse.json(
                { detail: 'Invalid credentials' },
                { status: 400 }
            );
        }

        // Get user plan from database
        const { data: userData } = await supabase
            .from('users')
            .select('email, plan')
            .eq('email', email)
            .single();

        const userPlan = userData?.plan || 'free';

        // Create response
        const response = NextResponse.json({
            user: {
                email: sessionData.user.email,
                plan: userPlan
            },
            token: sessionData.session.access_token
        });

        // Set auth cookies
        response.cookies.set('sb-access-token', sessionData.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });

        response.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { detail: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}
