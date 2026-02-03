import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Simple validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // In a real app, you would send an email here using Resend or SendGrid.
        // For now, we will log it to the server console so it "succeeds" for the user.
        console.log('--- NEW CONTACT FORM SUBMISSION ---');
        console.log(`From: ${name} (${email})`);
        console.log(`Message: ${message}`);
        console.log('-----------------------------------');

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
