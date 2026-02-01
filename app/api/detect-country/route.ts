import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get client IP from request
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';

        // Call backend API
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/detect-country`, {
            headers: {
                'x-forwarded-for': ip,
            },
        });

        if (!response.ok) {
            throw new Error('Backend country detection failed');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Country detection error:', error);
        // Default to Gumroad (international)
        return NextResponse.json({
            country: null,
            payment_provider: 'gumroad',
            is_india: false
        });
    }
}
