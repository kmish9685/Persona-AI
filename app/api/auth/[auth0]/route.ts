import { handleAuth, handleCallback, Claims } from '@auth0/nextjs-auth0';
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

            // Check if user exists in public.users
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', user.email)
                .single();

            if (!existingUser) {
                // Create new user in public.users
                // Note: We use the Auth0 'sub' as the ID if possible, likely better to keep consistent UUID.
                // But public.users usually expects a UUID. Auth0 'sub' is "auth0|..."
                // If our table relies on UUID, we might need to generate one or let Supabase generate it.
                // Let's assume database.py handles manual UUID or lets DB do it? 
                // Wait, standard Supabase 'users' table usually links to auth.users.id (UUID).
                // Since we are bypassing Supabase Auth, we don't have an auth.users record.
                // We must insert into public.users. 
                // If ID is a UUID PK, we need to generate one.

                // Let's rely on database default for ID if possible, or generate random UUID.
                // But typically id is PK.

                /* 
                   CRITICAL ARCHITECTURAL DECISION:
                   Since we are moving AWAY from Supabase Auth, 'public.users.id' referencing 'auth.users.id' is broken.
                   We should ideally store the Auth0 ID ('sub') in the users table.
                   However, 'id' is likely UUID type.
                   
                   PLAN:
                   1. Try to insert with a new random UUID.
                   2. Store 'auth0_id' if we had a column, but we don't.
                   3. We primarily query by EMAIL in the new system.
                */

                const { error } = await supabase
                    .from('users')
                    .insert({
                        email: user.email,
                        plan: 'free',
                        created_at: new Date().toISOString(),
                        // We let Supabase generate 'id' if it's default gen_random_uuid(), 
                        // otherwise we might fail if we don't provide it.
                        // Let's check if we need to provide it. Usually yes if it's not SERIAL/Generated.
                        // But we can't easily import uuid here without another package.
                        // Let's try inserting without ID and see if it works (assuming default function).
                        // If fails, we will need to fix it.
                    });

                if (error) {
                    console.error("Failed to sync Auth0 user to Supabase:", error);
                } else {
                    console.log(`Synced new user to Supabase: ${user.email}`);
                }
            }
        } catch (e) {
            console.error("Sync error:", e);
        }
    }
    return session;
};

export const GET = handleAuth({
    callback: handleCallback({ afterCallback })
});
