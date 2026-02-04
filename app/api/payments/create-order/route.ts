import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(request: NextRequest) {
    try {
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

        // 1. Verify Authentication
        const session = await getSession(); // Use global import
        if (!session?.user?.email) {
            return NextResponse.json({ detail: 'Authentication required' }, { status: 401 });
        }
        const userEmail = session.user.email;

        if (!razorpayKeyId || !razorpayKeySecret) {
            return NextResponse.json(
                { detail: 'Razorpay keys not configured' },
                { status: 500 }
            );
        }

        // Create Razorpay Subscription (Recurring)
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret
        });

        const subscription = await razorpay.subscriptions.create({
            plan_id: 'plan_SBvweKiucUyCuD', // Provided by user
            customer_notify: 1,
            total_count: 120, // 10 years monthly
            notes: {
                user_email: userEmail
            }
        });

        return NextResponse.json({
            subscription_id: subscription.id,
            currency: 'INR',
            key: razorpayKeyId
        });

    } catch (error: any) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { detail: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
