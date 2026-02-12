import { type NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: 'sandbox', // Use 'production' in production
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const priceId = searchParams.get('priceId');

    if (!priceId) {
        return new NextResponse('Missing priceId', { status: 400 });
    }

    try {
        console.log("Creating checkout for product:", priceId);
        const result = await polar.checkouts.create({
            products: [priceId],
            successUrl: `${request.nextUrl.origin}/chat?upgrade=true&success=true`,
        });

        return NextResponse.redirect(result.url);
    } catch (error: any) {
        console.error('Polar Checkout Error Details:', JSON.stringify(error, null, 2));
        return new NextResponse(`Checkout failed: ${error.message || 'Unknown error'}`, { status: 500 });
    }
}
