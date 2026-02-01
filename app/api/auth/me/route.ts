import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('sb-access-token')?.value;

        if (!accessToken) {
            return NextResponse.json(null);
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get user from token
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            return NextResponse.json(null);
        }

        // Get user plan from database
        const { data: userData } = await supabase
            .from('users')
            .select('email, plan')
            .eq('email', user.email)
            .single();

        return NextResponse.json({
            email: user.email,
            plan: userData?.plan || 'free'
        });

    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(null);
    }
}
