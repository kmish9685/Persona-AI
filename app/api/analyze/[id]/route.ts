import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Await params for Next.js 15
) {
    console.log("DELETE API called");
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("DELETE API: Unauthorized (No userId)");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        console.log(`DELETE API: Attempting to delete decision ${id} for user ${userId}`);

        if (!id) {
            console.error("DELETE API: No ID provided");
            return new NextResponse("ID required", { status: 400 });
        }

        // 1. Verify Ownership
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error("DELETE API: Error fetching decision:", fetchError);
            return new NextResponse(fetchError.message, { status: 500 });
        }

        if (!decision) {
            console.error("DELETE API: Decision not found");
            return new NextResponse("Not found", { status: 404 });
        }

        if (decision.user_id !== userId) {
            console.error(`DELETE API: Forbidden. Decision owner: ${decision.user_id}, Requesting user: ${userId}`);
            return new NextResponse("Forbidden", { status: 403 });
        }

        console.log("DELETE API: Ownership verified. Deleting dependent checkpoints...");

        // 2. Delete Checkpoints (Explicitly)
        const { error: checkpointError } = await supabase
            .from('checkpoints')
            .delete()
            .eq('decision_id', id);

        if (checkpointError) {
            console.error("DELETE API: Failed to delete checkpoints:", checkpointError);
            return new NextResponse("Failed to delete checkpoints", { status: 500 });
        }

        console.log("DELETE API: Checkpoints deleted. Deleting decision...");

        // 3. Delete Decision
        const { error: deleteError } = await supabase
            .from('decisions')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error("DELETE API: Failed to delete decision:", deleteError);
            return new NextResponse(deleteError.message, { status: 500 });
        }

        console.log("DELETE API: Success.");
        return new NextResponse("Deleted", { status: 200 });

    } catch (error: any) {
        console.error("DELETE API: Unexpected critical error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
