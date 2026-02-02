import { auth0 } from '@/src/lib/auth0';

export async function middleware(request: any) {
    const authResponse = await auth0.middleware(request);

    // Always return the auth response.
    return authResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
