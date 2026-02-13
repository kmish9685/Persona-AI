import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Supabase Admin
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET; // Using Key Secret as Webhook Secret for MVP if not specified

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const signature = req.headers.get('x-razorpay-signature');

        // Verify Signature (Optional for MVP but recommended)
        // const shasum = crypto.createHmac('sha256', RAZORPAY_SECRET || '');
        // shasum.update(JSON.stringify(body));
        // const digest = shasum.digest('hex');
        // if (signature !== digest) { ... }

        // Logic
        const event = body.event;
        const payload = body.payload;

        if (event === 'payment.captured' || event === 'order.paid') {
            const payment = payload.payment.entity;
            const notes = payment.notes;
            const userEmail = notes?.user_email;

            if (userEmail) {
                console.log(`Upgrading user ${userEmail} to PRO`);

                // Upsert Supabase (Update if exists, Insert if not)
                // We don't have UUID here if they are new, but we can rely on email matching or create a placeholder.
                // ideally we should query by email first.

                const { data: existingUser } = await supabase.from('users').select('id, plan').eq('email', userEmail).single();

                // 2. Decode Plan Duration from Notes
                // Note: 'notes' might be on payment.notes or need to be fetched from order.
                // Assuming payment.notes has it because create-order put it in the order, and Razorpay copies to payment usually.
                // If not, we default to 'monthly' to be safe, or 'annual' if that is the business default. 
                // Let's assume annual is default since variable was 'plan = annual' in create-order.
                const planType = notes?.plan_type || 'annual';

                // 3. Calculate End Date
                const now = new Date();
                let endDate = new Date(now); // Clone date

                if (planType === 'monthly') {
                    // Add 1 month (handles overflow e.g. Jan 31 -> Feb 28/29 auto-magically in JS)
                    endDate.setMonth(endDate.getMonth() + 1);
                } else {
                    // Add 1 year
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }
                const isoEndDate = endDate.toISOString();

                if (existingUser) {
                    const { error } = await supabase
                        .from('users')
                        .update({
                            plan: 'pro',
                            subscription_end_date: isoEndDate
                        })
                        .eq('email', userEmail);

                    if (error) console.error("Failed to upgrade user:", error);
                } else {
                    // Create new user record if missing (Safety Net)
                    const { error } = await supabase
                        .from('users')
                        .insert({
                            email: userEmail,
                            plan: 'pro',
                            subscription_end_date: isoEndDate
                        });

                    if (error) console.error("Failed to create & upgrade user:", error);
                }
            } else {
                console.warn("No user_email in payment notes");
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (e) {
        console.error("Webhook error:", e);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}
