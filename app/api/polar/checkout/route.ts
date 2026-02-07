import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/chat?payment=success`,
});
