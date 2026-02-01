import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        const response = await fetch(`${backendUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '',
            },
        });

        const data = await response.json();
        const nextResponse = NextResponse.json(data, { status: response.status });

        // Clear the auth cookie
        nextResponse.cookies.delete('auth_token');

        return nextResponse;
    } catch (error: any) {
        console.error('Logout proxy error:', error);
        return NextResponse.json(
            { detail: error.message || 'Logout failed' },
            { status: 500 }
        );
    }
}
