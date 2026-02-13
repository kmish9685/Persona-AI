import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { decisionId, status, message } = await req.json();

        if (!decisionId || !status) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Initialize Supabase with Service Key for reliable updates
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Verify Ownership
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('user_id')
            .eq('id', decisionId)
            .single();

        if (fetchError || !decision) {
            return new NextResponse("Decision not found", { status: 404 });
        }

        if (decision.user_id !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // 2. Update Decision Status
        const { error: updateError } = await supabase
            .from('decisions')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', decisionId);

        if (updateError) {
            console.error("Error updating decision status:", updateError);
            return new NextResponse("Failed to update status", { status: 500 });
        }

        // 3. Log Checkpoint
        const { error: checkpointError } = await supabase
            .from('checkpoints')
            .insert({
                decision_id: decisionId,
                checkpoint_date: new Date().toISOString(),
                metric: "Manual Status Update",
                status: status,
                actual_value: message || "User updated status manually."
            });

        if (checkpointError) {
            console.error("Error logging checkpoint:", checkpointError);
            // We don't fail the request if checkpoint logging fails, but it's bad.
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[CHECKPOINT_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
