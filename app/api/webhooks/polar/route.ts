import { NextRequest, NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = request.headers.get("polar-signature");
        const secret = process.env.POLAR_WEBHOOK_SECRET;

        if (!signature || !secret) {
            return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
        }

        // Validate webhook signature
        let event;
        try {
            event = validateEvent(payload, signature, secret);
        } catch (e) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        if (event.type === "checkout.completed") {
            const { customer_email, subscription_id } = event.data;
            if (customer_email) {
                // Update user to premium in Supabase
                const { error } = await supabase
                    .from("users")
                    .update({
                        plan: "pro", // Using 'pro' to match existing logig
                        subscription_id: subscription_id,
                        subscription_provider: "polar",
                        subscription_status: "active"
                    })
                    .eq("email", customer_email);

                if (error) console.error("Supabase update error:", error);
            }
        }

        if (event.type === "subscription.canceled" || event.type === "subscription.revoked") {
            const { subscription_id } = event.data;
            if (subscription_id) {
                await supabase
                    .from("users")
                    .update({
                        plan: "free",
                        subscription_status: "cancelled"
                    })
                    .eq("subscription_id", subscription_id);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Polar Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
