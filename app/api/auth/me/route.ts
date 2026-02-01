import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        const response = await fetch(`${backendUrl}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Cookie': request.headers.get('cookie') || '',
            },
        });

        if (!response.ok) {
            return NextResponse.json(null, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Session check proxy error:', error);
        return NextResponse.json(null, { status: 200 });
    }
}
