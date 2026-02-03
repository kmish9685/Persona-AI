import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

export async function POST(request: NextRequest) {
    try {
        const { userEmail } = await request.json();
        const polar = new Polar({
            accessToken: process.env.POLAR_ACCESS_TOKEN || "",
        });

        // Create Polar checkout session
        const checkout = await polar.checkouts.create({
            products: [process.env.POLAR_PRODUCT_PRICE_ID || ""],
            successUrl: `${process.env.APP_BASE_URL}/?payment=success`,
            customerEmail: userEmail,
        });

        return NextResponse.json({
            checkoutUrl: checkout.url
        });
    } catch (error: any) {
        console.error("Polar Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
