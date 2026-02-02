import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'Deployment is Working',
        timestamp: new Date().toISOString(),
        env_check: {
            has_auth0_secret: !!process.env.AUTH0_SECRET,
            base_url: process.env.AUTH0_BASE_URL
        }
    });
}
