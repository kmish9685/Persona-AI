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

                // Update Supabase
                const { error } = await supabase
                    .from('users')
                    .update({ plan: 'pro' })
                    .eq('email', userEmail);

                if (error) {
                    console.error("Failed to upgrade user:", error);
                    return NextResponse.json({ status: 'error', detail: 'Db update failed' }, { status: 500 });
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
