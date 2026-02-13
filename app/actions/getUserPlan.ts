'use server';

import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function getUserPlan() {
    try {
        const user = await currentUser();
        if (!user) return { plan: 'free' };

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) return { plan: 'free' };

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Query by email as that's what the webhook uses
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('plan')
            .eq('email', email)
            .single();

        if (existingUser) {
            console.log(`[getUserPlan] Found user ${email}: ${existingUser.plan}`);
            return { plan: existingUser.plan || 'free' };
        } else {
            console.log(`[getUserPlan] User ${email} not found. Auto-creating default entry.`);
            // Lazy create to ensure subsequent webhooks have a target
            const { error: insertError } = await supabase
                .from('users')
                .insert({ email, plan: 'free' });

            if (insertError) {
                console.error("[getUserPlan] Failed to auto-create user:", insertError);
            }

            return { plan: 'free' };
        }

    } catch (error) {
        console.error("[getUserPlan] Server error:", error);
        return { plan: 'free' };
    }
}
