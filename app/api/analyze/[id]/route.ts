import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * UUID Validation Helper
 */
function isValidUUID(uuid: string) {
    const s = "" + uuid;
    const match = s.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    return match !== null;
}

/**
 * GET Handler for Diagnostics
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json({ message: "Route is active", id });
}


/**
 * OPTIONS Handler (CORS Preflight & Method checks)
 */
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Allow': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

/**
 * POST Handler (Fallback for DELETE)
 * Allows deleting via POST with body { action: 'delete' }
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json().catch(() => ({}));
        if (body.action === 'delete') {
            console.log(`[DELETE_API] POST-tunneled delete request for ID: ${id}`);
            return await DELETE(request, { params: Promise.resolve({ id }) });
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error) {
        return new NextResponse("Bad Request", { status: 400 });
    }
}

/**
 * DELETE Handler
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(`[DELETE_API] Request received for ID: ${id}`);

    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("[DELETE_API] 401: No authenticated user session");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!id || id === 'undefined' || !isValidUUID(id)) {
            console.error(`[DELETE_API] 400: Invalid or missing ID: "${id}"`);
            return new NextResponse(`Invalid ID format: ${id}`, { status: 400 });
        }

        // 1. Verify Ownership
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error(`[DELETE_API] Database error:`, fetchError);
            return new NextResponse(`Database error: ${fetchError.message}`, { status: 500 });
        }

        if (!decision) {
            console.error(`[DELETE_API] 404: Not found: ${id}`);
            return new NextResponse("Decision not found", { status: 404 });
        }

        if (decision.user_id !== userId) {
            console.error(`[DELETE_API] 403: Forbidden. Owner: ${decision.user_id}, Requester: ${userId}`);
            return new NextResponse("Forbidden: You do not own this decision", { status: 403 });
        }

        // 2. Delete Checkpoints
        const { error: checkpointError } = await supabase
            .from('checkpoints')
            .delete()
            .eq('decision_id', id);

        if (checkpointError) {
            return new NextResponse(`Checkpoint error: ${checkpointError.message}`, { status: 500 });
        }

        // 3. Delete Decision
        const { error: deleteError } = await supabase
            .from('decisions')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return new NextResponse(`Delete error: ${deleteError.message}`, { status: 500 });
        }

        console.log(`[DELETE_API] SUCCESS: Removed ${id}`);
        return new NextResponse("Deleted Successfully", { status: 200 });

    } catch (error: any) {
        console.error("[DELETE_API] CRITICAL ERROR:", error);
        return new NextResponse(`Server Error: ${error.message}`, { status: 500 });
    }
}
