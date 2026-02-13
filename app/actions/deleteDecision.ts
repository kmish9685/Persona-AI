'use server';

import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteDecision(decisionId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { error: "Unauthorized" };
        }

        console.log(`[Server Action] Deleting decision ${decisionId} for user ${userId}`);

        // 1. Verify Ownership
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('user_id')
            .eq('id', decisionId)
            .single();

        if (fetchError || !decision) {
            return { error: "Decision not found" };
        }

        if (decision.user_id !== userId) {
            return { error: "Forbidden" };
        }

        // 2. Delete Checkpoints
        await supabase.from('checkpoints').delete().eq('decision_id', decisionId);

        // 3. Delete Decision
        const { error: deleteError } = await supabase
            .from('decisions')
            .delete()
            .eq('id', decisionId);

        if (deleteError) {
            return { error: deleteError.message };
        }

        revalidatePath('/dashboard');
        return { success: true };

    } catch (e: any) {
        console.error("Delete Action Failed:", e);
        return { error: e.message };
    }
}
