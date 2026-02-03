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
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
            headers[key] = value;
        });

        let event: any;
        try {
            event = validateEvent(payload, headers, secret);
        } catch (e) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        if (event.type === "checkout.created" || event.type === "checkout.updated") {
            const checkout = event.data;
            if (checkout.status === "succeeded" && checkout.customer_email) {
                // Update user to premium
                const { error } = await supabase
                    .from("users")
                    .update({
                        plan: "pro",
                        subscription_id: checkout.id,
                        subscription_provider: "polar",
                        subscription_status: "active"
                    })
                    .eq("email", checkout.customer_email);

                if (error) console.error("Supabase update error:", error);
            }
        }

        if (event.type === "subscription.created") {
            const subscription = event.data;
            if (subscription.user && subscription.user.email) {
                await supabase
                    .from("users")
                    .update({
                        plan: "pro",
                        subscription_id: subscription.id,
                        subscription_provider: "polar",
                        subscription_status: "active"
                    })
                    .eq("email", subscription.user.email);
            }
        }

        if (event.type === "subscription.canceled" || event.type === "subscription.revoked") {
            const subscription = event.data;
            if (subscription.id) {
                await supabase
                    .from("users")
                    .update({
                        plan: "free",
                        subscription_status: "cancelled"
                    })
                    .eq("subscription_id", subscription.id);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Polar Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
