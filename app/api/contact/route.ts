import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Simple validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Save to Supabase
        const { error } = await supabase
            .from('contact_submissions')
            .insert([
                { name, email, message, created_at: new Date().toISOString() }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            throw new Error('Failed to save message');
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
