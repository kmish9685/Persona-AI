import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

        // 1. Verify Authentication
        // Dynamic import to handle package resolution quirks
        // @ts-ignore
        const { getSession } = await import('@auth0/nextjs-auth0/server');

        const session = await getSession();
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

        // Create Razorpay order
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret
        });

        const options = {
            amount: 29900, // ₹299 in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                plan: 'founding_access',
                user_email: userEmail // Critical for linking payment to user
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount
        });

    } catch (error: any) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { detail: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
