import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        const response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        const setCookie = response.headers.get('set-cookie');
        const nextResponse = NextResponse.json(data, { status: response.status });

        if (setCookie) {
            nextResponse.headers.set('set-cookie', setCookie);
        }

        return nextResponse;
    } catch (error: any) {
        console.error('Login proxy error:', error);
        return NextResponse.json(
            { detail: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}
