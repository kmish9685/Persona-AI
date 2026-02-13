import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15+ dynamic routes
) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
        return new NextResponse("Missing ID", { status: 400 });
    }

    try {
        // Initialize Supabase with Service Key to bypass RLS and ensure deletion
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Verify Ownership
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !decision) {
            return new NextResponse("Decision not found", { status: 404 });
        }

        if (decision.user_id !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // 2. Delete Decision (Cascade should handle checkpoints if configured, but let's be safe)
        // Note: If you have foreign key constraints with ON DELETE CASCADE, checkpoints delete automatically.
        // If not, delete checkpoints first. Assuming CASCADE is set or we just delete decision.
        const { error: deleteError } = await supabase
            .from('decisions')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error("Delete Error:", deleteError);
            return new NextResponse("Failed to delete", { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[DECISION_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
