import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { detail: 'Email is required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            // Return success anyway (security - don't reveal invalid email)
            return NextResponse.json({ message: 'If that email exists, we sent a reset link.' });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase credentials');
            // Return success anyway (don't reveal server errors)
            return NextResponse.json({ message: 'If that email exists, we sent a reset link.' });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Send password reset email via Supabase
        // Force production URL to avoid localhost issues
        const siteUrl = 'https://personai.fun';

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl}/reset-password`,
        });

        if (error) {
            console.error('Password reset error:', error);
            // Return success anyway (security - don't reveal if email exists)
        }

        // Always return success message (security best practice)
        return NextResponse.json({
            message: 'If that email exists, we sent a reset link.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        // Return success anyway (security - don't reveal errors)
        return NextResponse.json({
            message: 'If that email exists, we sent a reset link.'
        });
    }
}
