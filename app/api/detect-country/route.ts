import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Vercel / Cloudflare provide country in headers
        const country = request.headers.get('x-vercel-ip-country') ||
            request.headers.get('cf-ipcountry') ||
            'US';

        const isIndia = country === 'IN';
        const paymentProvider = isIndia ? 'razorpay' : 'gumroad';

        return NextResponse.json({
            country: country,
            payment_provider: paymentProvider,
            is_india: isIndia
        });
    } catch (error) {
        console.error('Country detection error:', error);
        // Default to Gumroad
        return NextResponse.json({
            country: null,
            payment_provider: 'gumroad',
            is_india: false
        });
    }
}
