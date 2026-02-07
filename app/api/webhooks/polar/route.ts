import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onPayload: async (payload) => {
        // Handle "checkout.created" or "checkout.updated"
        if (payload.type === "checkout.created" || payload.type === "checkout.updated") {
            const checkout = payload.data;
            if (checkout.status === "succeeded" && checkout.customerEmail) {
                console.log(`[Polar] Upgrading user ${checkout.customerEmail} to PRO`);
                await supabase
                    .from("users")
                    .update({
                        plan: "pro",
                        subscription_id: checkout.id,
                        subscription_provider: "polar",
                        subscription_status: "active"
                    })
                    .eq("email", checkout.customerEmail);
            }
        }

        // Handle "subscription.created"
        if (payload.type === "subscription.created") {
            const subscription = payload.data as any; // Cast to any to avoid strict type mismatch if SDK types are outdated
            if (subscription.user && subscription.user.email) {
                console.log(`[Polar] Subscription created for ${subscription.user.email}`);
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

        // Handle Cancellations
        if (payload.type === "subscription.canceled" || payload.type === "subscription.revoked") {
            const subscription = payload.data;
            if (subscription.id) {
                console.log(`[Polar] Subscription cancelled: ${subscription.id}`);
                await supabase
                    .from("users")
                    .update({
                        plan: "free",
                        subscription_status: "cancelled"
                    })
                    .eq("subscription_id", subscription.id);
            }
        }
    },
});
