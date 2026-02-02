import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { detail: 'Password is required' },
                { status: 400 }
            );
        }

        // Password validation
        if (password.length < 8) {
            return NextResponse.json(
                { detail: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json(
                { detail: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get the access token from the request headers
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { detail: 'Invalid or expired reset token' },
                { status: 401 }
            );
        }

        const accessToken = authHeader.replace('Bearer ', '');

        // Create Supabase client with the user's access token
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        });

        // Update the user's password
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error('Password update error:', error);
            return NextResponse.json(
                { detail: error.message || 'Failed to reset password' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { detail: 'An error occurred while resetting password' },
            { status: 500 }
        );
    }
}
