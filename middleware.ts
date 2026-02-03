import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (Auth0 routes must be public)
         * - api/webhooks (Webhooks must be public)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - / (Landing page should be public)
         */
        "/chat(.*)",
        "/api/chat(.*)",
        "/api/payments/create-order", // Protect creation, but not webhooks/checkout
    ],
};
