import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'Diagnosis Mode',
        timestamp: new Date().toISOString(),
        env: {
            APP_BASE_URL: process.env.APP_BASE_URL,
            AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
            AUTH0_SECRET_LENGTH: process.env.AUTH0_SECRET ? process.env.AUTH0_SECRET.length : 0,
            AUTH0_CLIENT_ID_EXISTS: !!process.env.AUTH0_CLIENT_ID,
            AUTH0_CLIENT_SECRET_EXISTS: !!process.env.AUTH0_CLIENT_SECRET
        }
    });
}
