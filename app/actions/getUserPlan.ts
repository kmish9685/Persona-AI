'use server';

import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function getUserPlan() {
    try {
        const user = await currentUser();
        if (!user) return { plan: 'free' };

        if (user) {
            const email = user.emailAddresses[0]?.emailAddress;
            const userId = user.id;

            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
            let existingUser = null;

            // 1. Try Email
            if (email) {
                const { data } = await supabase.from('users').select('plan, subscription_end_date, id, email').eq('email', email).single();
                existingUser = data;
            }

            // 2. Try User ID (for legacy/manual records without email)
            if (!existingUser && userId) {
                const { data } = await supabase.from('users').select('plan, subscription_end_date, id, email').eq('user_id', userId).single();
                existingUser = data;

                // HEAL: If found by ID, update Email so future lookups work
                if (existingUser && email && existingUser.email !== email) {
                    console.log(`[getUserPlan] Healing user identity: Linking ${email} to ${userId}`);
                    await supabase.from('users').update({ email: email }).eq('id', existingUser.id);
                }
            }

            if (existingUser) {
                // Check Expiration
                if (existingUser.plan === 'pro' && existingUser.subscription_end_date) {
                    const endDate = new Date(existingUser.subscription_end_date);
                    if (endDate < new Date()) {
                        console.log(`[getUserPlan] Subscription expired for ${email || userId}`);
                        return { plan: 'free' };
                    }
                }
                return { plan: existingUser.plan || 'free' };
            } else {
                // Create New User (Lazy)
                console.log(`[getUserPlan] User not found. Auto-creating.`);
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        email: email || null,
                        user_id: userId,
                        plan: 'free'
                    });

                if (insertError) console.error("[getUserPlan] Create failed:", insertError);
                return { plan: 'free' };
            }
        }
        return { plan: 'free' };

    } catch (error) {
        console.error("[getUserPlan] Server error:", error);
        return { plan: 'free' };
    }
}
