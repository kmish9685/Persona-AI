import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

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
                plan: 'founding_access'
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
