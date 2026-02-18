import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PATCH(req: Request) {
    try {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
            auth: { persistSession: false }
        });

        const { decisionId, reaction } = await req.json();

        if (!decisionId || !reaction) {
            return NextResponse.json({ error: 'Missing decisionId or reaction' }, { status: 400 });
        }

        const { error } = await supabase
            .from('decisions')
            .update({
                gut_reaction: reaction,
                gut_vs_ai: reaction.alignment
            })
            .eq('id', decisionId);

        if (error) {
            console.error('Gut check save error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Gut check API error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
