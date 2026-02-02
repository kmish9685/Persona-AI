import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const afterCallback = async (req: NextRequest, session: any, state: any) => {
    const user = session.user;
    if (user && user.email) {
        try {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            const { data: existingUser } = await supabase.from('users').select('email').eq('email', user.email).single();

            if (!existingUser) {
                const { error } = await supabase.from('users').insert({
                    email: user.email,
                    plan: 'free',
                    created_at: new Date().toISOString(),
                });
                if (error) console.error("Failed to sync Auth0 user:", error);
                else console.log(`Synced new user: ${user.email}`);
            }
        } catch (e) {
            console.error("Sync error:", e);
        }
    }
    return session;
};

// Wrapper for Auth0 handler to use dynamic imports (avoiding build-time resolution issues)
export const GET = async (req: NextRequest, ctx: any) => {
    // @ts-ignore
    const { handleAuth, handleCallback } = await import('@auth0/nextjs-auth0/server');
    return handleAuth({
        callback: handleCallback({ afterCallback })
    })(req, ctx);
};
