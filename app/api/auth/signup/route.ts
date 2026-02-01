import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Get backend URL from environment or use default
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        // Forward request to Python backend
        const response = await fetch(`${backendUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // If backend set a cookie, forward it
        const setCookie = response.headers.get('set-cookie');
        const nextResponse = NextResponse.json(data, { status: response.status });

        if (setCookie) {
            nextResponse.headers.set('set-cookie', setCookie);
        }

        return nextResponse;
    } catch (error: any) {
        console.error('Signup proxy error:', error);
        return NextResponse.json(
            { detail: error.message || 'Signup failed' },
            { status: 500 }
        );
    }
}
