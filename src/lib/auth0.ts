import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
    domain: process.env.AUTH0_ISSUER_BASE_URL || process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    secret: process.env.AUTH0_SECRET,
    appBaseUrl: process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL,
    routes: {
        login: '/auth/login',
        callback: '/auth/callback',
        logout: '/auth/logout'
    }
});
